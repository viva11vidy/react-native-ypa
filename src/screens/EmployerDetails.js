import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView, TouchableHighlight, Keyboard, ScrollView, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, Animated, ImageBackground, Linking } from 'react-native';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';
import { useScrollToTop } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize, } from "react-native-responsive-dimensions";
import RadioButton from 'radio-button-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { ScrollView } from 'react-native-gesture-handler';
import { faArrowRight, faChevronLeft, faClock, faMapMarkedAlt, faMapMarkerAlt, faPoundSign, faShare, faSuitcase, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../components/Pagination';
import RBSheet from "react-native-raw-bottom-sheet";
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import moment from 'moment';
import { Shadow } from 'react-native-shadow-2';
import * as Animatable from 'react-native-animatable';
import HTMLView from 'react-native-htmlview';
import { htmlToText } from 'html-to-text';

import { useSelector, useDispatch } from 'react-redux';
import globals from '../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';

import NotificationListener from '../navigation/NotificationListener';

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

export default EmployerDetails = props => {

  const scrollY = new Animated.Value(0);
  const scrollA = useRef(new Animated.Value(0)).current;

  const HEADER_MAX_HEIGHT = responsiveWidth(100)/3;
  const HEADER_MIN_HEIGHT = responsiveHeight(9);
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  const company = props.route.params.company;
  const [selectedSort, setSelectedSort] = useState('Name A to Z');
  const sortSheetRef = useRef(null);
  const swiper = useRef();
  
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [htmlHeight, setHtmlHeight] = useState(0);
  const scrollRef = useRef();
  // const videoRef = useRef(null); 

  // const [videoPlayed, setVideoPlayed] = useState(false);
  // const [videoPaused, setVideoPaused] = useState(true);
  // const [videoAspectRatio, setVideoAspectRatio] = useState(null); 

  const [textShown, setTextShown] = useState(false);
  const [lengthMore,setLengthMore] = useState(false);
  const [jobs, setJobs] = useState([]); 
  const [events, setEvents] = useState([]); 
  const [inPersonEvents, setInPersonEvents] = useState([]); 
  const [pastEvents, setPastEvents] = useState([]); 

  const [isFirstJobLoaded, setFirstJobLoaded] = useState(false);
  const [isFirstEventLoaded, setFirstEventLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noMoreContent, setNoMoreContent] = useState(false);
  const perPage = 10;
  const [page, setPage] = useState(1);



  const handleIndexChanged = (index) => {
    
    videoRef.pause()
    
  };

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
    props.navigation.push('Opportunities2', {company: cid});
  }

  const goToEvents = cid => {
    props.navigation.push('Events2', {company: cid});
  }

  find_dimesions = (layout) => {
    const {x, y, width, height} = layout;
    setHtmlHeight(height);
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
        let inPersonEventData = []
        let pastEventsData = [];
        
          let params = {
            cmpid: company._id,
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

          inPersonEventData = await dispatch(commonActions.getEvents(params,params.eventType='InPerson'));
          if(refresh) {
            setInPersonEvents([...inPersonEventData]);
          } else {
            setInPersonEvents(inPersonEvents => {
              inPersonEventData.forEach(post => inPersonEvents.push(post));
              return inPersonEvents;
            });
          }

          pastEventsData = await dispatch(commonActions.getPastEvents(params));
          if(refresh) {
            setPastEvents([...pastEventsData]);
          } else {
            setPastEvents(pastEvents => {
              pastEventsData.forEach(post => pastEvents.push(post));
              return pastEvents;
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



  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  }

  const onTextLayout = useCallback(e =>{
    setLengthMore(e.nativeEvent.lines.length >=4); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  },[]);

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
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

  const borderColor = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: ['rgba(0, 0, 0, 0)', '#f1f1f1'],
    extrapolate: 'clamp',
  });

  const textColor = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: ['#ffffff', '#000000']
  });
  
  const bgColor = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: ['rgba(0, 0, 0, 0)', '#ffffff']
  });



 
  return (
    <LinearGradient colors={['#ffffff', '#ffffff']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>

      <Animated.View style={[styles.generalHeader, {backgroundColor:bgColor, borderBottomColor:borderColor}]}>
        <View style={styles.sideBySide}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Animated.Image style={[styles.headerBackIcon,{opacity: imageOpacity,zIndex:101},]} source={require('../../assets/images/ypa/new-images/left-arrow-white.png')} />
            <Animated.Image style={[styles.headerBackIcon,]} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />
            <Animated.Text style={[styles.title, {color:textColor}]}>Back</Animated.Text>
          </TouchableOpacity>
          {/* <FontAwesomeIcon style={styles.iconColor } size={16} icon={faChevronLeft} />
          <Animated.Text style={[styles.generalHeaderTitle, {color:textColor}]}>Back</Animated.Text> */}
        </View>
        
        {company.url &&

          <TouchableOpacity style={{...styles.employerShareIconWrapper, width:responsiveWidth(40),}}  onPress={() => openUrl(company.url)}>
            <Animated.Image style={[styles.employerShareIcon,{opacity: imageOpacity,zIndex:101},]} source={require('../../assets/images/ypa/new-images/share-white.png')}/>
            <Image style={styles.employerShareIcon} source={require('../../assets/images/ypa/new-images/share-black.png')}/>

            <View style={{paddingRight:responsiveWidth(2),position:"relative",top:-responsiveHeight(0.5)}}>
              <Animated.Text style={[styles.shareText, {color:textColor}]}>Website</Animated.Text>
            </View>
          </TouchableOpacity>
        }
        
      </Animated.View>
      


      <ScrollView scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false}
        )} showsVerticalScrollIndicator={false}>
        <View style={styles.employerImageWrapper}>
          <View style={styles.employerOverlay}></View>
          {company.banner_images && company.banner_images.length > 0 &&
            <Image style={styles.employerBackgroundImage} source={{uri: company.banner_images[0].regular}}/>
          }
          {!company.banner_images.length && 
            <Image style={styles.employerBackgroundImage}  source={require('../../assets/images/ypa/category-3.jpg')}/>
          }
        </View>

        <View style={styles.employerTopBar}>
          <Animatable.View animation="fadeInLeft" delay={300} style={styles.employerImageBG}>
            {company.color_images.length &&
            <Image style={styles.employerImg} source={{uri: company.color_images[0].regular}} />
            }
          </Animatable.View>
          <View style={{marginLeft:responsiveWidth(5),paddingTop:responsiveHeight(2.5)}}>
            <Text style={styles.empName}>{company.name}</Text>
            {company.featured &&
            <View style={styles.featuredEmpWrapper}>
              <Text style={styles.featuredEmpText}>Featured Employer</Text>
            </View>
            }
          </View>
        </View>




        {company.description &&
        <Animatable.View animation="fadeInLeft" delay={800} style={{paddingHorizontal:responsiveWidth(3),marginBottom:responsiveHeight(2)}}>
          <Text style={{...styles.jdMainContentTitle,marginBottom:responsiveHeight(2)}}>About Us</Text>

          {/* <Text style={styles.jdMainContent}>{htmlToText(company.description, {wordwrap: false})}</Text> */}

          <View onLayout={(event) => { this.find_dimesions(event.nativeEvent.layout) }}>
            <View style={textShown ? stylesHTML.nothing : stylesHTML.fourLine}>
              <HTMLView
                value={company.description.replace(/(\r\n|\n|\r)/gm, '').replace(/<p>&nbsp;<\/p>/g, '').replace(/<li>/g, '<p>')}
                stylesheet={stylesHTML}
                addLineBreaks={false}
                lineBreak={''}
              />
            </View>
          </View>

          {htmlHeight > 80 &&
            <Text style={styles.jdMainContentMore} onPress={toggleNumberOfLines}>
              {textShown ? 'Read less' : 'Read more'}
            </Text>
          }

          {/* <Text style={styles.jdMainContent} onTextLayout={onTextLayout} numberOfLines={textShown ? undefined : 4}>
            {company.description}
          </Text>
          {
            lengthMore ? 
            <Text style={styles.jdMainContentMore} onPress={toggleNumberOfLines}>
              {textShown ? 'Read less' : 'Read more'}
            </Text>
            :null
          } */}
        </Animatable.View>
        }



        {/* VIDEO SECTION */}
        {company && company.videos && company.videos.length && <>

          <View style={{paddingHorizontal:responsiveWidth(3.2)}}>
            <View style={{...styles.homeEmployerHeaderBarArea,marginBottom:responsiveHeight(2),padding:responsiveWidth(0),}}>
              <Text style={{...styles.jdMainContentTitle}}>Video Gallery</Text>
            </View> 
            <View style={{...styles.swipperWrapper,height:responsiveHeight(31),}}>
              <Swiper style={{...styles.swipperWrapper,height:responsiveHeight(30),}} onIndexChanged={handleIndexChanged} showsButtons={false} loop={true} autoplay={false} autoplayTimeout={5} ref={swiper} showsPagination={true} removeClippedSubviews={false} paginationStyle={{bottom:-5,zIndex:2,position:"absolute",}}>
                
              
                {company.videos.map((video, index) => {
                  return (

                    <VideoPlayer  key={index} 
                      ref={r => videoRef = r}
                      video={{uri: video.url}}
                      // video={require('../../assets/images/ypa/video-1.mp4')}
                      autoplay = {false}
                      defaultMuted={true}
                      disableSeek={true}
                      disableFullscreen={true}
                      videoWidth={1500}
                      videoHeight={900}
                      thumbnail={{uri:video.thumb}}
                    />

           
                  );
                })} 
                
              </Swiper>
            </View>
          </View>
        </>
        }






        { jobs.length > 0 && <>
          <View style={{...styles.homeEmployerHeaderBarArea,marginBottom:responsiveHeight(1)}}>
            <Text style={{...styles.jdMainContentTitle}}>Opportunities with us</Text>
            <TouchableOpacity style={styles.sideBySide} onPress={() => goToJobs(company._id)}>
              <Text style={{...styles.viewAll,color:"#065eb8"}}>View All</Text>
              <View style={{paddingLeft:responsiveWidth(2),top:-responsiveHeight(0.2)}}>
                <Image style={styles.rightArrow} source={require('../../assets/images/ypa/new-images/next-blue.png')} />
              </View>
            </TouchableOpacity>
          </View> 

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection:"row",alignItems:"center",paddingHorizontal:responsiveWidth(3),}}>

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



        <View style={{height:10}}></View>


        








        { inPersonEvents.length > 0 && <>
          <View style={{...styles.homeEmployerHeaderBarArea,marginBottom:responsiveHeight(1)}}>
            <Text style={{...styles.jdMainContentTitle}}>InPerson Events</Text>
            <TouchableOpacity style={styles.sideBySide} onPress={() => goToJobs(company._id)}>
              <Text style={{...styles.viewAll,color:"#065eb8"}}>View All</Text>
              <View style={{paddingLeft:responsiveWidth(2),top:-responsiveHeight(0.2)}}>
                <Image style={styles.rightArrow} source={require('../../assets/images/ypa/new-images/next-blue.png')} />
              </View>
            </TouchableOpacity>
          </View> 

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection:"row",alignItems:"center",paddingHorizontal:responsiveWidth(3),}}>

            {inPersonEvents.map((event, index) => {
              return (
                <TouchableOpacity key={index} onPress={() => goToEventInPersonDetails(event)}>
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
                </TouchableOpacity>
              )
            })}

          </ScrollView>

        </> }
        
        <View style={{height:10}}></View>










        { pastEvents.length > 0 && <>
          <View style={{...styles.homeEmployerHeaderBarArea,marginBottom:responsiveHeight(1)}}>
            <Text style={{...styles.jdMainContentTitle}}>Past Events</Text>
            <TouchableOpacity style={styles.sideBySide} onPress={() => goToJobs(company._id)}>
              <Text style={{...styles.viewAll,color:"#065eb8"}}>View All</Text>
              <View style={{paddingLeft:responsiveWidth(2),top:-responsiveHeight(0.2)}}>
                <Image style={styles.rightArrow} source={require('../../assets/images/ypa/new-images/next-blue.png')} />
              </View>
            </TouchableOpacity>
          </View> 

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection:"row",alignItems:"center",paddingHorizontal:responsiveWidth(3),}}>

            {pastEvents.map((event, index) => {
              return (
                <TouchableOpacity onPress={() => goToEventMediaDetail(event)}>
                  <View style={{...stylesInline.singlePastEvent,}}>
                    <View>
                      <View style={stylesInline.speOverlay}></View>
                      { event.en.videos.length ? <>
                        { event.en.videos[0].thumb ? 
                          <Image style={stylesInline.speImage} source={{uri: event.en.videos[0].thumb}} />
                        :
                          <Image style={stylesInline.speImage} source={require('../../assets/images/ypa/abc.jpg')} />
                        }
                      </> : <>
                        { event.en.images.length && event.en.images[0].regular ? 
                          <Image style={stylesInline.speImage} source={{uri: event.en.images[0].regular}} />
                        :
                          <Image style={stylesInline.speImage} source={require('../../assets/images/ypa/abc.jpg')} />
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
              )
            })}

          </ScrollView>

        </> }
        
        <View style={{height:10}}></View>
















        {/* WORKSHOPS */}
        {/* <ImageBackground style={{...styles.homeEmployerSection, height:responsiveHeight(37),marginTop:responsiveHeight(3)}} source={require('../../assets/images/ypa/new-images/home-employer-bg.jpg')} resizeMode="cover">
          <View style={{...styles.homeEmployerHeaderBarArea}}>
            <Text style={{...styles.homeEmployerHeaderBarTitle, fontSize:responsiveFontSize(2.2),}}>Latest Workshops</Text>
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
        { events.length > 0 && <>
          <View style={{...styles.homeEmployerHeaderBarArea,marginBottom:responsiveHeight(0)}}>
            <Text style={{...styles.jdMainContentTitle}}>Virtual Events</Text>
            <TouchableOpacity style={{...styles.sideBySide,top:responsiveHeight(0.2)}} onPress={() => goToEvents(company._id)}>
              <Text style={{...styles.viewAll,color:"#065eb8"}}>View All</Text>
              <View style={{paddingLeft:responsiveWidth(2),marginTop:-responsiveHeight(0.3)}}>
                <Image style={styles.rightArrow} source={require('../../assets/images/ypa/new-images/next-blue.png')} />
              </View>
            </TouchableOpacity>
          </View>
          <LinearGradient colors={['#ffffff', '#cee6ff']} style={styles.homeVirtualWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
            {events.map((event, index) => {
              return (
                <TouchableOpacity key={index} onPress={() => goToEventDetails(event)}>
                  <View style={styles.singleVirtualEvent}>
                    <View style={styles.sideBySide}>

                      {/* { event.images.length && event.images[0].regular ? <>
                        <Image style={styles.homevirtualEventImage} source={{uri: event.images[0].regular}} />
                      </> : <> 
                        { event.company.length && event.company[0].images.length && event.company[0].images[0].regular ? 
                          <Image style={styles.homevirtualEventImage} source={{uri: company.color_images[0].regular}} />
                          :
                          <Image style={styles.homevirtualEventImage} source={require('../../assets/images/ypa/slide-1.jpg')} />
                        }  
                      </> } */}

                      <Image style={{...styles.sImage,resizeMode:"contain"}} source={{uri: company.color_images[0].regular}} />
                    
                      <View>
                        <Text style={styles.hveDate}>{moment(event.event_date).format("Do MMM")}, {event.event_time_hour}:{event.event_time_mins}</Text>
                        <Text style={{...styles.hveTitle, fontSize: responsiveFontSize(2)}} numberOfLines={2}>{event.title}</Text>
                      </View>
                    </View>
                    <Image style={styles.rightCircleBlue} source={require('../../assets/images/ypa/new-images/right-circle-blue.png')} />
                  </View>
                </TouchableOpacity>
              )
            })}
            



          </LinearGradient>
        </>}


      </ScrollView>
      
    </LinearGradient>
  );

}


