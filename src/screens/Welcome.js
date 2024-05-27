import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { StackActions } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, } from "react-native-responsive-dimensions";
import LinearGradient from 'react-native-linear-gradient';

import { useSelector, useDispatch } from 'react-redux';

export default Welcome = props => {

  const authUser = useSelector(state => state.auth.user);
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
      goToHomePage();
    }, 500);
  }, []);

  const goToHomePage = () => {
    setTimeout(() => {
      props.navigation.dispatch(StackActions.replace('AppNav'));
    }, 2000);
    
  }


  return (
    <LinearGradient colors={['#ebf1ff', '#ebf1ff']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
      <View style={{ backgroundColor: "transparent", alignItems: "center", justifyContent: "center", marginTop: responsiveHeight(5) }}>
        <View style={{ width: responsiveWidth(70), height: responsiveWidth(70), }}>
          <LottieView source={require('../../assets/images/ypa/welcome-check.json')} autoPlay loop={false} />
        </View>
        <Animated.View style={{ opacity: fadeAnim, marginTop: marginAnim, transform: [{ scale: scaleAnim }] }}>
          <Text style={styles.title}>Hello {authUser.name}</Text>
          <Text style={{ ...styles.title, marginTop: responsiveHeight(2) }}>Get ready to</Text>
          <View style={{top:responsiveHeight(2)}}>
            <Text style={styles.walkthroughTitle}>Discover the </Text>
            <Text style={styles.walkthroughTitle}>right Career Path</Text>
            <Text style={styles.walkthroughTitle}>For You</Text>
          </View>
        </Animated.View>
      </View>
    </LinearGradient>
  );

}

const styles = StyleSheet.create({
  parentWrapper: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollview: {
    height: '100%',
  },
  title: {
    color: "#222222",
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(2.5),
    textAlign: "center"
  },
  boldTitle: {
    color: "#222222",
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2.8),
    textAlign: "center",
  },
  walkthroughTitle: {
    fontSize: responsiveFontSize(3),
    textAlign: "center",
    color: "#222222",
    fontFamily: "Poppins-SemiBold",
    textTransform: 'uppercase',
    lineHeight:responsiveFontSize(3.5)
    // textShadowColor: 'rgba(57, 158, 255, 1)',
    // textShadowOffset: { width: 0, height: 0 },
    // textShadowRadius: 8,
  },
});
