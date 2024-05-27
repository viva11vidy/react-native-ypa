import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView, TouchableHighlight, Keyboard, ScrollView, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, Animated } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faChevronLeft, faFilePdf, faPlayCircle, faPoundSign, faSuitcase } from '@fortawesome/free-solid-svg-icons';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize, } from "react-native-responsive-dimensions";
import RadioButton from 'radio-button-react-native';

// import { ScrollView } from 'react-native-gesture-handler';
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

export default WorkshopStarts = props => {

  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  const swiper = useRef();
  const [swipeIndex, setSwipeIndex] = useState(0);
  const scrollRef = useRef();
  const [fadeAnim] = useState(new Animated.Value(0));

  const swipe = (index) => {

    // console.log(swiper.current.state.index);
    // if(swiper.current.state.index == 0) {
    // console.log(index);
    setSwipeIndex(index);
    swiper.current.scrollTo(index)
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

  const goBack = () => {
    props.navigation.goBack();
  }




  return (
    <LinearGradient colors={['#ffffff', '#ffffff']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>

      
       
      <View style={styles.videoPlayArea}>
        <LinearGradient colors={['#ffffff00', '#00000083']} style={{...styles.blackOverlay,}} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }}></LinearGradient>

        <TouchableOpacity style={styles.profileBackButton} onPress={() => goBack()}>
          <Image style={[styles.headerBackIcon]} source={require('../../assets/images/ypa/new-images/left-arrow-white.png')} />
          <Text style={[styles.title]}>Back</Text>
        </TouchableOpacity>

        <Image style={styles.subsImage} source={require('../../assets/images/ypa/slide-1.jpg')} />
      </View>



      <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={styles.scrollview} contentContainerStyle={{ paddingBottom: 0 }} stickyHeaderIndices={[1]}>
        

        <View style={{ padding: responsiveWidth(3.2) }}>
          <View style={styles.singleContent}>
            <View>
              <Text style={styles.wsHeading}>Title Workplace Communication: You Can Speak Up at Meetings!</Text>
              <Text style={styles.wsContent}>Description I've listen to you tell me that you found it difficult to upload your homework videos to the Udemy Q and A Section. To make it easier for you to get quick feedback from me and your fellow students, I've created a Facebook page just for my Udemy students.</Text>
            </View>
          </View>
        </View>

        {/* <Text>asas</Text> */}
          


          
          
        <View>
          <ScrollView style={styles.tabWrapper} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabWrapperContent} ref={scrollRef}>
            <TouchableOpacity onPress={() => swipe(0)}>
              <View style={styles.singleTab}>
                <Text style={styles.singleTabTitleActive}>Contents</Text>
                {/* <View style={styles.singleTabActiveBorder}></View> */}
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>





        <View>
          {/* <Swiper scrollEnabled={true} index={0} showsPagination={false} showsButtons={false} style={styles.tabContentSwiper} loop={false} ref={swiper} containerStyle={styles.tabContentSwiperInner} onIndexChanged={(index) => swipe(index)} height="100%"> */}

            {/* Description */}
            <View style={{ backgroundColor: "#ffffff", maxHeight: responsiveHeight(60) }}>
              <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={{ width: '100%', height: "100%" }}>
                <View>
                  

                <TouchableOpacity>
                  <View style={styles.singleCurriculum}>
                    <View style={styles.iconBgVideo}>
                      <FontAwesomeIcon color={'#ffffff'} size={17} icon={faPlayCircle} />
                    </View>
                    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between", flex:1}}>
                      <View style={{width:responsiveWidth(72)}}>
                        <Text style={styles.curriculumName}>Speaking With Ease and Authority to make it easier for you to speak publicly</Text>
                        <View style={styles.videoTime}>
                          <Text style={styles.videoTimeText}>10 Minutes</Text>
                        </View>
                      </View>
                      <FontAwesomeIcon color={'#009688'} size={22} icon={faCheckCircle} />
                    </View>
                  </View>
                </TouchableOpacity>

                <View style={{...styles.singleCurriculum, backgroundColor:"#f7f7f7"}}>
                  <View style={styles.iconBgPDF}>
                    <FontAwesomeIcon color={'#ffffff'} size={17} icon={faFilePdf} />
                  </View>
                  <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between", flex:1}}>
                    <View style={{width:responsiveWidth(72)}}>
                      <Text style={styles.curriculumName}>Speaking With Ease and Authority to make it easier for you to speak publicly</Text>
                      <View style={styles.videoTime}>
                        <Text style={styles.videoTimeText}>5 Pages</Text>
                      </View>
                    </View>
                    <Text style={styles.contentProgress}>80%</Text>
                  </View>
                </View>


                <View style={styles.singleCurriculum}>
                  <View style={styles.iconBgPDF}>
                    <FontAwesomeIcon color={'#ffffff'} size={17} icon={faFilePdf} />
                  </View>
                  <View>
                    <Text style={styles.curriculumName}>Good Practice Eliminates All Stress</Text>
                    <View style={styles.videoTime}>
                      <Text style={styles.videoTimeText}>5 Pages</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.singleCurriculum}>
                  <View style={styles.iconBgPDF}>
                    <FontAwesomeIcon color={'#ffffff'} size={17} icon={faFilePdf} />
                  </View>
                  <View>
                    <Text style={styles.curriculumName}>Good Practice Eliminates All Stress</Text>
                    <View style={styles.videoTime}>
                      <Text style={styles.videoTimeText}>5 Pages</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.singleCurriculum}>
                  <View style={styles.iconBgPDF}>
                    <FontAwesomeIcon color={'#ffffff'} size={17} icon={faFilePdf} />
                  </View>
                  <View>
                    <Text style={styles.curriculumName}>Good Practice Eliminates All Stress</Text>
                    <View style={styles.videoTime}>
                      <Text style={styles.videoTimeText}>5 Pages</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.singleCurriculum}>
                  <View style={styles.iconBgPDF}>
                    <FontAwesomeIcon color={'#ffffff'} size={17} icon={faFilePdf} />
                  </View>
                  <View>
                    <Text style={styles.curriculumName}>Good Practice Eliminates All Stress</Text>
                    <View style={styles.videoTime}>
                      <Text style={styles.videoTimeText}>5 Pages</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.singleCurriculum}>
                  <View style={styles.iconBgPDF}>
                    <FontAwesomeIcon color={'#ffffff'} size={17} icon={faFilePdf} />
                  </View>
                  <View>
                    <Text style={styles.curriculumName}>Good Practice Eliminates All Stress</Text>
                    <View style={styles.videoTime}>
                      <Text style={styles.videoTimeText}>5 Pages</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.singleCurriculum}>
                  <View style={styles.iconBgPDF}>
                    <FontAwesomeIcon color={'#ffffff'} size={17} icon={faFilePdf} />
                  </View>
                  <View>
                    <Text style={styles.curriculumName}>Good Practice Eliminates All Stress</Text>
                    <View style={styles.videoTime}>
                      <Text style={styles.videoTimeText}>9 Pages</Text>
                    </View>
                  </View>
                </View>


                  
                </View>
              </ScrollView>
            </View>

          {/* </Swiper> */}
        </View>


        
        

      </ScrollView>









        

     
    </LinearGradient>
  );

}

