import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import {  StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight,  Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, TouchableWithoutFeedback, Animated } from 'react-native';
import ScaledImage from 'react-native-scalable-image';
import { useScrollToTop } from '@react-navigation/native';
import Swiper from 'react-native-swiper'
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize,} from "react-native-responsive-dimensions";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faCalendarCheck, faChevronLeft, faChevronRight, faClipboard, faClipboardList, faCog, faCogs, faCommentAlt, faHeart, faHouseUser, faPlay, faPlayCircle, faQuestionCircle, faSearch, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
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
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

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

export default SubscriptionNotTaken = props => {


  const authUser = useSelector(state => state.auth.user);
  const productCountSheetRef = useRef();
  const [applyPopup, setApplyPopup] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const [planActive, setPlanActive] = useState('1');


  

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

  const goToSubscriptionSuccess = () => {
    props.navigation.push('SubscriptionSuccess'); 
  };

  const goBack = () => {
    props.navigation.goBack(null);
  };


  




  return ( 
    <LinearGradient colors={['#000000', '#011c38']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
     



      <View style={styles.backHeaderStyle}>
        <TouchableOpacity onPress={() => goBack()}>
          <View style={{ flexDirection: "row", alignItems: "center", height: responsiveHeight(9), paddingHorizontal: responsiveWidth(3),}}>
            <FontAwesomeIcon color={'#ffffff'} size={20} icon={faChevronLeft} />
            <Text style={styles.pageHeading}>Subscription</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollview} contentContainerStyle={{paddingBottom: 10,paddingTop:responsiveHeight(3)}}>


        {/* Expired Subscription */}
        <View style={styles.expired}>
          <Text style={styles.expiredText}>Your subscription is expired on {moment(authUser.created).format("MMM DD, YYYY")} Please select a plan to continue</Text>
        </View>

        

        <View style={styles.fullSearchArea}>
      
          <View style={{marginBottom:responsiveHeight(1.5),marginLeft:responsiveWidth(1.5)}}>
            <Text style={styles.subsTitle}>What will you get ?</Text>
          </View>


          <View style={styles.singleLesson}>
            <View style={styles.leftArea}>
              <FontAwesomeIcon color={'#2498fd'} size={20} icon={faCalendar} />
            </View>
            <View style={{ flex:1 }}>
              <Text style={styles.chapterCount} numberOfLines={1}>Access to event calendar</Text>
            </View>
          </View>

          <View style={styles.singleLesson}>
          <View style={styles.leftArea}>
              <FontAwesomeIcon color={'#2498fd'} size={20} icon={faCalendarCheck} />
            </View>
            <View style={{ flex:1 }}>
              <Text style={styles.chapterCount} numberOfLines={1}>Book an exclusive event</Text>
            </View>
          </View>

          <View style={styles.singleLesson}>
            <View style={styles.leftArea}>
              <FontAwesomeIcon color={'#2498fd'} size={20} icon={faPlayCircle} />
            </View>
            <View style={{ flex:1 }}>
              <Text style={styles.chapterCount} numberOfLines={1}>Access to past event medias</Text>
            </View>
          </View>


          <View style={{marginBottom:responsiveHeight(1.5),marginLeft:responsiveWidth(1.5),marginTop:responsiveHeight(2)}}>
            <Text style={styles.subsTitle}>Select a subscription plan</Text>
          </View>
          

          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"}}>
            
            <TouchableOpacity onPress={() => setPlanActive('1')}>
              <View style={[planActive == '1' ? styles.singleLesson2Active :styles.singleLesson2]}>
                <View style={[planActive == '1' ? styles.planNameWrapperActive : styles.planNameWrapper]}>
                  <Text style={[planActive == '1' ? styles.planNameActive : styles.planName]}>Broze Plan</Text>
                </View>
                <View>
                  <Image style={styles.subsImage2} source={require('../../assets/images/ypa/bronze-image.png')} />
                </View>
                <View style={{alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(0.4)}}>
                  <Text style={styles.chapterCount2} numberOfLines={1}>30 Days</Text>
                  <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                    <View style={{marginRight:5}}>
                      <Text style={styles.price}>£12</Text>
                    </View>
                    <Text style={styles.discountPrice}>£15</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPlanActive('2')}>
              <View style={[planActive == '2' ? styles.singleLesson2Active :styles.singleLesson2]}>
                <View style={[planActive == '2' ? styles.planNameWrapperActive : styles.planNameWrapper]}>
                  <Text style={[planActive == '2' ? styles.planNameActive : styles.planName]}>Silver Plan</Text>
                </View>
                <View>
                  <Image style={styles.subsImage2} source={require('../../assets/images/ypa/silver-image.png')} />
                </View>
                <View style={{alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(0.4)}}>
                  <Text style={styles.chapterCount2} numberOfLines={1}>60 Days</Text>
                  <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                    <View style={{marginRight:5}}>
                      <Text style={styles.price}>£15</Text>
                    </View>
                    <Text style={styles.discountPrice}>£18</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPlanActive('3')}>
              <View style={[planActive == '3' ? styles.singleLesson2Active :styles.singleLesson2]}>
                <View style={[planActive == '3' ? styles.planNameWrapperActive : styles.planNameWrapper]}>
                  <Text style={[planActive == '3' ? styles.planNameActive : styles.planName]}>Gold Plan</Text>
                </View>
                <View>
                  <Image style={styles.subsImage2} source={require('../../assets/images/ypa/gold-image.png')} />
                </View>
                <View style={{alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(0.4)}}>
                  <Text style={styles.chapterCount2} numberOfLines={1}>180 Days</Text>
                  <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                    <View style={{marginRight:5}}>
                      <Text style={styles.price}>£18</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPlanActive('4')}>
              <View style={[planActive == '4' ? styles.singleLesson2Active :styles.singleLesson2]}>
                <View style={[planActive == '4' ? styles.planNameWrapperActive : styles.planNameWrapper]}>
                  <Text style={[planActive == '4' ? styles.planNameActive : styles.planName]}>Diamond Plan</Text>
                </View>
                <View>
                  <Image style={styles.subsImage2} source={require('../../assets/images/ypa/silver-image.png')} />
                </View>
                <View style={{alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(0.4)}}>
                  <Text style={styles.chapterCount2} numberOfLines={1}>365 Days</Text>
                  <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                    <View style={{marginRight:5}}>
                      <Text style={styles.price}>£22</Text>
                    </View>
                    <Text style={styles.discountPrice}>£30</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            
          </View>

          <View style={styles.gryBG}>
            <Text style={styles.gryBGText}>Membership ends on Apr 18, 2022. This membership will auto renew. You can turn off auto-renew after that</Text>
          </View>
            
          
        </View>

        
      </ScrollView>


      <View style={styles.bottomArea}>
        <View>
          <Text style={styles.priceText}>Total Cost</Text>
          <View style={{flexDirection:"row",alignItems:"center",marginTop:responsiveHeight(1.5),marginBottom:responsiveHeight(0.4)}}>
            <Text style={styles.price2}>$12 </Text>
            <Text style={styles.priceSub2}> for 30 days</Text>
          </View>
        </View>

        <View>
          <TouchableOpacity onPress={() => goToSubscriptionSuccess()}>
            <View style={styles.downloadbtn}>
              <Text style={styles.downloadbtnText}>Select Plan</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

     

    </LinearGradient>
  );

}

