import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import {  StyleSheet, Text, View, ImageBackground, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight,  Picker, Keyboard, ActivityIndicator  } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenWidth} from "react-native-responsive-dimensions";
import ScaledImage from 'react-native-scalable-image';
import Swiper from 'react-native-swiper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarAlt, faChevronDown, faChevronRight, faClock, faPlay, faPlayCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import Input from '../ui/Input';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
import styles from './StyleSheet';


export default EventMediaDetail = props => {

  const dispatch = useDispatch();
  const pastEvents = useSelector(state => state.common.pastEvents);
  const event = props.route.params.event; 
  const authUser = useSelector(state => state.auth.user);
  const swiper = useRef(null);
  const videoRef = useRef(null); 
  const [videoPlayed, setVideoPlayed] = useState(false);
  const [videoPaused, setVideoPaused] = useState(true);
  const [videoAspectRatio, setVideoAspectRatio] = useState(null); 
  
  useEffect(() => {
    registerEventArchiveLog();
  }, []);

  const goBack = () => {
    props.navigation.goBack(null);
  };

  registerEventArchiveLog = async () => {
    if (!event.viewed_by || !event.viewed_by.includes(authUser._id)) {
        try {
          let response = await dispatch(commonActions.registerEventArchiveLog(event._id));
          let eventIndex = pastEvents.findIndex(pastEvent => pastEvent._id == response._id);
          pastEvents[eventIndex] = response;
          dispatch(commonActions.setPastEvents([...pastEvents], false));

        } catch(err) {
          commonActions.setSystemMessage('Unknown error occured');
        }
    }
  };
  
  

   return ( 
    <LinearGradient colors={['#ffffff', '#ffffff']} style={stylesInline.container} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>


      <View style={styles.mainHeader}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <View style={stylesInline.backHeaderStyleInner}>
            <Image style={[stylesInline.headerBackIcon,]} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />
            <Text style={stylesInline.pageHeading}>Back</Text>
          </View>
        </TouchableOpacity>
      </View>




      <ScrollView showsVerticalScrollIndicator={false} style={{}}>

        {/* FOR IMAGE */}
            {/* <Swiper scrollEnabled={true} index={0} showsPagination={true} showsButtons={false} style={stylesInline.adminstructureSwipper} activeDotStyle={stylesInline.activeDotStyle} dotStyle={stylesInline.dotStyle} loop={false} ref={swiper}>
             
               
              <View>
                <Image style={stylesInline.mediaImage} source={require('../../assets/images/ypa/slide-1.jpg')} />
              </View>
              <View>
                <Image style={stylesInline.mediaImage} source={require('../../assets/images/ypa/slide-2.jpg')} />
              </View>
                
            
            </Swiper> */}
          
            {/* <Image style={stylesInline.mediaImage} source={require('../../assets/images/ypa/slide-1.jpg')}  /> */}
         

        {/* FOR Video */}
        { event.en.videos.length > 0 && <View style={{width: responsiveWidth(100), height: responsiveHeight(30), flex:1, justifyContent:'center',}}>
          <View style={{width: responsiveWidth(100), height: videoAspectRatio ? responsiveWidth(100) / videoAspectRatio : responsiveHeight(30), position:"relative",}}>
            { !videoPlayed && <TouchableOpacity style={{...stylesInline.playIconWrapper, ...(videoAspectRatio ? {} : {backgroundColor: 'transparent'})}} onPress={() => {setVideoPaused(false);setVideoPlayed(true);}}>
              <FontAwesomeIcon color={'#ffffff'} size={50} icon={ faPlayCircle }/>
            </TouchableOpacity> }
            <TouchableOpacity onPress={() => setVideoPaused(true)}>
              <Video source={{
                  uri: event.en.videos[0].url.replace(/ /g, '%20')
                }}
                ref={videoRef} 
                poster={event.en.videos[0].thumb}
                posterResizeMode="contain"
                resizeMode="contain"
                hideShutterView={true}
                repeat={true}
                paused={videoPaused}  
                controls={videoPaused && !videoPlayed ? false : true}
                fullscreen={true}
                style={{...stylesInline.mediaVideo, height: videoAspectRatio ? responsiveWidth(100) / videoAspectRatio : responsiveHeight(30)}}
                onLoad={data => {
                  setVideoAspectRatio(data.naturalSize.width / data.naturalSize.height);
                }}
              />
            </TouchableOpacity>
          </View> 


        </View> }

        <View style={{paddingHorizontal:responsiveWidth(3.4),marginTop: responsiveHeight(3)}}>
          <Text style={stylesInline.mediaTitle} ellipsizeMode='tail'>{event.en.title}</Text>


          {/* <View style={stylesInline.jobDateWrapper}>
            <View style={{ flexDirection: "row", alignItems: "center",marginBottom:responsiveHeight(1) }}>
              <FontAwesomeIcon color={'#222222'} size={14} icon={faCalendarAlt} />
              <Text style={stylesInline.jobDateText}>Date: {moment(event.event_date).format("MMM DD, YYYY")}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesomeIcon color={'#222222'} size={14} icon={faClock} />
              <Text style={stylesInline.jobDateText}>Time: {event.event_timing}</Text>
            </View>
          </View> */}

          <View style={stylesInline.jobDateWrapper}>
            <View style={stylesInline.singleLesson}>
              <View style={{marginRight:responsiveWidth(5)}}>
                <Image style={stylesInline.subsImage} source={require('../../assets/images/ypa/calendar.png')} />
              </View>
              <View style={{ flex:1 }}>
                <Text style={stylesInline.chapterCount} numberOfLines={1}>Event Date</Text>
                <Text style={stylesInline.chapterTitle} ellipsizeMode='tail'>{moment(event.event_date).format("dddd, Do MMMM YYYY")}</Text>
              </View>
            </View>

            <View style={stylesInline.singleLesson}>
              <View style={{marginRight:responsiveWidth(5)}}>
                <Image style={stylesInline.subsImage} source={require('../../assets/images/ypa/clock-red.png')} />
              </View>
              <View style={{ flex:1 }}>
                <Text style={stylesInline.chapterCount} numberOfLines={1}>Event Time</Text>
                <Text style={stylesInline.chapterTitle} ellipsizeMode='tail'>{event.event_timing}</Text>
              </View>
            </View>
          </View>



          <Text style={stylesInline.mediaDescription} ellipsizeMode='tail'>{event.en.long_description ? event.en.long_description : event.en.short_description}</Text>

          { event.en.images && event.en.images.length > 0 &&
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"flex-start",flexWrap:"wrap"}}>

            { event.en.images.map((image, index) => {
              return (
                <View key={index} style={{width:"100%",marginBottom:responsiveHeight(3),borderRadius:10,overflow:"hidden"}}>
                  <ScaledImage width={responsiveWidth(94)} source={{uri: image.regular}} />
                </View>
              );
            })}
            </View>

          }

        </View>

        

        


        <View style={{height:80}}></View>
      </ScrollView>
    </LinearGradient>
  );

 
}

