import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView, TouchableHighlight, Keyboard, ScrollView, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation,Animated } from 'react-native';
import ScaledImage from 'react-native-scalable-image';
import { useScrollToTop } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize, } from "react-native-responsive-dimensions";
import BlinkView from 'react-native-blink-view';
import Input from '../ui/Input';
import RadioButton from 'radio-button-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { ScrollView } from 'react-native-gesture-handler';
import { faArrowRight, faBookOpen, faCertificate, faChevronLeft, faClock, faFilePdf, faGraduationCap, faMapMarkedAlt, faMapMarkerAlt, faPlay, faPlayCircle, faPoundSign, faShare, faSuitcase, faTimes, faVideo } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../components/Pagination';
import RBSheet from "react-native-raw-bottom-sheet";
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';

import { useSelector, useDispatch } from 'react-redux';
import globals from '../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';

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



export default BookEventDetails = props => {

  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  const swiper = useRef(null);
  const [isSwippable, setIsSwippable] = useState(true);
  // const [showText, setShowText] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [bookTicketPopup, setBookTicketPopup] = useState(false);

  const goToWorkshopStarts = () => {
    props.navigation.push('WorkshopStarts');
  };

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      zipcode: '',
    },
    inputValidities: {
      zipcode: false,
    },
    formIsValid: false
  });

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );
  

  const openBookTicketPopup = () => {
    setBookTicketPopup(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver:true
    }).start();
    
  }

  const closeBookTicketPopup = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver:true
    }).start();
    setTimeout(() => {
      setBookTicketPopup(false)
    }, 225);
  }
  const goBack = () => {
    props.navigation.goBack();
  }

  const goToBookEventSuccess= () => {
    props.navigation.push('BookEventSuccess');
  };


  return (
    <LinearGradient colors={['#ebf1ff', '#ebf1ff']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>

      <View style={styles.backHeaderStyle}>
        <TouchableOpacity onPress={() => goBack()}>
          <View style={{ flexDirection: "row", alignItems: "center", height: responsiveHeight(9), paddingHorizontal: responsiveWidth(3),}}>
            <FontAwesomeIcon color={'#ffffff'} size={20} icon={faChevronLeft} />
            <Text style={styles.pageHeading}>Back</Text>
          </View>
        </TouchableOpacity>
      </View>


      <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={styles.scrollview} contentContainerStyle={{ paddingBottom: 0 }}>



      <View style={styles.feedsSwiperContentContainer}>
        <Swiper scrollEnabled={isSwippable} index={0} showsPagination={true} showsButtons={false} style={styles.adminstructureSwipper} activeDotStyle={styles.activeDotStyle} dotStyle={styles.dotStyle} loop={false} ref={swiper}>
          <Image 
            style={{...styles.structureTwoVerticalImage,resizeMode:"cover",}} 
            source={require('../../assets/images/ypa/slide-1.jpg')} 
            height={SCREEN_WIDTH-responsiveWidth(20)}
            width={responsiveWidth(100)}
          />
          <Image 
            style={{...styles.structureTwoVerticalImage,resizeMode:"cover",}} 
            source={require('../../assets/images/ypa/slide-1.jpg')} 
            height={SCREEN_WIDTH-responsiveWidth(20)}
            width={responsiveWidth(100)}
          />
        </Swiper>
      </View>




        <View style={{ padding: responsiveWidth(3.2) }}>
          <View style={styles.singleContent}>
            <Text style={styles.singleContentTitle}>The Job Search Accelerator Masterclass</Text>

            <View style={styles.calWrapper}>
              <LinearGradient colors={['#3281ff', '#0348b6']} style={styles.cal} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                <View style={{alignItems:"center",justifyContent:"center"}}>
                  <Text style={styles.calDate}>29</Text>
                  <Text style={styles.calDay}>Fri</Text>
                </View>
              </LinearGradient>
              <View>
                <Text style={styles.calMonth}>January, 2022</Text>
                <Text style={styles.calTime}>10:00-12:00 PM</Text>
              </View>
            </View> 



            <Text style={styles.singleContentSubTitle}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</Text>
            

            <View style={styles.tagWrapper}>
              <View style={styles.singleTag}>
                <Text style={styles.singleTagText}>Keywords</Text>
              </View>
              <View style={styles.singleTag}>
                <Text style={styles.singleTagText}>Tags</Text>
              </View>
            </View>

            
            <View style={styles.jobOptionWrapper}>
              <Image style={styles.mapImage} source={require('../../assets/images/ypa/map-sample.jpg')} />
              
                <View style={styles.singleJobOption}>
                  <View style={{ marginRight: responsiveWidth(1.7),marginTop:responsiveHeight(0.6) }}>
                    <FontAwesomeIcon color={'#2498fd'} size={17} icon={faMapMarkerAlt} />
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.singleJobOptionTitle}>Keyham, Leicester LE7 9JQ, UK and India together in not far</Text>
                  </TouchableOpacity>
                </View>
              
            </View>
            



            

            <ScrollView style={styles.lessonWrapper} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: responsiveWidth(3.3),marginBottom:responsiveHeight(3) }}>
              <View style={styles.jobWrapper}>
              
                <TouchableOpacity>
                  <View style={styles.eventContent}>
                    <Image style={styles.eventImage} source={require('../../assets/images/ypa/company-white-logo-1.png')} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.eventContent}>
                    <Image style={styles.eventImage} source={require('../../assets/images/ypa/company-white-logo-1.png')} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.eventContent}>
                    <Image style={styles.eventImage} source={require('../../assets/images/ypa/company-white-logo-1.png')} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.eventContent}>
                    <Image style={styles.eventImage} source={require('../../assets/images/ypa/company-white-logo-1.png')} />
                  </View>
                </TouchableOpacity>
                
              </View>
            </ScrollView>


          </View>


          


          {/* <View style={styles.videoAreaWrapper}>
            <View style={styles.videoMainImageWrapper}>
              <Image style={styles.workshopImage} source={require('../../assets/images/ypa/slide-1.jpg')} />
              <View style={styles.playCircle}>
                <FontAwesomeIcon color={'#0182ff'} size={19} icon={faPlay} />
              </View>
            </View>
            <TouchableOpacity onPress={() => goToWorkshopStarts()}>
              <View style={styles.companyButton}>
                <Text style={styles.companyButtonText}>Start Now</Text>
                <FontAwesomeIcon color={'#ffffff'} size={16} icon={faArrowRight} />
              </View>
            </TouchableOpacity>
            <Text style={styles.singleContentTitle2}>This workshop includes</Text>

            <View style={{...styles.contentTextWrapper, marginTop:responsiveHeight(2.5)}}>
              <FontAwesomeIcon color={'#009281'} size={32} icon={faPlayCircle} />
              <Text style={styles.contentText}>8 Video</Text>
            </View>
            <View style={styles.contentTextWrapper}>
              <FontAwesomeIcon color={'#009281'} size={32} icon={faFilePdf} />
              <Text style={styles.contentText}>12 PDF</Text>
            </View>
            <View style={{...styles.contentTextWrapper, marginBottom:responsiveHeight(1)}}>
              <FontAwesomeIcon color={'#009281'} size={32} icon={faCertificate} />
              <Text style={styles.contentText}>Certificate on completion</Text>
            </View>

            <View style={styles.divider}></View>
            <TouchableOpacity>
              <View style={styles.shareButton}>
                <FontAwesomeIcon color={'#ffffff'} size={17} icon={faShare} />
                <Text style={styles.shareButtonText}>Share this workshop</Text>
                
              </View>
            </TouchableOpacity>


          </View>


          <View style={styles.bottomSection}>
            <Text style={styles.wsHeading}>Overview</Text>
            <Text style={styles.wsContent}>Workplace Communication. Imagine that you can speak up at any time in meetings and everyone in the room understands your messages and is impressed by your confidence and authority. Wouldn't it be great to feel you can speak up at any time and voice your opinions with clarity and ease? You can be great at Workplace Communication.</Text>

            <Text style={styles.wsHeading}>Curriculum</Text>
            <View style={styles.singleCurriculum}>
              <View style={styles.iconBgVideo}>
                <FontAwesomeIcon color={'#ffffff'} size={17} icon={faPlayCircle} />
              </View>
              <View>
                <Text style={styles.curriculumName}>Speaking With Ease and Authority</Text>
                <View style={styles.videoTime}>
                  <Text style={styles.videoTimeText}>0 Minutes</Text>
                </View>
              </View>
            </View>
            <View style={styles.singleCurriculum}>
              <View style={styles.iconBgPDF}>
                <FontAwesomeIcon color={'#ffffff'} size={17} icon={faFilePdf} />
              </View>
              <View>
                <Text style={styles.curriculumName}>Good Practice Eliminates All Stress</Text>
                <View style={styles.PDFPage}>
                  <Text style={styles.videoTimeText}>5 Pages</Text>
                </View>
              </View>
            </View>
          </View> */}
          


        </View>

        

        
        <View>
          <LinearGradient colors={['#009a90', '#009a90']} style={{...styles.left}} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.leftText}>10 tickets left only</Text>
          </LinearGradient>
          <View style={styles.bookWrapper}>
            <View>
              <Text style={styles.priceText}>Price</Text>
              <View style={{flexDirection:"row",alignItems:"center",marginTop:responsiveHeight(0.5)}}>
                <Text style={styles.price}>$10</Text>
                <Text style={styles.priceSub}>/per ticket</Text>
              </View>
              
            </View>
            <TouchableOpacity onPress={() => openBookTicketPopup()}>
              <View style={styles.companyButton}>
                <Text style={styles.companyButtonText}>Book a ticket</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>


       


      </ScrollView>


      {/* POPUP CALENDAR */}
      {bookTicketPopup == true ?
      <Animated.View style={{...styles.bookTicketPopup,opacity: fadeAnim}}>
        <View style={styles.mainAreaPopup}>
          
          <View style={styles.closePopup}>
            <TouchableOpacity style={styles.closePopupTouch} onPress={() => closeBookTicketPopup()}>
              <FontAwesomeIcon color={'#ffffff'} size={18} icon={faTimes} />
            </TouchableOpacity>
          </View>
          <View style={{width:"100%"}}>
            
          <Text style={{...styles.priceText,marginBottom:responsiveHeight(4),textAlign:"center", fontFamily: "FuturaLT-Book",fontSize: responsiveFontSize(2.8), color: "#222222",}}>Book your ticket</Text>
          
            <View style={styles.normalInputContainer}>
              <Text style={styles.normalInputText}>Full Name</Text>
              <Input 
                id="name"
                style={{...styles.input}} 
                errorContainerStyle={styles.errorContainer}
                errorTextStyle={styles.errorText}
                placeholderTextColor="#999999" 
                placeholder={""} 
                multiline={true} 
                required
                minLength={1}
                errorText="Enter valid name"
                onInputChange={inputChangeHandler}
                validateOnChange={true}
              />
            </View>
            <View style={styles.normalInputContainer}>
              <Text style={styles.normalInputText}>Email Address</Text>
              <Input 
                id="email"
                style={{...styles.input}} 
                errorContainerStyle={styles.errorContainer}
                errorTextStyle={styles.errorText}
                placeholderTextColor="#999999" 
                placeholder={""} 
                multiline={true} 
                required
                minLength={1}
                errorText="Enter valid email address"
                onInputChange={inputChangeHandler}
                validateOnChange={true}
              />
            </View>
            <View style={styles.normalInputContainer}>
              <Text style={styles.normalInputText}>No. of Ticket</Text>
              <Input 
                id="ticket"
                keyboardType='numeric'
                style={{...styles.input}} 
                errorContainerStyle={styles.errorContainer}
                errorTextStyle={styles.errorText}
                placeholderTextColor="#999999" 
                placeholder={""} 
                multiline={true} 
                required
                minLength={1}
                errorText="Enter valid number of ticket"
                onInputChange={inputChangeHandler}
                validateOnChange={true}
              />
            </View>

            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:responsiveHeight(3)}}>
              <Text style={styles.priceText}>Payable Amount</Text>
              <Text style={{...styles.price, height:responsiveHeight(5)}}>$20</Text>
            </View>

            <TouchableOpacity onPress={() => goToBookEventSuccess()}>
              <View style={{...styles.companyButton}}>
                <Text style={styles.companyButtonText}>Confirm & Pay</Text>
              </View>
            </TouchableOpacity>



          </View>

        </View>
      </Animated.View>
        :
        <></>
      }

      

    </LinearGradient>
  );

}

