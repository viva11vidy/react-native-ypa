import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight, Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, Animated, TouchableWithoutFeedback, SectionList } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/core';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize, } from "react-native-responsive-dimensions";
import CheckBox from '@react-native-community/checkbox';
import RadioButton from 'radio-button-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faSearch, faSortAmountDown, faClock, faSuitcase, faPoundSign, faMapMarkerAlt, faBookmark, faBriefcase, faMoneyBill, faMoneyBillAlt, faMoneyBillWave, faMoneyBillWaveAlt } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../components/Pagination';
import RBSheet from "react-native-raw-bottom-sheet";
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { Shadow } from 'react-native-shadow-2';
import ToggleSwitch from 'toggle-switch-react-native';


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

export default Opportunities = props => {

  const scrollA = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const showBackButton = typeof props.route.params !== typeof undefined && (props.route.params.sector || props.route.params.company);

  const authUser = useSelector(state => state.auth.user);

  const jobs = useSelector(state => state.common.jobs);
  const featuredJobs = useSelector(state => state.common.featuredJobs);
  const savedJobs = useSelector(state => state.auth.savedJobs);
  const [showSavedJobs, setShowSavedJobs] = useState(false);

  const filterSheetRef = useRef(null);
  const sortSheetRef = useRef(null);

  const [allJobSectors, setAllJobSectors] = useState([]);
  const [selectedJobSectors, setSelectedJobSectors] = useState(props.route.params && props.route.params.sector ? [props.route.params.sector] : []);

  const [allCompanies, setAllCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState(props.route.params && props.route.params.company ? [props.route.params.company] : []);

  const [allJobLocations, setAllJobLocations] = useState([]);
  const [selectedJobLocation, setSelectedJobLocation] = useState('');

  const [allJobRoles, setAllJobRoles] = useState(['Intermediate Apprenticeships', 'Advanced Apprenticeships', 'Higher Apprenticeships', 'Degree Apprenticeships', 'Work Experience']);
  const [selectedJobRole, setSelectedJobRole] = useState('');

  const [searchText, setSearchText] = useState(props.route.params && props.route.params.searchText ? props.route.params.searchText : '');

  const [sortBy, setSortBy] = useState('created:-1');

  const [activeFilter, setActiveFilter] = useState("location");
  const [filterJobLocation, setFilterJobLocation] = useState('');
  const [filterJobRole, setFilterJobRole] = useState('');
  const [filterJobSectors, setFilterJobSectors] = useState(props.route.params && props.route.params.sector ? [props.route.params.sector] : []);
  const [filterJobCompanies, setFilterJobCompanies] = useState(props.route.params && props.route.params.company ? [props.route.params.company] : []);


  const [scrollAmount, setScrollAmount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noMoreContent, setNoMoreContent] = useState(false);
  const perPage = 10;
  const [page, setPage] = useState(1);
  const [filterChange, setFilterChange] = useState(false);

  useEffect(() => {
    fetchData(true);
    console.log(props.route)
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
      getJobLocations();
      if(isLoading) {
        try {
          dispatch(commonActions.getJobs({featured: true}));
          authUser && getSavedJobs();
        } catch (error) {}
        
      }
    }
    setPage(async page => {
      let pageToFetch = await page;
      if(refresh) { //first load or pull to refresh
        pageToFetch = 1;
        setNoMoreContent(false);
        if(jobs.length > 0) {
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
          location: selectedJobLocation,
          type: selectedJobRole,
          q: searchText.toLowerCase(),
          sort: sortBy,
          perpage: perPage,
          page: pageToFetch,
        }
        console.log(params);
        let data = await dispatch(commonActions.getJobs(params));
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

  const getSavedJobs = async () => {
    try {
      let savedJobs = await dispatch(authActions.getMyWishlist({page: 1, perpage: 10000, type: 'Job'}));
    } catch (error) {}
  }; 

  const getData = (data) => {
    const updatedData = ["sticky", ...data]
    return updatedData;
  }

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

  const getJobLocations = async () => {
    try {
      let params = {};
      let data = await dispatch(commonActions.getJobLocations(params));
      if(data.length > 0) {
        setAllJobLocations(data);
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
    await dispatch(commonActions.setJobs([]));
    setIsPaginating(true);
    setFilterChange(state => !state);
  };

  const applySort = async sort => {
    sortSheetRef.current.close();
    setSortBy(sort);
    await dispatch(commonActions.setJobs([]));
    setIsPaginating(true);
    setFilterChange(state => !state);
  };

  const applyFilter = async () => {
    filterSheetRef.current.close();
    setSelectedJobLocation(filterJobLocation);
    setSelectedJobRole(filterJobRole);
    setSelectedJobSectors(filterJobSectors);
    setSelectedCompanies(filterJobCompanies);
    await dispatch(commonActions.setJobs([]));
    setIsPaginating(true);
    setFilterChange(state => !state); //perform api call
  };

  
  const closeFilterModal = () => {
    filterSheetRef.current.close();
  };

  const resetFilter = () => {
    setFilterJobLocation(selectedJobLocation);
    setFilterJobRole(selectedJobRole);
    setFilterJobSectors(selectedJobSectors);
    setFilterJobCompanies(selectedCompanies);
    setActiveFilter('location');
  };
  

  
  

  const handleScroll = (event) => {
    setScrollAmount(event.nativeEvent.contentOffset.y);
    // console.log(event.nativeEvent.contentOffset.y);
  }

  const addToWishlist = async eid => { 
    try {
      let response = await dispatch(authActions.addToWishlist(eid, 'Job'));
      let resJob = jobs.find(job => job._id == response.eid);
      dispatch(authActions.setSavedJobs([{...response, job: [{...resJob}]}], false));
    } catch(err) {
      commonActions.setSystemMessage('Unknown error occured');
    }
  };

  const removeFromWishlist = async eid => { 
    try {
      let res = await dispatch(authActions.removeFromWishlist(eid));
      let savedIndex = savedJobs.findIndex(savedJob => savedJob._id == res._id);
      dispatch(authActions.setSavedJobs([{...savedJobs[savedIndex]}], false));
    } catch(err) {
      commonActions.setSystemMessage('Unknown error occured');
    }
  };

  

  const goToJobDetails = job => {
    props.navigation.navigate('OpportunityDetails', {job, job});
  }
  // const goToJobDetails = () => {
  //   props.navigation.navigate('OpportunityDetails');
  // }


  const _keyExtractor = (item, index) => item._id+index;

  const renderHeader = () => { 
    return (
      <>
        
          {/* {job.featured && */}
          <View style={styles.bannerContainer}>
            <View style={{ height: responsiveHeight(38),width: responsiveWidth(100)}}>
              <LinearGradient colors={['#ffffff', '#cee6ff']} style={{height:"100%"}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                <View style={{...styles.featureTitle, marginTop:responsiveHeight(3)}}>
                  <Image style={styles.featureStar} source={require('../../assets/images/ypa/new-images/blue-star.png')} />
                  <Text style={{...styles.psTitle,position:"relative",top:responsiveHeight(0.3),backgroundColor:"transparent"}}>FEATURED JOBS</Text>
                  <Image style={styles.featureStar} source={require('../../assets/images/ypa/new-images/blue-star.png')} />
                </View>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection:"row",alignItems:"center",paddingHorizontal:responsiveWidth(3),height:responsiveHeight(25),}}>


                  {featuredJobs.map((job, index) => {
                    return ( 
                      <TouchableWithoutFeedback key={index} onPress={() => goToJobDetails(job)}>
                        <View style={styles.jobFeaturedSingle}>
                          <LinearGradient colors={['#3499ff', '#0057af']} style={styles.singleFeaturedInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                            <View style={styles.fShadow}></View>
                            <View style={{width:"60%"}}>
                              <Text style={{...styles.singleFeaturedTitle,fontSize: responsiveFontSize(2.2),}} numberOfLines={2}>{job.title}</Text>
                              <Text style={{...styles.singleFeaturedSubTitle, fontSize: responsiveFontSize(1.8),}}>{job.type}</Text>
                              <View style={{...styles.sideBySide,marginBottom:responsiveHeight(1.5)}}>
                                <Image  style={styles.singleFeaturedmap} source={require('../../assets/images/ypa/new-images/map-marker-white.png')} />
                                <Text key={index} style={{...styles.singleFeaturedLocation, fontSize: responsiveFontSize(1.6),}} numberOfLines={1}>
                                  { job.locations ? <>
                                    { job.locations.map((single, index) => {
                                      return (<Text key={index}>{single} {index < job.locations.length - 1 ? ", " : " "}</Text>)
                                    })}
                                  </> : <>
                                    <Text>{job.location}</Text>
                                  </> }
                                </Text>
                              </View>
                              { job.keywords.length > 0 && <View style={{...styles.singleFeaturedTag, paddingHorizontal:responsiveWidth(4),height:responsiveHeight(4),}}>
                                <Text style={{...styles.singleFeaturedTagText, fontSize: responsiveFontSize(1.6),}}>{job.keywords[0]}</Text>
                              </View> }
                            </View>
                            <View style={{width:"40%",justifyContent:"flex-end",flexDirection:"row"}}>
                            { job.company[0].images.length && job.company[0].images[0].regular && <Image style={styles.singleFeaturedEmployerImage} source={{uri: job.company[0].images[0].regular}} /> }
                            </View>
                          </LinearGradient>
                        </View>
                      </TouchableWithoutFeedback>
                    );
                  })}
                    
                  
                </ScrollView>
              </LinearGradient>
            </View>
          </View>
        {/* } */}
       
      </>
    );
  };

  const renderEmptyContainer = () => { 
    return(
      <View style={{alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(0)}}>
        <Image style={styles.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
        <Text style={styles.noDataTitle}>No Job Found</Text>
      </View>
    );
  };

  const renderJob = (job, index) => {
    return (
      <>
      {typeof job === "string" && (
        <View style={scrollAmount > 270 ? styles.bottomFeaturedBorder : styles.bottomFeatured}>
          <View style={{...styles.filterHeader}}>
            <View style={{width: '100%', flexDirection:"row",alignItems:"center", justifyContent: 'space-between'}}>
              <TouchableOpacity onPress={() => filterSheetRef.current.open()}>
                <View style={styles.fButton}>
                  <Text style={styles.fButtonTitle}>Filter</Text>
                  <Image style={styles.fButtonImage} source={require('../../assets/images/ypa/new-images/filter-blue.png')} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sortSheetRef.current.open()}>
                <View style={{...styles.fButton, width:responsiveWidth(27), marginLeft:responsiveWidth(2.5)}}>
                  <Text style={styles.fButtonTitle}>Sort By</Text>
                  <Image style={styles.fButtonImage} source={require('../../assets/images/ypa/new-images/sort-blue.png')} />
                </View>
              </TouchableOpacity>
              { authUser && <View>
              <ToggleSwitch
                isOn={showSavedJobs}
                onColor="#2196f3"
                offColor="#cccccc"
                label="Saved Jobs"
                labelStyle={{fontFamily: "Poppins-Light", color: "#222", }}
                size="medium"
                onToggle={isOn => {setPage(1);getSavedJobs();setShowSavedJobs(isOn);}}
              />
            </View> }
            </View>
            
            
          </View>
          { searchText!= '' && <View style={{paddingBottom: responsiveWidth(3.2)}}>
            <View style={{backgroundColor:"#ffffff",padding:responsiveWidth(3),borderRadius:6, marginBottom:-responsiveWidth(3)}}>
              <Text style={styles.contentDesc}>Showing results for <Text style={{color:"#2498fd"}}>"{searchText}"</Text></Text>
              <TouchableOpacity style={styles.searchButtonEmptyContainer} onPress={() => applySearchText('')}>
                <Image style={styles.searchEmptyButton} source={require('../../assets/images/ypa/close-circle-grey.png')} />
              </TouchableOpacity>
            </View>
          </View> }
        </View>
      )}
      {typeof job !== "string" && (
        <TouchableOpacity style={{ width: "100%",paddingHorizontal:responsiveWidth(3), }} onPress={() => goToJobDetails(job)}>
          <View style={styles.singleJob}>
            <View style={styles.singleJobTop}>
              <View style={styles.singleJobTitleWrapper}>
                <Text style={{...styles.singleJobTitle,width:responsiveWidth(68)}} numberOfLines={2}>{job.title}</Text>
                <View style={styles.singleJobImageWrapper}>
                { job.company[0].color_images.length && job.company[0].color_images[0].regular && <Image style={styles.singleJobImage} source={{uri: job.company[0].color_images[0].regular}} /> }
                </View> 
              </View>
              
              <Text style={styles.singleJobSubTitle} numberOfLines={1}>{job.company[0].name}</Text>

              {job.salary != 0 &&
              <View style={styles.sideBySide}>
                <FontAwesomeIcon style={{...styles.singleJobOptionImage,  marginRight:responsiveWidth(4.4)}} color={'#666666'} size={13} icon={faMoneyBillWave} />
                <Text style={styles.singleJobSubTitle} numberOfLines={1}>{job.salary}</Text>
              </View>
              }

              <View style={styles.sideBySide}>
                <Image style={styles.singleJobOptionImage} source={require('../../assets/images/ypa/new-images/map-marker-grey.png')} />
                <Text style={styles.singleJobSubTitle} numberOfLines={1}>
                  { job.locations ? <>
                    { job.locations.map((single, index) => {
                      return (<Text key={index}>{single} {index < job.locations.length - 1 ? ", " : " "}</Text>)
                    })}
                  </> : <>
                    <Text>{job.location}</Text>
                  </> }
                </Text>
              </View>

              <View style={styles.sideBySide}>
                <FontAwesomeIcon style={{...styles.singleJobOptionImage,  marginRight:responsiveWidth(4.4)}} color={'#666666'} size={13} icon={faBriefcase} />
                <Text style={styles.singleJobSubTitle} numberOfLines={1}>{job.type}</Text>
              </View>
            </View>
            <View style={styles.singleJobFooter}>
              <View style={styles.sideBySide}>
                <FontAwesomeIcon color={'#666666'} size={13} icon={faClock} />
                <Text style={styles.singleJobFooterText}>Posted : {moment(job.created).fromNow()}</Text>
              </View>
              { authUser && <>
              
                {savedJobs.findIndex(savedJob => savedJob.job[0]._id === job._id) !== -1?  <>
                  <TouchableWithoutFeedback onPress={()=> removeFromWishlist(job._id)}>
                    <View style={styles.sideBySide}>
                        <Text style={styles.singleJobFooterText}>Saved</Text>
                        <Image style={{...styles.singleJobOptionImage, marginRight:responsiveWidth(0),top:responsiveHeight(0),}} source={require('../../assets/images/ypa/new-images/ribbon-blue.png')} />
                    </View>
                  </TouchableWithoutFeedback>
                </> : <>
                  <TouchableWithoutFeedback onPress={()=> addToWishlist(job._id)}>
                    <View style={styles.sideBySide}>
                        <Text style={styles.singleJobFooterText}>Save</Text>
                        <Image style={{...styles.singleJobOptionImage, marginRight:responsiveWidth(0),top:responsiveHeight(0),}} source={require('../../assets/images/ypa/new-images/ribbon-outline-blue.png')} />
                    </View>
                  </TouchableWithoutFeedback>
                </> }
              </> }
            </View>
          </View>
        </TouchableOpacity>
      )}
      </>
    );
  };

  if (isLoading) { 
    return (
      <LinearGradient colors={['#ffffff', '#ffffff']} style={{...styles.screen,flex: 1,justifyContent: 'center',alignItems: 'center',}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <ActivityIndicator size="large" color={'#007fff'} />
      </LinearGradient>
    );
  }

  return (

    <View style={{flex:1,backgroundColor:"#ffffff"}}>
      <Shadow style={{width:responsiveWidth(100)}} distance={5} startColor={'#0000000d'} >
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
              <Text style={styles.pageName}>Opportunities</Text>
            </View>
          </View>
          <View style={styles.sideBySide}>
            <TouchableOpacity onPress={() => { props.navigation.navigate('SearchResult', {from: 'OpportunitiesPage'}); }}>
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
      </Shadow>


      
      <View>
        <FlatList
          onScroll={event  => handleScroll(event)} 
          style={{padding: responsiveWidth(0)}}
          nestedScrollEnabled={true}
          contentContainerStyle={{paddingBottom: 60}}
          showsVerticalScrollIndicator={false}
          data={!showSavedJobs ? getData(jobs) : getData(savedJobs.map(savedJob => savedJob.job[0]))}
          keyExtractor={_keyExtractor}
          ListEmptyComponent={renderEmptyContainer()}
          ListHeaderComponent={renderHeader()}
          ListFooterComponent={isPaginating && !showSavedJobs && <Pagination />}
          renderItem={({item, index, separators}) => {
            return renderJob(item, index);
          }}
          refreshControl={
            <RefreshControl
              onRefresh={() => fetchData(true)}
              refreshing={isRefreshing}
              colors={['#0051ad']}
              title="Pull to Refresh"
              tintColor="#0051ad"
              titleColor="#0051ad"
            />
          }
          onEndReached={() => !showSavedJobs && fetchData(false)}
          onEndReachedThreshold={0.5}
          stickyHeaderIndices={[1]}
          stickySectionHeadersEnabled
        />

        { !isPaginating && renderEmptyContainer() }
      </View>


        {/* <TouchableOpacity onPress={()=> goToJobDetails()}>
          <View style={styles.singleJob}>
            <View style={styles.singleJobTop}>
              <View style={styles.singleJobTitleWrapper}>
                <Text style={styles.singleJobTitle} numberOfLines={2}>Level 4 | Business Associate Apprenticeship</Text>
                <View style={styles.singleJobImageWrapper}>
                  <Image style={styles.singleJobImage} source={require('../../assets/images/ypa/company-1.png')} />
                </View>
              </View>
              
              <Text style={styles.singleJobSubTitle} numberOfLines={1}>Willis Tower Watson</Text>

              <View style={styles.sideBySide}>
                <FontAwesomeIcon style={{...styles.singleJobOptionImage,  marginRight:responsiveWidth(4.4)}} color={'#666666'} size={13} icon={faMoneyBillWave} />
                <Text style={styles.singleJobSubTitle} numberOfLines={1}>$ 21,470 per annum</Text>
              </View>

              <View style={styles.sideBySide}>
                <Image style={styles.singleJobOptionImage} source={require('../../assets/images/ypa/new-images/map-marker-grey.png')} />
                <Text style={styles.singleJobSubTitle} numberOfLines={1}>London Manchester Liverpool</Text>
              </View>

              <View style={styles.sideBySide}>
                <FontAwesomeIcon style={{...styles.singleJobOptionImage,  marginRight:responsiveWidth(4.4)}} color={'#666666'} size={13} icon={faBriefcase} />
                <Text style={styles.singleJobSubTitle} numberOfLines={1}>Internships</Text>
              </View>
            </View>
            <View style={styles.singleJobFooter}>
              <View style={styles.sideBySide}>
                <FontAwesomeIcon color={'#666666'} size={13} icon={faClock} />
                <Text style={styles.singleJobFooterText}>Posted : 1 day ago</Text>
              </View>
              <View style={styles.sideBySide}>
                <Text style={styles.singleJobFooterText}>Saved</Text>
                <Image style={{...styles.singleJobOptionImage, marginRight:responsiveWidth(0),top:responsiveHeight(0),}} source={require('../../assets/images/ypa/new-images/ribbon-full.png')} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.singleJob}>
          <View style={styles.singleJobTop}>
            <View style={styles.singleJobTitleWrapper}>
              <Text style={styles.singleJobTitle} numberOfLines={2}>Level 4 | Business Associate Apprenticeship</Text>
              <View style={styles.singleJobImageWrapper}>
                <Image style={styles.singleJobImage} source={require('../../assets/images/ypa/company-1.png')} />
              </View>
            </View>
            
            <Text style={styles.singleJobSubTitle} numberOfLines={1}>Willis Tower Watson</Text>

            <View style={styles.sideBySide}>
              <FontAwesomeIcon style={{...styles.singleJobOptionImage,  marginRight:responsiveWidth(4.4)}} color={'#666666'} size={13} icon={faMoneyBillWave} />
              <Text style={styles.singleJobSubTitle} numberOfLines={1}>$ 21,470 per annum</Text>
            </View>

            <View style={styles.sideBySide}>
              <Image style={styles.singleJobOptionImage} source={require('../../assets/images/ypa/new-images/map-marker-grey.png')} />
              <Text style={styles.singleJobSubTitle} numberOfLines={1}>London Manchester Liverpool</Text>
            </View>

            <View style={styles.sideBySide}>
              <FontAwesomeIcon style={{...styles.singleJobOptionImage,  marginRight:responsiveWidth(4.4)}} color={'#666666'} size={13} icon={faBriefcase} />
              <Text style={styles.singleJobSubTitle} numberOfLines={1}>Internships</Text>
            </View>
          </View>
          <View style={styles.singleJobFooter}>
            <View style={styles.sideBySide}>
              <FontAwesomeIcon color={'#666666'} size={13} icon={faClock} />
              <Text style={styles.singleJobFooterText}>Posted : 1 day ago</Text>
            </View>
            <View style={styles.sideBySide}>
              <Text style={styles.singleJobFooterText}>Save</Text>
              <Image style={{...styles.singleJobOptionImage, marginRight:responsiveWidth(0),top:responsiveHeight(0),}} source={require('../../assets/images/ypa/new-images/ribbon.png')} />
            </View>
          </View>
        </View> */}
            

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
              <Text style={styles.sheetTitle}>Filter Jobs</Text>
              <TouchableOpacity onPress={() => closeFilterModal()}>
                <Image style={styles.rbsheetClose} source={require('../../assets/images/ypa/new-images/close-blue.png')} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{height:responsiveHeight(55),flexDirection:"row"}}>

              
              <View style={styles.leftFilter}>
                <TouchableOpacity onPress={() => setActiveFilter('location')}>
                  <View style={activeFilter == 'location' ? styles.leftSingleFilterActive : styles.leftSingleFilter}>
                    <Text style={activeFilter == 'location' ? styles.leftSingleFilterTextActive : styles.leftSingleFilterText}>Location</Text>
                    {(activeFilter == 'location') &&
                      <View style={styles.leftSingleFilterViewActive}></View>
                    }
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveFilter('jobrole')}>
                  <View style={activeFilter == 'jobrole' ? styles.leftSingleFilterActive : styles.leftSingleFilter}>
                    <Text style={activeFilter == 'jobrole' ? styles.leftSingleFilterTextActive : styles.leftSingleFilterText}>Job Role</Text>
                    {(activeFilter == 'jobrole') &&
                      <View style={styles.leftSingleFilterViewActive}></View>
                    }
                  </View>
                </TouchableOpacity>
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
                  {/* Location */}
                  {activeFilter == 'location' &&
                  <View>
                    <TouchableOpacity style={styles.singleSheetOption} onPress={() => setFilterJobLocation('')}>
                      <View style={styles.radioButtonPosition}>
                        <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={filterJobLocation} value={''} onPress={() => setFilterJobLocation('')} />
                      </View>
                      <Text style={styles.singleSheetText}>View All Locations</Text>
                    </TouchableOpacity>

                    { allJobLocations.map((jobLocation, index) => {
                      return (
                        <TouchableOpacity key={index} style={styles.singleSheetOption} onPress={() => setFilterJobLocation(jobLocation.location)}>
                          <View style={styles.radioButtonPosition}>
                            <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={filterJobLocation} value={jobLocation.location} onPress={() => setFilterJobLocation(jobLocation.location)} />
                          </View>
                          <Text style={styles.singleSheetText}>{jobLocation.location}</Text>
                        </TouchableOpacity>
                      );
                    })}

                    
                  </View>
                  }

                  {/* JOB ROLE */}
                  {activeFilter == 'jobrole' &&
                  <View>
                    <TouchableOpacity style={styles.singleSheetOption} onPress={() => setFilterJobRole('')}>
                      <View style={styles.radioButtonPosition}>
                        <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={filterJobRole} value={''} onPress={() => setFilterJobRole('')} />
                      </View>
                      <Text style={styles.singleSheetText}>View All Roles</Text>
                    </TouchableOpacity>

                    
                    { allJobRoles.map((jobRole, index) => {
                      return (
                        <TouchableOpacity key={index} style={styles.singleSheetOption} onPress={() => setFilterJobRole(jobRole)}>
                          <View style={styles.radioButtonPosition}>
                            <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={filterJobRole} value={jobRole} onPress={() => setFilterJobRole(jobRole)} />
                          </View>
                          <Text style={styles.singleSheetText}>{jobRole}</Text>
                        </TouchableOpacity>
                      );
                    })}

                  </View>
                  }

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
              </View>

            </ScrollView>


          </View>
      </RBSheet>
      
    </View>
  );

}