const styles = StyleSheet.create({
  priceText:{
    fontSize: responsiveFontSize(2),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
    marginBottom:-responsiveHeight(1)
  },
  price2:{
    fontSize: responsiveFontSize(3.5),
    color: "#2498fd",
    fontFamily: "FuturaLT-Bold",
  },
  priceSub2:{
    fontSize: responsiveFontSize(1.8),
    color: "#888",
    fontFamily: "FuturaLT",
  },
  bottomArea:{
    backgroundColor:"#011c38",
    elevation:5,
    flexDirection:"row",
    alignItems:"center",
    borderTopColor:"#013b75",
    borderTopWidth:0,
    justifyContent:"space-between",
    paddingHorizontal:responsiveWidth(3.4),
    paddingTop:responsiveWidth(2),
    paddingBottom:responsiveWidth(0.8),

  },
  gryBG:{
    backgroundColor:"transparent",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    paddingVertical:responsiveHeight(1),
    paddingHorizontal:responsiveWidth(3.5)
  },
  gryBGText:{
    fontSize: responsiveFontSize(1.5),
    color: "#ffffff",
    fontFamily: "FuturaLT",
    textAlign:"center",
    opacity:0.6
  },
  gryBGTextBold:{
    fontSize: responsiveFontSize(1.8),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
  },
  planNameWrapper:{
    paddingHorizontal: responsiveWidth(3.5),
    borderBottomWidth:1,
    borderColor:"#013b75",
    width:"100%",
    paddingBottom:responsiveHeight(0.4),
    marginBottom:responsiveHeight(1.5),
    paddingTop:responsiveHeight(0.6), 
  },
  planNameWrapperActive :{
    paddingHorizontal: responsiveWidth(3.5),
    borderBottomWidth:1,
    borderColor:"#ed2065",
    backgroundColor:"#ed2065",
    width:"100%",
    paddingBottom:responsiveHeight(0.4),
    marginBottom:responsiveHeight(1.5),
    paddingTop:responsiveHeight(0.6), 
  },
  planName:{
    fontSize: responsiveFontSize(1.5),
    color: "#ffffff",
    fontFamily: "FuturaLT",
    textAlign:"center"
  },
  planNameActive:{
    fontSize: responsiveFontSize(1.5),
    color: "#ffffff",
    fontFamily: "FuturaLT",
    textAlign:"center"
  },
  price:{
    fontSize: responsiveFontSize(2.4),
    color: "#ffffff",
    fontFamily: "FuturaLT-Bold",
  },
  discountPrice:{
    fontSize: responsiveFontSize(2.4),
    color: "#999999",
    fontFamily: "FuturaLT",
    textDecorationLine: 'line-through', 
    textDecorationStyle: 'solid'
  },
  leftArea: {
    backgroundColor: "#013b75",
    height: responsiveWidth(8.5),
    width: responsiveWidth(8.5),
    alignItems:"center",
    justifyContent:"center",
    borderRadius: 50,
    marginRight: responsiveWidth(4),
  },
  expired:{
    backgroundColor:"#f8d7da",
    borderWidth:1,
    borderColor:"#f5c6cb",
    paddingVertical:responsiveHeight(1),
    paddingHorizontal:responsiveWidth(5),
    margin:responsiveWidth(3.2),
    borderRadius:10
  },
  expiredText:{
    color:"#721c24",
    fontSize: responsiveFontSize(1.8),
    fontFamily: "FuturaLT",
    textAlign:"center"
  },
  topArea:{
    backgroundColor: "#2498fd",
    height: responsiveHeight(19),
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20
  },
  headerContentWrapper:{
    paddingTop:responsiveHeight(3),
    paddingHorizontal:responsiveWidth(3.5),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start"
  },
  profileBg:{
    height:responsiveHeight(12),
    width:responsiveHeight(12),
    resizeMode:"cover",
    borderRadius:100,
    borderWidth:3,
    borderColor:"#ffffff",
    marginBottom:responsiveHeight(2),
    marginRight:responsiveWidth(4)
    // elevation:10
  },
  profileTitle:{
    fontSize: responsiveFontSize(2.4),
    color: "#ffffff",
    fontFamily: "FuturaLT-Bold",
  },
  profileAge:{
    fontSize: responsiveFontSize(2.2),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
    marginVertical:responsiveHeight(0.1),
    opacity:1
  },
  profileJoining:{
    fontSize: responsiveFontSize(1.9),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
    opacity:0.9
  },
  profileJoining2:{
    fontSize: responsiveFontSize(1.7),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
    opacity:0.6
  },
 
  downloadbtn: {
    backgroundColor: "#ffffff",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal:responsiveHeight(1.5),
    height: responsiveHeight(5.1),
  },
  downloadbtnText: {
    fontSize: responsiveFontSize(1.8),
    color: "#011c38",
    fontFamily: "FuturaLT-Bold",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  singleLesson: {
    backgroundColor: "#011c38",
    borderWidth:1,
    borderColor:"#013b75",
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"flex-start",
    marginBottom:responsiveHeight(1),
    paddingHorizontal: responsiveWidth(3.5),
    paddingVertical:responsiveHeight(1.3) 
  },
  singleLesson2 :{
    width:responsiveWidth(45.6),
    backgroundColor: "#011c38",
    borderWidth:1,
    borderColor:"#013b75",
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "column",
    alignItems: "center",
    justifyContent:"center",
    marginBottom:responsiveHeight(1),
    paddingBottom:responsiveHeight(0.7) 
  },
  singleLesson2Active:{
    width:responsiveWidth(45.6),
    backgroundColor: "#013b75",
    borderWidth:1,
    borderColor:"#ed2065",
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "column",
    alignItems: "center",
    justifyContent:"center",
    marginBottom:responsiveHeight(1),
    paddingBottom:responsiveHeight(0.7) 
  },
  subsImage:{
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    resizeMode: "contain",
  },
  subsImage2:{
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    resizeMode: "contain",
  },
  chapterImage: {
    height: responsiveHeight(13.5),
    width: responsiveHeight(17),
    resizeMode: "cover",
  },
  chapterCount2: {
    fontSize: responsiveFontSize(1.5),
    color: "#999",
    fontFamily: "FuturaLT",
    marginTop:responsiveHeight(0.6),
  },
  chapterTitle2: {
    fontSize: responsiveFontSize(1.8),
    color: "#333",
    fontFamily: "FuturaLT-Bold",
    textAlign:"center"
  },
  chapterCount: {
    fontSize: responsiveFontSize(1.7),
    color: "#ffffff",
    fontFamily: "FuturaLT",
    marginTop:responsiveHeight(0.6),
    width:responsiveWidth(52)
  },
  chapterTitle: {
    fontSize: responsiveFontSize(1.8),
    color: "#333",
    fontFamily: "FuturaLT-Bold",
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
    backgroundColor: "#000000",
    height: responsiveHeight(9),
    borderBottomWidth:1,
    borderColor:"#111111",
    elevation: 0,
    shadowOpacity: 0,
    position:"absolute",
    top:0,
    width:responsiveWidth(100),
    zIndex:9999

  },
  secondaryPageHeading: {
    fontFamily: "FuturaLT-Bold",
    fontSize: responsiveFontSize(3),
    color: "#ffffff"
  },
  pageHeading: {
    fontFamily: "FuturaLT-Bold",
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
    paddingTop: responsiveHeight(7),
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
    fontFamily:"FuturaLT",
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
    paddingTop: responsiveHeight(2),
    paddingHorizontal:responsiveWidth(3.2),
    paddingBottom:responsiveHeight(8)
  },
  subsTitle:{
    fontSize:responsiveScreenFontSize(1.9),
    fontFamily:"FuturaLT-Bold",
    color:"#ffffff"
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
    fontFamily:"FuturaLT",
    color:"#222222"
  },
  searchNameBold:{
    fontSize:responsiveScreenFontSize(1.7),
    fontFamily:"FuturaLT-Bold",
    color:"#222222"
  },
  searchCategoryName:{
    fontSize:responsiveScreenFontSize(1.3),
    fontFamily:"FuturaLT",
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
    fontFamily:"FuturaLT-Bold",
    fontSize:responsiveFontSize(2),
    color:"#141517",
    marginTop:responsiveHeight(0)
  },
  noDataSubTitle:{
    fontFamily:"FuturaLT-Book",
    fontSize:responsiveFontSize(2),
    color:"#888888",
    textAlign:"center"
  },



  
  // POPUP
  applyPopup:{
    position:"absolute",
    top:0,
    bottom:0,
    right:0,
    left:0,
    zIndex:99999,
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems:"center",
    justifyContent:"center",
    padding:responsiveWidth(9)
  },


  mainAreaPopup:{
    backgroundColor:"#011c38",
    alignItems:"center",
    justifyContent:"center",
    position:"relative",
    padding:responsiveWidth(4),
    borderRadius:10,
    paddingTop:responsiveHeight(5.5),
  },
  popupImageWrapper:{
    backgroundColor:"#011c38",
    position:"absolute",
    top:-responsiveHeight(5),
    padding:responsiveHeight(1.6),
    borderRadius:50
  },
  popupImage:{
    height:responsiveHeight(5.5),
    width:responsiveHeight(5.5),
    resizeMode:"contain"
  },
  mainTitleWrapper:{
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center",
    justifyContent:"center"
  },
  mainTitlePopup:{
    fontFamily: "FuturaLT-Book",
    textAlign:"center",
    fontSize:responsiveFontSize(1.8),
    color:"#ffffff"
  },
  mainTitlePopupBold:{
    fontFamily: "FuturaLT-Bold",
    textAlign:"center",
    fontSize:responsiveFontSize(2.2)
  },
  popupBtnWraper:{
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center",
    justifyContent:"center",
    marginTop:responsiveHeight(3)
  },
  cancelBtn:{
    backgroundColor: "#dcdcdc",
    marginRight: responsiveWidth(3),
    borderRadius:6,
    paddingVertical:responsiveHeight(1.4),
    width:responsiveWidth(26)
  },
  cancelBtnText:{
    fontFamily: "FuturaLT-Book",
    textAlign:"center",
    fontSize:responsiveFontSize(1.8),
    color: "#333",
  },
  applyBtn:{
    backgroundColor: "#0066ca",
    marginRight: responsiveWidth(2),
    borderRadius:6,
    paddingVertical:responsiveHeight(1.4),
    width:responsiveWidth(26)
  },
  applyBtnText:{
    fontFamily: "FuturaLT-Book",
    textAlign:"center",
    fontSize:responsiveFontSize(1.8),
    color: "#ffffff",
  },


  
});
