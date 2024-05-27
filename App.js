import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Animated, BackHandler, SafeAreaView, View, Text, TouchableOpacity, Dimensions, Easing, Platform, StatusBar } from 'react-native';

import { firebase } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import LinearGradient from 'react-native-linear-gradient';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import globals from './src/config/globals';
import commonReducer from './src/store/reducers/common';
import authReducer from './src/store/reducers/auth';

import NavigationContainer from './src/navigation/NavigationContainer';
import SystemMessage from './src/ui/SystemMessage';
import { navigationRef } from './src/navigation/NavigationService';

import ConnectionListener from './src/navigation/ConnectionListener';

const rootReducer = combineReducers({
  common: commonReducer,
  auth: authReducer,
});

// const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(ReduxThunk)));
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default App = props => {
  
  const [backClickCount, setBackClickCount] = useState(0);
  
  const springValue = useMemo(() => new Animated.Value(100), []);

  useEffect(() => {

    StatusBar.setBarStyle( 'light-content', true);
    StatusBar.setBackgroundColor("#000000");
    StatusBar.setTranslucent(false);
    
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    // firebase.initializeApp();
    checkPermission();

    GoogleSignin.configure({
      webClientId: '239101420326-mjop55sdu0742gaiohvujqr51pcn8ncu.apps.googleusercontent.com',
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  });

  const _spring = () => {
    setBackClickCount(1);
    Animated.sequence([
      Animated.spring(
          springValue,
          {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
          }
      ),
      Animated.timing(
          springValue,
          {
              toValue: 100,
              duration: 300,
              useNativeDriver: true,
          }
      ),
    ]).start(() => {
      setBackClickCount(0);
    });
  }


  const handleBackButton = () => {
    if(navigationRef.current?.canGoBack()) {
      navigationRef.current?.goBack();
    } else {
      backClickCount == 1 ? BackHandler.exitApp() : _spring();
    }
    return true;
  };

  const checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled == 1) {
        getToken();
    } else {
        requestPermission();
    }
  };
    
  const requestPermission = async () => {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  };

  const getToken = async () => {
    await firebase.messaging().registerDeviceForRemoteMessages();
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
          // user has a device token
          await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  };

  return <LinearGradient colors={['#11bcfc', '#0051ad']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
  
   
  
    <SafeAreaView style={styles.container}>
      <Provider store={store}>
        <NavigationContainer />
        <SystemMessage />
        <ConnectionListener />
      </Provider>
      
      <Animated.View style={[styles.animatedView, {transform: [{translateY: springValue}]}]}>
      
          <Text style={styles.exitTitleText}>Press back again to close the app</Text>

          <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => BackHandler.exitApp()}
          >
              <Text style={styles.exitText}>Close</Text>
          </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  
  </LinearGradient>
  ;

}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  animatedView:{
    width: '100%',
    backgroundColor: "#0051ad",
    elevation: 2,
    position: "absolute",
    bottom: 0,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    margin: 0,
  },
  exitTitleText:{
      textAlign: "center",
      color: "#fff",
      marginRight: 10,
      fontFamily: "Poppins-Light",
  },
  exitText:{
      color: "#e5933a",
      paddingHorizontal: 10,
      paddingVertical: 3,
      fontFamily: "Poppins-SemiBold",
  }
});



