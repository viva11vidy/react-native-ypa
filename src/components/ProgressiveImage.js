import React from 'react';
import { View, StyleSheet, Animated, Image, Text } from 'react-native';

export default ProgressiveImage = props => {

  const { thumbnailSource, source, style } = props;
  const thumbnailAnimated = new Animated.Value(0);
  const imageAnimated = new Animated.Value(0);

  const handleThumbnailLoad = () => {
    Animated.timing(thumbnailAnimated, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true
    }).start();
  };

  const onImageLoad = () => {
    Animated.timing(imageAnimated, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true
    }).start();
  };

  return(

    <View style={[styles.container, { height: style.height ? style.height : "100%", width: style.width ? style.width : "100%"}]}>
      
      <Animated.Image 
        {...props} 
        source={thumbnailSource} 
        style={[style, { opacity: thumbnailAnimated }]} 
        onLoad={handleThumbnailLoad}
        blurRadius={1} 
      />
      <Animated.Image 
        {...props} 
        source={source} 
        style={[styles.imageOverlay, { opacity: imageAnimated }, style]}
        onLoad={onImageLoad}
      />
    </View>

  );


};

const styles = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: '#D2ECFF',
    alignContent: "flex-end",
    alignSelf: "flex-end",
    alignItems: "flex-end"
  },
});

