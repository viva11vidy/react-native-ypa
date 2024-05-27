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
import ScaledImage from 'react-native-scalable-image';
import { Shadow } from 'react-native-shadow-2';
import HTMLView from 'react-native-htmlview';
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

export default EventDetails = props => {

  const dispatch = useDispatch();

  const scrollY = new Animated.Value(0);
  const HEADER_MAX_HEIGHT = responsiveHeight(48);
  const HEADER_MIN_HEIGHT = responsiveHeight(9);
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
  const [textShown, setTextShown] = useState(false);
  const [lengthMore,setLengthMore] = useState(false);
  const [htmlHeight, setHtmlHeight] = useState(0);

  const authUser = useSelector(state => state.auth.user);
  const [event, setEvent] = useState(props.route.params.event);
  const [selectedSort, setSelectedSort] = useState('Name A to Z');
  const sortSheetRef = useRef(null);
  const swiper = useRef();
  const [swipeIndex, setSwipeIndex] = useState(0);
  const scrollRef = useRef();


  // useEffect(() => {
  //   console.log('-----------------------------------------------')
  //   console.log(swiper.current.state.index);
  // }, []);

  useEffect(() => {
    fetchData(true);
  }, [dispatch]);

  const fetchData = async refresh => {
    if(!event.title) {
      setIsLoading(true);
      try {
        let res = await dispatch(commonActions.getEvents({id: event._id}));
        if(res.length) {
          setEvent(res[0]);
        }
        event.description = event.description.replace(new RegExp('<p>', 'g'), '<span>').replace(new RegExp('</p>', 'g'), '</span>')
      } catch (error) {
        
      }
      setIsLoading(false);
    }
    
  };

  const openUrl = uri => {
    props.navigation.navigate('WebPage', {uri: uri});
  }


  const swipe = (index) => {

    // console.log(swiper.current.state.index);
    // if(swiper.current.state.index == 0) {
    // console.log(index);
    setSwipeIndex(index);
    
    if (index > 1) {
      // console.log('asas');
      scrollRef.current?.scrollTo({
        x: 400,
        animated: true,
      });
    } else if (index < 2) {
      scrollRef.current?.scrollTo({
        x: 0,
        animated: true,
      });
    }

    // } else if(swiper.current.state.index == 1) {
    //   setSwipeIndex(1)
    // }else if(swiper.current.state.index == 2) {
    //   setSwipeIndex(2)
    // }else if(swiper.current.state.index == 3) {
    //   setSwipeIndex(3)
    // }
  };

  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  }

  const goToEmployerDetails = company => {
    props.navigation.navigate('EmployerDetails', {company: company});
  }

  const onTextLayout = useCallback(e =>{

    console.log(e.nativeEvent.lines.length);
    // setLengthMore(e.nativeEvent.lines.length >=4); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  },[]);

  find_dimesions = (layout) => {
    const {x, y, width, height} = layout;
    setHtmlHeight(height);
  }

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
    outputRange: ['rgba(0, 0, 0, 0.6)', '#ffffff']
  });

  const companyImage = item => {
    return (
      <View style={{ padding: responsiveWidth(3.2) }}>
        <View style={styles.singleContent}>
          <Text style={styles.singleContentTitle}>{event.title}</Text>
          <View style={{marginTop:responsiveHeight(1)}}>
           <Text style={styles.singleContentSubTitle}>{event.company[0].name}</Text>
          </View>
          <View style={{flexDirection: "row",alignItems: "flex-start",flexWrap: "wrap",marginBottom:responsiveHeight(1.5)}}>
            <View style={{position:"relative", marginTop:responsiveHeight(0.8)}}>
              <FontAwesomeIcon color={'#222222'} size={13} icon={faMapMarkerAlt} />
            </View>
            <Text style={styles.singleContentLocation}>{event.location}</Text>
          </View>
          <View style={styles.jobTagWrapper}>
            { event.keywords.map((keyword, index) => {
              return (<View key={index} style={styles.singleTag}>
                <Text style={styles.singleTagText}>{keyword}</Text>
              </View>);
            })}
            
          </View>
          <View style={styles.jobDateWrapper}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesomeIcon color={'#007fff'} size={14} icon={faClock} />
              <Text style={styles.jobDateText}>Event Date: {moment(event.event_date).format("DD/MM/YYYY, hh:mm A")}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const companyTab = item => {
    return (
      <View>
        <ScrollView style={styles.tabWrapper} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabWrapperContent} ref={scrollRef}>
          <TouchableOpacity onPress={() => swiper.current.scrollTo(0)}>
            <View style={styles.singleTab}>
              {swipeIndex == 0 ?
                <>
                  <Text style={styles.singleTabTitleActive}>Description</Text>
                  <View style={styles.singleTabActiveBorder}></View>
                </>
                :
                <Text style={styles.singleTabTitle}>Description</Text>
              }
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => swiper.current.scrollTo(1)}>
            <View style={styles.singleTab}>
              {swipeIndex == 1 ?
                <>
                  <Text style={styles.singleTabTitleActive}>About Company</Text>
                  <View style={styles.singleTabActiveBorder}></View>
                </>
                :
                <Text style={styles.singleTabTitle}>About Company</Text>
              }
            </View>
          </TouchableOpacity>

        </ScrollView>
      </View>
    );
  };

  const companyTabContent = item => {
    return (
      <View>
        <Swiper scrollEnabled={true} index={0} showsPagination={false} showsButtons={false} style={styles.tabContentSwiper} loop={false} ref={swiper} containerStyle={styles.tabContentSwiperInner} onIndexChanged={(index) => swipe(index)} height="100%">

          {/* Description */}
          <View style={{ backgroundColor: "#ebf1ff", minHeight: responsiveHeight(80) }}>
            <ScrollView scrollEnabled={Platform.OS != 'ios'} nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={{ width: '100%', height: "100%" }}>
              <View style={{ padding: responsiveWidth(3.2),paddingTop:responsiveHeight(3) }}>
                <Text style={styles.companyDesc}>{event.description}</Text>
                { typeof event.link_url == 'string' && event.link_url != '' && <TouchableOpacity onPress={() => openUrl(event.link_url)}>
                  <View style={styles.companyButton}>
                    <Text style={styles.companyButtonText}>Register Now</Text>
                    <View style={{marginLeft:responsiveWidth(3)}}>
                     <FontAwesomeIcon color={'#ffffff'} size={16} icon={faArrowRight} />
                    </View>
                  </View>
                </TouchableOpacity> }
              </View>
            </ScrollView>
          </View>

          {/* About Company */}
          <View style={{ backgroundColor: "#ebf1ff", minHeight: responsiveHeight(80) }}>
            <ScrollView scrollEnabled={Platform.OS != 'ios'} showsVerticalScrollIndicator={false} style={{ width: '100%', height: "100%" }}>
              <View style={{ padding: responsiveWidth(3.2),paddingTop:responsiveHeight(5) }}>
                <View style={{backgroundColor:"#007fff",padding:responsiveWidth(1),borderRadius:10,marginBottom:responsiveHeight(3)}}>
                  <ScaledImage style={styles.jobImage} source={{uri: event.company[0].images[0].regular}} width={responsiveHeight(25)} />
                </View>
                <Text style={styles.companyDesc}>{event.company[0].description}</Text>
              </View>
            </ScrollView>
          </View>

        </Swiper>
      </View>
    );
  };


  if(!event.title && isLoading) {
    return(
      <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(20)}}>
        <ActivityIndicator size="large" color={'#007fff'} />
      </View>
    );
  }


  if(!event.title && !isLoading) {
    return(
      <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(20)}}>
        <Image style={styles.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
        <Text style={styles.noDataTitle}>No Event Found</Text>
      </View>
    );
  }


  return (
    <View>



      <View>
        <ScrollView scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false}
        )}>
          <View style={styles.scrollViewContent}>

            

            <View style={styles.sideBySide}>
              <Image style={styles.salaryIcon} source={require('../../assets/images/ypa/new-images/map-marker-blue.png')} />
              <Text style={styles.jdLocation}>{event.location}</Text>
            </View>
            
            

            <Text style={{...styles.jdMainContentTitle, marginTop:responsiveHeight(6), marginBottom:responsiveHeight(3)}}>About Event</Text>


            <View onLayout={(event) => { this.find_dimesions(event.nativeEvent.layout) }}>
              <View style={textShown ? stylesHTML.nothing : stylesHTML.fourLine}>
                <HTMLView
                  value={event.description.replace(/(\r\n|\n|\r)/gm, '').replace(/<p>&nbsp;<\/p>/g, '').replace(/<li>/g, '<p>')}
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
              {event.description}
            </Text> 
            {
              lengthMore ? 
              <Text style={styles.jdMainContentMore} onPress={toggleNumberOfLines}>
                {textShown ? 'Read less' : 'Read more'}
              </Text>
              :null
            }
            */}
 
            <View style={styles.tagWrapper}>

            { event.keywords.map((keyword, index) => {
              return (<View key={index} style={styles.singleTag}>
                <Text style={styles.singleTagText}>{keyword}</Text>
              </View>);
            })}
            </View>


            {event.sidebar_images && event.sidebar_images.length && event.sidebar_images[0].regular && 
              <Image style={styles.eipImage} source={{uri: event.sidebar_images[0].regular}} />
            }
            



            <View style={styles.jdCompanyWrapper}>
              <View style={{...styles.jobDetailsCompanyLogoWrapper, marginRight:responsiveWidth(6), borderColor:"#f1f1f1", borderWidth:1}}>
                <Image style={styles.jobDetailsCompanyLogo} source={{uri: event.company[0].color_images[0].regular}} />
              </View>
              <View>
                <Text style={styles.jobCompanyName}>{event.company[0].name}</Text>
                <TouchableOpacity onPress={() => goToEmployerDetails(event.company[0])}>
                  <Text style={styles.jobKnowMore}>Know More</Text>
                </TouchableOpacity>
              </View>
            </View>


          </View>
        </ScrollView>


        <Animated.View style={[styles.header, {height: headerHeight}]}>

          <Animated.View style={[styles.jdContentWrapper,{opacity: imageOpacity}]}>

          
            <Animatable.View animation="fadeInDown" delay={50} style={styles.jobDetailsCompanyLogoWrapper}>
              <Image style={styles.jobDetailsCompanyLogo} source={{uri: event.company[0].color_images[0].regular}} />
            </Animatable.View>

            <Animatable.Text animation="fadeInLeft" delay={100} style={styles.jdCompanyTitle}>{event.company[0].name}</Animatable.Text>
            <Animatable.Text animation="fadeInLeft" delay={200} style={styles.jdTitle} numberOfLines={2}>{event.title}</Animatable.Text>

            <Animatable.View animation="fadeInLeft" delay={300} style={styles.sideBySide}>
              <Image style={{...styles.salaryIcon,height:responsiveHeight(2.2),width:responsiveHeight(2.2),}} source={require('../../assets/images/ypa/new-images/clock-white.png')} />
              <Text style={styles.jdSalary}>{moment(event.event_date).format("DD MMM YYYY")}, {event.event_time_hour}:{event.event_time_mins}</Text>
            </Animatable.View>
            
            
          </Animated.View>


          <Animated.View style={[styles.bgOverlay, {backgroundColor:bgColor},{height: headerHeight}]}></Animated.View>
          <Animated.Image animation="fadeIn" delay={100} style={[styles.backgroundImage, {opacity: imageOpacity, transform: [{translateY: imageTranslate}]},]} source={{uri: event.images[0].regular}}
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

        
        <View style={styles.jdFooter}>
          <Shadow distance={5} startColor={'#0000000d'} >
            <View style={styles.jdFooterInner}>
              <Text style={styles.jdFooterText}>Interested ?</Text>
              <View style={styles.sideBySide}>
                

                { typeof event.link_url == 'string' && event.link_url != '' && 
                <TouchableOpacity onPress={() => openUrl(event.link_url)}>
                  <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.applyFilterButton, width:responsiveWidth(35),}}>
                      <Text style={styles.applyFilterButtonText}>Register Now</Text>
                    </LinearGradient>
                </TouchableOpacity>
                }

              </View>
            </View>
          </Shadow>
        </View>
        
      </View>










      {false &&
        <LinearGradient colors={['#ebf1ff', '#ebf1ff']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>

          <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={styles.scrollview} contentContainerStyle={{ paddingBottom: 0 }} stickyHeaderIndices={[1]}>
            {companyImage()}
            {companyTab()}
            {companyTabContent()}
          </ScrollView>
        </LinearGradient>
      }
    </View>
  );

}


