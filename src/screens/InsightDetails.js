import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import {  StyleSheet, Text, View, ImageBackground, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight,  Picker, Keyboard, ActivityIndicator, Animated  } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenWidth} from "react-native-responsive-dimensions";
import ScaledImage from 'react-native-scalable-image';
import Swiper from 'react-native-swiper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faSearch, faSortAmountDown, faClock, faSuitcase, faPoundSign, faMapMarkerAlt, faBookmark, faBriefcase, faMoneyBill, faMoneyBillAlt, faMoneyBillWave, faMoneyBillWaveAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Video from 'react-native-video';
import Input from '../ui/Input';
import moment from 'moment';
import { WebView } from 'react-native-webview';
import { Shadow } from 'react-native-shadow-2';
import * as Animatable from 'react-native-animatable';
import HTMLView from 'react-native-htmlview';

import { useSelector, useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
import styles from './StyleSheet';

const fontUrl = Platform.select({
  ios: "Poppins-Light.ttf",
  android: "file:///android_asset/fonts/Poppins-Light.ttf",
});

const HTML = `
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>

    @font-face {
      font-family: 'Poppins-Light'; 
      src: url('${fontUrl}') format('truetype')
    }

    body {
      font-size:15px;
      color:#222222;
      font-family: 'Poppins-Light';
      background-color: #ffffff;
    }
    p {
      color:#222222;
      font-size: 15px;
      font-family: 'Poppins-Light';
      margin-bottom:0
    }
  </style>
`
;

export default InsightDetails = props => {

  const scrollY = new Animated.Value(0);
  const HEADER_MAX_HEIGHT = responsiveHeight(40);
  const HEADER_MIN_HEIGHT = responsiveHeight(9);
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const [textShown, setTextShown] = useState(false);
  const [lengthMore,setLengthMore] = useState(false);

  const insight = props.route.params.insight; 
  const swiper = useRef(null);
  const videoRef = useRef(null); 
  const [videoPlayed, setVideoPlayed] = useState(false);
  const [videoPaused, setVideoPaused] = useState(true);
  const [videoAspectRatio, setVideoAspectRatio] = useState(null); 
  
  const [webViewHeight, setWebViewHeight] = useState(0.5);
  const onMessage = (event) => {
    // console.log(event.nativeEvent.data);
    let data = JSON.parse(event.nativeEvent.data);
    setWebViewHeight(data.height);
  }
  const injectedJavaScript=`
    setTimeout(function() { 
      window.ReactNativeWebView.postMessage(
        JSON.stringify({height: Math.max(document.body.offsetHeight, document.body.scrollHeight), index: 0})
      );
    }, 100);
  `;

  const goBack = () => {
    props.navigation.goBack(null);
  };


  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  }


  // function renderNode(node, index, siblings, parent, defaultRenderer) {
  //   if (node.name == 'li') {
  //     // const specialSyle = node.attribs.style
  //     return (
  //       <View key={index} style={{backgroundColor:"red",height:responsiveHeight(7.5)}}>
  //       {defaultRenderer(node.children, parent)}
  //       </View>
  //     )
  //   }
  // }
 

  const onTextLayout = useCallback(e =>{
    setLengthMore(e.nativeEvent.lines.length >=4); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  },[]);

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
        <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          { useNativeDriver: false }
        )}>
          <View style={{...styles.scrollViewContent, marginTop: responsiveHeight(40),backgroundColor:"#f0f7ff"}}>
          




          { (insight.en.description || insight.en.short_description) && 
            <View style={{ overflow: "hidden", flex: 1,backgroundColor:"#ffffff",padding:responsiveWidth(2),borderRadius:8}}>

              {insight.en.description ?
              <HTMLView
                value={insight.en.description.replace(/(\r\n|\n|\r)/gm, '').replace(/<p>&nbsp;<\/p>/g, '').replace(/<li>/g, '<p>')}
                stylesheet={stylesHTML}
                addLineBreaks={false}
                lineBreak={''}
                
              />
              :
              <Text>{insight.en.short_description}</Text>
              }

            {/* <WebView  
              originWhitelist={['*']}
              source={{ html: `<body><div>`+HTML+(insight.en.description ? insight.en.description : insight.en.short_description)+`</div></body>`, baseUrl: '' }}
              scrollEnabled={false}
              onMessage={onMessage}
              injectedJavaScript={injectedJavaScript}
              style={{flex: 0, height: webViewHeight,backgroundColor:"#ffffff"}}
            />  */}
            </View>
          }
          </View>
        </ScrollView>


        <Animated.View style={[styles.header, {height: headerHeight}]}>

          <Animated.View style={[styles.jdContentWrapper,{opacity: imageOpacity}]}>
            
            <Animatable.Text animation="fadeInLeft" delay={200} style={{...styles.jdTitle, fontSize:responsiveFontSize(3),}}>{insight.en.name}</Animatable.Text>

            <Animatable.View animation="fadeInLeft" delay={300} style={styles.sideBySide}>
              <FontAwesomeIcon color={'#ffffff'} size={12} icon={faCalendarAlt} style={{marginRight:responsiveWidth(3)}}/>
              <Text style={styles.jdSalary}>{moment(insight.publish_date).format("dddd, MMMM Do YYYY")} {insight.insight_timing}</Text>
            </Animatable.View>
          </Animated.View>

          {insight.en.images.map((image, index) => {
            return (
              <>
                <Animated.View style={[styles.bgOverlay, {backgroundColor:bgColor},{height: headerHeight}]}></Animated.View>
                <Animated.Image animation="fadeIn" delay={100} style={[styles.backgroundImage, {opacity: imageOpacity, transform: [{translateY: imageTranslate}]},]} source={{uri: image.regular}}/>
                <Animated.Image style={{position:"absolute",top:0, width:responsiveWidth(100),height:headerHeight,opacity: imageOpacity, transform: [{translateY: imageTranslate}]}} source={require('../../assets/images/ypa/bg-9.jpg')} />
              </>
            );
          })}

 
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






    // <View style={styles.container}>
    //   <ScrollView style={{}}>

    //     <View style={{paddingHorizontal:responsiveWidth(3),backgroundColor:"#ebf1ff",paddingTop:responsiveHeight(2),paddingBottom:responsiveHeight(8)}} renderToHardwareTextureAndroid={true} >
    //       <Text style={styles.mediaTitle} ellipsizeMode='tail'>{insight.en.name}</Text>

    //       { insight.en.images && insight.en.images.length > 0 &&
    //         <View style={{flexDirection:"row",alignItems:"center",justifyContent:"flex-start",flexWrap:"wrap",marginTop:responsiveHeight(1)}}>

    //         { insight.en.images.map((image, index) => {
    //           return (
    //             <View key={index} style={{width:"100%",marginBottom:responsiveHeight(3),borderRadius:10,overflow:"hidden"}}>
    //               <ScaledImage width={responsiveWidth(94)} source={{uri: image.regular}} />
    //             </View>
    //           );
    //         })}
    //         </View>
    //       }

    //       <View style={styles.jobDateWrapper}>
    //         <View style={{ flexDirection: "row", alignItems: "center",marginVertical:responsiveHeight(1) }}>
    //           <FontAwesomeIcon color={'#007fff'} size={14} icon={faClock} />
    //           <Text style={styles.jobDateText}>Publish Date: {moment(insight.publish_date).format("MMM DD, YYYY")}, {insight.insight_timing}</Text>
    //         </View>
    //       </View>
          
    //       { (insight.en.description || insight.en.short_description) && 
    //       <View style={{ overflow: "hidden", flex: 1,backgroundColor:"#0065cb",padding:responsiveWidth(2),borderRadius:8}}>
    //       <WebView  
    //         originWhitelist={['*']}
    //         source={{ html: `<body><div>`+HTML+(insight.en.description ? insight.en.description : insight.en.short_description)+`</div></body>`, baseUrl: '' }}
    //         scrollEnabled={false}
    //         onMessage={onMessage}
    //         injectedJavaScript={injectedJavaScript}
    //         style={{flex: 0, height: webViewHeight,backgroundColor:"#0065cb"}}
    //       /> 
    //       </View>
    //       }
          
          

    //     </View>
        
    //   </ScrollView>
    // </View>
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
  },
  ul:{
    display:"flex",
    flexDirection:"column",
    marginBottom:10,
    width:responsiveWidth(85),
  },
  li:{
    
  }
});

