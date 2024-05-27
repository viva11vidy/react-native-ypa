import React from 'react';
import { StyleSheet, Image,Text, View } from 'react-native';



export default function Header() {
  return(
    <View style={styles.header}>
      <View>
        <Text>asas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header:{
    width:"100%",
    height:"100%",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center"
  }
});