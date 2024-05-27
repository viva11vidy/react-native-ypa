import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { StackActions } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, } from "react-native-responsive-dimensions";
import LinearGradient from 'react-native-linear-gradient';

export default SubscriptionSuccess = props => {

  const [fadeAnim] = useState(new Animated.Value(0));
  const [marginAnim] = useState(new Animated.Value(responsiveWidth(0)));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  React.useEffect(() => {
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }).start();
      Animated.timing(marginAnim, {
        toValue: -responsiveWidth(5),
        duration: 1500,
        useNativeDriver: false,
      }).start();
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }).start();
      goToSubscriptionPage();
    }, 500);
  }, []);

  const goToSubscriptionPage = () => {
    setTimeout(() => {
      props.navigation.push('SubscriptionTaken'); 
    }, 2000);
    
  }


  return (
    <LinearGradient colors={['#000000', '#011c38']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
      <View style={{ backgroundColor: "transparent", alignItems: "center", justifyContent: "center", marginTop: responsiveHeight(15) }}>
        <View style={{ width: responsiveWidth(70), height: responsiveWidth(70), }}>
          <LottieView source={require('../../assets/images/ypa/welcome-check.json')} autoPlay loop={false} />
          {/* <LottieView source={require('../../assets/images/ypa/payment-cancel.json')} autoPlay loop={false} /> */}
        </View>
        <Animated.View style={{ opacity: fadeAnim, marginTop: marginAnim, transform: [{ scale: scaleAnim }] }}>
          <Text style={styles.title}>You have subscribed</Text>
          <Text style={styles.boldTitle}>Successfully</Text>
          {/* <Text style={styles.title}>Payment has been cancelled</Text> */}
        </Animated.View>
      </View>
    </LinearGradient>
  );

}

const styles = StyleSheet.create({
  parentWrapper: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollview: {
    height: '100%',
  },
  title: {
    color: "#ffffff",
    fontFamily: "FuturaLT",
    fontSize: responsiveFontSize(2.5),
    textAlign: "center"
  },
  boldTitle: {
    color: "#ffffff",
    fontFamily: "FuturaLT",
    fontSize: responsiveFontSize(2.5),
    textAlign: "center"
  }
});
