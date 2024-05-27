import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import {  StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight,  Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import ScaledImage from 'react-native-scalable-image';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize,} from "react-native-responsive-dimensions";
import { useSelector, useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import * as commonActions from '../store/actions/common';

const fontUrl = Platform.select({
  ios: "Poppins-Light.ttf",
  android: "file:///android_asset/fonts/Poppins-Light.ttf",
});


// const HTML = ``;
const HTML = `
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>

    @font-face {
      font-family: 'Poppins-Light'; 
      src: url('${fontUrl}') format('truetype')
    }

    body {
      font-size:15px;
      color:#222222 !important;
      font-family: 'Poppins-Light';
      background-color: #ffffff;
    }
    p, a {
      color:#222222 !important;
      font-size: 14px;
      font-family: 'Poppins-Light';
      margin-bottom:0
    }
  </style>
`
;


export default DynamicPage = props => {

  const dispatch = useDispatch();
  const pages = useSelector(state => state.common.pages); 
  const page = pages.find(el => el.url == props.route.params.url);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [dispatch]);


  const fetchData = async () => {
    try {
      await dispatch(commonActions.getPages());
    } catch(err) {}
    setIsLoading(false);
  };

  if (!page && isLoading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color={'#1444cc'} />
      </View>
    );
  }




  return ( 
    <LinearGradient colors={['#ffffff', '#ffffff']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
      
      {page ? 
        <>
          <View style={styles.titleWrapper}>
            <Text style={{...styles.categoryName}}>{page.title}</Text>
          </View>

          <WebView  
            style={{backgroundColor:"#ffffff",color:"#000000"}}
            originWhitelist={['*']}
            source={{ html: HTML+page.content, baseUrl: '' }}
          />
        </>
      :
        <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(0)}}>
          <Image style={styles.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
          <Text style={styles.noDataTitle}>Nothing found</Text>
        </View>
      }

     
      
    </LinearGradient>
  );

}

