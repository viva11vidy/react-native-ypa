import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView, TouchableHighlight, Keyboard, ScrollView, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, Animated } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize, } from "react-native-responsive-dimensions";
import RadioButton from 'radio-button-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { ScrollView } from 'react-native-gesture-handler';
import { faArrowRight, faBookOpen, faCertificate, faClock, faFilePdf, faGraduationCap, faMapMarkedAlt, faMapMarkerAlt, faPlay, faPlayCircle, faPoundSign, faShare, faShareAlt, faSuitcase, faVideo } from '@fortawesome/free-solid-svg-icons';
import { Shadow } from 'react-native-shadow-2';
import Pagination from '../components/Pagination';
import RBSheet from "react-native-raw-bottom-sheet";
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';

import { useSelector, useDispatch } from 'react-redux';
import globals from '../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
import * as Animatable from 'react-native-animatable';
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



export default WorkshopDetails = props => {

  const dispatch = useDispatch();
  const scrollY = new Animated.Value(0);
  const HEADER_MAX_HEIGHT = responsiveHeight(36);
  const HEADER_MIN_HEIGHT = responsiveHeight(9);
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
  const authUser = useSelector(state => state.auth.user);
  const [totalStudentInWorkshop, setTotalStudentInWorkshop] = useState(0);
  const workshop = props.route.params.workshop; 
  // console.log(workshop);

  useEffect(() => {
    fetchData(true);
  }, [dispatch]);

  const fetchData = async refresh => {
    await getTotalStudentInAWorkshop();
  };

  const getTotalStudentInAWorkshop = async () => {
    
    
  };

  const goToWorkshopStarts = () => {
    props.navigation.push('WorkshopStarts');
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
    <View>      
      <View>
        <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}]
        )}>
          <View style={{...styles.scrollViewContent, marginTop: responsiveHeight(36),backgroundColor:"#ffffff"}}>
            <View style={stylesInline.videoAreaWrapper}>

              <View style={stylesInline.jobOptionWrapper}>
                <View style={stylesInline.singleJobOption}>
                  <View style={{ marginRight: responsiveWidth(2), }}>
                    <FontAwesomeIcon color={'#ff244e'} size={18} icon={faGraduationCap} />
                  </View>
                  <Text style={stylesInline.singleJobOptionTitle}>12 Students</Text>
                </View>
                <View style={{ ...stylesInline.singleJobOption, justifyContent: "center" }}>
                  <View style={{ marginRight: responsiveWidth(2), }}>
                    <FontAwesomeIcon color={'#ff244e'} size={18} icon={faPlayCircle} />
                  </View>
                  <Text style={stylesInline.singleJobOptionTitle}>50 Mins</Text>
                </View>
                <View style={{ ...stylesInline.singleJobOption, marginRight: 0, }}>
                  <View style={{ marginRight: responsiveWidth(2), }}>
                    <FontAwesomeIcon color={'#ff244e'} size={18} icon={faBookOpen} />
                  </View>
                  <Text style={stylesInline.singleJobOptionTitle}>10 Lessons</Text>
                </View>
              </View>
                            
              <View style={stylesInline.singleLesson}>
                <View style={{marginRight:responsiveWidth(5)}}>
                  <Image style={stylesInline.subsImage} source={require('../../assets/images/ypa/content.png')} />
                </View>
                <View style={{ flex:1 }}>
                  <Text style={stylesInline.chapterCount} numberOfLines={1}>Total Contents</Text>
                  <Text style={stylesInline.chapterTitle} ellipsizeMode='tail'>8 Videos and 12 PDFs</Text>
                </View>
              </View>

              <View style={stylesInline.singleLesson}>
                <View style={{marginRight:responsiveWidth(5)}}>
                  <Image style={stylesInline.subsImage} source={require('../../assets/images/ypa/certification.png')} />
                </View>
                <View style={{ flex:1 }}>
                  <Text style={stylesInline.chapterCount} numberOfLines={1}>Certificate</Text>
                  <Text style={stylesInline.chapterTitle} ellipsizeMode='tail'>You'll recieve after completion</Text>
                </View>
              </View>
              
            </View>

            

            <View style={{marginTop:responsiveHeight(2), marginBottom:responsiveHeight(1.5)}}>
              <Text style={stylesInline.subsTitle}>Overview</Text>
            </View>
            <Text style={stylesInline.singleContentSubTitle}>{workshop.short_description}</Text>
            

            <View style={{marginTop:responsiveHeight(2), marginBottom:responsiveHeight(1.5)}}>
              <Text style={stylesInline.subsTitle}>Description</Text>
            </View>
            <Text style={stylesInline.singleContentSubTitle}>{workshop.description}</Text>
            

            <View style={{marginTop:responsiveHeight(2), marginBottom:responsiveHeight(1)}}>
              <Text style={stylesInline.subsTitle}>Curriculum</Text>
            </View>

            <View style={stylesInline.singleCurriculum}>
              <View style={stylesInline.iconBgVideo}>
                <FontAwesomeIcon color={'#ffffff'} size={17} icon={faPlayCircle} />
              </View>
              <View>
                <Text style={stylesInline.curriculumName}>Speaking With Ease and Authority</Text>
                <View style={stylesInline.videoTime}>
                  <Text style={stylesInline.videoTimeText}>0 Minutes</Text>
                </View>
              </View>
            </View>
            <View style={stylesInline.singleCurriculum}>
              <View style={stylesInline.iconBgPDF}>
                <FontAwesomeIcon color={'#ffffff'} size={17} icon={faFilePdf} />
              </View>
              <View>
                <Text style={stylesInline.curriculumName}>Good Practice Eliminates All Stress</Text>
                <View style={stylesInline.videoTime}>
                  <Text style={stylesInline.videoTimeText}>5 Pages</Text>
                </View>
              </View>
            </View>

          </View>
          
        </ScrollView>


        <Animated.View style={[styles.header, {height: headerHeight}]}>

          <Animated.View style={[styles.jdContentWrapper,{opacity: imageOpacity}]}>
            <Animatable.Text animation="fadeInLeft" delay={200} style={{...styles.jdTitle, fontSize:responsiveFontSize(3),}}>{workshop.name}</Animatable.Text>
          </Animated.View>

          
          <Animated.View style={[styles.bgOverlay, {backgroundColor:bgColor},{height: headerHeight}]}></Animated.View>
          <Animated.Image animation="fadeIn" delay={100} style={[styles.backgroundImage,{height: responsiveHeight(36),}, {opacity: imageOpacity, transform: [{translateY: imageTranslate}]},]} source={{uri: workshop.images[0].regular}}
          />
              

 
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
              
              <View style={styles.sideBySide}>
                <TouchableOpacity onPress={() => goToWorkshopStarts()}>
                  <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.applyFilterButton, width:responsiveWidth(75),}}>
                    <Text style={styles.applyFilterButtonText}>Start Workshop</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={styles.sideBySide}>
                <TouchableOpacity onPress={() => goToWorkshopStarts()}>
                  <LinearGradient colors={['#cf4e64', '#c9082e']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.applyFilterButton, width:responsiveWidth(15),}}>
                  <Image style={[stylesInline.shareIcon,]} source={require('../../assets/images/ypa/new-images/share-white.png')} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Shadow>
        </View>
        

        
        
        
      </View>




      {false &&
        <LinearGradient colors={['#ffffff', '#ebf1ff']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>

          <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={styles.scrollview} contentContainerStyle={{ paddingBottom: 0 }} stickyHeaderIndices={[1]}>
            <View style={{ padding: responsiveWidth(0) }}>

              <View style={styles.videoAreaWrapper}>
                <View style={styles.videoMainImageWrapper}>
                  <Image style={styles.workshopImage} source={{uri: workshop.images[0].regular}} />
                  <View style={styles.playCircle}>
                    <FontAwesomeIcon color={'#ffffff'} size={19} icon={faPlay} />
                  </View>
                </View>
                <TouchableOpacity onPress={() => goToWorkshopStarts()} activeOpacity={.7}>
                  <View style={styles.companyButton}>
                    <Text style={styles.companyButtonText}>Start Now</Text>
                    <View style={{marginLeft:responsiveWidth(3)}}>
                      <FontAwesomeIcon color={'#011c38'} size={16} icon={faArrowRight} />
                    </View>
                  </View>
                </TouchableOpacity>
                <Text style={styles.singleContentTitle2}>This workshop includes</Text>

                <View style={{...styles.contentTextWrapper, marginTop:responsiveHeight(2.5)}}>
                  <FontAwesomeIcon color={'#2498fd'} size={32} icon={faPlayCircle} />
                  <Text style={styles.contentText}>8 Video</Text>
                </View>
                <View style={styles.contentTextWrapper}>
                  <FontAwesomeIcon color={'#2498fd'} size={32} icon={faFilePdf} />
                  <Text style={styles.contentText}>12 PDF</Text>
                </View>
                <View style={{...styles.contentTextWrapper, marginBottom:responsiveHeight(1)}}>
                  <FontAwesomeIcon color={'#2498fd'} size={32} icon={faCertificate} />
                  <Text style={styles.contentText}>Certificate on completion</Text>
                </View>

                <View style={styles.divider}></View>
                <TouchableOpacity activeOpacity={.7}>
                  <View style={styles.companyButton}>
                    <View style={{marginRight:responsiveWidth(3)}}>
                      <FontAwesomeIcon color={'#011c38'} size={17} icon={faShare} />
                    </View>
                    <Text style={styles.companyButtonText}>Share this workshop</Text>
                    
                  </View>
                </TouchableOpacity>


              </View>



              <View style={styles.singleContent}>
                <Text style={styles.singleContentTitle}>{workshop.name}</Text>
                <Text style={styles.singleContentSubTitle}>{workshop.short_description}</Text>
                <View style={styles.jobOptionWrapper}>
                  <View style={styles.singleJobOption}>
                    <View style={{ marginRight: responsiveWidth(1.5), }}>
                      <FontAwesomeIcon color={'#ff244e'} size={25} icon={faGraduationCap} />
                    </View>
                    <Text style={styles.singleJobOptionTitle}>12 Students</Text>
                  </View>
                  <View style={{ ...styles.singleJobOption, justifyContent: "center" }}>
                    <View style={{ marginRight: responsiveWidth(1.5), }}>
                      <FontAwesomeIcon color={'#ff244e'} size={20} icon={faPlayCircle} />
                    </View>
                    <Text style={styles.singleJobOptionTitle}>50 Mins</Text>
                  </View>
                  <View style={{ ...styles.singleJobOption, marginRight: 0, }}>
                    <View style={{ marginRight: responsiveWidth(1.5), }}>
                      <FontAwesomeIcon color={'#ff244e'} size={20} icon={faBookOpen} />
                    </View>
                    <Text style={styles.singleJobOptionTitle}>10 Lessons</Text>
                  </View>
                </View>
              </View>


              


              <View style={styles.bottomSection}>
                <Text style={styles.wsHeading}>Overview</Text>
                <Text style={styles.wsContent}>{workshop.description}</Text>

                <Text style={styles.wsHeading}>Curriculum</Text>
                <View style={styles.singleCurriculum}>
                  <View style={styles.iconBgVideo}>
                    <FontAwesomeIcon color={'#222222'} size={17} icon={faPlayCircle} />
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
              </View>
              


            </View>

            

          </ScrollView>
        </LinearGradient>
      }
    </View>


    
  );

}

