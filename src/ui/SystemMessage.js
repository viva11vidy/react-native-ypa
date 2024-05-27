import React, { useEffect } from 'react';
import { Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as commonActions from '../store/actions/common';

let {width} = Dimensions.get('window');

const SystemMessage = props => {

  const message = useSelector(state => state.common.systemMessage);
  const dispatch = useDispatch();
  let springValue = new Animated.Value(100);

  useEffect(() => {
    if(message != '') {
      _spring();
    }
  }, [message]);

  const _spring = () => {
    Animated.sequence([
      Animated.spring(
          springValue,
          {
              toValue: 0,
              // friction: 5,
              duration: 300,
              useNativeDriver: true,
          }
      ),
      Animated.timing(
        springValue,
        {
            toValue: 0,
            duration: 500,
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
      dispatch(commonActions.setSystemMessage(''));
    });
  }

  return (
    <>
      {message ? 
        <Animated.View style={[styles.animatedView, {transform: [{translateY: springValue}]}]}>
          <Text style={styles.messageText}>{message}</Text>
        </Animated.View>
       : <></>}
    </>

  );
};

const styles = StyleSheet.create({
  animatedView: {
    width,
    backgroundColor: "#01284f",
    elevation: 2,
    position: "absolute",
    bottom: 0,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    margin: 0,
  },
  messageText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "FuturaLT-Bold",
  },
});

export default SystemMessage;
