import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import {  StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight,  Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, TouchableWithoutFeedback } from 'react-native';
import ScaledImage from 'react-native-scalable-image';
import { useScrollToTop } from '@react-navigation/native';
import Swiper from 'react-native-swiper'
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize,} from "react-native-responsive-dimensions";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faChevronRight, faClipboard, faClipboardList, faClock, faCog, faCogs, faCommentAlt, faHeart, faHouseUser, faPlayCircle, faQuestionCircle, faSearch, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
// import Swiper from 'react-native-swiper';
import moment from 'moment';
import Pagination from '../components/Pagination';
import RBSheet from "react-native-raw-bottom-sheet";
import Input from '../ui/Input';
import LinearGradient from 'react-native-linear-gradient';

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

export default AppliedJobs = props => {


  const authUser = useSelector(state => state.auth.user);
  const productCountSheetRef = useRef();

  const goToEditProfile = () => {
    props.navigation.push('ProfileEdit'); 
  };

  const goToProfile = () => {
    props.navigation.push('Profile'); 
  };

  const goToOrders = () => {
    props.navigation.push('OrderList'); 
  };

  const goToWishlist = () => {
    props.navigation.push('Wishlist'); 
  };

  const goToMyAddresses = () => {
    props.navigation.push('MyAddresses'); 
  };

  const goToChangePassword = () => {
    props.navigation.push('ChangePassword'); 
  };

  const goToProductDetails = () => {
    props.navigation.push('ProductDetails'); 
  };
  
  const goToFaq = () => {
    props.navigation.push('FAQ'); 
  };
  
  const goToCustomerCare = () => {
    props.navigation.push('CustomerCare'); 
  };

  const goToSupportChat = () => {
    props.navigation.push('ChatDetail'); 
  };

  const goBack = () => {
    props.navigation.goBack(null);
  };






  return ( 
    <LinearGradient colors={['#ffffff', '#eaf2ff']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
      { authUser && 

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollview} contentContainerStyle={{paddingBottom: 10}}>

        <View style={styles.backHeaderStyle}>
          <TouchableOpacity onPress={() => goBack()}>
            <View style={{ flexDirection: "row", alignItems: "center", height: responsiveHeight(9), paddingHorizontal: responsiveWidth(3),}}>
              <FontAwesomeIcon color={'#ffffff'} size={20} icon={faChevronLeft} />
              <Text style={styles.pageHeading}>Applied Jobs</Text>
            </View>
          </TouchableOpacity>
        </View>

      

        {/* MAIN SEARCH RESULT */}
        <View style={styles.fullSearchArea}>
         
          <View style={styles.singleLesson}>
            <View style={{ }}>
              <Text style={styles.chapterTitle} ellipsizeMode='tail'>Data Business System Analyst – Global</Text>
              <Text style={styles.chapterCount} numberOfLines={1}>Royal Airforce</Text>
              <View style={styles.jobDateWrapper}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesomeIcon color={'#ff244e'} size={14} icon={faClock} />
                  <Text style={styles.jobDateText}>Applied On : 05/01/2022</Text>
                </View>
              </View>
            </View>
            <View>
              <Image style={styles.companyImage} source={require('../../assets/images/ypa/company-1.png')} />
            </View>
          </View>

          <View style={styles.singleLesson}>
            <View style={{ }}>
              <Text style={styles.chapterTitle} ellipsizeMode='tail'>Data Business System Analyst – Global</Text>
              <Text style={styles.chapterCount} numberOfLines={1}>Royal Airforce</Text>
              <View style={styles.jobDateWrapper}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesomeIcon color={'#ff244e'} size={14} icon={faClock} />
                  <Text style={styles.jobDateText}>Applied On : 05/01/2022</Text>
                </View>
              </View>
            </View>
            <View>
              <Image style={styles.companyImage} source={require('../../assets/images/ypa/company-2.png')} />
            </View>
          </View>

        </View>



        {/* NO RESULT */}
        <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(45)}}>
          <Image style={styles.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
          <Text style={styles.noDataTitle}>Nothing found</Text>
        </View>
        
      </ScrollView>

      }

    </LinearGradient>
  );

}

