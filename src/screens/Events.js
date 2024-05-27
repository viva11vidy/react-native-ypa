import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight, Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, TouchableWithoutFeedback, Animated } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/core';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize, } from "react-native-responsive-dimensions";
import CheckBox from '@react-native-community/checkbox';
import RadioButton from 'radio-button-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faSearch, faSortAmountDown, faClock, faChevronLeft, faArrowRight, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../components/Pagination';
import RBSheet from "react-native-raw-bottom-sheet";
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { Shadow } from 'react-native-shadow-2';
import { htmlToText } from 'html-to-text';


import { useSelector, useDispatch } from 'react-redux';
import globals from '../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
import styles from './StyleSheet';

const SCREEN_WIDTH = Dimensions.get('window').width;

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

export default EventsScreen = props => {

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const showBackButton = typeof props.route.params !== typeof undefined && (props.route.params.sector || props.route.params.company);
  const authUser = useSelector(state => state.auth.user);
  // const events = [];
  const events = useSelector(state => state.common.events);

  const filterSheetRef = useRef(null);
  const sortSheetRef = useRef(null);
 
  const [activePosition] = useState(new Animated.Value(0));
  const [activeTab, setActiveTab] = useState("Virtual");

  const [allJobSectors, setAllJobSectors] = useState([]);
  const [selectedJobSectors, setSelectedJobSectors] = useState(props.route.params && props.route.params.sector ? [props.route.params.sector] : []);

  const [allCompanies, setAllCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState(props.route.params && props.route.params.company ? [props.route.params.company] : []);

  const [searchText, setSearchText] = useState(props.route.params && props.route.params.searchText ? props.route.params.searchText : '');

  const [sortBy, setSortBy] = useState('created:-1');

  const [activeFilter, setActiveFilter] = useState("sector");
  const [filterJobSectors, setFilterJobSectors] = useState(props.route.params && props.route.params.sector ? [props.route.params.sector] : []);
  const [filterJobCompanies, setFilterJobCompanies] = useState(props.route.params && props.route.params.company ? [props.route.params.company] : []);

  const [isLoading, setIsLoading] = useState(true);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noMoreContent, setNoMoreContent] = useState(false);
  const perPage = 10;
  const [page, setPage] = useState(1);
  const [filterChange, setFilterChange] = useState(false);

  useEffect(() => {
    fetchData(true);
  }, [dispatch, filterChange]);

  useEffect(()=> {
    if(isFocused && props.route.params && props.route.params.searchText && props.route.params.searchText != searchText) {
      applySearchText(props.route.params.searchText);
    } 
  }, [isFocused]);

  const fetchData = refresh => { 
    // setIsLoading(false);
    // setIsPaginating(false);
    // setIsRefreshing(false);return true;
    if(refresh) {
      getCompanies();
      getCategories();
      if(isLoading) {
        try {
          //featured events

        } catch (error) {}
        
      }
    }
    setPage(async page => {
      let pageToFetch = await page;
      if(refresh) { //first load or pull to refresh
        pageToFetch = 1;
        setNoMoreContent(false);
        if(events.length > 0) {
          setIsRefreshing(true);
        }
      } else { //pagination
        if(noMoreContent) return pageToFetch; 
        pageToFetch = pageToFetch + 1;
        setIsPaginating(true);
      }
      try {
        let params = {
          eventType: activeTab,
          cids: selectedJobSectors.join(','),
          cmpids: selectedCompanies.join(','),
          q: searchText.toLowerCase(),
          sort: sortBy,
          perpage: perPage,
          page: pageToFetch,
        }

        let data = await dispatch(commonActions.getEvents(params));
        if(data.length < perPage) {
          setNoMoreContent(true);
        } else {
          setNoMoreContent(false);
        }
      } catch(err) {
        console.log(err.toString());
      } 
      setIsLoading(false);
      setIsPaginating(false);
      setIsRefreshing(false);
      return pageToFetch;
    });
  };

  
  const getCompanies = async () => {
    try {
      let params = {
        perpage: 1000,
        page: 1,
      }
      let data = await dispatch(commonActions.getCompanies(params));
      if(data.length > 0) {
        setAllCompanies(data);
      } 
    } catch(err) {
      console.log(err.toString());
    } 
  }; 

  const getCategories = async () => {
    try {
      let params = {
        perpage: 1000,
        page: 1,
      }
      let data = await dispatch(commonActions.getCategories(params));
      if(data.length > 0) {
        setAllJobSectors(data);
      } 
    } catch(err) {
      console.log(err.toString());
    } 
  }; 

  const selectJobSector = (state, index) => {
    let selectedJobSectorIndex = filterJobSectors.indexOf(allJobSectors[index]._id);

    if(state && selectedJobSectorIndex === -1) {
      setFilterJobSectors(jobSectors => {
        return [...jobSectors, allJobSectors[index]._id];  
      });
    }
      
    if(!state && selectedJobSectorIndex !== -1) {
      setFilterJobSectors(jobSectors => {
        jobSectors.splice(selectedJobSectorIndex, 1);
        return [...jobSectors];
      });
    }
  };

  const selectCompany = (state, index) => {
    let selectedCompaniesIndex = filterJobCompanies.indexOf(allCompanies[index]._id);

    if(state && selectedCompaniesIndex === -1) {
      setFilterJobCompanies(companies => {
        return [...companies, allCompanies[index]._id];  
      });
    }
      
    if(!state && selectedCompaniesIndex !== -1) {
      setFilterJobCompanies(companies => {
        companies.splice(selectedCompaniesIndex, 1);
        return [...companies];
      });
    }
  };

  const applySearchText = async text => {
    setSearchText(text);
    await dispatch(commonActions.setEvents([]));
    setIsPaginating(true);
    setFilterChange(state => !state);
  };

  const applySort = async sort => {
    sortSheetRef.current.close();
    setSortBy(sort);
    await dispatch(commonActions.setEvents([]));
    setIsPaginating(true);
    setFilterChange(state => !state);
  };

  const applyFilter = async () => {
    filterSheetRef.current.close();
    setSelectedJobSectors(filterJobSectors);
    setSelectedCompanies(filterJobCompanies);
    await dispatch(commonActions.setEvents([]));
    setIsPaginating(true);
    setFilterChange(state => !state); //perform api call
  };

  const closeFilterModal = () => {
    filterSheetRef.current.close();
  };

  const resetFilter = () => {
    setFilterJobSectors(selectedJobSectors);
    setFilterJobCompanies(selectedCompanies);
    setActiveFilter('sector');
  };

  const goToEventDetails = event => {
    props.navigation.navigate('EventDetails', {event: event});
  }
  const goToEventInPersonDetails = event => {
    props.navigation.navigate('EventInPersonDetails', {event: event});
  }

  const openUrl = uri => {
    props.navigation.navigate('WebPage', {uri: uri});
  }

  const tabClick = async name => {
    if(name=='InPerson'){
      Animated.timing(activePosition, {
        toValue: responsiveWidth(45),
        duration: 500,
        useNativeDriver:false
      }).start();
      setActiveTab('InPerson');
    } else {
      Animated.timing(activePosition, {
        toValue: 0,
        duration: 500,
        useNativeDriver:false
      }).start();
      setActiveTab('Virtual');
    }
    await dispatch(commonActions.setEvents([]));
    setIsPaginating(true);
    setFilterChange(state => !state); //perform api call
  }

  const _keyExtractor = (item, index) => item._id+index;

  const renderHeader = () => {
    return (
      <>
         

      {/* FILTER SHEET */}
      <RBSheet
          ref={filterSheetRef}
          closeOnDragDown={true}
          closeOnPressMask={true}
          dragFromTopOnly={true}
          height={responsiveHeight(76)}
          animationType={'none'}
          customStyles={{
            container: {
              opacity: 1,
              position: "absolute",
              zIndex: 2,
              bottom: 0,
              backgroundColor: "#ffffff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              overflow:"visible"
              //borderTopWidth:1,
              // borderColor:"red"
            },
            wrapper: {
              // overflow:"visible"
            },
            draggableIcon: {
              display:"none"
            }
          }}
          onOpen={()=> resetFilter()}
        >
          <View style={styles.allCenter}>
            <View style={styles.rbHandle}></View>
          </View>

          <View style={{paddingVertical: responsiveHeight(2) }}>

            <View style={styles.sheetTitleContainer}>
              <Text style={styles.sheetTitle}>Filter Events</Text>
              <TouchableOpacity onPress={() => closeFilterModal()}>
                <Image style={styles.rbsheetClose} source={require('../../assets/images/ypa/new-images/close-blue.png')} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{height:responsiveHeight(55),flexDirection:"row"}}>

              
              <View style={styles.leftFilter}>
                <TouchableOpacity onPress={() => setActiveFilter('sector')}>
                  <View style={activeFilter == 'sector' ? styles.leftSingleFilterActive : styles.leftSingleFilter}>
                    <Text style={activeFilter == 'sector' ? styles.leftSingleFilterTextActive : styles.leftSingleFilterText}>Sector</Text>
                    {(activeFilter == 'sector') &&
                      <View style={styles.leftSingleFilterViewActive}></View>
                    }
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveFilter('companies')}>
                  <View style={activeFilter == 'companies' ? styles.leftSingleFilterActive : styles.leftSingleFilter}>
                    <Text style={activeFilter == 'companies' ? styles.leftSingleFilterTextActive : styles.leftSingleFilterText}>Companies</Text>
                    {(activeFilter == 'companies') &&
                      <View style={styles.leftSingleFilterViewActive}></View>
                    }
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.rightFilter}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:responsiveHeight(8)}}>
                  
                  {/* Sector */}
                  {activeFilter == 'sector' &&
                  <View>
                    <View style={styles.singleSheetOption}>
                      <View style={styles.radioButtonPosition}>
                        <CheckBox
                          disabled={false}
                          value={filterJobSectors.length === 0}
                          onValueChange={(newValue) => setFilterJobSectors([])}
                          style={{height:18,width:18}}
                          tintColors={{ true: '#0057b0', false: '#0057b0' }}
                          tintColor="#0057b0"
                          onCheckColor="#0057b0"
                          onFillColor="#ffffff"
                          onTintColor="#0057b0"
                          boxType="square"
                          animationDuration={0}
                        />
                      </View><TouchableWithoutFeedback onPress={() => setFilterJobSectors([])}>
                        <Text style={styles.singleSheetText}>View All Sectors</Text>
                      </TouchableWithoutFeedback>
                    </View>

                    { allJobSectors.map((jobSector, index) => {
                      return (
                        <View key={index} style={styles.singleSheetOption}>
                          <View style={{...styles.radioButtonPosition}}>
                            <CheckBox
                              style={{height:18,width:18}}
                              disabled={false}
                              value={filterJobSectors.indexOf(jobSector._id) !== -1}
                              onValueChange={(newValue) => selectJobSector(newValue, index)}
                              tintColors={{ true: '#0057b0', false: '#0057b0' }}
                              tintColor="#0057b0"
                              onCheckColor="#0057b0"
                              onFillColor="#ffffff"
                              onTintColor="#0057b0"
                              boxType="square"
                              animationDuration={0}
                            />
                          </View>
                          <TouchableWithoutFeedback onPress={() => selectJobSector(filterJobSectors.indexOf(jobSector._id) === -1, index)}>
                            <Text style={styles.singleSheetText}>{jobSector.name}</Text>
                          </TouchableWithoutFeedback>
                        </View>
                      );
                    })}

                    
                  </View>
                  }

                  {/* Companies */}
                  {activeFilter == 'companies' &&
                  <View>
                    <TouchableOpacity style={styles.singleSheetOption} onPress={() => setFilterJobCompanies([])}>
                      <View style={styles.radioButtonPosition}>
                        <CheckBox
                          disabled={false}
                          value={filterJobCompanies.length === 0}
                          onValueChange={(newValue) => setFilterJobCompanies([])}
                          style={{height:18,width:18}}
                          tintColors={{ true: '#0057b0', false: '#0057b0' }}
                          tintColor="#0057b0"
                          onCheckColor="#0057b0"
                          onFillColor="#ffffff"
                          onTintColor="#0057b0"
                          boxType="square"
                          animationDuration={0}
                        />
                      </View>
                      <TouchableWithoutFeedback onPress={() => setFilterJobCompanies([])}>
                        <Text style={styles.singleSheetText}>View All Companies</Text>
                      </TouchableWithoutFeedback>
                      
                    </TouchableOpacity>

                    { allCompanies.map((company, index) => {
                      return (

                        <View key={index} style={styles.singleSheetOption}>
                          <View style={styles.radioButtonPosition}>
                            <CheckBox
                              disabled={false}
                              value={filterJobCompanies.indexOf(company._id) !== -1}
                              onValueChange={(newValue) => selectCompany(newValue, index)}
                              style={{height:18,width:18}}
                              tintColors={{ true: '#0057b0', false: '#0057b0' }}
                              tintColor="#0057b0"
                              onCheckColor="#0057b0"
                              onFillColor="#ffffff"
                              onTintColor="#0057b0"
                              boxType="square"
                              animationDuration={0}
                            />
                          </View>
                          <TouchableWithoutFeedback onPress={() => selectCompany(filterJobCompanies.indexOf(company._id) === -1, index)}>
                            <Text style={styles.singleSheetText}>{company.name}</Text>
                          </TouchableWithoutFeedback>
                        </View>

                        
                      );
                    })}

                    
                  </View>
                  }
                </ScrollView>
              </View>
              

              

              <View style={{ height: responsiveHeight(8) }}></View>

            </ScrollView>

            <Shadow style={{width:responsiveWidth(100)}} distance={5} startColor={'#0000000d'} >
              <View style={styles.filterFooter}>
                <TouchableOpacity onPress={() => { applyFilter(); }}>
                  <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.applyFilterButton}>
                    <Text style={styles.applyFilterButtonText}>APPLY FILTER</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Shadow>

          </View>
      </RBSheet>  


      {/* SORT BY SHEET */}
      <RBSheet
          ref={sortSheetRef}
          closeOnDragDown={true}
          closeOnPressMask={true}
          dragFromTopOnly={true}
          height={responsiveHeight(30)}
          animationType={'none'}
          customStyles={{
            container: {
              opacity: 1,
              position: "absolute",
              zIndex: 2,
              bottom: 0,
              backgroundColor: "#ffffff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              overflow:"visible"
              //borderTopWidth:1,
              // borderColor:"red"
            },
            wrapper: {
              // overflow:"visible"
            },
            draggableIcon: {
              display:"none"
            }
          }}
        >
          <View style={styles.allCenter}>
            <View style={styles.rbHandle}></View>
          </View>

          <View style={{paddingVertical: responsiveHeight(2) }}>

            <View style={styles.sheetTitleContainer}>
              <Text style={styles.sheetTitle}>Sort By</Text>
              <TouchableOpacity onPress={() => sortSheetRef.current.close()}>
                <Image style={styles.rbsheetClose} source={require('../../assets/images/ypa/new-images/close-blue.png')} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:responsiveWidth(4),paddingVertical:responsiveWidth(5)}}>
              
              <View>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => applySort('created:-1')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={sortBy} value={'created:-1'} onPress={() => applySort('created:-1')} />
                  </View>
                  <Text style={styles.singleSheetText}>Recently Added</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => applySort('title:1')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={sortBy} value={'title:1'} onPress={() => applySort('title:1')} />
                  </View>
                  <Text style={styles.singleSheetText}>Name: A to Z</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => applySort('title:-1')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={sortBy} value={'title:-1'} onPress={() => applySort('title:-1')} />
                  </View>
                  <Text style={styles.singleSheetText}>Name: Z to A</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => applySort('event_date:1')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={sortBy} value={'event_date:1'} onPress={() => applySort('event_date:1')} />
                  </View>
                  <Text style={styles.singleSheetText}>Event Date</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>


          </View>
      </RBSheet>
      </>
    );
  };

  const renderEmptyContainer = () => {
    return(
      // <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(20)}}>
      //   <Image style={stylesInline.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
      //   <Text style={stylesInline.noDataTitle}>No Event Found</Text>
      // </View>

      <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(30)}}>
        <TouchableOpacity onPress={() => openUrl('https://linktr.ee/youngprouk')}>
          <View style={stylesInline.eventButton}>
            <Text style={stylesInline.eventButtonText}>Click here to view events</Text>
            <FontAwesomeIcon color={'#ffffff'} size={16} icon={faArrowRight} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };


  const renderVirtualEvent = (event, index) => {
    return (
      <>

        
        <TouchableWithoutFeedback onPress={() => goToEventDetails(event)}>
          <View style={stylesInline.singleEvent}>
            <View style={{position:"relative"}}>
              <View style={stylesInline.eventImageWrapper}>
                <LinearGradient colors={['rgba(0, 0, 0, 0.7)', 'transparent']} style={stylesInline.eventImageOverlay} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}></LinearGradient>
                <Image style={stylesInline.eventImage} source={{uri: event.images[0].regular}} />
              </View>
              <View style={stylesInline.eventCompanyWrapper}>
                <Image style={stylesInline.eventCompanyImage} source={{uri: event.company[0].color_images[0].regular}} />
                {/* <Text style={stylesInline.eventCompany}>{event.company[0].iname}</Text> */}
              </View>
            </View>
            
            <View style={{paddingHorizontal:5}}>
              <Text style={stylesInline.eventTitle} numberOfLines={2} ellipsizeMode='tail'>{event.title}</Text>
              
              <Text style={stylesInline.eventDesc} numberOfLines={2} ellipsizeMode='tail'>{htmlToText(event.description, {wordwrap: false})}</Text>

              <View style={stylesInline.horizontalLine}></View>

              <View style={stylesInline.sideBySide}>
                <View style={stylesInline.sideBySide}>
                  <FontAwesomeIcon color={'#0076fd'} size={13} icon={faCalendarAlt} />
                  <Text style={stylesInline.eventDateText}>{moment(event.event_date).format("DD/MM/YYYY")}</Text>
                </View>
                <View style={{...stylesInline.sideBySide,marginLeft:responsiveWidth(4)}}>
                  <FontAwesomeIcon color={'#0076fd'} size={13} icon={faClock} />
                  <Text style={stylesInline.eventDateText}>{event.event_time_hour}:{event.event_time_mins}</Text>
                </View>
              </View>

              <View style={{height:responsiveHeight(0.5)}}></View>

            </View>
          </View>
        </TouchableWithoutFeedback>

        


        {/* <TouchableOpacity onPress={() => goToEventDetails(event)}>
          <View style={index % 2 == 0 ? stylesInline.eventContentLeft : stylesInline.eventContentRight}>
            <Image style={stylesInline.eventImage} source={{uri: event.company[0].images[0].regular}} />
            <Text style={stylesInline.eventTitle} numberOfLines={2} ellipsizeMode='tail'>{event.title}</Text>
            <Text style={stylesInline.eventDesc} numberOfLines={3} ellipsizeMode='tail'>{event.description.replace('\n', '').replace('\r', '')}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
              <FontAwesomeIcon color={'#ffffff'} size={14} icon={faClock} />
              <Text style={stylesInline.eventDateText}>{moment(event.event_date).format("DD/MM/YYYY, hh:mm A")}</Text>
            </View>
          </View>
        </TouchableOpacity> */}

      </>
    );
  };


  const renderInPersonEvent = (event, index) => {
    return (
      <>

        
        <TouchableWithoutFeedback onPress={() => goToEventInPersonDetails(event)}>
          <View style={stylesInline.singleEvent}>
            <View style={{position:"relative"}}>
              <View style={stylesInline.eventImageWrapper}>
                <LinearGradient colors={['rgba(0, 0, 0, 0.7)', 'transparent']} style={stylesInline.eventImageOverlay} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}></LinearGradient>
                <Image style={stylesInline.eventImage} source={{uri: event.images[0].regular}} />
              </View>

              <View style={{...stylesInline.eventCompanyWrapper,left:0,right:0,height:responsiveHeight(5),borderColor:"#ffffff"}}>
                <Image style={{height:responsiveHeight(2),width:responsiveHeight(2),resizeMode:"contain"}} source={require('../../assets/images/ypa/new-images/map-marker-blue.png')} />
                <Text style={stylesInline.eventDateText} numberOfLines={1}>{event.location.area}</Text>
              </View>

            </View>
            
            <View style={{}}>
              <View style={stylesInline.speBottom}>
                <LinearGradient colors={['#3895fc', '#005ba6']} style={stylesInline.speDateContainer} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                
                  <Text style={stylesInline.speMonth}>{moment(event.event_date).format("MMM")}</Text>
                  <Text style={stylesInline.speDate}>{moment(event.event_date).format("DD")}</Text>
                  <Text style={stylesInline.speYear}>{event.event_timing}</Text>
                </LinearGradient>
                <View style={{flex:1}}>
                  <Text style={stylesInline.speTitle} numberOfLines={1} ellipsizeMode='tail'>{event.title}</Text>
                  <Text style={stylesInline.speDesc} numberOfLines={3} ellipsizeMode='tail'>{htmlToText(event.description, {wordwrap: false})}</Text>
                </View>
              </View>


              {/* <Text style={stylesInline.eventTitle} numberOfLines={2} ellipsizeMode='tail'>{event.title}</Text>
              
              <Text style={stylesInline.eventDesc} numberOfLines={2} ellipsizeMode='tail'>{htmlToText(event.description, {wordwrap: false})}</Text>

              <View style={stylesInline.horizontalLine}></View> */}

              {/* <View style={stylesInline.sideBySide}>
                <View style={stylesInline.sideBySide}>
                  <FontAwesomeIcon color={'#0076fd'} size={13} icon={faCalendarAlt} />
                  <Text style={stylesInline.eventDateText}>{moment(event.event_date).format("DD/MM/YYYY")}</Text>
                </View>
                <View style={{...stylesInline.sideBySide,marginLeft:responsiveWidth(4)}}>
                  <FontAwesomeIcon color={'#0076fd'} size={13} icon={faClock} />
                  <Text style={stylesInline.eventDateText}>{event.event_timing}</Text>
                </View>
              </View> */}

              <View style={{height:responsiveHeight(0.5)}}></View>

            </View>
          </View>
        </TouchableWithoutFeedback>

        


        {/* <TouchableOpacity onPress={() => goToEventDetails(event)}>
          <View style={index % 2 == 0 ? stylesInline.eventContentLeft : stylesInline.eventContentRight}>
            <Image style={stylesInline.eventImage} source={{uri: event.company[0].images[0].regular}} />
            <Text style={stylesInline.eventTitle} numberOfLines={2} ellipsizeMode='tail'>{event.title}</Text>
            <Text style={stylesInline.eventDesc} numberOfLines={3} ellipsizeMode='tail'>{event.description.replace('\n', '').replace('\r', '')}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
              <FontAwesomeIcon color={'#ffffff'} size={14} icon={faClock} />
              <Text style={stylesInline.eventDateText}>{moment(event.event_date).format("DD/MM/YYYY, hh:mm A")}</Text>
            </View>
          </View>
        </TouchableOpacity> */}

      </>
    );
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#ffffff', '#cee6ff']} style={{...stylesInline.screen,flex: 1,justifyContent: 'center',alignItems: 'center',}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <ActivityIndicator size="large" color={'#007fff'} />
      </LinearGradient>
    );
  }


  return (
    <LinearGradient colors={['#ffffff', '#ffffff']} style={stylesInline.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>


      <View style={styles.mainHeader}>
        <View>
          <View style={styles.sideBySide}>
            { showBackButton && <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <View style={{...styles.sideBySide}}>
                <View style={styles.headerBackIconWrapper}>
                  <Image style={styles.headerBackIcon} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />
                </View>
                
                <Text style={{...styles.pageSubName, marginLeft: responsiveWidth(1), marginRight: responsiveWidth(3), position: 'relative'}}>Back</Text>
              </View>
            </TouchableOpacity> }
            <Text style={styles.pageName}>Industry Events</Text>
          </View>
        </View>
        <View style={styles.sideBySide}>
          <TouchableOpacity onPress={() => { props.navigation.navigate('SearchResult', {from: 'EventsScreen'}) }}>
            <View style={{marginRight:responsiveWidth(showBackButton ? 0 : 5)}}>
              <Image style={styles.headerSearchIcon} source={require('../../assets/images/ypa/new-images/search-blue.png')} />
            </View>
          </TouchableOpacity>
          { !showBackButton && <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
            <LinearGradient colors={['#3895fc', '#005ba6']} style={styles.menuButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={styles.menuLongLine}></View>
              <View style={styles.menuMediumLine}></View>
              <View style={styles.menuSmallLine}></View>
            </LinearGradient>
          </TouchableOpacity> }
        </View>
      </View>

      






      {/* TOP FILTER BAR */}
      <View style={stylesInline.singleTabContainer}>
        <View style={stylesInline.singleTabWrapper}>
          <TouchableOpacity style={stylesInline.singleTabLeft} onPress={() => tabClick('Virtual')}>
            <View style={stylesInline.singleTabTextWrapper}>
              <Text style={ activeTab == 'Virtual' ? stylesInline.singleTabTextWhite : stylesInline.singleTabText }>Virtual Events</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={stylesInline.singleTabRight} onPress={() => tabClick('InPerson')}> 
            <View style={stylesInline.singleTabTextWrapper}>
              <Text style={ activeTab == 'InPerson' ? stylesInline.singleTabTextWhite : stylesInline.singleTabText }>In Person Events</Text>
            </View>
          </TouchableOpacity>

          
          <Animated.View style={{...stylesInline.tabActive,left: activePosition}}>
          <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...stylesInline.tabActive}}></LinearGradient>
          </Animated.View>

          
        </View>
      </View>


      { activeTab == 'Virtual' ? <View style={{...styles.filterHeader, paddingHorizontal: responsiveWidth(3.2)}}>
          { activeTab == 'Virtual' ? <TouchableOpacity onPress={() => filterSheetRef.current.open()}>
            <View style={styles.fButton}>
              <Text style={styles.fButtonTitle}>Filter</Text>
              <Image style={styles.fButtonImage} source={require('../../assets/images/ypa/new-images/filter-blue.png')} />
            </View>
          </TouchableOpacity> : <View></View>}
          <TouchableOpacity onPress={() => sortSheetRef.current.open()}>
            <View style={{...styles.fButton, width:responsiveWidth(27),}}>
              <Text style={styles.fButtonTitle}>Sort By</Text>
              <Image style={styles.fButtonImage} source={require('../../assets/images/ypa/new-images/sort-blue.png')} />
            </View>
          </TouchableOpacity>
        </View> 
        : <View style={styles.filterHeader}>

        </View> }
        { searchText!= '' && <View style={{paddingBottom: responsiveWidth(3.2)}}>
          <View style={{backgroundColor:"#ffffff",padding:responsiveWidth(3),borderRadius:6, marginBottom:-responsiveWidth(3)}}>
            <Text style={styles.contentDesc}>Showing results for <Text style={{color:"#2498fd"}}>"{searchText}"</Text></Text>
            <TouchableOpacity style={styles.searchButtonEmptyContainer} onPress={() => applySearchText('')}>
              <Image style={styles.searchEmptyButton} source={require('../../assets/images/ypa/close-circle-grey.png')} />
            </TouchableOpacity>
          </View>
        </View> }


      <FlatList 
        style={{flex: 1, padding: responsiveWidth(3.2)}}
        nestedScrollEnabled={true}
        contentContainerStyle={{paddingBottom: 60}}
        showsVerticalScrollIndicator={false}
        numColumns={1}
        data={events}
        keyExtractor={_keyExtractor}
        // ListEmptyComponent={renderEmptyContainer()}
        ListHeaderComponent={renderHeader()}
        ListFooterComponent={isPaginating && <Pagination />}
        renderItem={({item, index, separators}) => {
          return activeTab == 'Virtual' ? renderVirtualEvent(item, index) : renderInPersonEvent(item, index);
        }}
        refreshControl={
          <RefreshControl
            onRefresh={() => fetchData(true)}
            refreshing={isRefreshing}
            colors={['#007fff']}
            title="Pull to refresh"
            tintColor="#ffffff"
            titleColor="#ffffff"
          />
        }
        onEndReached={() => fetchData(false)}
        onEndReachedThreshold={0.5}
      />

      { !isPaginating && events.length == 0 && renderEmptyContainer() }

    </LinearGradient>
  );

}

