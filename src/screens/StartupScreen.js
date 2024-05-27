import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Image, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { StackActions } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth, responsiveFontSize} from "react-native-responsive-dimensions";
import NetInfo from "@react-native-community/netinfo";

import { app } from '../navigation/NavigationContainer';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
import globals from './../config/globals';

const StartupScreen = props => {

  const dispatch = useDispatch();
  const appLoading = useSelector(state => !!state.common.appLoading); 

  useEffect(() => {

    NetInfo.fetch().then(async state => {
      if(state.isConnected) {
        try {
          dispatch(commonActions.getSettings());
          const authUser = await tryLogin();
          if(authUser) { console.log(authUser.is_signup_complete);
            if(authUser.is_signup_complete === false) {
              props.navigation.dispatch(StackActions.replace('AuthNav', {screen: 'SignUpAdditional'}));
            } else {
              props.navigation.dispatch(StackActions.replace('AppNav'));
            }
            
            return;
          } 
        } catch(err) {
          
        }
        await wait();
        if(appLoading) {
          props.navigation.dispatch(StackActions.replace('After'));
          // props.navigation.dispatch(StackActions.replace('AuthNav'));
        } else {
          // props.navigation.dispatch(StackActions.replace('AuthNav'));
          props.navigation.dispatch(StackActions.replace('AppNav'));
        }
      } else {
        props.navigation.dispatch(StackActions.replace('NoInternet')); 
      }
    }, err => {
      props.navigation.dispatch(StackActions.replace('NoInternet'));
    });
    
  }, [dispatch]);

  const tryLogin = () => {

    // props.navigation.dispatch(StackActions.replace('NoInternet'));return;
    return new Promise(async (resolve, reject) => {

      const userData = await AsyncStorage.getItem('userData');

      if (!userData) {
        resolve(false);
        return;
      }
      const transformedData = JSON.parse(userData);
      const { accessToken, user } = transformedData;
  
      if (!accessToken || !user) {
        resolve(false);
        return;
      }
  
      try {
        const authUser = await dispatch(authActions.validateToken(accessToken));
        resolve(authUser);
        return;
      } catch (err) {

      } 
  
      resolve(false);
  
      // const expirationTime = expirationDate.getTime() - new Date().getTime();
  
      // props.navigation.navigate('TutorialNav');
      // props.navigation.navigate('AppNav');
      // dispatch(authActions.authenticate(userId, token, expirationTime));
    });
    
  };

  const wait = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };
  
  return (
    <ImageBackground source={require('../../assets/images/ypa/ypa-slide-6.jpg')} resizeMode='cover' style={styles.screen}>
      <ActivityIndicator style={{position:"absolute",bottom:responsiveHeight(20)}} size="large" color={'#0051ad'} />
    </ImageBackground>
    // <LinearGradient
    //   colors={['#060606', '#000000']}
    //   style={styles.container}
    //   start={{ x: 0, y: 0 }}
    //   end={{ x: 1, y: 1 }}
    // >
    //   <Image style={styles.logo} source={require('../../assets/images/ypa/white-ypa-logo.png')} />
      
    //    <Image style={styles.spashBottom} source={require('../../assets/images/ypa/white-ypa-logo.png')} />
    // </LinearGradient>
  );
};

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo:{
    // height: responsiveHeight(12),
    width: responsiveWidth(50),
    resizeMode: 'contain',
    position:"absolute",
    top: responsiveWidth(30),
  },
  spashBottom:{
    width: responsiveWidth(40),
    resizeMode: 'contain',
    position:"absolute",
    bottom: responsiveHeight(10),
  }
});

export default StartupScreen;
