import React, { useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { BlurView } from "@react-native-community/blur";

import { useSelector, useDispatch } from 'react-redux';
import * as commonActions from '../store/actions/common';

let {width} = Dimensions.get('window');

const NotificationMessage = props => {

  const message = useSelector(state => state.common.notificationMessage);
  const dispatch = useDispatch();

  const closeNotificationPopup = () => {
    dispatch(commonActions.setNotificationMessage(''));
  }
  

  return (
    <>
      { message ? 
        <View style={styles.fullScreenBG}>
          <BlurView style={styles.fullScreenBG} blurType="light" blurAmount={5} reducedTransparencyFallbackColor="white" />
          <View style={styles.popupContainer}>
            <View style={styles.headingView}>
              <Text style={styles.headingText}>Message From Pricewall</Text>
            </View>
            <ScrollView style={styles.messageView}>
              <Text style={styles.messageText}>{message}</Text>
            </ScrollView>
            <TouchableOpacity onPress={() => closeNotificationPopup()}underlayColor='#fff'>
            <View style={styles.buttonView}>
              <Text style={styles.buttonText}>Tap to Continue</Text>
            </View>
            </TouchableOpacity>
          </View>
        </View>
      : <></> }
    </>

  );
};

const styles = StyleSheet.create({
  animatedView: {
    width,
    backgroundColor: "#0a5386",
    elevation: 2,
    position: "absolute",
    bottom: 0,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    margin: 0,
  },
  fullScreenBG:{
    position: "absolute", top: 0, bottom: 0, left: 0, right: 0,
    alignItems:"center",
    justifyContent:"center",
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
    fontWeight:"700",
    fontSize:responsiveFontSize(2.6),
    paddingVertical:8,
    paddingHorizontal:15,
    color:"#1761a0"
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
});

export default NotificationMessage;