const stylesHTML = StyleSheet.create({
  strong: {
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
    textAlign:"left"
    // color: '#FF3366',
  },
  p:{
    fontFamily: "Poppins-Light",
    marginTop: 0,
    marginBottom: 10,
  },
  fourLine:{
    maxHeight:100,
    overflow:"hidden"
  }
});


// const styles = StyleSheet.create({
//   parentWrapper: {
//     flex: 1,
//     // backgroundColor: "#f0f7ff",
//     backgroundColor: "#f5faff",

//   },
//   scrollview: {
//   },
//   // singleContent: {
//   //   backgroundColor: "#ffffff",
//   //   width: "100%",
//   //   marginBottom: responsiveHeight(0),
//   //   // alignItems: "center",
//   //   // justifyContent: "center",
//   //   paddingTop: responsiveWidth(4),
//   //   paddingBottom: responsiveWidth(4),
//   //   paddingHorizontal: responsiveWidth(4),
//   //   borderRadius: 8,
//   //   elevation: 0.5
//   // },
//   contentImage: {
//     width: "100%",
//     resizeMode: "contain",
//     height: responsiveHeight(20),
//     // backgroundColor:"red"
//   },
//   tabWrapper: {
//     backgroundColor: "#ffffff",
//     height: responsiveHeight(8),
//     // borderBottomWidth: 1,
//     // borderBottomColor: "#ececec"
//   },
//   tabWrapperContent: {
//     alignItems: "center",
//     flexDirection: "row",
//     paddingRight: responsiveWidth(3.3)
//   },
//   singleTab: {
//     alignItems: "center",
//     flexDirection: "row",
//     paddingHorizontal: responsiveWidth(8),
//     // backgroundColor:"red",
//     height: responsiveHeight(8),
//     position: "relative"
//   },
//   singleTabActiveBorder: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: responsiveHeight(0.6),
//     backgroundColor: "#007fff",
//     borderRadius: 7
//   },
//   singleTabTitle: {
//     fontSize: responsiveFontSize(2.1),
//     color: "#222222",
//     fontFamily: "FuturaLT-Book",
//   },
//   singleTabTitleActive: {
//     fontSize: responsiveFontSize(2.1),
//     color: "#007fff",
//     fontFamily: "FuturaLT-Book",
//   },
//   tabContentSwiper: {
//     backgroundColor: "#000000",
//     // maxHeight:responsiveHeight(80)
//   },
//   tabContentSwiperInner: {
//     // backgroundColor: "blue",
//     // maxHeight:"95%"
//   },
//   companyName: {
//     fontSize: responsiveFontSize(2.5),
//     color: "#222",
//     fontFamily: "Poppins-SemiBold",
//     marginTop: responsiveHeight(2),
//     marginBottom: responsiveHeight(2)
//   },
//   companyDesc: {
//     fontSize: responsiveFontSize(1.9),
//     color: "#222222",
//     fontFamily: "FuturaLT",
//     marginBottom: responsiveHeight(3)
//   },
//   companyButton: {
//     backgroundColor: "#007fff",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     height: responsiveHeight(8),
//     marginTop: responsiveHeight(2),
//     marginBottom: responsiveHeight(2)
//   },
//   companyButtonText: {
//     fontSize: responsiveFontSize(2.5),
//     color: "#ffffff",
//     fontFamily: "FuturaLT-Bold",
//     textTransform: 'uppercase',
//     textShadowColor: 'rgba(57, 158, 255, 0.4)',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 8,
//   },