// const stylesInline = StyleSheet.create({

//   singleBlog:{
//     backgroundColor:"#ffffff",
//     borderRadius:10,
//     elevation:2,
//     paddingVertical:8,
//     paddingHorizontal:14,
//     marginBottom:responsiveWidth(3)
//   },
//   blogBottom:{
//     backgroundColor:"transparent",
//     marginHorizontal:-14,
//     marginBottom:-8,
//     paddingVertical:8,
//     paddingHorizontal:14,
//     borderBottomLeftRadius:10,
//     borderBottomRightRadius:10,
//     borderTopWidth:1,
//     borderTopColor:"#b8b8b8",
//   },
//   blogTop:{
//     // flexDirection:"row",
//     // alignItems:"center",
//     // justifyContent:"space-between",
//     // backgroundColor:"red"
//   },
//   blogMiddle:{
//     alignItems:"flex-start",
//     justifyContent:"space-between",
//     paddingVertical:responsiveHeight(1.5) 
//     // backgroundColor:"green"
//   },
//   blogType:{
//     color:"#572973",
//     fontSize:responsiveFontSize(2.4), 
//     fontFamily: "Poppins-SemiBold",
//     paddingTop:responsiveWidth(1),
//   },
//   blogDate:{
//     color:"#aaaaab",
//     fontSize:responsiveFontSize(1.5), 
//     fontFamily: "Poppins-SemiBold",
//     paddingTop:responsiveWidth(1),
//     // width:"25%",
//     // textAlign:"right"
//   },
//   blogText:{
//     color:"#666666",
//     fontSize:responsiveFontSize(1.8), 
//     fontFamily: "FuturaLT-Book",
//     paddingTop:responsiveWidth(1),
//   },
//   blogTextMore:{
//     color:"#572973",
//     fontSize:responsiveFontSize(1.8), 
//     fontFamily: "Poppins-SemiBold",
//     paddingTop:responsiveWidth(1),
//     textDecorationLine: 'underline'
//   },
//   blogTextColor:{
//     color:"#572973",
//     fontSize:responsiveFontSize(1.8), 
//     fontFamily: "Poppins-SemiBold",
//     paddingTop:responsiveWidth(1),
//   },
//   userIcon:{
//     height: responsiveHeight(5),
//     width: responsiveWidth(5),
//     resizeMode: 'contain',
//   },
//   chatUnread:{
//     backgroundColor:"#b92428",
//     width:23,
//     height:23,
//     color:"#ffffff",
//     fontSize:responsiveFontSize(1.5), 
//     fontFamily: "FuturaLT-Book",
//     alignItems:"center",
//     justifyContent:"center",
//     textAlign:"center",
//     borderRadius:50,
//     textAlignVertical:"center",
//     paddingTop:3
//   },


  
//   container:{
//     flex:1,
//     backgroundColor:"#000000"
//   },
//   headerContainer:{
//     // backgroundColor:"red",
//     paddingTop:responsiveHeight(2),
//     paddingBottom:responsiveHeight(1.8),
//     paddingHorizontal:responsiveWidth(3.5),
//     flexDirection:"row",
//     justifyContent:"space-between",
//     alignItems:"center"
//   },
//   backIconContainer:{
//     width:"100%",
//     // marginTop:responsiveHeight(3.2),
//     flexDirection:"row",
//     alignItems:"center"
//   },
//   backIcon:{
//     height: responsiveHeight(2.6),
//     width: responsiveWidth(2.6),
//     resizeMode: 'contain',
//     marginRight:10
//   },
//   backText:{
//     color:"#141517",
//     fontSize:responsiveFontSize(2.4), 
//     fontFamily: "Poppins-SemiBold",
//     paddingTop:responsiveWidth(1),
//   },
//   topButton:{
//     backgroundColor:"#4f2e71",
//     paddingHorizontal:responsiveWidth(5),
//     borderRadius:6,
//     height:responsiveWidth(8),
//     alignItems:"center",
//     justifyContent:"center"
//   },
//   topButtonText:{
//     color:"#ffffff",
//     fontSize:responsiveFontSize(2), 
//     fontFamily: "FuturaLT-Book",
//   },
//   pageHeading:{
//     fontFamily:"FuturaLT-Bold",
//     fontSize:responsiveFontSize(3),
//     color:"#333333",
//     margin:0,
//     lineHeight:responsiveFontSize(4),
//   },
//   pageHeadingButton:{
//     backgroundColor:"#1197cc",
//     paddingTop:responsiveHeight(0.6),
//     paddingBottom:responsiveHeight(0.1),
//     paddingHorizontal:responsiveWidth(3),
//     borderRadius:9
//   },
//   pageHeadingButtonText:{
//     fontFamily:"FuturaLT-Book",
//     fontSize:responsiveFontSize(1.8),
//     color:"#ffffff"
//   },
//   singleOption:{
//     paddingHorizontal:responsiveWidth(3),
//     flexDirection:"row",
//     alignItems:"center",
//     justifyContent:"space-between",
//     marginBottom:responsiveHeight(2.5),
//   },
//   userImage:{
//     height:responsiveHeight(8),
//     width:responsiveHeight(8),
//     borderRadius:100
//   },
//   pagetitle:{
//     fontFamily:"FuturaLT-Book",
//     fontSize:responsiveFontSize(2.2),
//     color:"#333333",
//     marginLeft:responsiveWidth(3)
//   },
//   pageSubTitle:{
//     fontFamily:"FuturaLT-Book",
//     fontSize:responsiveFontSize(1.8),
//     lineHeight:responsiveFontSize(2.2),
//     color:"#333333",
//     marginLeft:responsiveWidth(3.2)
//   },
//   imageContainer:{
//     flexDirection:"row", 
//     width:'100%', 
//     alignItems: "center", 
//     justifyContent:"space-between", 
//     marginTop: responsiveHeight(3),
//     marginBottom: responsiveHeight(6),
//     paddingHorizontal:responsiveWidth(3.2)
//   },
//   singleImageUploadBG:{
//     backgroundColor: '#e3e3e3',
//     height: responsiveWidth(21),
//     width: responsiveWidth(21),
//     borderRadius: 20,
//     alignItems:"center",
//     justifyContent: 'center',
//     position: "relative"
//   },
//   singleImageUploadBGImage:{
//     height: responsiveWidth(21),
//     width: responsiveWidth(21),
//     resizeMode:"contain",
//     borderRadius: 20,
//   },
//   addButton:{
//     height: responsiveWidth(7),
//     width: responsiveWidth(7),
//     resizeMode:"contain"
//   },
//   btnSection:{
//     position: "absolute",
//     height: responsiveWidth(7),
//     width: responsiveWidth(7),
//     resizeMode:"contain",
//     right: -9,
//     top: -9,
//     zIndex: 2,
//   },
//   imageRemoveIcon:{
//     width: '100%',
//     height: '100%',
//   },
//   normalInputContainer:{
//     paddingHorizontal:responsiveWidth(3.5),
//     paddingBottom:responsiveHeight(6),
//     // backgroundColor:"green",
//     flex:1
//   },
//   discountText:{
//     paddingBottom:responsiveHeight(6),
//     fontFamily:"Poppins-SemiBold",
//     fontSize: responsiveFontSize(3),
//     color:"green",
//     marginLeft:5
//   },
//   normalInputText:{
//     fontFamily:"Poppins-SemiBold",
//     fontSize: responsiveFontSize(1.8),
//     color:"#4f2e71",
//     position:"absolute",
//     top:-12,
//     left:responsiveWidth(7),
//     backgroundColor:"#deedff",
//     zIndex:2,
//     paddingHorizontal:responsiveWidth(2)
//   },
//   input:{
//     marginLeft: 0,
//     paddingRight: 15,
//     paddingLeft: 20,
//     fontFamily:"FuturaLT-Book",
//     paddingTop:14,
//     fontSize: responsiveFontSize(2),
//     lineHeight:responsiveFontSize(2),
//     // fontWeight: '700',
//     borderColor:"#4f2e71",
//     borderWidth:1.5,
//     borderRadius:6,
//     color: '#222222',
//     textAlign: "left",
//     // width:"100%",
//   },
//   inputText:{
//     marginLeft: 0,
//     paddingRight: 15,
//     fontFamily:"FuturaLT-Book",
//     paddingTop:10,
//     paddingBottom:11,
//     fontSize: responsiveFontSize(2),
//     lineHeight:responsiveFontSize(2),
//     color: '#222222',
//     textAlign: "left",
//   },
//   errorContainer: {
//     // margin: 0,
//     position: "absolute",
//     bottom: -29,
//     left:10
//   },
//   errorText: {
//     color: 'red',
//     fontFamily:"FuturaLT-Book",
//     fontSize: responsiveFontSize(1.6),
//   },
//   searchChat:{
//     height: responsiveHeight(6),
//     width: responsiveWidth(6),
//     resizeMode: 'contain',
//   },
//   adminstructureSwipper:{
//     height: responsiveHeight(30)
//   },
//   activeDotStyle:{
//     backgroundColor: '#1444cc',
//     width: 8,
//     height: 8, 
//     marginLeft: 6,
//     marginRight: 6,
//     marginTop: 0,
//     marginBottom: -responsiveWidth(4),
//     // position:"absolute",
//     // bottom:0
//   },
//   dotStyle:{
//     backgroundColor: '#c5d4ff',
//     width: 8,
//     height: 8,
//     marginLeft: 6,
//     marginRight: 6,
//     marginTop: 0,
//     // position:"absolute",
//     // bottom:0
//     marginBottom: -responsiveWidth(4),
//   },
//   mediaImage:{
//     width: "100%",
//     height: responsiveHeight(30),
//     resizeMode:'cover',
//     alignSelf:"center",
//     marginBottom:responsiveHeight(1.4)
//   },
//   mediaVideo:{
//     width: responsiveWidth(100),
//     height: responsiveHeight(30),
//     marginBottom:responsiveHeight(1.4)
//   },
//   jobDateWrapper: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     marginBottom:responsiveHeight(1.5)
//   },
//   jobDateText: {
//     fontSize: responsiveFontSize(1.7),
//     color: "#000000",
//     fontFamily: "FuturaLT-Book",
//     marginLeft: responsiveWidth(1.8),
//   },
//   mediaTitle:{
//     fontSize: responsiveFontSize(2.5),
//     color: "#000000",
//     fontFamily: "FuturaLT-Bold",
//     marginBottom:responsiveHeight(0.8)
//   },
//   mediaSubTitle:{
//     fontFamily:"FuturaLT",
//     fontSize:responsiveFontSize(1.6),
//     color:"#333333",
//     marginBottom: responsiveHeight(3),
//   },
//   mediaDescription:{
//     // fontFamily:"FuturaLT-Book",
//     // fontSize:responsiveFontSize(2),
//     // color:"#333333",
//     fontSize: responsiveFontSize(1.9),
//     color: "#333",
//     fontFamily: "FuturaLT",
//     marginBottom: 35
//   },
//   playIconWrapper:{
//     position:"absolute",
//     zIndex:9,
//     top:0,
//     bottom:0,
//     left:0,
//     right:0,
//     alignItems:"center",
//     justifyContent:"center",
//     backgroundColor: 'rgba(0, 0, 0, 0.2)'
//   }
// });