const stylesInline = StyleSheet.create({
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
    justifyContent:"space-between",
    flexWrap: "wrap",
    width: "100%",
    marginBottom: responsiveHeight(1),
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
    color: "#222222",
    // width: "100%",
    fontFamily: "Poppins-Light",
    // backgroundColor:"red",
    height: responsiveHeight(2),
    lineHeight: responsiveHeight(2.5),
  },

  singleContentTitle: {
    fontSize: responsiveFontSize(2.7),
    color: "#222222",
    fontFamily: "Poppins-SemiBold",
  },
  singleContentSubTitle: {
    fontSize: responsiveFontSize(1.8),
    color: "#222222",
    fontFamily: "Poppins-Light",
    marginBottom: responsiveWidth(1.5),
  },



  // VIDEO AREA
  companyButton: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: responsiveHeight(7),
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2)
  },
  companyButtonText: {
    fontSize: responsiveFontSize(2.2),
    color: "#011c38",
    fontFamily: "Poppins-SemiBold",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },





  videoAreaWrapper:{
    backgroundColor:"#ffffff",
    borderRadius:8,
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
    resizeMode:"cover"
  },

  singleContentTitle2: {
    fontSize: responsiveFontSize(1.8),
    color: "#222222",
    fontFamily: "Poppins-Light",
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
    color: "#222222",
    fontFamily: "Poppins-Light",
    marginLeft: responsiveWidth(2)
  },

  playCircle:{
    backgroundColor:"#013b75",
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
    fontSize: responsiveFontSize(1.8),
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
  subsTitle:{
    fontSize:responsiveScreenFontSize(2),
    fontFamily:"Poppins-SemiBold",
    color:"#222222"
  },
  singleLesson: {
    backgroundColor: "#e9f4ff",
    borderWidth:1,
    borderColor:"#c6e3ff",
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"flex-start",
    marginBottom:responsiveHeight(1),
    paddingHorizontal: responsiveWidth(3.5),
    paddingVertical:responsiveHeight(2) 
  },
  subsImage:{
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    resizeMode: "contain",
  },
  chapterCount: {
    fontSize: responsiveFontSize(1.5),
    color: "#222222",
    fontFamily: "Poppins-Light",
    marginTop:responsiveHeight(0.6),
    width:responsiveWidth(52)
  },
  chapterTitle: {
    fontSize: responsiveFontSize(1.8),
    color: "#222222",
    fontFamily: "Poppins-SemiBold",
    width:responsiveWidth(80)
  },
  shareIcon:{
    height:responsiveHeight(2.3),
    width:responsiveHeight(2.3),
    resizeMode:"contain"
  }
  
  
});