//   // WORSKHOPS
//   workshopWrapper: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     flexWrap: "wrap",
//     padding: responsiveWidth(3.2)
//   },
//   workshopContent: {
//     backgroundColor: "#ffffff",
//     width: responsiveWidth(45.5),
//     marginBottom: responsiveWidth(2.7),
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "hidden",
//     // paddingTop: responsiveWidth(2.5),
//     // paddingBottom: responsiveWidth(2.7),
//     // paddingHorizontal: responsiveWidth(2.5),
//     borderRadius: 8
//   },

//   workshopImage: {
//     width: "100%",
//     resizeMode: "cover",
//     height: responsiveHeight(15),
//     // backgroundColor:"red"
//   },
//   workshopContentContainer: {
//     // alignItems: "center",
//     justifyContent: "center",
//     paddingBottom: responsiveWidth(2.7),
//     paddingHorizontal: responsiveWidth(2.5),
//   },
//   workshopTitle: {
//     fontSize: responsiveFontSize(1.9),
//     color: "#333333",
//     fontFamily: "Poppins-SemiBold",
//     textAlign: "left",
//     // backgroundColor:"red",
//     marginTop: responsiveHeight(1.9),
//     marginBottom: responsiveHeight(0.5),
//   },
//   workshopDesc: {
//     fontSize: responsiveFontSize(1.6),
//     color: "#333333",
//     fontFamily: "FuturaLT",
//     textAlign: "left",
//     // backgroundColor:"red",
//   },


