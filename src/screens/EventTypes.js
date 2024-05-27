import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight, Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, Animated } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize, } from "react-native-responsive-dimensions";
import { Shadow } from 'react-native-shadow-2';
import CheckBox from '@react-native-community/checkbox';
import RadioButton from 'radio-button-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faSearch, faSortAmountDown, faClock, faCalendarDay, faUsers, faLaptop, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import Pagination from '../components/Pagination';
import RBSheet from "react-native-raw-bottom-sheet";
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

import { useSelector, useDispatch } from 'react-redux';
import globals from '../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';

import NotificationListener from '../navigation/NotificationListener';

const SCREEN_WIDTH = Dimensions.get('window').width;


const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) { 
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

export default EventTypesScreen = props => {

  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [marginAnim] = useState(new Animated.Value(responsiveHeight(1.5)));

  React.useEffect(() => {
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: false,
      }).start();
      Animated.timing(marginAnim, {
        toValue: responsiveHeight(0),
        duration: 900,
        useNativeDriver: false,
      }).start();
    }, 1);
  }, []);

  useEffect(() => {

  }, [dispatch]);

  const goBack = () => {
    props.navigation.goBack(null);
  };

  return (
    <LinearGradient colors={['#ebf1ff', '#ebf1ff']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>

      {/* <View style={styles.secondaryHeaderStyle}>
        <Text style={styles.secondaryPageHeading}>Events</Text>
        <View style={{ flexDirection: "row", alignItems: "center", }}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => props.navigation.toggleDrawer()}>
            <FontAwesomeIcon color={'#ffffff'} size={30} icon={faBars} />
          </TouchableOpacity>
        </View>
      </View> */}
      <View style={styles.backHeaderStyle}>
        <TouchableOpacity onPress={() => goBack()}>
          <View style={{ flexDirection: "row", alignItems: "center", height: responsiveHeight(9), paddingHorizontal: responsiveWidth(3),}}>
            <FontAwesomeIcon color={'#ffffff'} size={20} icon={faChevronLeft} />
            <Text style={styles.pageHeading}>Events</Text>
          </View>
        </TouchableOpacity>
      </View>


      <View style={{...styles.stackWrapper,display:"flex"}}>
        
        
        <View style={styles.firstStackWrapper}>
          {/* <Shadow distance={15} startColor={'#00a8ff61'} finalColor={'#004f780a'} offset={[0, 0]}> */}
            <TouchableOpacity style={styles.firstStack} activeOpacity={.6} onPress={() => props.navigation.navigate('EventsScreen')}>
              <View style={{...styles.firstStack,backgroundColor:"transparent"}}>
                <Animated.View style={{...styles.stackIcon, opacity: fadeAnim, top: marginAnim,position:"relative"}}>
                  <FontAwesomeIcon color={'#0065cb'} size={36} icon={faLaptop} />
                </Animated.View>
                <Animated.View style={{opacity: fadeAnim, bottom: marginAnim,position:"relative"}}>
                  <Text style={styles.stackText}>Virtual Events</Text>
                </Animated.View>
              </View>
            </TouchableOpacity> 
          {/* </Shadow> */}
        </View>
        
        
        <View style={styles.secondStackWrapper}>
          {/* <Shadow distance={15} startColor={'#00a8ff61'} finalColor={'#004f780a'} offset={[0, 0]}> */}
            <TouchableOpacity style={styles.secondStack} activeOpacity={.6} onPress={() => props.navigation.navigate('BookEvents')}>
              <View style={{...styles.secondStack,backgroundColor:"transparent"}}>
                <Animated.View style={{...styles.stackIcon, opacity: fadeAnim, top: marginAnim,position:"relative"}}>
                  <FontAwesomeIcon color={'#0065cb'} size={40} icon={faUsers} />
                </Animated.View>
                <Animated.View style={{opacity: fadeAnim, bottom: marginAnim,position:"relative"}}>
                  <Text style={styles.stackText}>In Person Events</Text>
                </Animated.View>
              </View>
            </TouchableOpacity>
          {/* </Shadow> */}
        </View>

        {/* <View style={styles.thirdStackWrapper}>
          <Shadow distance={15} startColor={'#00a8ff61'} finalColor={'#004f780a'} offset={[0, 0]}>
            <TouchableOpacity style={styles.thirdStack} activeOpacity={.6} onPress={() => props.navigation.navigate('EventMediaList')}>
              <View style={{...styles.thirdStack,backgroundColor:"transparent"}}>
                <Animated.View style={{...styles.stackIcon, opacity: fadeAnim, top: marginAnim,position:"relative"}}>
                  <FontAwesomeIcon color={'#ffffff'} size={36} icon={faCalendarDay} />
                </Animated.View>
                <Animated.View style={{opacity: fadeAnim, bottom: marginAnim,position:"relative"}}>
                  <Text style={styles.stackText}>Past Events</Text>
                </Animated.View>
              </View>
            </TouchableOpacity>
          </Shadow>
        </View> */}

      </View>

      {/* <View style={{flex:1,alignItems:"center",justifyContent:"center",display:"none"}}>
        <TouchableOpacity>
          <View style={styles.eventButton}>
            <Text style={styles.eventButtonText}>Click here to view events</Text>
            <FontAwesomeIcon color={'#ffffff'} size={16} icon={faArrowRight} />
          </View>
        </TouchableOpacity>
      </View> */}
      

    </LinearGradient>
  );

}

