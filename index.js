/**
 * @format
 */

 import React from 'react';
 import {AppRegistry} from 'react-native';
 import App from './App';
 import {name as appName} from './app.json';
 import { firebase } from '@react-native-firebase/messaging';
 
 /*
 * Triggered when app in background
 * */
 firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
   // const { title, body } = remoteMessage.notification;
   // console.log('setBackgroundMessageHandler', title, body, typeof remoteMessage.data, remoteMessage.data);
 });
 
 function HeadlessCheck({ isHeadless }) {
     if (isHeadless) {
       // App has been launched in the background by iOS, ignore
       return null;
     }
   
     return <App />;
 }
 
 AppRegistry.registerComponent(appName, () => HeadlessCheck);