const styles = StyleSheet.create({
  backHeaderStyle: {
    // backgroundColor: "transparent",
    backgroundColor: "rgba(0,0,0,0.55)",
    height: responsiveHeight(9),
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    position:"absolute",
    top:0,
    width:responsiveWidth(100),
    zIndex:9999

  },
  secondaryPageHeading: {
    fontFamily: "FuturaLT-Book",
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
  left:{
    paddingVertical:responsiveHeight(0.4),
    // paddingHorizontal:responsiveWidth(2),
    width:responsiveWidth(100),
    alignItems:"center",
    justifyContent:"center",
  },
  leftText:{
    fontSize: responsiveFontSize(1.6),
    color: "#ffffff",
    fontFamily: "FuturaLT",
  },
  bookWrapper:{
    elevation:10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between",
    backgroundColor:"#ffffff",
    paddingHorizontal:responsiveWidth(3.2),
    paddingTop:responsiveWidth(1.8),
    paddingBottom:responsiveWidth(1.2),
    // backgroundColor:"red"
  },
  priceText:{
    fontSize: responsiveFontSize(2.5),
    color: "#222222",
    fontFamily: "FuturaLT-Book",
    marginBottom:-responsiveHeight(1)
  },
  price:{
    fontSize: responsiveFontSize(3.5),
    color: "#007fff",
    fontFamily: "FuturaLT-Bold",
  },
  priceSub:{
    fontSize: responsiveFontSize(1.8),
    color: "#222222",
    fontFamily: "FuturaLT",
  },

  calWrapper:{
    flexDirection: "row",
    alignItems: "center",
    marginBottom:responsiveHeight(2)
  },
  cal:{
    marginRight:responsiveWidth(3),
    height:responsiveHeight(7),
    width:responsiveHeight(7),
    borderRadius:6,
    alignItems: "center",
    justifyContent:"center"
  },
  calDate:{
    fontSize: responsiveFontSize(2.3),
    color: "#ffffff",
    fontFamily: "FuturaLT-Bold",
  },
  calDay:{
    fontSize: responsiveFontSize(1.9),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
    lineHeight:responsiveFontSize(2.0),
  },
  calMonth:{
    fontSize: responsiveFontSize(2),
    color: "#222222",
    fontFamily: "FuturaLT-Book",
  },
  calTime:{
    fontSize: responsiveFontSize(1.6),
    color: "#999999",
    fontFamily: "FuturaLT-Book",
  },




  jobWrapper: {
    // width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // flexWrap: "wrap",
    // backgroundColor:"red",
    // padding: responsiveWidth(3.2)
  },
  eventContent: {
    backgroundColor: "#0065cb",
    marginRight:responsiveWidth(3),
    width: responsiveWidth(45.5),
    paddingTop: responsiveWidth(2.5),
    paddingBottom: responsiveWidth(2.7),
    paddingHorizontal: responsiveWidth(2.5),
    borderRadius: 8
  },
  eventImage: {
    width: "100%",
    resizeMode: "contain",
    height: responsiveHeight(9),
    // backgroundColor:"yellow"
  },
  eventTitle: {
    fontSize: responsiveFontSize(1.9),
    color: "#222",
    fontFamily: "FuturaLT-Book",
    textAlign: "left",
    // backgroundColor:"red",
    width: "100%",
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(0.5),
  },
  feedsSwiperContentContainer:{
    // backgroundColor:"blue",
    // borderTopLeftRadius:15,
    // borderTopRightRadius:15,
    overflow:"hidden",
    marginBottom:-1,
  },
  tagWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: responsiveWidth(2.8),
  },
  singleTag: {
    backgroundColor: "#0065cb",
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: responsiveWidth(2),
    marginBottom: responsiveHeight(0.9),
    marginRight: responsiveHeight(0.9),
  },
  singleTagText: {
    fontSize: responsiveFontSize(1.6),
    color: "#ffffff",
    fontFamily: "FuturaLT",
  },
  adminstructureSwipper: {
    height: SCREEN_WIDTH-responsiveWidth(20),
    backgroundColor: '#ffffff',
  },
  activeDotStyle:{
    backgroundColor: '#2498fd',
    width: 8,
    height: 8, 
    marginLeft: 6,
    marginRight: 6,
    marginTop: 0,
    marginBottom: -responsiveWidth(4),
    // position:"absolute",
    // bottom:0
  },
  dotStyle:{
    backgroundColor: '#eff6ff',
    width: 8,
    height: 8,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 0,
    // position:"absolute",
    // bottom:0
    marginBottom: -responsiveWidth(4),
  },
  parentWrapper: {
    flex: 1,
    // backgroundColor: "#f0f7ff",
    backgroundColor: "#f5faff",

  },
  scrollview: {
  },
  contentImage: {
    width: "100%",
    resizeMode: "contain",
    height: responsiveHeight(20),
    // backgroundColor:"red"
  },




  // JOBS
  jobOptionWrapper: {
    flexDirection: "row",
    // alignItems: "center",
    // justifyContent:"space-between",
    flexWrap: "wrap",
    width: "100%",
    marginTop: responsiveHeight(1.2),
    backgroundColor:"yellow",
    borderRadius:8,
    overflow:"hidden",
    position:"relative",
    marginBottom:responsiveHeight(3)
  },
  mapImage:{
    height:responsiveHeight(20),
    width:"100%",
    backgroundColor:"#f1f1f1"
  },
  singleJobOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    position:"absolute",
    backgroundColor:"#ffffff",
    top:responsiveHeight(5.5),
    left:responsiveHeight(3),
    right:responsiveHeight(3),
    marginBottom: responsiveHeight(2.2),
    paddingHorizontal:responsiveHeight(2),
    paddingVertical:responsiveHeight(1.5),
    borderRadius:6
  },
  singleJobOptionTitle: {
    fontSize: responsiveFontSize(1.8),
    color: "#2498fd",
    fontFamily: "FuturaLT-Book",
  },

  singleContentTitle: {
    fontSize: responsiveFontSize(2.4),
    color: "#222222",
    fontFamily: "FuturaLT-Book",
    marginBottom: responsiveWidth(1.5),
  },
  singleContentSubTitle: {
    fontSize: responsiveFontSize(1.8),
    color: "#222222",
    fontFamily: "FuturaLT-Book",
    marginBottom: responsiveWidth(1.5),
  },



  // VIDEO AREA
  companyButton: {
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: responsiveHeight(1.5),
    paddingHorizontal:responsiveHeight(2.5),
    backgroundColor: "#007fff",
    paddingHorizontal:responsiveHeight(2.5),
    height: responsiveHeight(7), 
  },
  companyButtonText: {
    fontSize: responsiveFontSize(2.2),
    color: "#ffffff",
    fontFamily: "FuturaLT-Bold",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },





  videoAreaWrapper:{
    backgroundColor:"#ffffff",
    padding:responsiveHeight(3),
    borderRadius:8,
    marginTop:responsiveHeight(1),
    elevation:6
  },
  videoMainImageWrapper:{
    position:"relative",
    width:"100%",
    overflow:"hidden",
    borderRadius:8,
    alignItems:"center",
    justifyContent:"center"
  },
  workshopImage:{
    height:responsiveHeight(27),
    width:"100%",
    resizeMode:"contain"
  },

  singleContentTitle2: {
    fontSize: responsiveFontSize(2.5),
    color: "#222",
    fontFamily: "FuturaLT-Book",
    marginTop:responsiveHeight(1)
  },


  shareButton: {
    backgroundColor: "#f9516a",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: responsiveHeight(1.5),
    height: responsiveHeight(7),
  },
  shareButtonText: {
    fontSize: responsiveFontSize(2.2),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
    marginLeft: responsiveWidth(3)
  },
  divider:{
    width:"100%",
    height:1,
    backgroundColor:"#e3e3e3",
    marginVertical:responsiveHeight(3)
  },
  contentTextWrapper:{
    flexDirection:"row",
    alignItems:"center",
    marginBottom:responsiveHeight(4)
  },
  contentText:{
    fontSize: responsiveFontSize(1.9),
    color: "#a9a9a9",
    fontFamily: "FuturaLT-Book",
    marginLeft: responsiveWidth(2)
  },

  playCircle:{
    backgroundColor:"#ffffff",
    height:responsiveHeight(5),
    width:responsiveHeight(5),
    borderRadius:50,
    position:"absolute",
    // top:0,
    // bottom:0,
    // left:0,
    // right:0,
    // alignSelf:"center",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center"
  },
  bottomSection:{
    marginTop:responsiveHeight(4),
    marginBottom:responsiveHeight(2),
  },
  wsHeading:{
    fontSize: responsiveFontSize(2.1),
    color: "#222",
    fontFamily: "FuturaLT-Book",
  },
  wsContent:{
    fontSize: responsiveFontSize(1.8),
    color: "#666",
    fontFamily: "FuturaLT",
    marginBottom:responsiveHeight(2),
    marginTop:responsiveHeight(1)
  },  
  singleCurriculum:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start",
    marginTop:responsiveHeight(2)
  },
  iconBgVideo:{
    height:responsiveHeight(4),
    width:responsiveHeight(4),
    borderRadius:50,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"#65acea",
    marginRight:responsiveWidth(3)
  },
  curriculumName:{
    fontSize: responsiveFontSize(1.6),
    color: "#666666",
    fontFamily: "FuturaLT-Book",
  },
  videoTime:{
    backgroundColor:"#65acea",
    borderRadius:5,
    paddingVertical:responsiveHeight(0.2),
    paddingHorizontal:responsiveHeight(1),
    alignSelf: 'flex-start',
    marginTop:responsiveHeight(0.6)
  },
  iconBgPDF:{
    height:responsiveHeight(4),
    width:responsiveHeight(4),
    borderRadius:50,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"#ff7a7a",
    marginRight:responsiveWidth(3)
  },
  videoTimeText:{
    fontSize: responsiveFontSize(1.1),
    color: "#ffffff",
    fontFamily: "FuturaLT",
  },
  PDFPage:{
    backgroundColor:"#ff7a7a",
    borderRadius:5,
    paddingVertical:responsiveHeight(0.2),
    paddingHorizontal:responsiveHeight(1),
    alignSelf: 'flex-start',
    marginTop:responsiveHeight(0.6)
  },




  // POPUP
  bookTicketPopup:{
    position:"absolute",
    top:0,
    bottom:0,
    right:0,
    left:0,
    zIndex:9999999999999,
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.80)",
    alignItems:"center",
    justifyContent:"center",
  },
  closePopup:{
    position:"absolute",
    top:-responsiveHeight(2),
    right:-responsiveWidth(2.5),
    
    alignItems:"center",
    justifyContent:"center",
    elevation:5
  },
  closePopupTouch:{
    borderRadius:50,
    height:responsiveHeight(5),
    width:responsiveHeight(5),
    backgroundColor:"#007fff",
    alignItems:"center",
    justifyContent:"center",
  },


  mainAreaPopup:{
    backgroundColor:"#ffffff",
    alignItems:"center",
    justifyContent:"center",
    position:"relative",
    borderRadius:10,
    paddingTop:responsiveHeight(3),
    paddingBottom:responsiveHeight(2.5),
    paddingHorizontal:responsiveWidth(4),
    width:responsiveWidth(90)
  },
  popupImageWrapper:{
    backgroundColor:"#ffffff",
    position:"absolute",
    top:-responsiveHeight(5),
    padding:responsiveHeight(1.6),
    borderRadius:50
  },
  popupImage:{
    height:responsiveHeight(7),
    width:responsiveHeight(7),
    resizeMode:"contain"
  },
  mainTitleWrapper:{
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center",
    justifyContent:"center"
  },
  mainTitlePopup:{
    fontFamily: "FuturaLT-Book",
    textAlign:"center",
    fontSize:responsiveFontSize(2.2),
  },
  mainTitlePopupBold:{
    fontFamily: "FuturaLT-Bold",
    textAlign:"center",
    fontSize:responsiveFontSize(2.2)
  },
  popupBtnWraper:{
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center",
    // backgroundColor:"red",
    width:"100%",
    justifyContent:"flex-start",
    marginVertical:responsiveHeight(1),
    paddingTop:responsiveHeight(1),
    paddingLeft:responsiveWidth(5),
    borderTopWidth:1,
    borderColor:"#e1e1e1"
  },
  cancelBtn:{
    backgroundColor: "#dcdcdc",
    marginRight: responsiveWidth(3),
    borderRadius:6,
    paddingVertical:responsiveHeight(1.4),
    width:responsiveWidth(26)
  },
  cancelBtnText:{
    fontFamily: "FuturaLT-Book",
    textAlign:"center",
    fontSize:responsiveFontSize(1.8),
    color: "#333",
  },
  applyBtn:{
    backgroundColor: "#0066ca",
    marginRight: responsiveWidth(2),
    borderRadius:6,
    paddingVertical:responsiveHeight(1.4),
    width:responsiveWidth(26)
  },
  applyBtnText:{
    fontFamily: "FuturaLT-Book",
    textAlign:"center",
    fontSize:responsiveFontSize(1.8),
    color: "#ffffff",
  },
  blueCircle:{
    backgroundColor:"#2498fd",
    borderRadius:50,
    height:responsiveHeight(1.6),
    width:responsiveHeight(1.6),
    marginRight:responsiveWidth(2)
  },
  blueCircleText:{
    fontFamily: "FuturaLT-Book",
    fontSize:responsiveFontSize(1.6),
    color: "#888888",
  },
  




  // INPUT
  normalInputContainer:{
    marginBottom:responsiveHeight(3.5)
  },
  normalInputText:{
    fontFamily:"FuturaLT-Book",
    fontSize: responsiveFontSize(1.7),
    color:"#222222",
    position:"absolute",
    top:-12,
    left:responsiveWidth(3),
    backgroundColor:"#ffffff",
    zIndex:2,
    paddingHorizontal:responsiveWidth(2)
  },

  input:{
    marginLeft: 0,
    paddingRight: 15,
    paddingLeft: 20,
    fontFamily:"FuturaLT-Book",
    // paddingTop:responsiveHeight(1.8),
    // paddingBottom:responsiveHeight(1.8),
    fontSize: responsiveFontSize(1.8),
    borderColor:"#222222",
    borderWidth:1.5,
    // borderRadius:6,
    color: '#222222',
    textAlign: "left",
    height:responsiveHeight(7.5)
    // width:"100%",
  },
  errorContainer: {
    // margin: 0,
    // position: "absolute",
    // bottom: -29,
    left: 10
  },
  errorText: {
    color: 'red',
    fontFamily:"FuturaLT-Book",
    fontSize: responsiveFontSize(1.6),
  },
  // INPUT ENDS


});
