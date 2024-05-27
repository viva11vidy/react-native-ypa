import React from 'react';
import { StyleSheet, Image } from 'react-native';

class CustomMarker extends React.Component {
  render() {
    return (
      <Image
        style={styles.image}
        source={
          this.props.pressed ? require('../../assets/images/ruby.png') : require('../../assets/images/ruby.png')
        }
        resizeMode="contain"
      />
    );
  }
}

const styles = StyleSheet.create({
  image: {
    height: 31,
    width: 31,
    marginTop: 2
  },
});

export default CustomMarker;