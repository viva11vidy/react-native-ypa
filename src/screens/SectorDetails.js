import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView, TouchableHighlight, Keyboard, ScrollView, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, Animated } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize, } from "react-native-responsive-dimensions";
import RadioButton from 'radio-button-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { ScrollView } from 'react-native-gesture-handler';
import { faArrowRight, faCalendarAlt, faClock, faMapMarkedAlt, faMapMarkerAlt, faPoundSign, faSuitcase } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../components/Pagination';
import RBSheet from "react-native-raw-bottom-sheet";
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';

import { useSelector, useDispatch } from 'react-redux';
import globals from '../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
import styles from './StyleSheet';

import NotificationListener from '../navigation/NotificationListener';

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

export default SectorDetails = props => {

  const dispatch = useDispatch();


  const scrollY = new Animated.Value(0);
  const HEADER_MAX_HEIGHT = responsiveHeight(40);
  const HEADER_MIN_HEIGHT = responsiveHeight(9);
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;


  const authUser = useSelector(state => state.auth.user);
  const company = props.route.params.company;
  const sector = props.route.params.sector;

  // console.log(sector, 'heello');

  const [selectedSort, setSelectedSort] = useState('Name A to Z');
  const sortSheetRef = useRef(null);
  const swiper = useRef();
  const [swipeIndex, setSwipeIndex] = useState(0);
  const scrollRef = useRef();

  const [jobs, setJobs] = useState([]); 
  // const [sector, setSector] = useState([]); 


  const [events, setEvents] = useState([]); 
  const [isFirstJobLoaded, setFirstJobLoaded] = useState(false);
  const [isFirstEventLoaded, setFirstEventLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noMoreContent, setNoMoreContent] = useState(false);
  const perPage = 10;
  const [page, setPage] = useState(1);

  const openUrl = uri => {
    props.navigation.navigate('WebPage', {uri: uri});
  }

  const goToJobDetails = job => {
    props.navigation.navigate('OpportunityDetails', {job, job});
  }

  const goToEventDetails = event => {
    props.navigation.navigate('EventDetails', {event: event});
  }

  const goToJobs = cid => { 
    props.navigation.push('Opportunities2', {sector: cid});
  }

  const goToEvents = cid => {
    props.navigation.push('Events2', {sector: cid});
  }

  useEffect(() => {
    fetchData(true);
  }, [swipeIndex]);

  const fetchData = refresh => {
    setPage(async page => {
      let pageToFetch = await page;
      if(refresh) { //first load or pull to refresh
        pageToFetch = 1;
        setNoMoreContent(false);
        if(swipeIndex == 1) {
          
        } 
      } else { //pagination
        if(noMoreContent) return pageToFetch; 
        pageToFetch = pageToFetch + 1;
        setIsPaginating(true);
      }
      
      try {
        let jobData = [];
        let eventData = [];
        
          let params = {
            cid: sector._id,
            perpage: perPage,
            page: pageToFetch,

          }

          jobData = await dispatch(commonActions.getJobs(params));
          if(refresh) {
            setJobs([...jobData]);
          } else {
            setJobs(jobs => {
              jobData.forEach(post => jobs.push(post));
              return jobs;
            });
          }
          
          eventData = await dispatch(commonActions.getEvents(params));
          if(refresh) {
            setEvents([...eventData]);
          } else {
            setEvents(events => {
              eventData.forEach(post => events.push(post));
              return events;
            });
          }
        
        if(data.length < perPage) {
          setNoMoreContent(true);
        } else {
          setNoMoreContent(false);
        }
      } catch(err) {
        console.log(err);
      }
      setIsLoading(false);
      setIsPaginating(false);
      setIsRefreshing(false);
      if(swipeIndex == 1) {
          
      } 
      if(swipeIndex == 1) {
        if(!isFirstJobLoaded) setFirstJobLoaded(true);
      } 
      if(swipeIndex == 2) {
        if(!isFirstEventLoaded) setFirstEventLoaded(true);
      }
      
      return pageToFetch;
    });
  };

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const imageOpacityReverse = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 2],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -70],
    extrapolate: 'clamp',
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const textColor = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 2],
    outputRange: ['#ffffff', '#000000']
  });
  
  const bgColor = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: ['rgba(0, 0, 0, 0.5)', '#ffffff']
  });





  return (
    
    <View style={{backgroundColor:"#eef6ff"}}>
      

               
      <View>
        <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          { useNativeDriver: false }
        )}>
          <LinearGradient colors={['#ffffff', '#eef6ff']}  style={{...styles.scrollViewContent, marginTop: responsiveHeight(40)}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
            
          <Text style={styles.jdMainContent}>{sector.description}</Text>
          
          { jobs.length > 0 && <>
            <View style={{...styles.homeEmployerHeaderBarArea,marginBottom:responsiveHeight(1),marginTop:responsiveHeight(4)}}>
              <Text style={{...styles.jdMainContentTitle}}>Opportunities</Text>
              <TouchableOpacity style={styles.sideBySide} onPress={() => goToJobs(sector._id)}>
                <Text style={{...styles.viewAll,color:"#065eb8"}}>View All</Text>
                <View style={{paddingLeft:responsiveWidth(2),top:-responsiveHeight(0.2)}}>
                  <Image style={styles.rightArrow} source={require('../../assets/images/ypa/new-images/next-blue.png')} />
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection:"row",alignItems:"center",paddingRight:responsiveWidth(3),marginTop:responsiveHeight(2)}}>
              
              {jobs.map((job, index) => {
                return (
                  <TouchableOpacity key={index} onPress={() => goToJobDetails(job)}>
                    <View style={styles.homeSingleJob}>

                      <View style={{paddingHorizontal:responsiveWidth(3)}}>
                        <Image style={styles.homeSingleJobImage} source={{uri: job.company[0].color_images[0].regular}} />
                        <Text numberOfLines={1} style={{...styles.hsjjobBelow, marginBottom:responsiveHeight(0.2),color:"#b2b2b2"}}>{job.company[0].name}</Text>
                        <Text style={styles.hsjTitle} numberOfLines={2}>{job.title}</Text>
                        {job.salary !=0 &&
                          <Text style={styles.hsjjobBelow} numberOfLines={1}>{job.salary}</Text>
                        }
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
                )
              })}
              
            </ScrollView>
          </> }

          { events.length > 0 && <>

            <View style={{...styles.homeEmployerHeaderBarArea,marginBottom:responsiveHeight(0),marginTop:responsiveHeight(4)}}>
              <Text style={{...styles.jdMainContentTitle}}>Events</Text>
              <TouchableOpacity style={{...styles.sideBySide,top:responsiveHeight(0.2)}} onPress={() => goToEvents(sector._id)}>
                <Text style={{...styles.viewAll,color:"#065eb8"}}>View All</Text>
                <View style={{paddingLeft:responsiveWidth(2),marginTop:-responsiveHeight(0.3)}}>
                  <Image style={styles.rightArrow} source={require('../../assets/images/ypa/new-images/next-blue.png')} />
                </View>
              </TouchableOpacity>
            </View>


            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection:"row",alignItems:"center",paddingRight:responsiveWidth(3),marginTop:responsiveHeight(2)}}>
              {events.map((event, index) => {
                return (
                  <TouchableOpacity key={index} onPress={() => goToEventDetails(event)}>
                    <View style={stylesInline.singleEvent}>
                      <View style={{position:"relative"}}>
                        <View style={stylesInline.eventImageWrapper}>
                          <LinearGradient colors={['rgba(0, 0, 0, 0.7)', 'transparent']} style={stylesInline.eventImageOverlay} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}></LinearGradient>
                          <Image style={stylesInline.eventImage}  source={{uri: event.images[0].regular}} />
                        </View>
                        <View style={stylesInline.eventCompanyWrapper}>
                          { event.images.length && event.images[0].regular ? <>
                            <Image style={styles.eventCompanyImage} source={{uri: event.images[0].regular}} />
                          </> : <> 
                            { event.company.length && event.company[0].images.length && event.company[0].images[0].regular ? 
                              <Image style={styles.eventCompanyImage} source={{uri: event.company[0].images[0].regular}} />
                              :
                              <Image style={styles.eventCompanyImage} source={require('../../assets/images/ypa/slide-1.jpg')} />
                            }  
                          </> }
                          <Text style={stylesInline.eventCompany}>{event.company[0].name}</Text>
                        </View>
                      </View>
                      
                      <View style={{paddingHorizontal:5}}>
                        <Text style={stylesInline.eventTitle} numberOfLines={2} ellipsizeMode='tail'>{event.title}</Text>
                        
                        <Text style={stylesInline.eventDesc} numberOfLines={2} ellipsizeMode='tail'>{event.description}</Text>

                        <View style={stylesInline.horizontalLine}></View>

                        <View style={stylesInline.sideBySide}>
                          <View style={stylesInline.sideBySide}>
                            <FontAwesomeIcon color={'#0076fd'} size={13} icon={faCalendarAlt} />
                            <Text style={stylesInline.eventDateText}>{moment(event.event_date).format("Do MMM")}</Text>
                          </View>
                          <View style={{...stylesInline.sideBySide,marginLeft:responsiveWidth(4)}}>
                            <FontAwesomeIcon color={'#0076fd'} size={13} icon={faClock} />
                            <Text style={stylesInline.eventDateText}>{event.event_time_hour}:{event.event_time_mins}</Text>
                          </View>
                        </View>

                        <View style={{height:responsiveHeight(0.5)}}></View>

                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })}
              
            </ScrollView>

          </> }
          
          </LinearGradient>
        </ScrollView>




        <Animated.View style={[styles.header, {height: headerHeight}]}>

          <Animated.View style={[styles.jdContentWrapper,{opacity: imageOpacity}]}>
            
            <Animatable.Text animation="fadeInLeft" delay={200} style={{...styles.jdTitle, fontSize:responsiveFontSize(3),}}>{sector.name}</Animatable.Text>

            <Animatable.View animation="fadeInLeft" delay={300} style={styles.sideBySide}>
              {/* <FontAwesomeIcon color={'#ffffff'} size={12} icon={faCalendarAlt} style={{marginRight:responsiveWidth(3)}}/>
              <Text style={styles.jdSalary}>{moment(insight.publish_date).format("dddd, MMMM Do YYYY")} {insight.insight_timing}</Text> */}
            </Animatable.View>
          </Animated.View>

          
          <Animated.View style={[styles.bgOverlay, {backgroundColor:bgColor},{height: headerHeight}]}></Animated.View>
          <Animated.Image animation="fadeIn" delay={100} style={[styles.backgroundImage,{height: responsiveHeight(40),}, {opacity: imageOpacity, transform: [{translateY: imageTranslate}]},]} source={{uri: sector.images[0].regular}} 
          />
           <Animated.Image style={{position:"absolute",top:0, width:responsiveWidth(100),height:headerHeight,opacity: imageOpacity, transform: [{translateY: imageTranslate}]}} source={require('../../assets/images/ypa/bg-9.jpg')} />
           



 
          <View style={styles.bar}>

            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Animated.Image style={[styles.headerBackIcon,{opacity: imageOpacity,zIndex:101},]} source={require('../../assets/images/ypa/new-images/left-arrow-white.png')} />
              <Animated.Image style={[styles.headerBackIcon,]} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />
              <Animated.Text style={[styles.title, {color:textColor}]}>Back</Animated.Text>
            </TouchableOpacity>
          

            <Animated.View style={[styles.headerBorder,{opacity: imageOpacityReverse}]}></Animated.View>
          </View>


        </Animated.View>

        
        
        
      </View>
      
    </View>
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
    marginBottom:responsiveHeight(2),
    width:responsiveWidth(80)
  },
  eventImageWrapper:{
    height: responsiveHeight(20),
    borderRadius:8,
    overflow:"hidden"
  },
  
  eventImage: {
    width: "100%",
    resizeMode: "cover",
    height: "100%",
    // backgroundColor:"yellow"
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
    top:10,
    left:10,
    borderRadius:8
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



});