//   // JOBS
//   jobWrapper: {
//     width: "100%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     flexWrap: "wrap",
//     // backgroundColor:"red",
//     padding: responsiveWidth(3.2)
//   },
//   jobContent: {
//     backgroundColor: "#ffffff",
//     // width: responsiveWidth(100),
//     // flex:1,
//     marginBottom: responsiveWidth(2.7),
//     overflow: "hidden",
//     paddingTop: responsiveWidth(2.5),
//     paddingBottom: responsiveWidth(2.7),
//     paddingHorizontal: responsiveWidth(2.5),
//     borderRadius: 8,
//     marginBottom: responsiveWidth(2.9),
//   },
//   jobTopContent: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     marginBottom: responsiveWidth(2),
//     // overflow: "hidden",
//   },
//   jobImage: {
//     resizeMode: "cover",
//     borderRadius: 8,
//     marginRight: responsiveWidth(2.5),
//     marginBottom: responsiveWidth(2.5),
//     alignSelf: 'center'
//   },
//   jobTitle: {
//     fontSize: responsiveFontSize(1.9),
//     color: "#333333",
//     fontFamily: "Poppins-SemiBold",
//     textAlign: "left",
//     marginBottom: responsiveHeight(0.5),
//   },
//   jobOptionWrapper: {
//     flexDirection: "row",
//     // alignItems: "center",
//     flexWrap: "wrap",
//     width: "100%",
//     marginTop: responsiveHeight(1.2),
//     // backgroundColor:"yellow"
//   },
//   singleJobOption: {
//     flexDirection: "row",
//     alignItems: "center",
//     // backgroundColor:"red",
//     width: "47%",
//     marginRight: "3%",
//     marginBottom: responsiveHeight(2.2)
//     // backgroundColor:"blue"
//   },
//   singleJobOptionImage: {
//     width: responsiveHeight(1.5),
//     resizeMode: "contain",
//     height: responsiveHeight(1.5),
//     marginRight: responsiveWidth(1.5),
//     // backgroundColor:"yellow"
//   },
//   singleJobOptionTitle: {
//     fontSize: responsiveFontSize(1.6),
//     color: "#757a7a",
//     flex: 1,
//     // width: "100%",
//     fontFamily: "FuturaLT",
//     // backgroundColor:"red",
//     height: responsiveHeight(2),
//     lineHeight: responsiveHeight(2.5),
//   },
//   jobDesc: {
//     fontSize: responsiveFontSize(1.6),
//     color: "#333333",
//     fontFamily: "FuturaLT",
//     textAlign: "left",
//     marginBottom: responsiveWidth(2),
//     // backgroundColor:"red",
//   },
  