const styles = StyleSheet.create({

  secondaryHeaderStyle: {
    backgroundColor: "#2e80fe",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(3),
    height: responsiveHeight(9),
  },
  secondaryPageHeading: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(3),
    color: "#ffffff"
  },
  headerIcon: {
    marginHorizontal: responsiveWidth(3.5),
  },
  headerIconRight: {
    marginLeft: responsiveWidth(3.5),
  },
  eventButton: {
    backgroundColor: "#12a795",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: responsiveHeight(1.1),
    height: responsiveHeight(8),
    width:responsiveWidth(90),
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2),

  },
  eventButtonText: {
    fontSize: responsiveFontSize(2.1),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
    marginRight: responsiveWidth(3)
  },
  parentWrapper: {
    flex: 1,
    backgroundColor: "#f0f7ff",
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  stackWrapper:{
    flexDirection:"column",
    flex:1,
    justifyContent:"space-evenly"
  },
  firstStackWrapper : {
    paddingHorizontal:responsiveWidth(5),
    // paddingTop:responsiveWidth(5),
    
  },
  secondStackWrapper : {
    paddingHorizontal:responsiveWidth(5),
    // paddingTop:responsiveWidth(5),
    
  },
  thirdStackWrapper : {
    paddingHorizontal:responsiveWidth(5),
    paddingTop:responsiveWidth(5),
    paddingBottom:responsiveWidth(5),
  },
  firstStack:{
    backgroundColor:"#0065cb",
    alignItems:"center",
    justifyContent:"center",
    borderRadius:10,
    height:responsiveHeight(33),
    width:responsiveWidth(90),

    // elevation:6,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    // shadowRadius: 2,
  },
  secondStack:{
    backgroundColor:"#0065cb",
    alignItems:"center",
    justifyContent:"center",
    // margin:responsiveWidth(5),
    // marginVertical:responsiveWidth(2.5),
    height:responsiveHeight(33),
    width:responsiveWidth(90),
    borderRadius:10
  },
  thirdStack:{
    backgroundColor:"#011c38",
    alignItems:"center",
    justifyContent:"center",
    height:responsiveHeight(24),
    width:responsiveWidth(90),
    // margin:responsiveWidth(5),
    borderRadius:10
  },
  stackIcon:{
    height:responsiveHeight(9),
    width:responsiveHeight(9),
    borderRadius:50,
    backgroundColor:"#ffffff",
    alignItems:"center",
    justifyContent:"center",
    marginBottom:responsiveHeight(1)
  },
  
  stackText:{
    fontSize: responsiveFontSize(2.6),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
  },



  backHeaderStyle: {
    // backgroundColor: "transparent",
    backgroundColor: "#007fff",
    height: responsiveHeight(9),
    // borderBottomWidth:1,
    // borderColor:"#111111",
    elevation: 0,
    shadowOpacity: 0,
    // borderBottomWidth: 0,
    // position:"absolute",
    // top:0,
    width:responsiveWidth(100),
    zIndex:9999

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
