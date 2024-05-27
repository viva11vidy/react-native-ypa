import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, Animated, Dimensions, Modal, Image, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { WebView } from 'react-native-webview';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenWidth} from "react-native-responsive-dimensions";

export default WebPage = props => {


  const uri = props.route.params && props.route.params.uri ? props.route.params.uri : 'https://google.com';
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingProgressAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(loadingProgressAnimatedValue, {
      toValue: loadingProgress,
      duration: 500,
      useNativeDriver: false,
    }).start();

  }, [loadingProgress]);

  const loadingProgressWidth = loadingProgressAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp"
  });

  return (
    <>
      <View style={styles.backHeaderStyle}>
        <View style={{width: responsiveWidth(25)}}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <View style={{ flexDirection: "row", alignItems: "center", height: '100%', paddingHorizontal: responsiveWidth(3) }}>
              <FontAwesomeIcon color={'#ffffff'} size={20} icon={faChevronLeft} />
              <Text style={styles.pageHeading}>Back</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      { isLoading && <View style={styles.progressBar}>
        <Animated.View style={{backgroundColor: "#007fff", width: loadingProgressWidth}}/>
      </View> }
      <WebView
        style={{backgroundColor: "#ebf1ff"}}
        source={{uri: uri}}
        onLoadProgress={({ nativeEvent }) => {
          setLoadingProgress(nativeEvent.progress);
        }}
        onLoadEnd={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setTimeout(() => {
            setIsLoading(nativeEvent.loading);
          }, 500);
          
        }}
      />
    </>

  );
};

const styles = StyleSheet.create({
  progressBar: {
    height: 5,
    flexDirection: "row",
    width: responsiveWidth(100),
    backgroundColor: '#2e80fe',
    position: 'absolute',
    top: responsiveHeight(9) - 5,
  },
  backHeaderStyle: {
   // backgroundColor: "transparent",
    backgroundColor: "#007fff",
    height: responsiveHeight(9),
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth:1,
    borderColor:"#007fff",
  },
  pageHeading: {
    fontFamily: "FuturaLT-Bold",
    fontSize: responsiveFontSize(2.4),
    color: "#ffffff",
    position: "relative",
    top: 1,
    marginLeft: responsiveWidth(2)
  },
});