const stylesInline = StyleSheet.create({
  backHeaderStyleInner:{
    flexDirection: "row", 
    alignItems: "center",
  },
  pageHeading: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2.2),
    color: "#222",
    position: "relative",
    top: 1,
    marginLeft: responsiveWidth(2)
  },
  headerBackIcon:{
    height:responsiveHeight(2.3),
    width:responsiveHeight(2.3),
    resizeMode:"contain"
  },
  singleBlog:{
    backgroundColor:"#ffffff",
    borderRadius:10,
    elevation:2,
    paddingVertical:8,
    paddingHorizontal:14,
    marginBottom:responsiveWidth(3)
  },
  blogBottom:{
    backgroundColor:"transparent",
    marginHorizontal:-14,
    marginBottom:-8,
    paddingVertical:8,
    paddingHorizontal:14,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    borderTopWidth:1,
    borderTopColor:"#b8b8b8",
  },
  blogTop:{
    // flexDirection:"row",
    // alignItems:"center",
    // justifyContent:"space-between",
    // backgroundColor:"red"
  },
  blogMiddle:{
    alignItems:"flex-start",
    justifyContent:"space-between",
    paddingVertical:responsiveHeight(1.5) 
    // backgroundColor:"green"
  },
  blogType:{
    color:"#572973",
    fontSize:responsiveFontSize(2.4), 
    fontFamily: "Poppins-SemiBold",
    paddingTop:responsiveWidth(1),
  },
  blogDate:{
    color:"#aaaaab",
    fontSize:responsiveFontSize(1.5), 
    fontFamily: "Poppins-SemiBold",
    paddingTop:responsiveWidth(1),
    // width:"25%",
    // textAlign:"right"
  },
  blogText:{
    color:"#666666",
    fontSize:responsiveFontSize(1.8), 
    fontFamily: "Poppins-Light",
    paddingTop:responsiveWidth(1),
  },
  blogTextMore:{
    color:"#572973",
    fontSize:responsiveFontSize(1.8), 
    fontFamily: "Poppins-SemiBold",
    paddingTop:responsiveWidth(1),
    textDecorationLine: 'underline'
  },
  blogTextColor:{
    color:"#572973",
    fontSize:responsiveFontSize(1.8), 
    fontFamily: "Poppins-SemiBold",
    paddingTop:responsiveWidth(1),
  },
  userIcon:{
    height: responsiveHeight(5),
    width: responsiveWidth(5),
    resizeMode: 'contain',
  },
  chatUnread:{
    backgroundColor:"#b92428",
    width:23,
    height:23,
    color:"#ffffff",
    fontSize:responsiveFontSize(1.5), 
    fontFamily: "Poppins-Light",
    alignItems:"center",
    justifyContent:"center",
    textAlign:"center",
    borderRadius:50,
    textAlignVertical:"center",
    paddingTop:3
  },


  
  container:{
    flex:1,
    // backgroundColor:"#000000"

  },
  headerContainer:{
    // backgroundColor:"red",
    paddingTop:responsiveHeight(2),
    paddingBottom:responsiveHeight(1.8),
    paddingHorizontal:responsiveWidth(3.5),
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center"
  },
  backIconContainer:{
    width:"100%",
    // marginTop:responsiveHeight(3.2),
    flexDirection:"row",
    alignItems:"center"
  },
  backIcon:{
    height: responsiveHeight(2.6),
    width: responsiveWidth(2.6),
    resizeMode: 'contain',
    marginRight:10
  },
  backText:{
    color:"#141517",
    fontSize:responsiveFontSize(2.4), 
    fontFamily: "Poppins-SemiBold",
    paddingTop:responsiveWidth(1),
  },
  topButton:{
    backgroundColor:"#4f2e71",
    paddingHorizontal:responsiveWidth(5),
    borderRadius:6,
    height:responsiveWidth(8),
    alignItems:"center",
    justifyContent:"center"
  },
  topButtonText:{
    color:"#ffffff",
    fontSize:responsiveFontSize(2), 
    fontFamily: "Poppins-Light",
  },
  
  pageHeadingButton:{
    backgroundColor:"#1197cc",
    paddingTop:responsiveHeight(0.6),
    paddingBottom:responsiveHeight(0.1),
    paddingHorizontal:responsiveWidth(3),
    borderRadius:9
  },
  pageHeadingButtonText:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(1.8),
    color:"#ffffff"
  },
  singleOption:{
    paddingHorizontal:responsiveWidth(3),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    marginBottom:responsiveHeight(2.5),
  },
  userImage:{
    height:responsiveHeight(8),
    width:responsiveHeight(8),
    borderRadius:100
  },
  pagetitle:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(2.2),
    color:"#333333",
    marginLeft:responsiveWidth(3)
  },
  pageSubTitle:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(1.8),
    lineHeight:responsiveFontSize(2.2),
    color:"#333333",
    marginLeft:responsiveWidth(3.2)
  },
  imageContainer:{
    flexDirection:"row", 
    width:'100%', 
    alignItems: "center", 
    justifyContent:"space-between", 
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(6),
    paddingHorizontal:responsiveWidth(3.2)
  },
  singleImageUploadBG:{
    backgroundColor: '#e3e3e3',
    height: responsiveWidth(21),
    width: responsiveWidth(21),
    borderRadius: 20,
    alignItems:"center",
    justifyContent: 'center',
    position: "relative"
  },
  singleImageUploadBGImage:{
    height: responsiveWidth(21),
    width: responsiveWidth(21),
    resizeMode:"contain",
    borderRadius: 20,
  },
  addButton:{
    height: responsiveWidth(7),
    width: responsiveWidth(7),
    resizeMode:"contain"
  },
  btnSection:{
    position: "absolute",
    height: responsiveWidth(7),
    width: responsiveWidth(7),
    resizeMode:"contain",
    right: -9,
    top: -9,
    zIndex: 2,
  },
  imageRemoveIcon:{
    width: '100%',
    height: '100%',
  },
  normalInputContainer:{
    paddingHorizontal:responsiveWidth(3.5),
    paddingBottom:responsiveHeight(6),
    // backgroundColor:"green",
    flex:1
  },
  discountText:{
    paddingBottom:responsiveHeight(6),
    fontFamily:"Poppins-SemiBold",
    fontSize: responsiveFontSize(3),
    color:"green",
    marginLeft:5
  },
  normalInputText:{
    fontFamily:"Poppins-SemiBold",
    fontSize: responsiveFontSize(1.8),
    color:"#4f2e71",
    position:"absolute",
    top:-12,
    left:responsiveWidth(7),
    backgroundColor:"#deedff",
    zIndex:2,
    paddingHorizontal:responsiveWidth(2)
  },
  input:{
    marginLeft: 0,
    paddingRight: 15,
    paddingLeft: 20,
    fontFamily:"Poppins-Light",
    paddingTop:14,
    fontSize: responsiveFontSize(2),
    lineHeight:responsiveFontSize(2),
    // fontWeight: '700',
    borderColor:"#4f2e71",
    borderWidth:1.5,
    borderRadius:6,
    color: '#222222',
    textAlign: "left",
    // width:"100%",
  },
  inputText:{
    marginLeft: 0,
    paddingRight: 15,
    fontFamily:"Poppins-Light",
    paddingTop:10,
    paddingBottom:11,
    fontSize: responsiveFontSize(2),
    lineHeight:responsiveFontSize(2),
    color: '#222222',
    textAlign: "left",
  },
  errorContainer: {
    // margin: 0,
    position: "absolute",
    bottom: -29,
    left:10
  },
  errorText: {
    color: 'red',
    fontFamily:"Poppins-Light",
    fontSize: responsiveFontSize(1.6),
  },
  searchChat:{
    height: responsiveHeight(6),
    width: responsiveWidth(6),
    resizeMode: 'contain',
  },
  adminstructureSwipper:{
    height: responsiveHeight(30)
  },
  activeDotStyle:{
    backgroundColor: '#1444cc',
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
    backgroundColor: '#c5d4ff',
    width: 8,
    height: 8,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 0,
    // position:"absolute",
    // bottom:0
    marginBottom: -responsiveWidth(4),
  },
  mediaImage:{
    width: "100%",
    height: responsiveHeight(30),
    resizeMode:'cover',
    alignSelf:"center",
    marginBottom:responsiveHeight(1.4)
  },
  mediaVideo:{
    width: responsiveWidth(100),
    height: responsiveHeight(30),
    marginBottom:responsiveHeight(1.4)
  },
  jobDateWrapper: {
    // flexDirection: "row",
    // justifyContent: "flex-start",
    marginBottom:responsiveHeight(1),
    marginTop:responsiveHeight(1.5)
  },
  jobDateText: {
    fontSize: responsiveFontSize(1.9),
    color: "#222222",
    fontFamily: "Poppins-Light",
    marginLeft: responsiveWidth(1.8),
    position:"relative",
    top:responsiveHeight(0.2)
  },
  mediaTitle:{
    fontSize: responsiveFontSize(2.5),
    color: "#222222",
    fontFamily: "Poppins-SemiBold",
    marginBottom:responsiveHeight(0.8)
  },
  mediaSubTitle:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(1.6),
    color:"#333333",
    marginBottom: responsiveHeight(3),
  },
  mediaDescription:{
    // fontFamily:"Poppins-Light",
    // fontSize:responsiveFontSize(2),
    // color:"#333333",
    fontSize: responsiveFontSize(2),
    color: "#222222",
    fontFamily: "Poppins-Light",
    marginTop: 10,
    marginBottom: 15
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
});
