import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import AppNavigator from './AppNavigator';
import { navigationRef } from './NavigationService';
import { StackActions } from '@react-navigation/native';

import * as commonActions from '../store/actions/common';
import { nativeViewProps } from 'react-native-gesture-handler/lib/typescript/handlers/NativeViewGestureHandler';


export default NavigationContainer = props => {

  const dispatch = useDispatch();
  const isAuth = useSelector(state => !!state.auth.accessToken);
  const isConnected = useSelector(state => !!state.common.isConnected);
  const appLoading = useSelector(state => !!state.common.appLoading);
  const [currentRoute, setCurrentRoute] = useState(navigationRef.current?.getCurrentRoute()); 
  const [rootRoute, setRootRoute] = useState(navigationRef.current?.getRootState()?.routes[0]); 

  useEffect(() => {
    if(appLoading) {
      dispatch(commonActions.setAppLoading(false));
      return;
    }
    // if (!isConnected) {
    //   navigationRef.current?.dispatch(StackActions.replace('NoInternet'));
    //   return;
    // }
    if (!isAuth && isConnected) {
      navigationRef.current?.dispatch(StackActions.replace('AppNav'));
    }

  }, [isAuth]);

  useEffect(() => {
    const unsubscribe = navigationRef.current?.addListener('state', (e) => {
      setCurrentRoute(navigationRef.current?.getCurrentRoute());
      let rootRoutes = navigationRef.current?.getRootState()?.routes;
      if(rootRoutes.length) {
        setRootRoute(rootRoutes[rootRoutes.length - 1]);
      }
      // console.log(navigationRef.current?.getRootState()?.routes);
    });
    return () => {
      unsubscribe();
    }

  }, [dispatch]);

  useEffect(() => {
    if(currentRoute?.name == 'After' || currentRoute?.name == 'FirstScreen') {
      StatusBar.setBarStyle( 'light-content', true);
    } else {
      StatusBar.setBarStyle( 'dark-content', true);
    }

  }, [currentRoute]);
  

  return <SafeAreaView edges={ rootRoute?.name != 'AppNav' ? ['left'] : [] } style={{flex: 1}}><AppNavigator /></SafeAreaView>;
};
