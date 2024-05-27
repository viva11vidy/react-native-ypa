import React, { useState } from 'react';
import {  StyleSheet, Text, View, Animated, Easing  } from 'react-native';
import { responsiveFontSize} from "react-native-responsive-dimensions";

export default Pagination = props => {

  const [spinValue] = useState(new Animated.Value(0));

  Animated.loop(
    Animated.timing(
      spinValue,
      {
       toValue: 1,
       duration: 3000,
       easing: Easing.linear,
       useNativeDriver: true
      }
    )
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.loading}>
      <Text style={styles.loadingText}>Loading</Text>
      <Animated.Image style={{...styles.loadingImage, transform: [{rotate: spin}],}} source={require('../../assets/images/ypa/loading.png')} /> 
    </View>
  );
  
}

const styles = StyleSheet.create({
  loading: {
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    width:"100%",
    marginVertical:20
  },
  loadingText: {
    color:"#222",
    fontSize:responsiveFontSize(1.9),
    fontFamily:"Poppins-Light"
  },
  loadingImage: {
    height:16,
    width:16,
    marginLeft:8 
  },
});
