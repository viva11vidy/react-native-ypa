import React, { useState } from 'react';
import { StyleSheet, Image,Text, View, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { responsiveHeight, responsiveWidth, responsiveFontSize,} from "react-native-responsive-dimensions";
import { reportIssue } from '../store/actions/auth';
import Animated from 'react-native-reanimated';

import { useDispatch } from 'react-redux';
import * as commonActions from '../store/actions/common';

export function BottomTabComponent( {state, descriptors, navigation }) {

  const dispatch = useDispatch();

  return(
    // <View style={styles.tabContent}>
    //   <TouchableOpacity onPress={() => navigation.jumpTo ('Wall')}>
    //     <View style={styles.singleTabComponent}>
    //       <Image style={styles.tabIcon} source={require('../../assets/images/tab-1.png')} />
    //     </View>
    //   </TouchableOpacity>
    //   <View style={styles.singleTabComponent}>
    //     <Image style={styles.tabIcon} source={require('../../assets/images/tab-2.png')} />
    //   </View>
    //   <View style={styles.singleTabComponent}>
    //     <Image style={styles.tabIcon} source={require('../../assets/images/tab-3.png')} />
    //   </View>
    //   <View style={styles.singleTabComponent}>
    //     <Image style={styles.tabIcon} source={require('../../assets/images/tab-4.png')} />
    //   </View>
    //   <TouchableOpacity onPress={() => navigation.jumpTo('ProfileScreen')}>
    //     <View style={styles.singleTabComponent}>
    //       <Image style={styles.tabIcon} source={require('../../assets/images/tab-5.png')} />
    //     </View>
    //   </TouchableOpacity>
    // </View>
    <View  style={styles.tabContent}>

      

      {state.routes.map((route, index) => {

      // const opacity = useState(new Animated.Value(0))[0];
      // const fadeIn = () => {
      //   Animated.timing(opacity, {
      //     toValue:1,
      //     duration:1000,
      //     useNativeDriver:true
      //   }).start()
      //   // console.log('hi');
      // };

        const { options } = descriptors[route.key]; 
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if(options.showSignupPopup === true) {
            dispatch(commonActions.setSignupPopup(1));
          } else if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
          >
          {isFocused ?
            <View style={styles.singleTabComponent}>
              <View style={styles.activeTab}>
                <Image style={styles.tabIconActive} source={options.imageActive} />
              </View>
              <Text style={styles.tabText}>{label}</Text>
            </View>
          :
            <View style={styles.singleTabComponent}>
              <Image style={styles.tabIcon} source={options.image} />
            </View>
          }
         
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent:{
    width:responsiveWidth(100),
    height:responsiveWidth(13.5),
    backgroundColor:"#000000",
    alignItems:"center",
    justifyContent:"space-between",
    flexDirection:"row",
    // paddingHorizontal:responsiveWidth(4)
  },
  singleTabComponent:{
    // backgroundColor:"red",
    alignItems:"center",
    width:responsiveWidth(20),
    flexGrow:1,
    alignItems:"center",
    justifyContent:"center"
  },
  activeTab:{
    backgroundColor:"#ffffff",
    height:responsiveWidth(11),
    width:responsiveWidth(11),
    alignItems:"center",
    justifyContent:"center",
    marginTop:-responsiveHeight(3),
    borderRadius:100,
    elevation:7
  },
  tabIconActive:{
    height:responsiveWidth(6),
    width:responsiveWidth(6),
    resizeMode:"contain"
  },
  tabIcon:{
    height:responsiveWidth(6),
    width:responsiveWidth(6),
    resizeMode:"contain"
  },
  tabText:{
    color:"#ffffff",
    fontFamily:"Poppins-Medium",
    fontSize:responsiveFontSize(1.4),
    marginTop:responsiveHeight(0.5)
  }




});