const stylesHTML = StyleSheet.create({
  strong: {
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
    textAlign:"left"
    // color: '#FF3366',
  },
  br:{
    marginVertical:responsiveHeight(5),
    height:10,
    width:responsiveWidth(80),
    backgroundColor:"red"
  },
  p:{
    fontFamily: "Poppins-Light",
    marginTop: 0,
    marginBottom: 10,
  },
  fourLine:{
    maxHeight:90,
    overflow:"hidden"
  }
});

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
    width:responsiveWidth(85),
    backgroundColor:"#ffffff",
    padding:10,
    borderRadius:8,
    borderColor:"#f1f1f1",
    borderWidth:1,
    marginBottom:responsiveHeight(2),
    marginRight:responsiveWidth(5)
  },
  eventImageWrapper:{
    height: responsiveHeight(15),
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



  singlePastEvent:{
    backgroundColor:"#ffffff",
    borderRadius:8,
    borderColor:"#f1f1f1",
    borderWidth:1,
    marginBottom:responsiveHeight(2),
    overflow:"hidden",
    width:responsiveWidth(85),
    marginRight:responsiveWidth(5)
  },
  speImage:{
    width: "100%",
    resizeMode: "cover",
    height: responsiveHeight(29),
  },
  spePlayWrapper:{
    position:"absolute",
    width: "100%",
    alignItems:"center",
    justifyContent:"center",
    height: responsiveHeight(29),
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
    height: responsiveHeight(29),
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
  playIconWrapper:{
    position:"absolute",
    zIndex:9,
    top:0,
    bottom:0,
    left:0,
    right:0,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  mediaVideo:{
    width: responsiveWidth(100),
    height: responsiveHeight(30),
    marginBottom:responsiveHeight(1.4)
  },

});

