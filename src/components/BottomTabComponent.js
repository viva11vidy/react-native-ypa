import React, { useState } from 'react';
import { StyleSheet, Image,Text, View, TouchableOpacity, Animated  } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { responsiveHeight, responsiveWidth, responsiveFontSize,} from "react-native-responsive-dimensions";
import { reportIssue } from '../store/actions/auth';
// import Animated from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';
import { useDispatch } from 'react-redux';
import * as commonActions from '../store/actions/common';

export function BottomTabComponent( {state, descriptors, navigation }) {

  const dispatch = useDispatch();

  const [fadeAnim] = useState(new Animated.Value(0));
  const [marginAnim] = useState(new Animated.Value(responsiveHeight(1)));

  React.useEffect(() => {
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
      Animated.timing(marginAnim, {
        toValue: -responsiveHeight(0),
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, 1);
  }, []);



  return false;  //remove this to bring back bottom bar


  return (
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
    
    <Shadow distance={25} startColor={'#00000020'} endColor={'transparent'} offset={[0, 2]}>
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

            fadeAnim.setValue(0);
            marginAnim.setValue(responsiveHeight(1));

            setTimeout(() => {
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false,
              }).start();
              Animated.timing(marginAnim, {
                toValue: -responsiveHeight(0),
                duration: 1000,
                useNativeDriver: false,
              }).start();
            }, 0);

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
                {/* <View style={styles.activeTab}> */}
                  <Image style={styles.tabIconActive} source={options.imageActive} />
                {/* </View> */}
                {/* <Animated.View style={{ opacity: fadeAnim, marginTop: marginAnim,position:"relative"}}> */}
                  <Text style={styles.tabTextActive}>{label}</Text>
                {/* </Animated.View> */}
              </View>
              
            :
              <View style={styles.singleTabComponent}>
                <Image style={styles.tabIcon} source={options.image} />
                  <Text style={styles.tabText}>{label}</Text>
              </View>
            }
          
            </TouchableOpacity>
          );
        })}
      </View>
    </Shadow>
  );
}

const styles = StyleSheet.create({
  tabContent:{
    width:responsiveWidth(100),
    height:responsiveWidth(16),
    backgroundColor:"#007fff",
    alignItems:"center",
    justifyContent:"space-between",
    flexDirection:"row",
    borderTopColor:'rgba(255, 255, 255, 0.10)',
    borderTopWidth:1,

    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 15,
    // elevation:1
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
    height:responsiveWidth(7.5),
    width:responsiveWidth(7.5),
    resizeMode:"contain",
    // backgroundColor:"red"
  },
  tabIcon:{
    height:responsiveWidth(7.5),
    width:responsiveWidth(7.5),
    resizeMode:"contain",
    // backgroundColor:"red"
  },
  tabText:{
    // color:"#747474",
    color:"#ffffff",
    fontFamily:"FuturaLT-Book",
    fontSize:responsiveFontSize(1.4),
    marginTop:responsiveHeight(0.5),
    opacity:0.4
  },
  tabTextActive:{
    color:"#ffffff",
    fontFamily:"FuturaLT-Book",
    fontSize:responsiveFontSize(1.4),
    marginTop:responsiveHeight(0.5)
  }




});