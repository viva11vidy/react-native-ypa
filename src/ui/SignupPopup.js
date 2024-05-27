import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Dimensions, Image,TouchableHighlight,Keyboard } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { BlurView } from "@react-native-community/blur";

import { useSelector, useDispatch } from 'react-redux';
import * as commonActions from '../store/actions/common';
import { navigationRef } from '../navigation/NavigationService';
import { StackActions } from '@react-navigation/native';

let {width} = Dimensions.get('window');

const SignupPopup = props => {
  
  const signupPopup = useSelector(state => state.common.signupPopup);
  const authUser = useSelector(state => state.auth.user);
  const [isWelcomeSignupPopupShowed, setWelcomeSignupPopupShowed] = useState(false); 
  console.log('signupPopup', signupPopup);

  const dispatch = useDispatch();

  useEffect(() => {
    if(!authUser) {
      if(signupPopup) {
        Keyboard.dismiss();
      }
    } else {
      closeNotificationPopup();
    }
    
  }, [signupPopup]);

  const closeNotificationPopup = () => {
    dispatch(commonActions.setSignupPopup(0));
    if(signupPopup == -1) {
      setWelcomeSignupPopupShowed(true);
    }
  }
  const goToRegister = () => {
    navigationRef.current?.dispatch(StackActions.replace('AuthNav'));
  }
  

  return (
    <>
      { !authUser && (signupPopup == 1 || (signupPopup == -1 && !isWelcomeSignupPopupShowed)) ? 
        <View style={styles.fullScreenBG}>
          <BlurView style={styles.fullScreenBG} blurType="light" blurAmount={5} reducedTransparencyFallbackColor="white" />

          <View style={styles.modalView}>
              {/* <Text style={styles.modalTextMain}>Update Location ?</Text> */}
              
              
              <Image style={styles.modalLocationUpdate} source={require('../../assets/images/force-login.png')} />

              { signupPopup == -1 && <Text style={styles.modalTextSub}>Dear users, Thanks for downloading the Pricewall app, Please signup as a seller or buyer to explore more products and deals at nearby shops or anywhere you wish to set your location for shopping.</Text> }
              
              { signupPopup == 1 && <Text style={styles.modalTextSub}>Please login to access this feature.</Text> }

              <View style={{flexDirection:"row",alignItems:"center"}}>
                <TouchableHighlight underlayColor="#e5e5e5" style={{ ...styles.openButton, backgroundColor: "transparent" }} onPress={() => {closeNotificationPopup();}}>
                  <Text style={styles.textStyleCancel}>Cancel</Text>
                </TouchableHighlight>
                <TouchableHighlight style={{ ...styles.openButton, backgroundColor: "#2196F3", }} onPress={() => {closeNotificationPopup();goToRegister();}}>
                  <Text style={styles.textStyle}>Go to Signup / Login</Text>
                </TouchableHighlight>
              </View>


            </View>




          
            
        </View>
      : <></> }
    </>

  );
};

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: responsiveWidth(4),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width:responsiveWidth(80)
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 10,
    paddingVertical: responsiveWidth(1.4),
    paddingHorizontal: responsiveWidth(4),
    // elevation: 2,
    marginHorizontal:responsiveWidth(2)
  },
  textStyleCancel:{
    fontFamily:"Poppins-Medium",
    fontSize:responsiveFontSize(1.9),
    color:"#888888",
    textAlign: "center"
  },
  textStyle: {
    fontFamily:"Poppins-Medium",
    fontSize:responsiveFontSize(1.9),
    color:"#ffffff",
    textAlign: "center"
  },
  modalTextMain: {
    fontFamily:"Poppins-SemiBold",
    fontSize:responsiveFontSize(2),
    color:"#333"
  },
  modalTextSub: {
    fontFamily:"Poppins-Medium",
    fontSize:responsiveFontSize(1.9),
    color:"#666666",
    marginVertical: responsiveHeight(1.8),
    textAlign: "center"
  },
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

export default SignupPopup;
