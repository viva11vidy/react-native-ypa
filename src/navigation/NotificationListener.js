import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { firebase } from '@react-native-firebase/messaging';
import { StackActions } from '@react-navigation/native';

import * as authActions from '../store/actions/auth';

export default NotificationListener = props => {

  const dispatch = useDispatch();
  const unreadNotifications = useSelector(state => state.auth.unreadNotifications);



  useEffect(() => {

    /*
    * Triggered when app in foreground
    * */
    const foregroundMessageListener = firebase.messaging().onMessage(remoteMessage => {
      // process data message
      // const { title, body } = remoteMessage.notification;
      // console.log('onMessage', title, body);
      // console.log('onMessage', remoteMessage);
      if (remoteMessage) {
        // const { title, body } = remoteMessage.notification;
        // // console.log('getInitialNotification', title, body, remoteMessage);
        switch(remoteMessage.data.type) {
          case 'talentspot-noti':
          case 'app-exclusive':
            dispatch(authActions.setUnreadNotifications(unreadNotifications+1));
            break;
          // case 'all':
          // case 'notify-user':
          //   dispatch(commonActions.setNotificationMessage(body));
          //   break;
          default:
            break; 
        }
      }
    });
    
    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    const notificationOpenedAppListener = firebase.messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        handleTappedNotification(remoteMessage);
      }
        // const { title, body } = remoteMessage.notification;
        // console.log('onNotificationOpenedApp', title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    firebase.messaging().getInitialNotification().then(remoteMessage => {
      // console.log('getInitialNotification', remoteMessage, remoteMessage.data.type);
      if (remoteMessage) {
        handleTappedNotification(remoteMessage);
      }
    }, err => {
      console.log(err);
    });

    return () => {
      foregroundMessageListener();
      // backgroundMessageListener();
      notificationOpenedAppListener();
    };
  });

  const handleTappedNotification = remoteMessage => {
    const { title, body } = remoteMessage.notification;
    switch(remoteMessage.data.type) {
      case 'talentspot-noti':
        goToNotification(remoteMessage.data);
        break;
      case 'app-exclusive':
        props.navigation.navigate('NotificationDetail', { notification: {notification: body}});
        break;
      default:
        break; 
    }
  };


  const goToNotification = (notification) => { 
    try {
      if(notification.dependent) {
        let dependent = JSON.parse(notification.dependent);
        if(dependent.entity == 'Job') {
          if(props.navigation.canGoBack()) {
            props.navigation.dispatch(StackActions.pop(1));
          }
          props.navigation.navigate('OpportunityDetails', {job: {_id: dependent._id}});
        }
        if(dependent.entity == 'Event') {
          if(props.navigation.canGoBack()) {
            props.navigation.dispatch(StackActions.pop(1));
          }
          props.navigation.navigate('EventDetails', {event: {_id: dependent._id}});
        }
        if(dependent.entity == 'Talentspot') {
          if(props.navigation.canGoBack()) {
            props.navigation.dispatch(StackActions.pop(1));
          }
          props.navigation.navigate('NotificationDetail', { notification: {_id: dependent._id} });
        }
      } else if(notification.notitype == 'app-exclusive') {
        if(props.navigation.canGoBack()) {
          props.navigation.dispatch(StackActions.pop(1));
        }
        props.navigation.navigate('NotificationDetail', { notification: notification });
      }
    } catch(err) {}

  };

  return <></>;

};