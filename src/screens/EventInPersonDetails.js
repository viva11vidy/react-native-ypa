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
import * as Animatable from 'react-native-animatable';
import HTMLView from 'react-native-htmlview';
import { htmlToText } from 'html-to-text';


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
  const HEADER_MAX_HEIGHT = responsiveHeight(40);
  const HEADER_MIN_HEIGHT = responsiveHeight(9);
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
  const [textShown, setTextShown] = useState(false);
  const [lengthMore,setLengthMore] = useState(false);
  const [htmlHeight, setHtmlHeight] = useState(0);

  const authUser = useSelector(state => state.auth.user);
  const [event, setEvent] = useState(props.route.params.event);
  const [isLoading, setIsLoading] = useState(false);
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
    if(!event.title || (event.companies && event.companies.length && !event.companies[0]._id)) {
      setIsLoading(true);
      try {
        let res = await dispatch(commonActions.getEvents({id: event._id, eventType: 'InPerson'}));
        if(res.length) {
          setEvent(res[0]);
        }
      } catch (error) {
        
      }
      setIsLoading(false);
    }
    
  };

  const openUrl = uri => {
    props.navigation.navigate('WebPage', {uri: uri});
  }


  const swipe = (index) => {

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
    setLengthMore(e.nativeEvent.lines.length >=4); //to check the text is more than 4 lines or not
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
          <View style={{...styles.scrollViewContent,marginTop: responsiveHeight(40),}}>

            

            <View style={{...styles.sideBySide, marginBottom:responsiveHeight(2)}}>
              <View style={styles.sideBySide}>
                <Image style={styles.salaryIcon} source={require('../../assets/images/ypa/new-images/map-marker-blue.png')} />
                <Text style={styles.jdLocation}>{event.location.area}</Text>
              </View>
            </View>

            <TouchableOpacity>
              <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.googlemap}>
                <Text style={styles.googlemapText}>View in Google maps</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            
            

            <Text style={{...styles.jdMainContentTitle, marginTop:responsiveHeight(6), marginBottom:responsiveHeight(3)}}>About Event</Text>

            <View onLayout={(event) => { this.find_dimesions(event.nativeEvent.layout) }}>
              <View style={textShown ? stylesHTML.nothing : stylesHTML.fourLine}>
                <HTMLView
                  value={event.description.replace(/(\r\n|\n|\r)/gm, '')}
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

            {/* <Text style={styles.jdMainContent}>{htmlToText(event.description, {wordwrap: false})}</Text> */}




            {/* <Text style={styles.jdMainContent} onTextLayout={onTextLayout} numberOfLines={textShown ? undefined : 4}>
              {htmlToText(event.description, {wordwrap: false})}
            </Text>
            {
              lengthMore ? 
              <Text style={styles.jdMainContentMore} onPress={toggleNumberOfLines}>
                {textShown ? 'Read less' : 'Read more'}
              </Text>
              :null
            } */}
 
            <View style={styles.tagWrapper}>
            { event.keywords.map((keyword, index) => {
              return (<View key={index} style={styles.singleTag}>
                <Text style={styles.singleTagText}>{keyword}</Text>
              </View>);
            })}
            </View>

            {event.sidebar_images && event.sidebar_images.length &&
              <Image style={styles.eipImage} source={{uri: event.sidebar_images[0].regular}} />
            }


            { event.companies.length > 0 && event.companies[0]._id && <>
              <Text style={{...styles.jdMainContentTitle, marginTop:responsiveHeight(6), marginBottom:responsiveHeight(2)}}>Partnered with top employers</Text>
              <View style={{...styles.jdCompanyWrapper,flexWrap:"wrap",marginTop:responsiveHeight(0)}}>
                { event.companies.map((company, index) => { 
                return (<View key={index} style={{...styles.jobDetailsCompanyLogoWrapper, marginRight:responsiveWidth(6), borderColor:"#f1f1f1", borderWidth:1}}>
                  { company.color_images && company.color_images.length > 0 ?
                    <Image style={styles.jobDetailsCompanyLogo} source={{uri: company.color_images[0].regular}} />
                  : <>
                    { company.images && company.images.length > 0 ?
                      <Image style={styles.jobDetailsCompanyLogo} source={{uri: company.images[0].regular}} /> 
                    : 
                      <></>
                    } 
                  </> }
                </View>);
                })}
              </View> 
            </> }


          </View>
        </ScrollView>


        <Animated.View style={[styles.header, {height: headerHeight}]}>

          <Animated.View style={[styles.jdContentWrapper,{opacity: imageOpacity}]}>

            <Animatable.Text animation="fadeInLeft" delay={200} style={styles.jdTitle} numberOfLines={2}>{event.title}</Animatable.Text>

            <Animatable.View animation="fadeInLeft" delay={300} style={styles.sideBySide}>
              <Image style={{...styles.salaryIcon,height:responsiveHeight(2.2),width:responsiveHeight(2.2),}} source={require('../../assets/images/ypa/new-images/clock-white.png')} />
              <Text style={styles.jdSalary}>{moment(event.event_date).format("DD/MM/YYYY")}, {event.event_timing}</Text>
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










      
    </View>
  );

}

const stylesHTML = StyleSheet.create({
  strong: {
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
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

