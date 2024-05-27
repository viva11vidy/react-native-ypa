import React, { useEffect } from 'react';
import NetInfo from "@react-native-community/netinfo";

import { navigationRef } from './NavigationService';
import { StackActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import * as commonActions from '../store/actions/common';

export default ConnectionListener = props => {

  const dispatch = useDispatch();
  const isConnected = useSelector(state => !!state.common.isConnected);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Is connected?", state.isConnected);
      console.log("Connection type", state.type);
      console.log("Is internet reachable?", state.isInternetReachable);
      if(state.isConnected === false) {
        navigationRef.current?.dispatch(StackActions.replace('NoInternet'));
      }
      dispatch(commonActions.connectionState(state.isInternetReachable));
      
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return <></>;

};