const stylesInline = StyleSheet.create({
  singleTabContainer:{
    width:"100%",
    alignItems:"center",
    justifyContent:"center",
    marginTop:responsiveHeight(3)
  },
  singleTabWrapper:{
    backgroundColor:"#f1f1f1",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    borderRadius:30,
    height:responsiveHeight(6),
    width:responsiveWidth(90),
  },
  singleTabLeft:{
    position:"absolute",
    zIndex:999,
    width:responsiveWidth(45),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    height:responsiveHeight(6),
    left:0,
    elevation:5
  },
  singleTabRight:{
    position:"absolute",
    zIndex:999,
    right:0,
    width:responsiveWidth(45),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    height:responsiveHeight(6),
    elevation:5
  },
  singleTabTextWrapper:{
  },
  singleTabText:{
    fontSize: responsiveFontSize(2),
    color: "#222",
    fontFamily: "Poppins-Light",
  },
  singleTabTextWhite:{
    fontSize: responsiveFontSize(2),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
  },
  tabActive:{
    backgroundColor:"#ffffff",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    borderRadius:30,
    width:responsiveWidth(45),
    position:"absolute",
    zIndex:1,
    height:responsiveHeight(6),
    left:0,
    // elevation:5
  },










  singleEvent:{
    backgroundColor:"#ffffff",
    padding:10,
    borderRadius:8,
    borderColor:"#f1f1f1",
    borderWidth:1,
    marginBottom:responsiveHeight(2)
  },
  eventImageWrapper:{
    height: responsiveHeight(17),
    borderRadius:8,
    overflow:"hidden"
  },
  
  eventImage: {
    // width: "100%",
    // resizeMode: "cover",
    // height: "100%",
    resizeMode:"contain",
    width: "100%",
    aspectRatio: 3/1
  },
  eventImageOverlay:{
    position:"absolute",
    zIndex:1,
    top:0,
    left:0,
    bottom:0,
    right:0,
  },
  eventTitle: {
    fontSize: responsiveFontSize(2.2),
    color: "#222",
    fontFamily: "Poppins-SemiBold",
    textAlign: "left",
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(0.5),
  },
  eventCompanyWrapper:{
    backgroundColor:"#ffffff",
    height:responsiveHeight(7),
    paddingHorizontal:responsiveWidth(2),
    flexDirection:"row",
    alignItems:"center",
    position:"absolute",
    bottom:-10,
    left:10,
    borderRadius:8,
    borderWidth:1,
    borderColor:"#fafafa"
  },
  eventCompanyImage:{
    resizeMode: "contain",
    height:responsiveHeight(6),
    width:responsiveHeight(6)
  },
  eventCompany:{
    fontSize: responsiveFontSize(1.9),
    color: "#222",
    fontFamily: "Poppins-Light",
  },
  eventDesc: {
    fontSize: responsiveFontSize(1.9),
    color: "#222",
    fontFamily: "Poppins-Light",
  },
  horizontalLine:{
    backgroundColor:"#f1f1f1",
    height:1,
    width:"100%",
    marginVertical:responsiveHeight(1.5),
  },
  sideBySide:{
    flexDirection:"row",
    alignItems:"center",
  },
  eventDateText: {
    fontSize: responsiveFontSize(1.8),
    color: "#222",
    fontFamily: "Poppins-Light",
    marginLeft: responsiveWidth(1.8),
    position: "relative",
    top: responsiveHeight(0.3)
  },
  clock:{
    height:responsiveHeight(2),
    width:responsiveHeight(2),
    resizeMode:"contain"
  },
  bookEventButton: {
    backgroundColor: "#f9516a",
    // borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: responsiveHeight(1.5),
    height: responsiveHeight(6),
  },
  bookEventButtonText: {
    fontSize: responsiveFontSize(1.9),
    color: "#ffffff",
    fontFamily: "Poppins-Light",
  },
  // No DATA CSS
  noDataImage: {
    width: 125,
    resizeMode: "contain"
  },
  noDataTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2.5),
    color: "#141517",
    marginTop: 10
  },
  noDataSubTitle: {
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(2),
    color: "#888888",
    textAlign: "center"
  },
  eventButton: {
    backgroundColor: "#12a795",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: responsiveHeight(1.1),
    height: responsiveHeight(8),
    width:responsiveWidth(90),
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2),

  },
  eventButtonText: {
    fontSize: responsiveFontSize(2.1),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
    marginRight: responsiveWidth(3)
  },

  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  secondaryHeaderStyle: {
    backgroundColor: "#3895fc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(3),
    height: responsiveHeight(9),
  },
  secondaryPageHeading: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(3),
    color: "#ffffff"
  },
  pageHeading: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2.4),
    color: "#ffffff",
    position: "relative",
    top: 1,
    marginLeft: responsiveWidth(2)
  },
  headerIcon: {
    marginHorizontal: responsiveWidth(3.5),
  },
  headerIconRight: {
    marginLeft: responsiveWidth(3.5),
  },

  parentWrapper: {
    flex: 1,
    backgroundColor: "#f0f7ff",
  },
  scrollview: {
    height: '100%',
    padding: responsiveWidth(3.2)
  },

  topFilterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff", 
  },
  singleFilter: {
    backgroundColor: "#ffffff", 
    width: responsiveWidth(50),
    height: responsiveHeight(8),
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#ececec",
  },
  singleFilterText: {
    fontSize: responsiveFontSize(1.8),
    color: "#222222",
    fontFamily: "Poppins-Light",
  },
  filterActivatedHeader :{
    position:"absolute",
    borderWidth:1,
    top:-8,
    right:-1.5,
    borderColor:"#ffffff",
    height:9,
    width:9,
    borderRadius:50,
    backgroundColor:"#26beaf",
    marginLeft:responsiveWidth(1.5)
  },
  filterActivated :{
    // position:"absolute",
    height:responsiveHeight(2),
    width:responsiveHeight(2),
    alignItems:"center",justifyContent:"center",
    borderRadius:50,
    backgroundColor:"#2e80fe",
    marginLeft:responsiveWidth(1.5),
    
  },
  filterActivatedText:{
    fontSize: responsiveFontSize(1.2),
    color: "#ffffff",
    fontFamily: "Poppins-Light",
    position:"relative",
    top:responsiveHeight(0.05)
  },
  filterActivatedHeader :{
    position:"absolute",
    borderWidth:1,
    top:-8,
    right:-1.5,
    borderColor:"#ffffff",
    height:9,
    width:9,
    borderRadius:50,
    backgroundColor:"#26beaf",
    marginLeft:responsiveWidth(1.5)
  },


  // Events
  eventWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    backgroundColor: 'red',
  },
  eventContent: {
    backgroundColor: "#ffffff",
    width: responsiveWidth(45.5),
    marginBottom: responsiveWidth(2.7),
    paddingTop: responsiveWidth(2.5),
    paddingBottom: responsiveWidth(2.7), 
    paddingHorizontal: responsiveWidth(2.5),
    borderRadius: 8
  },
  eventContentLeft: {
    backgroundColor: "#013b75",
    width: responsiveWidth(45.5),
    marginBottom: responsiveWidth(2.7),
    paddingTop: responsiveWidth(2.5),
    paddingBottom: responsiveWidth(2.7),
    paddingHorizontal: responsiveWidth(2.5),
    borderRadius: 8
  },
  eventContentRight: {
    backgroundColor: "#013b75",
    width: responsiveWidth(45.5),
    marginLeft: responsiveWidth(2.6),
    marginBottom: responsiveWidth(2.7),
    paddingTop: responsiveWidth(2.5),
    paddingBottom: responsiveWidth(2.7),
    paddingHorizontal: responsiveWidth(2.5),
    borderRadius: 8
  },
  
  
  
  




  // RB SHEET

  sheetTitleContainer: {
    borderBottomWidth: 1,
    borderColor: "#e6e6e6",
    paddingBottom: responsiveHeight(1),
    marginBottom: responsiveHeight(4)
  },
  sheetTitle: {
    fontSize: responsiveFontSize(2.3),
    // lineHeight:responsiveFontSize(2.1),
    fontFamily: "Poppins-SemiBold",
    color: "#222222",
    textAlign: "center"
  },
  singleSheetOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    // marginBottom: responsiveHeight(0.5),
    // backgroundColor:"red",
    paddingBottom: responsiveHeight(3),
  },
  singleSheetText: {
    fontSize: responsiveFontSize(2),
    fontFamily: "Poppins-Light",
    color: "#333333",
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center"
  },
  label: {
    alignSelf: "center",
    fontSize: responsiveFontSize(1.9),
    marginLeft: 5,
    // lineHeight:responsiveFontSize(2.1),
    fontFamily: "Poppins-SemiBold",
    color: "#ffffff",
    textAlign: "center"
  },


  // RADIO
  radioButtonPosition: {
    // position:"absolute", 
    // top: responsiveWidth(5), 
    // right:responsiveWidth(5),
    // zIndex:1
    marginRight: responsiveWidth(3)
  },

  searchButtonEmptyContainer:{
    position:"absolute",
    // right:responsiveWidth(2),
    // top:responsiveHeight(1.3)
    top: 0, left: 0, right: responsiveWidth(3), bottom: 0, justifyContent: 'center', alignItems: 'flex-end'
  },
  searchEmptyButton:{
    height:responsiveWidth(5.5),
    width:responsiveWidth(5.5),
    resizeMode:"contain",
  },

  searchIcon:{
    width: responsiveHeight(3.4),
    width: responsiveHeight(3.4),
    resizeMode: 'contain',
  },




  speBottom:{
    position:"relative",
    paddingTop:responsiveHeight(2),
    flexDirection:"row",
  },
  speDateContainer:{
    // position:"absolute",
    // right:responsiveWidth(3),
    width:responsiveWidth(20),
    height:responsiveHeight(12),
    borderRadius:10,
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center",
    // top:-responsiveHeight(8),
    zIndex:1,
    marginRight:responsiveWidth(3)
    // paddingVertical:responsiveHeight(2)
  },
  speMonth:{
    fontSize: responsiveFontSize(1.8),
    color: "#ffffff",
    fontFamily: "Poppins-Light",
  },
  speDate:{
    fontSize: responsiveFontSize(4),
    lineHeight:responsiveFontSize(5),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
  },
  speYear:{
    fontSize: responsiveFontSize(1.2),
    color: "#ffffff",
    fontFamily: "Poppins-Light",
    marginTop:-responsiveHeight(0.3)
  },

  speTitle:{
    fontSize: responsiveFontSize(2.2),
    color:"#222222",
    fontFamily: "Poppins-SemiBold",
    // paddingRight:responsiveWidth(20),
    marginBottom:responsiveHeight(1)
  },
  speDesc:{
    fontSize: responsiveFontSize(1.8),
    color:"#222222",
    fontFamily: "Poppins-Light",
  },



});