const styles = StyleSheet.create({
  titleWrapper:{
    // backgroundColor:"red",
    alignItems:"center",
    justifyContent:"center",
    height:responsiveHeight(8)
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noDataImage:{
    height:responsiveHeight(8),
    resizeMode:"contain",
    marginBottom:responsiveHeight(2)
  },
  noDataTitle:{
    fontFamily:"Poppins-SemiBold",
    fontSize:responsiveFontSize(2),
    color:"#222222",
  },
  noDataSubTitle:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(2),
    color:"#888888",
    textAlign:"center"
  },
  parentWrapper:{
    flex:1,
    backgroundColor:"#ffffff",
    padding:responsiveWidth(3),
    paddingBottom:0
  },
  scrollview:{
    height: '100%',
  },
  topHeaderWrapper:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    marginBottom:10
  },
  textRegularDark:{
    fontFamily:"FuturaLT",
    fontSize:responsiveFontSize(1.7),
    color:"#333333",
  },
  textMediumPrimary:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(1.7),
    color:"#1444CC",
  },
  categoryName:{
    fontFamily:"Poppins-SemiBold",
    fontSize:responsiveFontSize(2.8),
    color:"#000000",
    textAlign:"left",

  },
  accountBgWrapper:{
    backgroundColor:"#f5f7ff",
    padding:responsiveWidth(3),
    flexDirection:"row",
    alignItems:"center"
  },
  accountImage:{
    height:responsiveHeight(10),
    width:responsiveHeight(10),
    borderRadius:50,
    backgroundColor:"#1444CC",
    alignItems:"center",
    justifyContent:"center",
    marginRight:responsiveWidth(3)
  },
  accountName:{
    fontFamily:"FuturaLT",
    fontSize:responsiveFontSize(2.8),
    color:"#ffffff",
  },
  userName:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(1.8),
    color:"#000000",
  },
  userEmail:{
    fontFamily:"FuturaLT",
    fontSize:responsiveFontSize(1.5),
    color:"#000000",
  },
  userMobile:{
    fontFamily:"FuturaLT",
    fontSize:responsiveFontSize(1.5),
    color:"#000000",
  },
  productSmallImage:{
    height:responsiveHeight(10),
    width:responsiveHeight(10),
    borderRadius:50,
    resizeMode:"cover"
  },
  onlyButtonText:{
    color:"#1444CC",
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(1.5),
  },
  star:{
    height:responsiveWidth(3.5),
    width:responsiveWidth(3.5),
    resizeMode:"contain",
    marginTop:-4,
    marginRight:3
  },
  paymentSelectionSection:{
    // borderTopWidth:6,
    borderBottomWidth:6,
    borderColor:"#f3f3f3"
  },
  singleMenuOption:{
    padding:responsiveWidth(3),
    paddingTop:responsiveWidth(3.6),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
    // backgroundColor:"red"
  },
  singleMenuTitle:{
    color:"#000000",
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(1.8),
    marginLeft:10,
  },
  menuOptionDivider:{
    height:1,
    backgroundColor:"#ececec"
  },
  cartSummary: {
    // backgroundColor:"#F5F7FF",
    paddingHorizontal:responsiveWidth(3),
    paddingVertical:responsiveWidth(4)
  },
  cartSummaryTitle:{
    fontFamily:"Poppins-SemiBold",
    fontSize:responsiveFontSize(1.9),
    color:"#000000",
  },
  singleCartOption:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    marginBottom:responsiveWidth(2)
  },
  singleCartOptionText:{
    fontFamily:"FuturaLT",
    fontSize:responsiveFontSize(1.7),
    color:"#000000"
  },
  singleCartOptionMessage:{
    fontFamily:"FuturaLT",
    fontSize:responsiveFontSize(1.5),
    color:"#A2A6B0"
  },

  trackingWrapper:{
    marginTop:responsiveWidth(3),
  },
  singleStep:{
    borderLeftWidth:2,
    borderLeftColor:"green",
    paddingLeft:responsiveWidth(4),
    marginLeft:responsiveWidth(2),
    paddingTop:responsiveWidth(0),
    paddingBottom:responsiveWidth(4),
  },
  singleStepRound:{
    height:responsiveWidth(2),
    width:responsiveWidth(2),
    backgroundColor:"green",
    borderRadius:50,
    position:"absolute",
    left:-responsiveWidth(1.2),
  },
  singleStepRoundLastSuccess:{
    height:responsiveWidth(4),
    width:responsiveWidth(4),
    borderWidth:4,
    backgroundColor:"green",
    borderColor:"#a6eb98",
    borderRadius:50,
    position:"absolute",
    left:-responsiveWidth(2.1),
    top:-responsiveWidth(0.8)
  },
  singleStepRoundLastFailed:{
    height:responsiveWidth(4),
    width:responsiveWidth(4),
    borderWidth:4,
    backgroundColor:"red",
    borderColor:"#ffdbde",
    borderRadius:50,
    position:"absolute",
    left:-responsiveWidth(2.1),
    top:-responsiveWidth(0.8)
  },
  singleStepTitle:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(1.5),
    color:"#000000",
    marginTop:-responsiveWidth(1.45),
  },
  singleStepSubTitle:{
    fontFamily:"FuturaLT",
    fontSize:responsiveFontSize(1.4),
    color:"#A2A6B0"
  },
  outlinePrimaryButton:{
    borderWidth:1,
    borderColor:"#1444cc",
    flexDirection:"row",
    alignItems:"center",
    paddingHorizontal:responsiveWidth(6),
    paddingVertical:responsiveWidth(2),
    borderRadius:50,
    alignSelf: 'flex-start'
  },
  outlineButtonImage:{
    height:responsiveWidth(5),
    width:responsiveWidth(5),
    resizeMode:"contain",
    marginRight:responsiveWidth(2)
  },
  outlineButtonImageSmall:{
    height:responsiveWidth(4.5),
    width:responsiveWidth(4.5),
    resizeMode:"contain",
    marginRight:responsiveWidth(2.5), 
    marginTop:-2
  },
  outlineButtonText:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(1.8),
    color:"#1444cc",
  },
  smallRightImage:{
    height:responsiveWidth(4.5),
    width:responsiveWidth(4.5),
    resizeMode:"contain",
  },

  socialMediaImage:{
    height:responsiveWidth(7),
    width:responsiveWidth(7),
    resizeMode:"contain",
    marginHorizontal:responsiveWidth(2)
  },
  collapseBody:{
    padding:responsiveWidth(3),
    paddingVertical:responsiveWidth(10),
    paddingTop:0
  },
  collapseBodyLargeHeading:{
    fontFamily:"Poppins-SemiBold",
    fontSize:responsiveFontSize(1.9),
    color:"#333333",
    marginBottom:18,
  },
  collapseBodyHeading:{
    fontFamily:"Poppins-SemiBold",
    fontSize:responsiveFontSize(1.8),
    color:"#333333",
    marginBottom:18,
  },
  collapseBodyText:{
    fontFamily:"FuturaLT",
    fontSize:responsiveFontSize(1.6),
    color:"#333333",
    marginBottom:18,
  },

  
});