const styles = StyleSheet.create({
  blackOverlay:{
    height:responsiveHeight(8),
    width:"100%",
    position:"absolute",
    zIndex:1
  },
  videoPlayArea:{
    backgroundColor:"#f1f1f1",
    height:responsiveHeight(40),
  },
  subsImage:{
    height:responsiveHeight(40),
    width:"100%",
    resizeMode:"cover"
  },
  profileBackButton:{
    position:"absolute",
    left: responsiveWidth(3),
    top:responsiveHeight(1.5),
    zIndex:999999,
    // backgroundColor:"red",
    height:responsiveHeight(5),
    flexDirection:"row",
    alignItems:"center",
  },
  profileBackButtonView:{
    flexDirection:"row",
    alignItems:"center",
  },
  parentWrapper: {
    flex: 1,
    // backgroundColor: "#f0f7ff",
    backgroundColor: "#f5faff",

  },
  scrollview: {
    // backgroundColor:"red"
    // height:responsiveHeight(60)
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
    // backgroundColor:"yellow"
  },
  singleJobOption: {
    flexDirection: "row",
    alignItems: "center",
    // flex:1,
    // backgroundColor:"red",
    width: "32%",
    marginRight: "2%",
    marginBottom: responsiveHeight(2.2)
    // backgroundColor:"blue"
  },
  singleJobOptionTitle: {
    fontSize: responsiveFontSize(1.9),
    color: "#333333",
    // width: "100%",
    fontFamily: "Poppins-Light",
    // backgroundColor:"red",
    height: responsiveHeight(2),
    lineHeight: responsiveHeight(2.5),
  },





  // VIDEO AREA
  companyButton: {
    backgroundColor: "#0182ff",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: responsiveHeight(1.5),
    height: responsiveHeight(7),
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2)
  },
  companyButtonText: {
    fontSize: responsiveFontSize(2.2),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
    marginRight: responsiveWidth(3)
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
    fontFamily: "Poppins-Light",
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
    fontFamily: "Poppins-SemiBold",
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
    fontFamily: "Poppins-Light",
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
    color: "#222222",
    fontFamily: "Poppins-SemiBold",
  },
  wsContent:{
    fontSize: responsiveFontSize(1.8),
    color: "#222222",
    fontFamily: "Poppins-Light",
    marginBottom:responsiveHeight(0.5),
    marginTop:responsiveHeight(1)
  },  
  singleCurriculum:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start",
    // marginTop:responsiveHeight(2),
    paddingHorizontal: responsiveWidth(3.2),
    paddingVertical:responsiveHeight(1.4)
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
    fontSize: responsiveFontSize(1.7),
    color: "#222222",
    fontFamily: "Poppins-Light",
  },
  videoTime:{
    backgroundColor:"#ebebeb",
    borderRadius:5,
    height:responsiveHeight(2),
    alignItems:"center",
    justifyContent:"center",
    paddingHorizontal:responsiveHeight(1),
    marginTop:responsiveHeight(0.6),
    alignSelf:"flex-start"
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
    fontSize: responsiveFontSize(1.2),
    color: "#222222",
    fontFamily: "Poppins-Light",
  },
  PDFPage:{
    backgroundColor:"#ff7a7a",
    borderRadius:5,
    paddingVertical:responsiveHeight(0.2),
    paddingHorizontal:responsiveHeight(1),
    alignSelf: 'flex-start',
    marginTop:responsiveHeight(0.6)
  },




  tabWrapper: {
    backgroundColor: "#e9f4ff",
    borderWidth:1,
    borderColor:"#dceaf8",
    height: responsiveHeight(7),
    // borderBottomWidth: 1,
    // borderBottomColor: "#ececec"
  },
  tabWrapperContent: {
    alignItems: "center",
    flexDirection: "row",
    paddingRight: responsiveWidth(3.3)
  },
  singleTab: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: responsiveWidth(5),
    // backgroundColor:"red",
    height: responsiveHeight(7),
    position: "relative"
  },
  singleTabActiveBorder: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: responsiveHeight(0.6),
    backgroundColor: "#c6e3ff",
    borderRadius: 7
  },
  singleTabTitle: {
    fontSize: responsiveFontSize(1.9),
    color: "#222",
    fontFamily: "Poppins-Light",
  },
  singleTabTitleActive: {
    fontSize: responsiveFontSize(1.9),
    color: "#222222",
    fontFamily: "Poppins-SemiBold",
  },
  tabContentSwiper: {
    backgroundColor: "#ffffff",
    // backgroundColor:"red"
    // maxHeight:responsiveHeight(80)
  },
  tabContentSwiperInner: {
    // backgroundColor: "blue",
    // maxHeight:"95%"
  },
  companyName: {
    fontSize: responsiveFontSize(2.5),
    color: "#222",
    fontFamily: "Poppins-SemiBold",
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2)
  },
  companyDesc: {
    fontSize: responsiveFontSize(1.9),
    color: "#333",
    fontFamily: "Poppins-Light",
    marginBottom: responsiveHeight(3)
  },
  companyButton: {
    backgroundColor: "#2e80fe",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: responsiveHeight(1.5),
    height: responsiveHeight(8),
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2)
  },
  companyButtonText: {
    fontSize: responsiveFontSize(2.2),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
    marginRight: responsiveWidth(3)
  },


  // WORSKHOPS
  workshopWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: responsiveWidth(3.2)
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

  workshopImage: {
    width: "100%",
    resizeMode: "cover",
    height: responsiveHeight(15),
    // backgroundColor:"red"
  },
  workshopContentContainer: {
    // alignItems: "center",
    justifyContent: "center",
    paddingBottom: responsiveWidth(2.7),
    paddingHorizontal: responsiveWidth(2.5),
  },
  workshopTitle: {
    fontSize: responsiveFontSize(1.9),
    color: "#333333",
    fontFamily: "Poppins-SemiBold",
    textAlign: "left",
    // backgroundColor:"red",
    marginTop: responsiveHeight(1.9),
    marginBottom: responsiveHeight(0.5),
  },
  workshopDesc: {
    fontSize: responsiveFontSize(1.6),
    color: "#333333",
    fontFamily: "Poppins-Light",
    textAlign: "left",
    // backgroundColor:"red",
  },


  // JOBS
  jobWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    // backgroundColor:"red",
    padding: responsiveWidth(3.2)
  },
  jobContent: {
    backgroundColor: "#ffffff",
    // width: responsiveWidth(100),
    // flex:1,
    marginBottom: responsiveWidth(2.7),
    overflow: "hidden",
    paddingTop: responsiveWidth(2.5),
    paddingBottom: responsiveWidth(2.7),
    paddingHorizontal: responsiveWidth(2.5),
    borderRadius: 8,
    marginBottom: responsiveWidth(2.9),
  },
  jobTopContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: responsiveWidth(2),
    // overflow: "hidden",
  },
  jobImage: {
    resizeMode: "cover",
    borderRadius: 8,
    marginRight: responsiveWidth(2.5),
    marginBottom: responsiveWidth(2.5),
    alignSelf: 'flex-start'
  },
  jobTitle: {
    fontSize: responsiveFontSize(1.9),
    color: "#333333",
    fontFamily: "Poppins-SemiBold",
    textAlign: "left",
    marginBottom: responsiveHeight(0.5),
  },
  jobOptionWrapper: {
    flexDirection: "row",
    // alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
    marginTop: responsiveHeight(1.2),
    // backgroundColor:"yellow"
  },
  singleJobOption: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor:"red",
    width: "47%",
    marginRight: "3%",
    marginBottom: responsiveHeight(2.2)
    // backgroundColor:"blue"
  },
  singleJobOptionImage: {
    width: responsiveHeight(1.5),
    resizeMode: "contain",
    height: responsiveHeight(1.5),
    marginRight: responsiveWidth(1.5),
    // backgroundColor:"yellow"
  },
  singleJobOptionTitle: {
    fontSize: responsiveFontSize(1.7),
    color: "#333333",
    flex: 1,
    // width: "100%",
    fontFamily: "Poppins-Light",
    // backgroundColor:"red",
    height: responsiveHeight(2),
    lineHeight: responsiveHeight(2.5),
  },
  jobDesc: {
    fontSize: responsiveFontSize(1.6),
    color: "#333333",
    fontFamily: "Poppins-Light",
    textAlign: "left",
    marginBottom: responsiveWidth(2),
    // backgroundColor:"red",
  },


  singleContentTitle: {
    fontSize: responsiveFontSize(2.7),
    color: "#222",
    fontFamily: "Poppins-SemiBold",
  },
  singleContentSubTitle: {
    fontSize: responsiveFontSize(1.8),
    color: "#555",
    fontFamily: "Poppins-Light",
    marginBottom: responsiveWidth(1.5),
  },

  jobTagWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: responsiveWidth(2.8),
  },
  singleContentLocation: {
    fontSize: responsiveFontSize(1.7),
    color: "#333333",
    fontFamily: "Poppins-Light",
    marginLeft: responsiveWidth(1.5),
    flex: 1,
    position: "relative",
    top: -10,
  },
  singleTag: {
    backgroundColor: "#62b4fe",
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: responsiveWidth(2),
    marginBottom: responsiveHeight(0.9),
    marginRight: responsiveHeight(0.9),
  },
  singleTagText: {
    fontSize: responsiveFontSize(1.6),
    color: "#ffffff",
    fontFamily: "Poppins-Light",
  },
  jobDateWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  jobDateText: {
    fontSize: responsiveFontSize(1.7),
    color: "#333333",
    fontFamily: "Poppins-Light",
    marginLeft: responsiveWidth(1.8),
  },



  // Events
  eventWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: responsiveWidth(3.2)
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
  eventImage: {
    width: "100%",
    resizeMode: "contain",
    height: responsiveHeight(9),
    // backgroundColor:"yellow"
  },
  eventTitle: {
    fontSize: responsiveFontSize(1.9),
    color: "#222",
    fontFamily: "Poppins-SemiBold",
    textAlign: "left",
    // backgroundColor:"red",
    width: "100%",
    height: responsiveHeight(7),
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(0.5),
  },
  eventDesc: {
    fontSize: responsiveFontSize(1.6),
    color: "#222",
    fontFamily: "Poppins-Light",
    textAlign: "left",
    marginBottom: responsiveHeight(1.5),
    // backgroundColor:"red",
    width: "100%"
  },
  eventDateText: {
    fontSize: responsiveFontSize(1.5),
    color: "#222",
    fontFamily: "Poppins-Light",
    marginLeft: responsiveWidth(1.8),
    position: "relative",
    top: responsiveHeight(0.2)
  },






  // POPUP
  applyPopup:{
    position:"absolute",
    top:0,
    bottom:0,
    right:0,
    left:0,
    zIndex:99999,
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems:"center",
    justifyContent:"center",
    padding:responsiveWidth(9)
  },


  mainAreaPopup:{
    backgroundColor:"#ffffff",
    alignItems:"center",
    justifyContent:"center",
    position:"relative",
    padding:responsiveWidth(4),
    borderRadius:10,
    paddingTop:responsiveHeight(5.5),
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
    fontFamily: "Poppins-Light",
    textAlign:"center",
    fontSize:responsiveFontSize(2.2),
  },
  mainTitlePopupBold:{
    fontFamily: "Poppins-SemiBold",
    textAlign:"center",
    fontSize:responsiveFontSize(2.2)
  },
  popupBtnWraper:{
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center",
    justifyContent:"center",
    marginTop:responsiveHeight(3)
  },
  cancelBtn:{
    backgroundColor: "#dcdcdc",
    marginRight: responsiveWidth(3),
    borderRadius:6,
    paddingVertical:responsiveHeight(1.4),
    width:responsiveWidth(26)
  },
  cancelBtnText:{
    fontFamily: "Poppins-Light",
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
    fontFamily: "Poppins-Light",
    textAlign:"center",
    fontSize:responsiveFontSize(1.8),
    color: "#ffffff",
  },
  contentProgress:{
    fontFamily: "Poppins-SemiBold",
    fontSize:responsiveFontSize(1.6),
    color: "#009688",
  },
  headerBackIcon:{
    height:responsiveHeight(2.3),
    width:responsiveHeight(2.3),
    resizeMode:"contain"
  },
  title: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    position:"relative",
    top:responsiveHeight(0.3),
    fontSize:responsiveFontSize(2.3),
    paddingLeft:responsiveWidth(1.5)
  },


  
});