//   singleContentTitle:{
//     fontSize: responsiveFontSize(2.7),
//     color: "#222222",
//     fontFamily: "FuturaLT-Bold",
//   },
//   singleContentSubTitle:{
//     fontSize: responsiveFontSize(1.8),
//     color: "#222222",
//     fontFamily: "FuturaLT-Book",
//     marginBottom: responsiveWidth(1.5),
//   },

//   jobTagWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     flexWrap: "wrap",
//     marginBottom: responsiveWidth(2.8),
//   },
//   singleContentLocation:{
//     fontSize: responsiveFontSize(1.7),
//     color: "#222222",
//     fontFamily: "FuturaLT-Book",
//     marginLeft:responsiveWidth(1.5),
//     flex:1,
//     position:"relative",
//     top:-10,
//   },
//   singleTag: {
//     backgroundColor: "#013b75",
//     borderRadius: 4,
//     paddingVertical: 2,
//     paddingHorizontal: responsiveWidth(2),
//     marginBottom: responsiveHeight(0.9),
//     marginRight: responsiveHeight(0.9),
//   },
//   singleTagText: {
//     fontSize: responsiveFontSize(1.6),
//     color: "#ffffff",
//     fontFamily: "FuturaLT",
//   },
//   jobDateWrapper: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//   },
//   jobDateText: {
//     fontSize: responsiveFontSize(1.7),
//     color: "#222222",
//     fontFamily: "FuturaLT-Book",
//     marginLeft: responsiveWidth(1.8),
//   },



