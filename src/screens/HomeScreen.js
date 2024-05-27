import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight, Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, Animated, ImageBackground } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize, } from "react-native-responsive-dimensions";
import { Shadow } from 'react-native-shadow-2';
// import Swiper from 'react-native-swiper';
import moment from 'moment';
import Pagination from '../components/Pagination';
import RBSheet from "react-native-raw-bottom-sheet";
import Input from '../ui/Input';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faSearch, faSortAmountDown, faClock, faSuitcase, faPoundSign, faMapMarkerAlt, faPlayCircle, faArrowRight, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import styles from './StyleSheet';




import LinearGradient from 'react-native-linear-gradient';

import { useSelector, useDispatch } from 'react-redux';
import globals from '../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';

import NotificationListener from '../navigation/NotificationListener';
import { TouchableWithoutFeedback } from 'react-native';



export default HomeScreen = props => {

  const scrollA = useRef(new Animated.Value(0)).current;
  

  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  const scrollRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [ongoingWorkshops, setOngoingWorkshops] = useState([]); 
  const [topJobs, setTopJobs] = useState([]); 
  const [topEvents, setTopEvents] = useState([]); 
  const [topSectors, setTopSectors] = useState([]); 
  
  
  const [recentWorkshops, setRecentWorkshops] = useState([]); 

  const [homeInsights, setHomeInsights] = useState([]);
  const [homeCompanies, setHomeCompanies] = useState([]);
  const homeFeaturedJobs = useSelector(state => state.common.featuredJobs);

  const [currentPosition, setCurrentPosition] = useState(1); 
  

  const ref = React.useRef(null);
  const swiper = useRef();
  const refRBSheet = useRef();

  useEffect(() => {
    fetchData(true);
  }, [dispatch]);

  const fetchData = async refresh => {
    await getInsights();
    await getCompanies();
    authUser && await getOngoingWorkshops();
    await getTopJobs();
    await getFeaturedJobs();
    await getTopEvents();
    await getTopSectors();
    await getRecentWorkshops();
    
    setIsLoading(false);
    getDynamicPages();
    
  };

 
 

  const getOngoingWorkshops = async () => {
    try {
      let params = {
        perpage: 10,
        page: 1,
        studentID : authUser._id,
      }
      let data = await dispatch(authActions.getMyCourses(params));
      
      if(data.length) {
        data = data.filter(myCourse => myCourse.course.length);
        data.forEach((course, courseIndex) => {
          let overallProgressTotal = 0;
          course.course[0].content.forEach(content => {
            if(content.progress.length){
              overallProgressTotal += content.progress[0].progress_percent;
            }
          });
          data[courseIndex].overallProgress = Math.round(overallProgressTotal / course.course[0].content.length);
        });
        setOngoingWorkshops([...data]);
      } 
    } catch(err) {
      console.log(err.toString());
    } 
  };

  const getTopJobs = async () => {
    try {
      let params = {
        perpage: 10,
        page: 1,
        sort:'created:-1',
      }
      let data = await dispatch(commonActions.getJobs(params));
      if(data.length) {
        setTopJobs([...data]);
      } 
    } catch(err) {
      console.log(err.toString());
    } 
  };

  const getTopEvents = async () => {
    try {
      let params = {
        perpage: 3,
        page: 1,
        sort:'created:-1',
      }
      let data = await dispatch(commonActions.getEvents(params));
      if(data.length) {
        setTopEvents([...data]);
      } 
    } catch(err) {
      console.log(err.toString());
    } 
  };

  const getTopSectors = async () => {
    try {
      let params = {
        perpage: 10,
        page: 1,
      }
      let data = await dispatch(commonActions.getCategories(params));
      if(data.length) {
        setTopSectors([...data]);
        // console.warn('22',topSectors)
      } 
    } catch(err) {
      console.log(err.toString());
    } 
  };

  const getRecentWorkshops = async () => {
    try {
      let params = {
        perpage: 10,
        page: 1,
        sort:'created:-1',
      }
      let data = await dispatch(commonActions.getCourses(params));
      if(data.length) {
        setRecentWorkshops([...data]);
      } 
    } catch(err) {
      console.log(err.toString());
    } 
  };

  const getDynamicPages = async () => {
    try {
      await dispatch(commonActions.getPages());
    } catch(err) {
      console.log(err.toString());
    } 
  };

  const getInsights = async () => {
    try {
      let params = {
        perpage: 1,
        page: 1,
      }
      let data = await dispatch(commonActions.getInsights(params));

      if(data.list.length) {
        setHomeInsights([...data.list]);
        // console.warn(homeInsights);
      } 
      
    } catch(err) {
      console.log(err.toString());
    } 
  };

  const getCompanies = async () => {
    try {
      let params = {
        perpage: 100,
        page: 1,
      }
      let data = await dispatch(commonActions.getCompanies(params));
      if(data.length) {
        setHomeCompanies([...data]);
        // console.warn(homeCompanies);
      } 
      
    } catch(err) {
      console.log(err.toString());
    } 
  };

  const getFeaturedJobs = async () => {
    try {
      let params = {
        perpage: 10,
        page: 1,
        featured: true
      }
      await dispatch(commonActions.getJobs(params));
    } catch(err) {
      console.log(err.toString());
    } 
  };

  

  useScrollToTop(ref);


  const onPressNext = (step) => {
    swiper.current.scrollBy(step);
  }
  
  

  const goToWorkshopDetails = workshop => {
    props.navigation.push('WorkshopDetails', {workshop: workshop});
  };

  const goToSectorDetails = sector => {
    props.navigation.navigate('SectorDetails', {sector: sector});
  }

  const goToEmployerDetails = company => {
    props.navigation.navigate('EmployerDetails', {company: company});
  }

  const goToJobDetails = job => {
    props.navigation.navigate('OpportunityDetails', {job, job});
  }

  const goToEventDetails = event => {
    props.navigation.navigate('EventDetails', {event: event});
  }
  
  if (isLoading) {
    return (
      <LinearGradient colors={['#ebf1ff', '#ebf1ff']} style={{...styles.parentWrapper,flex: 1,justifyContent: 'center',alignItems: 'center',}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <NotificationListener {...props} />
        <ActivityIndicator size="large" color={'#007fff'} />
      </LinearGradient>
    );
  }


  return (
    <View style={{flex:1}}>
      <NotificationListener {...props} />
      <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:"#ffffff"}}>

     


        <View style={styles.container}>
          
          <View style={styles.topBar}>
            <View>
              { authUser && <View style={styles.sideBySide}>
                <Text style={styles.mainText}>Hi, {authUser.name.split(" ")[0]} </Text>
                {/* <Image style={styles.wave} source={require('../../assets/images/ypa/wave.png')} /> */}
              </View> }
              <Text style={styles.smallText}>Discover the right career path for you</Text>
            </View>
            <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
              <LinearGradient colors={['#3895fc', '#005ba6']} style={styles.menuButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.menuLongLine}></View>
                <View style={styles.menuMediumLine}></View>
                <View style={styles.menuSmallLine}></View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Search Job */}
          <TouchableOpacity onPress={() => { props.navigation.navigate('SearchResult', {from: 'OpportunitiesPage'})}}>
            <View style={{marginTop:responsiveHeight(2)}}>
              {/* <Shadow distance={8} startColor={'#0000000a'} endColor={'#00000000'} offset={[2, 1]}> */}
                <View style={styles.searchInput}>
                  <Image style={styles.searchIcon} source={require('../../assets/images/ypa/grey-search.png')} />
                  <Text style={styles.searchOpportunity}>Search Opportunity</Text>
                </View>
              {/* </Shadow> */}
            </View>
          </TouchableOpacity>

          {/* INSIGHTS */}
          
          {homeInsights.length > 0 && <>
          {homeInsights.map((insight, index) => {
            return (
            <View key={index} style={styles.insightWrapper}>
              <View style={{width: responsiveWidth(50),paddingTop:responsiveHeight(1)}}>
                <Text style={styles.homeInsightGrayText}>INSIGHTS</Text>
                <Text style={styles.homeInsightHeadingText} numberOfLines={2}>{insight.en.name}</Text>
                <TouchableOpacity style={styles.sideBySide}onPress={() => { props.navigation.navigate('Insights')}}>
                  <Text style={{...styles.viewAll,color:"#065eb8"}}>Know More</Text>
                  <View style={{paddingLeft:responsiveWidth(2),marginTop:-responsiveHeight(0.3)}}>
                    <Image style={styles.rightArrow} source={require('../../assets/images/ypa/new-images/next-blue.png')} />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.homeInsightWrapper}>
                <Image style={styles.homeInsightImage} source={{uri: insight.en.images[0].regular}} />
              </View>
            </View>
            );
          })}
          </>
        }

        </View>


        {/* Employers */}
        <ImageBackground style={styles.homeEmployerSection} source={require('../../assets/images/ypa/new-images/home-employer-bg.jpg')} resizeMode="cover">
          <View style={styles.homeEmployerHeaderBarArea}>
            <Text style={styles.homeEmployerHeaderBarTitle}>EMPLOYERS</Text>
            <TouchableOpacity style={styles.sideBySide} onPress={() => props.navigation.navigate('EmployersPage')}>
              <Text style={styles.viewAll}>View All</Text>
              <View style={{paddingLeft:responsiveWidth(2),marginTop:-responsiveHeight(0.3)}}>
                <Image style={styles.rightArrow} source={require('../../assets/images/ypa/new-images/next-white.png')} />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection:"row",alignItems:"center",height:responsiveHeight(12),paddingLeft:responsiveWidth(3.2)}}>
            {homeCompanies.length > 0 && <>
              {homeCompanies.map((company, index) => {
                return (
                  <TouchableOpacity key={index} onPress={() => goToEmployerDetails(company)}>
                    <View style={styles.homeSingleEmployer}>
                      <Image style={styles.homeSingleEmployerImage} source={{uri: company.images[0].regular}}/>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
            }
            </ScrollView>
          </View>
          <View style={{marginTop:responsiveHeight(1.2)}}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection:"row",alignItems:"center",height:responsiveHeight(12),paddingLeft:responsiveWidth(3.2)}}>
            {homeCompanies.length > 0 && <>
              {homeCompanies.reverse().map((company, index) => {
                return (
                  <TouchableOpacity key={index} onPress={() => goToEmployerDetails(company)}>
                    <View style={styles.homeSingleEmployer}>
                      <Image style={styles.homeSingleEmployerImage} source={{uri: company.images[0].regular}}/>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
            }
            </ScrollView>
          </View>
        </ImageBackground>
 

        {/* RECENT JOBS */}
        <View style={{...styles.homeEmployerHeaderBarArea,marginBottom:responsiveHeight(0)}}>
          <Text style={{...styles.homeEmployerHeaderBarTitle,color:"#222"}}>RECENT JOBS</Text>
          <TouchableOpacity style={styles.sideBySide} onPress={() => props.navigation.navigate('OpportunitiesPage')}>
            <Text style={{...styles.viewAll,color:"#065eb8"}}>View All</Text>
            <View style={{paddingLeft:responsiveWidth(2),marginTop:-responsiveHeight(0.3)}}>
              <Image style={styles.rightArrow} source={require('../../assets/images/ypa/new-images/next-blue.png')} />
            </View>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection:"row",alignItems:"center",padding:responsiveWidth(3),}}>
          {topJobs.length > 0 && <>
            {topJobs.map((job, index) => {
              return (
              <TouchableOpacity key={index} onPress={() => goToJobDetails(job)}>
                <View  style={styles.homeSingleJob}>
                  
                  <View style={{paddingHorizontal:responsiveWidth(3)}}>
                    <Image style={styles.homeSingleJobImage} source={{uri: job.company[0].color_images[0].regular}} />
                    <Text numberOfLines={1} style={{...styles.hsjjobBelow, marginBottom:responsiveHeight(0.2),color:"#b2b2b2"}}>{job.company[0].name}</Text>
                    <Text style={styles.hsjTitle} numberOfLines={2}>{job.title}</Text>
                    <Text style={styles.hsjjobBelow} numberOfLines={1}>{job.salary}</Text>
                  </View>
                 
                  

                  <LinearGradient colors={['#3399fe', '#0057b0']} style={{paddingHorizontal:responsiveWidth(2.8),paddingTop:responsiveHeight(1),paddingBottom:responsiveHeight(0.5)}} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <View style={{...styles.sideBySide,alignItems:"flex-start"}}>
                      <Image style={styles.hsjjobMarker} source={require('../../assets/images/ypa/new-images/map-marker-white.png')} />
                      <Text style={{...styles.hsjjobBelow,color:"#ffffff"}} numberOfLines={1} ellipsizeMode='tail'>
                        { job.locations ? <>
                          { job.locations.map((single, index) => {
                            return (<Text key={index}>{single} {index < job.locations.length - 1 ? ", " : " "}</Text>)
                          })}
                        </> : <>
                          <Text>{job.location}</Text>
                        </> }
                      </Text>
                    </View>
                  </LinearGradient>

                </View>
              </TouchableOpacity>
              );
            })}
          </>
          }
        </ScrollView>
        






        {/* PAST EVENTS */}
        <TouchableOpacity activeOpacity={0.7} onPress={() => props.navigation.navigate('EventMediaList')}>
          <View style={{paddingHorizontal:responsiveWidth(3),marginTop:responsiveHeight(3),marginBottom:responsiveHeight(3),position:"relative"}}>
            <ImageBackground style={styles.homePastEvents} source={require('../../assets/images/ypa/new-images/past-event.png')} borderRadius={10} resizeMode='cover'>
              <View style={{width:responsiveWidth(70)}}>
                <Text style={styles.peTitle}>PAST EVENTS</Text>
                <Text style={styles.peSubTitle}>Learn how we made an impact on <Text style={styles.peSubTitleBold}>Society and Businesses</Text></Text>
              </View>
              <Image style={styles.rightCircle} source={require('../../assets/images/ypa/new-images/right-circle.png')} />
            </ImageBackground>
            <Image style={styles.peShadow} source={require('../../assets/images/ypa/new-images/past-event.png')} />
          </View>
        </TouchableOpacity>





        {/* POPULAR SECTOR */}
        {topSectors && topSectors.length > 0 &&
        <View style={{marginBottom:responsiveHeight(3)}}>
          <View style={styles.psTitleWrapper}>
            <Text style={{...styles.psTitle,position:"relative",top:responsiveHeight(2)}}>POPULAR SECTORS</Text>
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection:"row",alignItems:"center",paddingHorizontal:responsiveWidth(3)}}>
            <View style={{flexDirection:"column",flexWrap:"wrap",justifyContent:"flex-start",height:responsiveHeight(35)}}>
            {topSectors.map((sector, index) => {
              return (
              <TouchableOpacity key={index} activeOpacity={0.7}  onPress={() => goToSectorDetails(sector)}>
                <View style={styles.singleHomeSector}>
                  <Image style={styles.singleHomeSectorImage}  source={{uri: sector.images[0].regular}} />
                  <Text style={styles.singleHomeSectorText} numberOfLines={1}>{sector.name}</Text>
                </View>
              </TouchableOpacity>
              );
            })}
              
            </View>
          </ScrollView>
        </View>
        }
        

        {/* Featured Job */}
        {homeFeaturedJobs.length > 0 && 
          <View>
            <View style={styles.featureTitle}>
              <Image style={styles.featureStar} source={require('../../assets/images/ypa/new-images/blue-star.png')} />
              <Text style={{...styles.psTitle,position:"relative",top:responsiveHeight(0.3)}}>FEATURED JOBS</Text>
              <Image style={styles.featureStar} source={require('../../assets/images/ypa/new-images/blue-star.png')} />
            </View>
            <View style={styles.swiperFullWrapper}>
              <Swiper style={styles.swipperWrapper} showsButtons={false} loop={true} autoplay={true} autoplayTimeout={5} ref={swiper} showsPagination={true} removeClippedSubviews={false} paginationStyle={{bottom:-5,zIndex:2,position:"absolute",}}>
                
              
                {homeFeaturedJobs.map((job, index) => {
                  return (
                    <TouchableOpacity activeOpacity={0.7} key={index} onPress={() => goToJobDetails(job)}>
                    <View style={styles.singleFeaturedWrapper}>
                      <LinearGradient colors={['#3499ff', '#0057af']} style={styles.singleFeaturedInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <View style={styles.fShadow}></View>
                        <View style={{width:"55%"}}>
                          <Text style={styles.singleFeaturedTitle} numberOfLines={2}>{job.title}</Text>
                          
                          <Text style={styles.singleFeaturedSubTitle} numberOfLines={1}>{job.type}</Text>
                          
                          <View style={{...styles.sideBySide,marginBottom:responsiveHeight(2),marginTop:responsiveHeight(1)}}>
                            <Image  style={styles.singleFeaturedmap} source={require('../../assets/images/ypa/new-images/map-marker-white.png')} />
                            <Text style={styles.singleFeaturedLocation} numberOfLines={1}>
                            { job.locations ? <>
                              { job.locations.map((single, index) => {
                                return (<Text key={index}>{single} {index < job.locations.length - 1 ? ", " : " "}</Text>)
                              })}
                            </> : <>
                              <Text>{job.location}</Text>
                            </> }
                            </Text>
                          </View>

                         
                              
                          <View style={styles.singleFeaturedTag}>
                            <Text style={styles.singleFeaturedTagText}>{job.keywords[0]}</Text>
                          </View>
                              
                           
                          

                        </View>
                        <View style={{width:"45%",justifyContent:"flex-end",flexDirection:"row"}}>
                          <Image style={styles.singleFeaturedEmployerImage} source={{uri: job.company[0].images[0].regular}} />
                        </View>
                      </LinearGradient>
                    </View>
                    </TouchableOpacity>
                  
                  );
                })}
                
              </Swiper>
            </View>
          </View>
        }
        

        {/* WORKSHOPS */}
        {/* <ImageBackground style={{...styles.homeEmployerSection, height:responsiveHeight(37),}} source={require('../../assets/images/ypa/new-images/home-employer-bg.jpg')} resizeMode="cover">
          <View style={{...styles.homeEmployerHeaderBarArea}}>
            <Text style={styles.homeEmployerHeaderBarTitle}>LATEST WORKSHOPS</Text>
            <TouchableOpacity style={{...styles.sideBySide,top:responsiveHeight(0.2)}}>
              <Text style={styles.viewAll}>View All</Text>
              <View style={{paddingLeft:responsiveWidth(2),marginTop:-responsiveHeight(0.3)}}>
                <Image style={styles.rightArrow} source={require('../../assets/images/ypa/new-images/next-white.png')} />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection:"row",alignItems:"center",paddingHorizontal:responsiveWidth(3)}}>
              <View style={styles.homeSingleWorkshops}>
                <Image style={styles.homeSingleWorkshopImage} source={{uri:'https://res.cloudinary.com/young-professionalsuk/image/upload/v1685695285/ypacademy/ulgfudjcnhejkeoyj2xi.png'}} />
                <View>
                  <Text style={styles.workText} numberOfLines={2}>Financial Accounting and Reporting</Text>
                  <View style={{...styles.sideBySide, paddingHorizontal:responsiveWidth(1.8),justifyContent:"flex-start"}}>
                    <FontAwesomeIcon color={'#666666'} size={13} icon={faClock} />
                    <Text style={{...styles.minutes,marginLeft:responsiveWidth(3),top:responsiveHeight(0.2)}}>120 minutes</Text>
                  </View>
                </View>
                <View style={styles.worksshopVideoIcon}>
                  <FontAwesomeIcon color={'#055db6'} size={60} icon={faPlayCircle} />
                </View>
              </View>
              <View style={styles.homeSingleWorkshops}>
                <Image style={styles.homeSingleWorkshopImage} source={{uri:'https://res.cloudinary.com/young-professionalsuk/image/upload/v1685695285/ypacademy/ulgfudjcnhejkeoyj2xi.png'}} />
                <View>
                  <Text style={styles.workText} numberOfLines={2}>Financial Accounting and Reporting</Text>
                  <View style={{...styles.sideBySide, paddingHorizontal:responsiveWidth(1.8),justifyContent:"flex-start"}}>
                    <FontAwesomeIcon color={'#666666'} size={13} icon={faClock} />
                    <Text style={{...styles.minutes,marginLeft:responsiveWidth(3),top:responsiveHeight(0.2)}}>120 minutes</Text>
                  </View>
                </View>
                <View style={styles.worksshopVideoIcon}>
                  <FontAwesomeIcon color={'#055db6'} size={60} icon={faPlayCircle} />
                </View>
              </View>
              <View style={styles.homeSingleWorkshops}>
                <Image style={styles.homeSingleWorkshopImage} source={{uri:'https://res.cloudinary.com/young-professionalsuk/image/upload/v1685695285/ypacademy/ulgfudjcnhejkeoyj2xi.png'}} />
                <View>
                  <Text style={styles.workText} numberOfLines={2}>Financial Accounting and Reporting</Text>
                  <View style={{...styles.sideBySide, paddingHorizontal:responsiveWidth(1.8),justifyContent:"flex-start"}}>
                    <FontAwesomeIcon color={'#666666'} size={13} icon={faClock} />
                    <Text style={{...styles.minutes,marginLeft:responsiveWidth(3),top:responsiveHeight(0.2)}}>120 minutes</Text>
                  </View>
                </View>
                <View style={styles.worksshopVideoIcon}>
                  <FontAwesomeIcon color={'#055db6'} size={60} icon={faPlayCircle} />
                </View>
              </View>
            </ScrollView>
          </View>
        </ImageBackground> */}


        {/* VIRTUAL EVENTS */}
        {topEvents.length > 0 &&<>
          <View style={{...styles.homeEmployerHeaderBarArea,marginBottom:responsiveHeight(0)}}>
            <Text style={{...styles.homeEmployerHeaderBarTitle,color:"#222"}}>INDUSTRY EVENTS</Text>
            <TouchableOpacity style={{...styles.sideBySide,top:responsiveHeight(0.2)}} onPress={() => { props.navigation.navigate('EventsScreen')}}>
              <Text style={{...styles.viewAll,color:"#065eb8"}}>View All</Text>
              <View style={{paddingLeft:responsiveWidth(2),marginTop:-responsiveHeight(0.3)}}>
                <Image style={styles.rightArrow} source={require('../../assets/images/ypa/new-images/next-blue.png')} />
              </View>
            </TouchableOpacity>
          </View>
          <LinearGradient colors={['#ffffff', '#cee6ff']} style={styles.homeVirtualWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
            {topEvents.map((event,index) =>{
              return (
              <TouchableOpacity key={index} activeOpacity={0.7}  onPress={() => goToEventDetails(event)}>
                <View style={styles.singleVirtualEvent}>
                  <View style={styles.sideBySide}>
                    <Image style={styles.eventCompanyImage} source={{uri: event.company[0].color_images[0].regular}} />
                    <View>
                      <Text style={styles.hveDate}>{moment(event.event_date).format("DD/MM/YYYY")}, {event.event_time_hour}:{event.event_time_mins}</Text>
                      <Text style={styles.hveTitle} numberOfLines={2}>{event.title}</Text>
                    </View>
                  </View>
                  <Image style={styles.rightCircleBlue} source={require('../../assets/images/ypa/new-images/right-circle-blue.png')} />
                </View>
              </TouchableOpacity>
              )
            })}
          </LinearGradient>
        </>
        } 
        

        {/* VIRTUAL EVENTS */}
        {topEvents.length <= 0 &&
          <TouchableOpacity activeOpacity={0.7} onPress={() => { props.navigation.navigate('EventsScreen')}}>
          <View style={{paddingHorizontal:responsiveWidth(3),marginTop:responsiveHeight(3),marginBottom:responsiveHeight(3),position:"relative"}}>
            <ImageBackground style={styles.homePastEvents} source={require('../../assets/images/ypa/new-images/past-event.png')} borderRadius={10} resizeMode='cover'>
              <View style={{width:responsiveWidth(70)}}>
                <Text style={styles.peTitle}>INDUSTRY EVENTS</Text>
                <Text style={styles.peSubTitle}>Get skilss and engage with world's leading employers</Text>
              </View>
              <Image style={styles.rightCircle} source={require('../../assets/images/ypa/new-images/right-circle.png')} />
            </ImageBackground>
            <Image style={styles.peShadow} source={require('../../assets/images/ypa/new-images/past-event.png')} />
          </View>
          </TouchableOpacity>
        }



        <View style={styles.belowTextWrapper}>
          <Text style={styles.belowText}>We are the</Text>
          <Text style={styles.belowText}>UK & IRELAND's</Text>
          <Text style={styles.belowTextBold}>Leading Student</Text>
          <Text style={styles.belowTextBold}>Network</Text>
          <Text style={styles.belowTextCopy}>© Young Professionals</Text>
        </View>


        {/* <View style={{height:responsiveHeight(20),backgroundColor:"white"}}></View> */}

        
      </ScrollView>



    
      {false &&
        <View>
          <LinearGradient colors={['#ebf1ff', '#ebf1ff']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <NotificationListener {...props} />
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollview} contentContainerStyle={{ paddingBottom: 60 }}>
              <View style={styles.bannerBgWrapper}>
                <View style={styles.bannerContent}>
                  <View style={{width:"80%"}}>
                    <Text style={styles.bannerHeading}>Discover the right Career Path for you</Text>
                  </View>
                  <View style={styles.topWhiteBoxWrapper}>
                    
                      {/* <Shadow distance={15} startColor={'#00a8ff61'} finalColor={'#004f780a'} offset={[0, 0]}> */}
                        <TouchableOpacity style={styles.topWhiteBox} activeOpacity={0.7} onPress={() => props.navigation.navigate('EventTypesPage')}>
                          
                            {/* <View style={styles.topCountBadge}>
                              <Text style={styles.topCountBadgeText}>99</Text>
                            </View> */}
                            <Image style={styles.whiteBoxImage} source={require('../../assets/images/ypa/industry-event.png')} />
                            <Text style={styles.whiteBoxText}>INDUSTRY EVENTS</Text>
                          
                        </TouchableOpacity>
                      {/* </Shadow> */}
                    
                    <TouchableOpacity style={styles.topWhiteBox} activeOpacity={0.7} onPress={() => props.navigation.navigate('Insights')}>
                      {/* <Shadow distance={15} startColor={'#00a8ff61'} finalColor={'#004f780a'} offset={[0, 0]}> */}
                        {/* <View style={styles.topWhiteBox}> */}
                          {/* <View style={styles.topCountBadge}>
                            <Text style={styles.topCountBadgeText}>99</Text>
                          </View> */}
                          <Image style={styles.whiteBoxImage} source={require('../../assets/images/ypa/insights.png')} />
                          <Text style={styles.whiteBoxText}>INSIGHTS</Text>
                        {/* </View> */}
                      {/* </Shadow> */}
                    </TouchableOpacity>
                  </View>
                </View>
                <Image style={styles.bannerBg} source={require('../../assets/images/ypa/homepage-bg-light.png')} />
                {/* <View style={styles.laserLightWrapper}>
                <Image style={styles.laserLight} source={require('../../assets/images/ypa/laser-1.png')} />
                </View> */}
              </View>











              {/* {ongoingWorkshops.length > 0 && <View style={{
                marginHorizontal: responsiveWidth(3.3),
                marginTop: responsiveHeight(4.5),
                marginBottom: responsiveHeight(2.5),
              }}>
                <Text style={styles.simpleTitle}>Welcome Back, ready for next lesson ?</Text>
              </View> } */}

              {/* {ongoingWorkshops.length > 0 && <ScrollView style={styles.lessonWrapper} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: responsiveWidth(3.3) }}>
                { ongoingWorkshops.map((workshop, index) => {
                  return (
                    <TouchableOpacity key={index} onPress={() => goToWorkshopDetails(workshop.course[0])}>
                      <View style={styles.singleLesson}>
                        <View>
                          <Image style={styles.chapterImage} source={{uri: workshop.course[0].images[0].regular}} />
                          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                            <FontAwesomeIcon color={'#ffffff'} size={30} icon={faPlayCircle} />
                          </View>
                        </View>
                        <View style={{ padding: responsiveWidth(2) }}>
                          <Text style={styles.chapterCount}>Total {workshop.course[0].content.length} {workshop.course[0].content.length > 1 ? 'Contents' : 'Content' }</Text>
                          <Text style={styles.chapterTitle} numberOfLines={1} ellipsizeMode='tail'>{workshop.course[0].name}</Text>
                          <View style={styles.progressBarBg}>
                            <View style={{ ...styles.progressBar, ...(workshop.overallProgress ? { width: workshop.overallProgress+"%"} : {}) }}></View>
                          </View>
                          <Text style={styles.chapterCount}>{workshop.overallProgress}%</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}

              </ScrollView> } */}

              {topJobs.length > 0 && <View style={{
                marginHorizontal: responsiveWidth(3.3),
                marginTop: responsiveHeight(3.5),
                marginBottom: responsiveHeight(0.5),
              }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center",}}>
                    <View style={styles.menuIconWrapper}>
                      <Image style={styles.menuIcon} source={require('../../assets/images/ypa/raj-img-dark.png')} />
                    </View>
                    <Text style={styles.simpleTitle}>Recently Added Jobs</Text>
                  </View>
                  <TouchableOpacity onPress={() => props.navigation.jumpTo('Opportunities')}>
                    <Text style={styles.primaryLink}>View All</Text>
                  </TouchableOpacity>
                </View>
              </View> }

              {topJobs.length > 0 && <ScrollView style={styles.lessonWrapper} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: responsiveWidth(3.3) }}>
                <View style={{...styles.jobWrapper,paddingBottom: responsiveWidth(2.8),paddingLeft:responsiveWidth(2),paddingTop:responsiveHeight(2)}}>
                  { topJobs.map((job, index) => {
                    return (
                      <TouchableOpacity style={styles.jobContent} activeOpacity={0.7} key={index} onPress={() => goToJobDetails(job)}>
                        {/* <View > */}
                          <View style={styles.jobTopContent}>
                            <Image style={styles.jobImage} source={{uri: job.company[0].images[0].regular}} />
                            <View style={{ flex: 1 }}>
                              <Text style={styles.jobTitle} numberOfLines={1} ellipsizeMode='tail'>{job.title}</Text>
                              <View style={styles.jobOptionWrapper}>
                                {/* <View style={styles.singleJobOption}>
                                  <View style={{ marginRight: responsiveWidth(1.5), }}>
                                    <FontAwesomeIcon color={'#757a7a'} size={13} icon={faSuitcase} />
                                  </View>
                                  <Text style={styles.singleJobOptionTitle} numberOfLines={1} ellipsizeMode='tail'>{job.vacancies} {job.vacancies > 1 ? 'vacancies' : 'vacancy'}</Text>
                                </View> */}
                                <View style={{ ...styles.singleJobOption, marginRight: 0, width: "100%" }}>
                                  <View style={{ marginRight: responsiveWidth(1.5), }}>
                                    <FontAwesomeIcon color={'#ffffff'} size={13} icon={faPoundSign} />
                                  </View>
                                  <Text numberOfLines={1} ellipsizeMode='tail' style={styles.singleJobOptionTitle}>{job.salary}</Text>
                                </View>
                                <View style={{ ...styles.singleJobOption, width: "100%" }}>
                                  <View style={{ marginRight: responsiveWidth(1.5), }}>
                                    <FontAwesomeIcon color={'#ffffff'} size={13} icon={faMapMarkerAlt} />
                                  </View>
                                  <Text numberOfLines={1} ellipsizeMode='tail' style={styles.singleJobOptionTitle}>{job.location}</Text>
                                </View>
                              </View>

                            </View>
                          </View>
                        {/* </View> */}
                      </TouchableOpacity>
                    );
                  })}
              
                </View>
              </ScrollView> }


              {topEvents.length > 0 && <View style={styles.blueBg}>
                <View style={styles.laserLightWrapperTop}>
                <Image style={styles.laserLight} source={require('../../assets/images/ypa/laser-1.png')} />
                </View>
                <View style={{
                  marginHorizontal: responsiveWidth(3.3),
                  marginTop: responsiveHeight(3.5),
                  marginBottom: responsiveHeight(0.5),
                }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center",}}>
                      <View style={styles.menuIconWrapper2}>
                        <Image style={styles.menuIcon2} source={require('../../assets/images/ypa/top-event.png')} />
                      </View>
                      <Text style={styles.simpleTitle}>Top Events</Text>
                    </View>
                    <TouchableOpacity onPress={() => props.navigation.navigate('EventsScreen')}>
                      <Text style={styles.primaryLink}>View All</Text>
                    </TouchableOpacity>
                  </View>
                </View> 

                <ScrollView style={styles.lessonWrapper} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: responsiveWidth(3.3) }}>
                  <View style={styles.jobWrapper}>
                    { topEvents.map((event, index) => {
                      return (
                        <TouchableOpacity key={index} onPress={() => goToEventDetails(event)}>
                          <View style={styles.eventContent}>
                            <View style={{ borderRadius: 8}}>
                              <Image style={styles.eventImage} source={{uri: event.company[0].images[0].regular}} />
                            </View>
                            <Text style={styles.eventTitle} numberOfLines={2} ellipsizeMode='tail'>{event.title}</Text>
                            <Text style={styles.eventDesc} numberOfLines={3} ellipsizeMode='tail'>{event.description.replace('\n', '').replace('\r', '')}</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
                              <FontAwesomeIcon color={'#ffffff'} size={14} icon={faClock} />
                              <Text style={styles.eventDateText}>{moment(event.event_date).format("DD/MM/YYYY, hh:mm A")}</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView> 
                <View style={styles.laserLightWrapper}>
                <Image style={styles.laserLight} source={require('../../assets/images/ypa/laser-1.png')} />
                </View>
              </View> }


              {topSectors.length > 0 && <View style={{
                marginHorizontal: responsiveWidth(3.3),
                marginTop: responsiveHeight(3.5),
                marginBottom: responsiveHeight(2.5),
              }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center"}}>
                    <View style={styles.menuIconWrapper2}>
                      <Image style={styles.menuIcon2} source={require('../../assets/images/ypa/ranking-dark.png')} />
                    </View>
                    <Text style={styles.simpleTitle}>Top Job Sectors</Text>
                  </View>
                </View>
              </View> }

              {/* <ScrollView style={styles.lessonWrapper} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: responsiveWidth(3.3) }}> */}
                {topSectors.length > 0 && <View style={{...styles.categoryWrapper, paddingHorizontal: responsiveWidth(3.3)}}>
                  { topSectors.map((sector, index) => {
                    return (
                //       <Shadow distance={20}
                //   // startColor={tinycolor('#00000020').toHex8String()}
                //   // finalColor={tinycolor('#00000020').toHex8String()}
                //   offset={[0, -5]}
                //   getChildRadius={false}
                //   getViewStyleRadius={false}
                // >
                      <TouchableOpacity key={index} style={styles.categoryContent} activeOpacity={0.7}  onPress={() => goToSectorDetails(sector)}>
                        {/* <View > */}
                          <Image style={styles.categoryImage} source={{uri: sector.images[0].regular}} />
                          <Text style={styles.categoryTitle} numberOfLines={2} ellipsizeMode='tail'>{sector.name}</Text>
                        {/* </View> */}
                      </TouchableOpacity>
                      // </Shadow>
                    );
                  })}
                </View> } 
              {/* </ScrollView> */}


              
              
              {recentWorkshops.length > 0 && 
                <View style={styles.blueBg}>
                  <View style={styles.laserLightWrapperTop}>
                    <Image style={styles.laserLight} source={require('../../assets/images/ypa/laser-1.png')} />
                  </View>

                  <View style={{
                    marginHorizontal: responsiveWidth(3.3),
                    marginTop: responsiveHeight(3.5),
                    marginBottom: responsiveHeight(2.5),
                  }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ flexDirection: "row", alignItems: "center"}}>
                        <View style={styles.menuIconWrapper2}>
                          <Image style={styles.menuIcon2} source={require('../../assets/images/ypa/webinar.png')} />
                        </View>
                        <Text style={styles.simpleTitle}>Workshops</Text>
                      </View>
                      <TouchableOpacity>
                        <Text style={styles.primaryLink}>View All</Text>
                      </TouchableOpacity>
                    </View>
                  </View> 
                
                  
                  <ScrollView style={styles.lessonWrapper} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: responsiveWidth(3.3) }}>
                    <View style={styles.jobWrapper}>
                      { recentWorkshops.map((workshop, index) => {
                        return (
                          <TouchableOpacity key={index} onPress={() => goToWorkshopDetails(workshop)}>
                            <View style={styles.workshopContent}>
                              <Image style={styles.workshopImage} source={{uri: workshop.images[0].regular}} />
                              <View style={styles.workshopContentContainer}>
                                <Text style={styles.workshopTitle} numberOfLines={1} ellipsizeMode='tail'>{workshop.name}</Text>
                                <Text style={styles.workshopDesc} numberOfLines={3} ellipsizeMode='tail'>{workshop.description.replace('\n', '').replace('\r', '')}</Text>
                              </View>
                              <View style={styles.durationWrapper}>
                                <FontAwesomeIcon color={'red'} size={14} icon={faClock} />
                                <Text style={styles.durationText}>{workshop.duration_in_mins} Mins</Text>
                              </View>
                            </View>
                            
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>

                  <View style={styles.laserLightWrapper}>
                    <Image style={styles.laserLight} source={require('../../assets/images/ypa/laser-1.png')} />
                  </View>
                
                  
                </View>
              }
            



            </ScrollView>
          </LinearGradient>
        </View>
      }

    </View>
  );

}

