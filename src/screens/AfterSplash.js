import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight, Keyboard, ActivityIndicator, PermissionsAndroid, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';

import { useSelector, useDispatch } from 'react-redux';
import { StackActions } from '@react-navigation/native';

import globals from './../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

export default AfterSplash = props => {

  const dispatch = useDispatch();
  const swiper = useRef(null);
  const [showPagination, setShowPagination] = useState(true);

  useEffect(() => {


  }, [dispatch]);

  const goToFirstScreen = () => {
    props.navigation.dispatch(StackActions.replace('AppNav'));
  }

  const skipForNow = () => {
    props.navigation.dispatch(StackActions.replace('AppNav'));
  }
  const next = (param) => {
    if(param == 'hide'){
      setShowPagination(false);
    } 
    swiper.current.scrollBy(1); 
  }

  const prev = (param) => {
    swiper.current.scrollBy(-1); 
  }

  return (
     
    <View style={{flex:1}}>
      <View style={styles.videoOverlay}></View>
      <Video
        source={{uri:'https://cdn.ypacademy.co.uk/videos/video-1-1695200687910.mp4'}}
        rate={1.0}
        volume={1.0}
        muted={true}
        resizeMode={"cover"}
        repeat
        style={styles.video}
      />
      <View style={styles.container}>
      <Image style={styles.walkLogo} source={require('../../assets/images/ypa/app-logo-white.png')} />
      <Swiper scrollEnabled={true} showsPagination={false} showsButtons={false} activeDotStyle={styles.activeDotStyle} dotStyle={styles.dotStyle} loop={false} ref={swiper}>
        {/* 1st Slide */}
        <View style={styles.singleSlide}>
          <View></View>
          <View style={{top:responsiveHeight(5)}}>
            <Text style={styles.walkthroughTitle}>Discover the </Text>
            <Text style={styles.walkthroughTitle}>right Career Path</Text>
            <Text style={styles.walkthroughTitle}>For You</Text>
          </View>
          <View style={styles.walkthroughButtonWrapper}>
            <TouchableOpacity style={styles.walkthroughButtonOutline} onPress={() => skipForNow()}>
              <Text style={styles.walkthroughLinkLeft}>SKIP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walkthroughButtonSolid} onPress={() => next()}>
              <Text style={styles.walkthroughLinkRight}>NEXT</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2nd Slide */}
        <View style={styles.singleSlide}>
          <View></View>
          <View style={{top:responsiveHeight(5)}}>
            <Text style={styles.walkthroughTitle}>Work with</Text>
            <Text style={styles.walkthroughTitle}>World Leading</Text>
            <Text style={styles.walkthroughTitle}>Organisations</Text>
          </View>
          <View style={styles.walkthroughButtonWrapper}>
            <TouchableOpacity style={styles.walkthroughButtonOutline} onPress={() => prev()}>
              <Text style={styles.walkthroughLinkLeft}>PREV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walkthroughButtonSolid} onPress={() => next()}>
              <Text style={styles.walkthroughLinkRight}>NEXT</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3rd Slide */}
        <View style={styles.singleSlide}>
          <View></View>
          <View style={{top:responsiveHeight(5)}}>
            <Text style={{...styles.walkthroughTitle, fontSize: responsiveFontSize(3.2),}}>Work Experiences</Text>
            <Text style={{...styles.walkthroughTitle, fontSize: responsiveFontSize(3.2),}}>& apprenticeships</Text>
            <Text style={{...styles.walkthroughTitle, fontSize: responsiveFontSize(3.2),}}>in one place</Text>
          </View>
          <View style={{...styles.walkthroughButtonWrapper,justifyContent:"center"}}>
            <TouchableOpacity style={{...styles.walkthroughButtonSolid,width:"100%"}} onPress={() => goToFirstScreen()}>
              <Text style={styles.walkthroughLinkRight}>Get Started Now</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Swiper>
      </View>
    </View>
      
    
  );


}