//   // Events
//   eventWrapper: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     flexWrap: "wrap",
//     padding: responsiveWidth(3.2)
//   },
//   eventContent: {
//     backgroundColor: "#ffffff",
//     width: responsiveWidth(45.5),
//     marginBottom: responsiveWidth(2.7),
//     paddingTop: responsiveWidth(2.5),
//     paddingBottom: responsiveWidth(2.7),
//     paddingHorizontal: responsiveWidth(2.5),
//     borderRadius: 8
//   },
//   eventImage: {
//     width: "100%",
//     resizeMode: "contain",
//     height: responsiveHeight(9),
//     // backgroundColor:"yellow"
//   },
//   eventTitle: {
//     fontSize: responsiveFontSize(1.9),
//     color: "#222",
//     fontFamily: "FuturaLT-Bold",
//     textAlign: "left",
//     // backgroundColor:"red",
//     width: "100%",
//     height: responsiveHeight(7),
//     marginTop: responsiveHeight(3),
//     marginBottom: responsiveHeight(0.5),
//   },
//   eventDesc: {
//     fontSize: responsiveFontSize(1.6),
//     color: "#222",
//     fontFamily: "FuturaLT",
//     textAlign: "left",
//     marginBottom: responsiveHeight(1.5),
//     // backgroundColor:"red",
//     width: "100%"
//   },
//   eventDateText: {
//     fontSize: responsiveFontSize(1.5),
//     color: "#222",
//     fontFamily: "FuturaLT-Book",
//     marginLeft: responsiveWidth(1.8),
//     position: "relative",
//     top: responsiveHeight(0.2)
//   },

  

// });
