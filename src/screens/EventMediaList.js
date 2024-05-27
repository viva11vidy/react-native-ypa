import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight, Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, TouchableWithoutFeedback } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/core';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize, } from "react-native-responsive-dimensions";
import CheckBox from '@react-native-community/checkbox';
import RadioButton from 'radio-button-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faSearch, faSortAmountDown, faClock, faChevronLeft, faPlay, faEye } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../components/Pagination';
import RBSheet from "react-native-raw-bottom-sheet";
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { Shadow } from 'react-native-shadow-2';
import { StackActions } from '@react-navigation/native';

import { useSelector, useDispatch } from 'react-redux';
import globals from '../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
import styles from './StyleSheet';
import { color } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';


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

export default EventMediaList = props => {

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const authUser = useSelector(state => state.auth.user);
  const pastEvents = useSelector(state => state.common.pastEvents);

  const filterSheetRef = useRef(null);
  const sortSheetRef = useRef(null);
 
  const [allJobSectors, setAllJobSectors] = useState([]);
  const [selectedJobSectors, setSelectedJobSectors] = useState([]);

  const [allCompanies, setAllCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const [searchText, setSearchText] = useState(props.route.params && props.route.params.searchText ? props.route.params.searchText : '');

  const [sortBy, setSortBy] = useState('event_date:-1');

  const [activeFilter, setActiveFilter] = useState("sector");
  const [filterJobSectors, setFilterJobSectors] = useState([]);
  const [filterJobCompanies, setFilterJobCompanies] = useState([]);

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

  // componentDidMount = () => {
  //   console.log('as');
  //   fetchData();
  //   focusSubscription = props.navigation.addListener(
  //     'focus',
  //     () => {
  //       fetchData();
  //     }
  //   );
  // }

  // componentWillUnmount = () => {
  //   focusSubscription();
  // }

  const fetchData = refresh => {
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
        if(pastEvents.length > 0) {
          setIsRefreshing(true);
        }
      } else { //pagination
        if(noMoreContent) return pageToFetch; 
        pageToFetch = pageToFetch + 1;
        setIsPaginating(true);
      }
      try {
        let params = {
          cids: selectedJobSectors.join(','),
          cmpids: selectedCompanies.join(','),
          q: searchText.toLowerCase(),
          sort: sortBy,
          perpage: perPage,
          page: pageToFetch,
        }
        let data = await dispatch(commonActions.getPastEvents(params));
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
    await dispatch(commonActions.setPastEvents([]));
    setIsPaginating(true);
    setFilterChange(state => !state);
  };

  const applySort = async sort => {
    sortSheetRef.current.close();
    setSortBy(sort);
    await dispatch(commonActions.setPastEvents([]));
    setIsPaginating(true);
    setFilterChange(state => !state);
  };

  const applyFilter = async () => {
    filterSheetRef.current.close();
    setSelectedJobSectors(filterJobSectors);
    setSelectedCompanies(filterJobCompanies);
    await dispatch(commonActions.setPastEvents([]));
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



  const goToEventMediaDetail = event => {
    !authUser ? goToRegister() : props.navigation.push('EventMediaDetail', {event: event}); 
  };
  const goToRegister = () => {
    props.navigation.dispatch(StackActions.replace('AuthNav'));
  }


  const _keyExtractor = (item, index) => item._id+index;

  const goBack = () => {
    props.navigation.goBack(null);
  };

  const renderHeader = () => {
    return (
      <>
        <View style={styles.filterHeader}>
          <TouchableOpacity onPress={() => filterSheetRef.current.open()}>
            <View style={styles.fButton}>
              <Text style={styles.fButtonTitle}>Filter</Text>
              <Image style={styles.fButtonImage} source={require('../../assets/images/ypa/new-images/filter-blue.png')} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => sortSheetRef.current.open()}>
            <View style={{...styles.fButton, width:responsiveWidth(27),}}>
              <Text style={styles.fButtonTitle}>Sort By</Text>
              <Image style={styles.fButtonImage} source={require('../../assets/images/ypa/new-images/sort-blue.png')} />
            </View>
          </TouchableOpacity>
        </View>

        { searchText!= '' && <View style={{paddingBottom: responsiveWidth(3.2)}}>
          <View style={{backgroundColor:"#ffffff",padding:responsiveWidth(3),borderRadius:6, marginBottom:-responsiveWidth(3)}}>
            <Text style={styles.contentDesc}>Showing results for <Text style={{color:"#2498fd"}}>"{searchText}"</Text></Text>
            <TouchableOpacity style={styles.searchButtonEmptyContainer} onPress={() => applySearchText('')}>
              <Image style={styles.searchEmptyButton} source={require('../../assets/images/ypa/close-circle-grey.png')} />
            </TouchableOpacity>
          </View>
        </View> }


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
              <TouchableOpacity style={styles.singleSheetOption} onPress={() => applySort('event_date:-1')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={sortBy} value={'event_date:-1'} onPress={() => applySort('event_date:-1')} />
                  </View>
                  <Text style={styles.singleSheetText}>Recent Events</Text>
                </TouchableOpacity>
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
              </View>

            </ScrollView>


          </View>
        </RBSheet>
      </>
    );
  };

  const renderEmptyContainer = () => {
    return(
      <View style={{height: responsiveHeight(75), alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(0)}}>
        <Image style={styles.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
        <Text style={styles.noDataTitle}>No Event Found</Text>
      </View>
    );
  };

  const renderEvent = (event, index) => {
    return (
      <>
        <TouchableOpacity onPress={() => goToEventMediaDetail(event)}>
          <View style={stylesInline.singlePastEvent}>
            <View>

            {event.viewed_by && event.viewed_by.length ?
              <View style={stylesInline.totalView}>
                <FontAwesomeIcon style={stylesInline.totalViewIcon} color={'#333333'} size={14} icon={faEye} />
                <Text style={stylesInline.totalViewText}>{event.viewed_by.length}</Text>
              </View>
              :
              <></>
            }

              <View style={stylesInline.speOverlay}></View>

              { event.en.preview_images && event.en.preview_images.length ? <>

                <Image style={stylesInline.speImage} source={{uri: event.en.preview_images[0].thumb}} />

                </>:<>
                  { event.en.videos.length ? <>
                  
                    { event.en.images.length && event.en.images[0].regular ? 
                      <Image style={stylesInline.speImage} source={{uri: event.en.images[0].regular}} />
                    :
                      <Image style={stylesInline.speImage} source={require('../../assets/images/ypa/abc.jpg')} />
                    }
                  </> : <>
                    { event.en.videos[0].thumb ? 
                      <Image style={stylesInline.speImage} source={{uri: event.en.videos[0].thumb}} />
                    :
                      <Image style={stylesInline.speImage} source={require('../../assets/images/ypa/abc.jpg')} />
                    }
                  </>
                  }
                </>
              }


              { event.en.videos.length ?
                <View style={stylesInline.spePlayWrapper}>
                  <Image style={stylesInline.spePlay} source={require('../../assets/images/ypa/new-images/play-button-white.png')}  />
                </View>
              :
                <></>
              }
            </View>
            <View style={stylesInline.speBottom}>
              <LinearGradient colors={['#3895fc', '#005ba6']} style={stylesInline.speDateContainer} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              
                <Text style={stylesInline.speMonth}>{moment(event.event_date).format("MMM")}</Text>
                <Text style={stylesInline.speDate}>{moment(event.event_date).format("DD")}</Text>
                <Text style={stylesInline.speYear}>{moment(event.event_date).format("YYYY")}</Text>
              </LinearGradient>
              <View style={{flex:1}}>
                <Text style={stylesInline.speTitle} numberOfLines={1} ellipsizeMode='tail'>{event.en.title}</Text>
                <Text style={stylesInline.speDesc} numberOfLines={3} ellipsizeMode='tail'>{event.en.short_description ? event.en.short_description.replace('\n', '').replace('\r', '') : (event.en.long_description ? event.en.long_description.replace('\n', '').replace('\r', '') : '')}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => goToEventMediaDetail(event)}>
          <View style={index % 2 == 0 ? stylesInline.workshopContentLeft : stylesInline.workshopContentRight}>
            <View style={{position:"relative",backgroundColor:"#011c38"}}>

              <View style={stylesInline.blackBg}>
                <FontAwesomeIcon style={stylesInline.playIcon} color={'#ffffff'} size={28} icon={faPlay} />
              </View>
              
              { event.en.videos.length ? 
                <Image style={stylesInline.workshopImage} source={{uri: event.en.videos[0].thumb}} />
              :
                <Image style={stylesInline.workshopImage} source={{uri: event.en.images[0].regular}} />
              }
            </View>
            <View style={stylesInline.workshopContentContainer}>
              <Text style={stylesInline.workshopTitle} numberOfLines={1} ellipsizeMode='tail'>{event.en.title}</Text>
              <Text style={stylesInline.workshopDesc} numberOfLines={3} ellipsizeMode='tail'>{event.en.short_description ? event.en.short_description.replace('\n', '').replace('\r', '') : event.en.long_description.replace('\n', '').replace('\r', '')}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
                <FontAwesomeIcon color={'#ffffff'} size={14} icon={faClock} />
                <Text style={stylesInline.eventDateText}>{moment(event.event_date).format("MMM DD, YYYY")}</Text>
              </View>
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
    <LinearGradient colors={['#ffffff', '#cee6ff']} style={stylesInline.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>

      
      <View style={styles.mainHeader}>
        <View>
          <View style={styles.sideBySide}>
            <Text style={styles.pageName}>Past Events</Text>
          </View>
        </View>
        <View style={styles.sideBySide}>
          <TouchableOpacity onPress={() => { props.navigation.navigate('SearchResult', {from: 'EventMediaList'}) }}>
            <View style={{marginRight:responsiveWidth(7)}}>
              <Image style={styles.headerSearchIcon} source={require('../../assets/images/ypa/new-images/search-blue.png')} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
            <LinearGradient colors={['#3895fc', '#005ba6']} style={styles.menuButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={styles.menuLongLine}></View>
              <View style={styles.menuMediumLine}></View>
              <View style={styles.menuSmallLine}></View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      

      



      <FlatList 
        style={{paddingHorizontal: responsiveWidth(3.2),paddingBottom:responsiveHeight(5)}}
        nestedScrollEnabled={true}
        contentContainerStyle={{paddingBottom: responsiveHeight(15)}}
        showsVerticalScrollIndicator={false}
        numColumns={1}
        data={pastEvents}
        keyExtractor={_keyExtractor}
        // ListEmptyComponent={renderEmptyContainer()}
        ListHeaderComponent={renderHeader()}
        ListFooterComponent={isPaginating && <Pagination />}
        renderItem={({item, index, separators}) => {
          return renderEvent(item, index);
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

    { !isPaginating && pastEvents.length == 0 && renderEmptyContainer() }

    </LinearGradient>
  );

}

const stylesInline = StyleSheet.create({
  totalView:{
    backgroundColor:"#ffffff",
    borderRadius:8,
    position:"absolute",
    top:8,
    right:8,
    padding:responsiveWidth(1),
    paddingHorizontal:responsiveWidth(1.5),
    zIndex:99,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start"
  },
  totalViewText:{
    fontSize: responsiveFontSize(1.6),
    lineHeight:responsiveFontSize(2),
    color: "#333333",
    fontFamily: "Poppins-Light",
    marginLeft:responsiveWidth(1.5)
  },
  singlePastEvent:{
    backgroundColor:"#ffffff",
    borderRadius:8,
    borderColor:"#f1f1f1",
    borderWidth:1,
    marginBottom:responsiveHeight(2),
    overflow:"hidden"
  },
  speImage:{
    width: "100%",
    resizeMode: "cover",
    height: responsiveHeight(24),
  },
  spePlayWrapper:{
    position:"absolute",
    width: "100%",
    alignItems:"center",
    justifyContent:"center",
    height: responsiveHeight(24),
    zIndex:1
  },
  spePlay:{
    width: responsiveHeight(6),
    resizeMode: "contain",
    height: responsiveHeight(6),
  },
  speOverlay:{
    width: "100%",
    resizeMode: "cover",
    height: responsiveHeight(24),
    backgroundColor:"rgba(0,0,0,0.4)",
    position:"absolute",
    top:0,
    zIndex:1
  },
  speBottom:{
    position:"relative",
    padding:responsiveWidth(3),
    flexDirection:"row",
  },
  speDateContainer:{
    // position:"absolute",
    // right:responsiveWidth(3),
    width:responsiveWidth(18),
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
    fontSize: responsiveFontSize(1.8),
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






  backHeaderStyle: {
    // backgroundColor: "transparent",
    backgroundColor: "#000000",
    height: responsiveHeight(9),
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    position:"absolute",
    top:0,
    width:responsiveWidth(100),
    zIndex:9999

  },
  eventDateText: {
    fontSize: responsiveFontSize(1.5),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
    marginLeft: responsiveWidth(1.8),
    position: "relative",
    top: responsiveHeight(0.2)
  },
  secondaryPageHeading: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(3),
    color: "#ffffff"
  },
  pageHeading: {
    fontFamily: "FuturaLT-Bold",
    fontSize: responsiveFontSize(2.4),
    color: "#ffffff",
    position: "relative",
    top: 1,
    marginLeft: responsiveWidth(2)
  },
  noDataImage: {
    width: 100,
    resizeMode: "contain"
  },
  noDataTitle: {
    fontFamily: "FuturaLT",
    fontSize: responsiveFontSize(2.5),
    color: "#141517",
    marginTop: 10
  },
  noDataSubTitle: {
    fontFamily: "FuturaLT-Book",
    fontSize: responsiveFontSize(2),
    color: "#888888",
    textAlign: "center"
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  secondaryHeaderStyle: {
    backgroundColor: "#2e80fe",
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
    justifyContent: "space-between"
  },
  singleFilter: {
    backgroundColor: "#ffffff",
    width: responsiveWidth(50),
    height: responsiveHeight(8),
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#ececec"
  },
  singleFilterText: {
    fontSize: responsiveFontSize(1.8),
    color: "#333",
    fontFamily: "FuturaLT-Book",
  },


  // WORSKHOPS
  workshopWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  workshopContent: {
    backgroundColor: "#ffffff",
    width: responsiveWidth(45.5),
    marginBottom: responsiveWidth(2.7),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    // paddingTop: responsiveWidth(2.5),
    // paddingBottom: responsiveWidth(2.7),
    // paddingHorizontal: responsiveWidth(2.5),
    borderRadius: 8
  },
  workshopContentLeft: {
    backgroundColor: "#013b75",
    width: responsiveWidth(45.5),
    marginBottom: responsiveWidth(2.7),
    // alignItems: "center",
    // justifyContent: "center",
    overflow: "hidden",
    // paddingTop: responsiveWidth(2.5),
    // paddingBottom: responsiveWidth(2.7),
    // paddingHorizontal: responsiveWidth(2.5),
    borderRadius: 8
  },
  workshopContentRight: {
    backgroundColor: "#013b75",
    width: responsiveWidth(45.5),
    marginLeft: responsiveWidth(2.6),
    marginBottom: responsiveWidth(2.7),
    // alignItems: "center",
    // justifyContent: "center",
    overflow: "hidden",
    // paddingTop: responsiveWidth(2.5),
    // paddingBottom: responsiveWidth(2.7),
    // paddingHorizontal: responsiveWidth(2.5),
    borderRadius: 8
  },
  blackBg:{
    position:"absolute",
    backgroundColor:"rgba(0, 0, 0, 0.5)",
    top:0,
    right:0,
    left:0,
    bottom:0,
    zIndex:2,
    alignItems:"center",
    justifyContent:"center"
  },
  playIcon:{
    position:"absolute",
    zIndex:2,
  },
  workshopImage: {
    width: "100%",
    resizeMode: "cover",
    height: responsiveHeight(15),
    // backgroundColor:"red"
  },
  workshopContentContainer: {
    // alignItems: "center",
    // justifyContent: "center",
    paddingBottom: responsiveWidth(2.7),
    paddingHorizontal: responsiveWidth(2.5),
  },
  workshopTitle: {
    fontSize: responsiveFontSize(1.9),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
    textAlign: "left",
    // backgroundColor:"red",
    marginTop: responsiveHeight(1.9),
    marginBottom: responsiveHeight(0.5),
  },
  workshopDesc: {
    fontSize: responsiveFontSize(1.6),
    color: "#ffffff",
    fontFamily: "FuturaLT",
    textAlign: "left",
    height:responsiveHeight(7),
    marginBottom: responsiveHeight(1.5),
    // backgroundColor:"red",
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
    fontFamily: "FuturaLT-Bold",
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
    fontFamily: "FuturaLT-Book",
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


});
