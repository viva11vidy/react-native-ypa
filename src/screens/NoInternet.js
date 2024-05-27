import React, { useState, useEffect, useReducer, useCallback, useRef, useMemo } from 'react';
import {  StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Dimensions, PermissionsAndroid, Platform, Linking, ActivityIndicator, ScrollView } from 'react-native';
import { StackActions } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import NetInfo from "@react-native-community/netinfo";


export default NoInternetScreen = props => {

  const checkNetConnection = () => {
    NetInfo.fetch().then(state => {
      if(state.isConnected) {
        props.navigation.dispatch(StackActions.replace('Startup'));
      }
    }, err => {});
  };

  return(
    <LinearGradient colors={['#ffffff', '#cee6ff']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>

      <View style={styles.screen}>
        <Image source={require('../../assets/images/ypa/no-internet.png')} resizeMode='contain' style={ styles.noInternetImage}></Image> 
        <Text style={styles.headingText}>Oops! It seems like you have no internet connection</Text>
      </View>

      <View style={styles.bottomButtonArea}>
        <TouchableOpacity onPress={() => checkNetConnection()}>
          <LinearGradient colors={['#3895fc', '#005ba6']} style={styles.solidButtonPrimary} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
            <Text style={styles.solidButtonPrimaryText}>Retry</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>


    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bottomButtonArea:{
    // backgroundColor:"red",
    width: "100%",
    paddingHorizontal:responsiveWidth(5),
    paddingBottom:responsiveHeight(2),
    paddingTop:responsiveHeight(0),
    // marginVertical: 15,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: responsiveHeight(-10),
  },
  noInternetImage:{
    height: responsiveHeight(8),
    width:responsiveWidth(16),
    //backgroundColor:"red"
  },
  logo:{
    height: responsiveHeight(10),
    width: responsiveWidth(18),
    resizeMode: 'contain',
  },
  mainButtonText:{
    fontSize: responsiveFontSize(2),
    color:"#1c75bc",
    fontFamily:"Poppins-SemiBold",
  },
  mainButton:{
    backgroundColor: "#ffffff",
    height: responsiveHeight(7),
    width: "100%",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    marginVertical: 15,
    borderRadius: 10
  },
  makeProfileButton:{
    marginRight:'auto',
    marginLeft:'auto',
    marginTop:0,
    paddingTop:11,
    paddingBottom:11,
    backgroundColor:'#23395B',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#707070',
    width: responsiveWidth(45),
  },
  makeProfileButtonText:{
    color:'#fff',
    textAlign:'center',
    paddingLeft : 0,
    paddingRight : 0,
    fontSize: responsiveFontSize(2.8),
    fontWeight: '700',
    //fontStyle: 'italic',
  },
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    // height: '100%',
    //backgroundColor:"red",
    flex: 1, 
    position: 'relative',
    alignItems:"center",
    justifyContent:"space-between",
  },
  imgBackground: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'stretch',
    textAlign: 'center',
    
  },
  
  popupContainer:{
    backgroundColor:"#ffffff",
    width: "77%",
    borderWidth:1,
    borderRadius:18,
    borderColor:"#1761a0"
  },
  headingView:{
    borderBottomWidth:1,
    borderColor:"#1761a0"
  },
  headingText:{
    textAlign:"center",
    fontFamily:"Poppins-SemiBold",
    color: '#222222',
    fontSize:responsiveFontSize(2.2),
    paddingHorizontal:15,
    marginTop:responsiveHeight(5)
  },
  messageView:{
    paddingVertical:10,
    paddingHorizontal:15,
    paddingBottom:0,
    maxHeight:150,
    color:"#1761a0"
  },
  messageText:{
    fontWeight:"700",
    fontSize:responsiveFontSize(2.3),
    marginBottom: 15,
    color:"#1761a0"
  },
  spashBottom: {
    width: responsiveWidth(30),
    resizeMode: 'contain',
    position: "absolute",
    bottom: responsiveWidth(15),
  },
  buttonView:{
    borderTopWidth:1,
    borderColor:"#1761a0",
  },
  buttonText:{
    textAlign:"center",
    fontWeight:"700",
    fontSize:responsiveFontSize(3.3),
    paddingTop:8,
    paddingBottom:10,
    color:"#1761a0"
  },

  bottomButtonArea:{
    // backgroundColor:"red",
    width: "100%",
    paddingHorizontal:responsiveWidth(5),
    paddingBottom:responsiveHeight(2),
    paddingTop:responsiveHeight(2)+22,
    // marginVertical: 15,
  },
  applyBtn:{
    backgroundColor:"#ffffff",
    // borderRadius:7,
    alignItems:"center",
    justifyContent:"center",
    padding:responsiveHeight(1.5),
    marginBottom:responsiveHeight(2)
  },
  applyBtnText:{
    fontSize: responsiveFontSize(2),
    color: "#011c38",
    fontFamily: "Poppins-SemiBold",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  solidButtonPrimary:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    borderRadius:8,
    paddingHorizontal:responsiveWidth(4),
    height:responsiveHeight(6.2),
    width:"100%"
  },
  solidButtonPrimaryText:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(1.9),
    color: "#ffffff",
  },
  
});