const styles = StyleSheet.create({

  mainView: {
    flex: 1,
    // backgroundColor:"#ffffff"
  },
  buttonImage:{
    width: responsiveWidth(54),
    height: responsiveHeight(13),
    resizeMode: "contain",
  },
  walkthroughImage: {
    width: responsiveWidth(100),
    height: responsiveHeight(56),
    resizeMode: "cover"
  },
  walkthroughImageLast: {
    width: responsiveWidth(95),
    height: responsiveHeight(56),
    resizeMode: "cover",
    alignSelf:"center"
  },
  container: {
    alignItems: 'center',
    justifyContent:"space-between",
    position: "relative",
    width:responsiveWidth(100),
    height: responsiveHeight(100),
    // padding:responsiveHeight(3),
    // backgroundColor:"red",
    zIndex:3
  },
  containerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent:"center",
    position: "absolute",
    height: responsiveHeight(100),
    bottom: 0,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: responsiveHeight(3),
    // paddingTop: responsiveHeight(15),
    // paddingBottom: responsiveHeight(1),
    left: 0,
    right: 0,
    // backgroundColor:"red"
  },
  activeDotStyle: {
    backgroundColor: '#ffffff',
    width: 10,
    height: 10,
    borderRadius: 50,
    borderColor: '#ffffff',
    borderWidth: 1,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 0,
    marginBottom: responsiveHeight(0),
  },
  dotStyle: {
    backgroundColor: '#ffffff',
    width: 10,
    height: 10,
    borderRadius: 50,
    opacity: 0.4,
    borderColor: '#ffffff',
    borderWidth: 1,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 0,
    marginBottom: responsiveHeight(0),
  },
  walkthroughTitle: {
    fontSize: responsiveFontSize(3.8),
    textAlign: "center",
    color: "#ffffff",
    fontFamily: "FuturaLT-Bold",
    textTransform: 'uppercase',
    // textShadowColor: 'rgba(57, 158, 255, 1)',
    // textShadowOffset: { width: 0, height: 0 },
    // textShadowRadius: 8,
  },
  walkthroughSubTitle: {
    fontSize: responsiveFontSize(2),
    textAlign: "center",
    color: "#ffffff",
    fontFamily: "FuturaLT",
    width: "84%"
  },
  walkthroughButtonWrapper: {
    // position: "absolute",
    // bottom: responsiveHeight(2.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: responsiveWidth(92),
  },
  walkthroughButtonOutline:{
    width:responsiveWidth(44),
    height:responsiveHeight(7.5),
    borderRadius:8,
    borderWidth:1,
    borderColor:'#ffffff',
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center"
  },
  walkthroughButtonSolid:{
    width:responsiveWidth(44),
    height:responsiveHeight(7.5),
    borderRadius:8,
    backgroundColor:'#ffffff',
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center"
  },
  walkthroughLinkRight: {
    fontSize: responsiveFontSize(2.1),
    color: "#222222",
    fontFamily: "Poppins-SemiBold",
  },
  walkthroughLinkLeft: {
    fontSize: responsiveFontSize(2.1),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
  },
  
  whiteFullButtonTouchable:{
    position:"absolute",
    bottom:7,
    width:"100%",
    flexGrow:1,
  },
  whiteFullButton:{
    // backgroundColor:"#ffffff",
    // borderRadius:7,
    alignItems:"center",
    justifyContent:"center",
    // padding:responsiveHeight(1.5),
  },
  whiteFullButtonText:{
    fontSize: responsiveFontSize(2.2),
    color: "#3281ff",
    fontFamily: "Poppins-SemiBold",
  },
  walkLogo:{
    height:responsiveHeight(10),
    width:responsiveWidth(95),
    // backgroundColor:"red",
    resizeMode:"contain",
    top:responsiveHeight(5),
    position:"absolute"
  },

  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex:1
  },
  videoOverlay:{
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex:2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  singleSlide:{
    height:responsiveHeight(100),
    justifyContent:"space-between",
    alignItems:"center",
    paddingBottom:responsiveHeight(3)
  }





});