const styles = StyleSheet.create({
  jobDateWrapper: {
    flexDirection: "row",
    marginTop:responsiveHeight(0.8)
  },
  jobDateText: {
    fontSize: responsiveFontSize(1.4),
    color: "#333333",
    fontFamily: "Poppins-Regular",
    marginLeft: responsiveWidth(1.8),
  },
  companyImage:{
    height: responsiveHeight(10),
    width: responsiveHeight(10),
    resizeMode:"contain"
  },
  downloadbtn: {
    backgroundColor: "#2498fd",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal:responsiveHeight(3),
    height: responsiveHeight(5.1),
  },
  downloadbtnText: {
    fontSize: responsiveFontSize(1.8),
    color: "#ffffff",
    fontFamily: "Poppins-Medium",
  },
  singleLesson: {
    backgroundColor: "#ffffff",
    borderWidth:1,
    borderColor:"#f1f1f1",
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between",
    marginBottom:responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(3),
    paddingVertical:responsiveHeight(1) 
  },
  chapterImage: {
    height: responsiveHeight(13.5),
    width: responsiveHeight(17),
    resizeMode: "cover",
  },
  chapterCount: {
    fontSize: responsiveFontSize(1.7),
    color: "#999",
    fontFamily: "Poppins-Regular",
    marginTop:responsiveHeight(0.5),
    width:responsiveWidth(52)
  },
  chapterTitle: {
    fontSize: responsiveFontSize(1.8),
    color: "#333",
    fontFamily: "Poppins-SemiBold",
    width:responsiveWidth(56)
  },
  progressBarBg: {
    backgroundColor: "#e2e2e2",
    height: 2,
    marginTop: responsiveHeight(1.6)
  },
  progressBar: {
    backgroundColor: "#39847b",
    height: 2,
  },
  backHeaderStyle: {
    // backgroundColor: "transparent",
    backgroundColor: "#2498fd",
    height: responsiveHeight(9),
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    position:"absolute",
    top:0,
    width:responsiveWidth(100),
    zIndex:9999

  },
  secondaryPageHeading: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(3),
    color: "#ffffff"
  },
  pageHeading: {
    fontFamily: "Poppins-Bold",
    fontSize: responsiveFontSize(2.4),
    color: "#ffffff",
    position: "relative",
    top: 1,
    marginLeft: responsiveWidth(2)
  },
  parentWrapper:{
    flex:1,
    backgroundColor:"#ffffff",
  },
  scrollview:{
    height: '100%',
  },
  searchContainer:{
    backgroundColor:"#ffffff",
    paddingHorizontal:responsiveWidth(3),
    paddingVertical:1.5,
    borderRadius:6,
    flexDirection:"row",
    flex:1,
    marginLeft:responsiveWidth(1)
  },
  searchInput:{
    fontSize:responsiveScreenFontSize(1.9),
    fontFamily:"Poppins-Regular",
    paddingTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(0.6),
    // backgroundColor:"red",
    width:"85%"
  },
  searchButtonContainer:{
    position:"absolute",
    right:responsiveWidth(2),
    top:responsiveHeight(0.75)
  },
  searchButton:{
    height:responsiveWidth(7.5),
    width:responsiveWidth(7.5),
    resizeMode:"contain",
  },
  searchButtonEmptyContainer:{
    position:"absolute",
    right:responsiveWidth(2),
    top:responsiveHeight(1.3)
  },
  searchEmptyButton:{
    height:responsiveWidth(5.5),
    width:responsiveWidth(5.5),
    resizeMode:"contain",
  },
  backButton:{
    height:responsiveWidth(5),
    width:responsiveWidth(7),
    transform: [{ rotate: '180deg' }],
    marginRight:responsiveWidth(3)
  },




  fullSearchArea:{
    // backgroundColor:"#e7e7e7",
    height:"100%",
    paddingTop: responsiveHeight(11),
    paddingHorizontal:responsiveWidth(3.2)
  },
  singleSearchArea:{
    flexDirection:"row",
    alignItems:"center",
    // backgroundColor:"red",
    paddingHorizontal:responsiveWidth(3),
    height:responsiveHeight(8)
  },
  productImage:{
    width:responsiveWidth(12),
    height:responsiveWidth(12),
    resizeMode:"contain",
    marginRight:responsiveWidth(3.5),
  },
  productImageSmall:{
    width:responsiveWidth(12),
    height:responsiveWidth(5),
    resizeMode:"contain",
    marginRight:responsiveWidth(3.5),
  },
  searchContentContainer:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    width:responsiveWidth(79),
    height:responsiveHeight(8),
    borderBottomWidth:1,
    borderBottomColor:"#e7e7e7",
  },
  searchName:{
    fontSize:responsiveScreenFontSize(1.7),
    fontFamily:"Poppins-Regular",
    color:"#222222"
  },
  searchNameBold:{
    fontSize:responsiveScreenFontSize(1.7),
    fontFamily:"Poppins-Bold",
    color:"#222222"
  },
  searchCategoryName:{
    fontSize:responsiveScreenFontSize(1.3),
    fontFamily:"Poppins-Regular",
    color:"#1444cc"
  },
  topLeftArrowContainer:{
    padding:responsiveWidth(2.5)
  },
  topLeftArrow:{
    height:responsiveWidth(4),
    width:responsiveWidth(4),
    transform: [{ rotate: '-45deg' }],
    marginLeft:responsiveWidth(3)
  },
  // No DATA CSS

  noDataImage:{
    width:responsiveWidth(20),
    resizeMode:"contain"
  },
  noDataTitle:{
    fontFamily:"Poppins-Bold",
    fontSize:responsiveFontSize(2),
    color:"#141517",
    marginTop:responsiveHeight(0)
  },
  noDataSubTitle:{
    fontFamily:"Poppins-Medium",
    fontSize:responsiveFontSize(2),
    color:"#888888",
    textAlign:"center"
  },
  
});
