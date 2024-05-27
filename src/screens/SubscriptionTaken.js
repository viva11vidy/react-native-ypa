import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import {  StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight,  Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, TouchableWithoutFeedback, Animated } from 'react-native';
import ScaledImage from 'react-native-scalable-image';
import { useScrollToTop } from '@react-navigation/native';
import Swiper from 'react-native-swiper'
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize,} from "react-native-responsive-dimensions";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faChevronRight, faClipboard, faClipboardList, faCog, faCogs, faCommentAlt, faHeart, faHouseUser, faPlayCircle, faQuestionCircle, faSearch, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
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

export default SubscriptionTaken = props => {


  const authUser = useSelector(state => state.auth.user);
  const productCountSheetRef = useRef();
  const [applyPopup, setApplyPopup] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

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


  const applyJob = () => {
    setApplyPopup(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver:true
    }).start();
    
  }




  return ( 
    <LinearGradient colors={['#000000', '#000000']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
     

     {applyPopup == true ?
     
      
    
     <View style={styles.applyPopup}>
       <View style={styles.mainAreaPopup}>
         <View style={styles.popupImageWrapper}>
           <Image style={styles.popupImage} source={require('../../assets/images/ypa/caution.png')} />
         </View>
         <View style={styles.mainTitleWrapper}>
           <Text style={styles.mainTitlePopup}>Are you sure you want to turn off auto renewal ? You need to subscribe again when your subscription will expire.</Text>
         </View>
         <View style={styles.popupBtnWraper}>
           <TouchableOpacity onPress={() => setApplyPopup(false)}>
             <View style={styles.cancelBtn}>
               <Text  style={styles.cancelBtnText}>No</Text>
             </View>
           </TouchableOpacity>
           <TouchableOpacity>
             <View style={styles.applyBtn}>
               <Text style={styles.applyBtnText}>Yes</Text>
             </View>
           </TouchableOpacity>
         </View>
       </View>
     </View>
     
     :
     <></>
     }


      <View style={styles.backHeaderStyle}>
        <TouchableOpacity onPress={() => goBack()}>
          <View style={{ flexDirection: "row", alignItems: "center", height: responsiveHeight(9), paddingHorizontal: responsiveWidth(3),}}>
            <FontAwesomeIcon color={'#ffffff'} size={20} icon={faChevronLeft} />
            <Text style={styles.pageHeading}>Subscription</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollview} contentContainerStyle={{paddingBottom: 10}}>

        <LinearGradient colors={['#000000', '#011c38']} style={styles.topArea} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
          <View style={styles.headerContentWrapper}>
            <Image style={styles.profileBg} source={{uri: authUser.profile_picture}} />
            <View style={{marginTop:-responsiveHeight(2),flex: 1,}}>
              <Text style={{...styles.profileTitle, flexWrap: 'wrap'}}>{authUser.name}</Text>
              <View style={{marginBottom:responsiveHeight(0.6)}}>
                <Text style={styles.profileJoining}>{authUser.email}</Text>
              </View>
              <Text  style={styles.profileJoining2}>Member since {moment(authUser.created).format("MMM DD, YYYY")}</Text>
            </View>
          </View>
        </LinearGradient>
        
        {/* MAIN SEARCH RESULT */}
        <View style={styles.fullSearchArea}>

          <View style={{marginBottom:responsiveHeight(1.5),marginLeft:responsiveWidth(1.5)}}>
           <Text style={styles.subsTitle}>Subscription</Text>
          </View>
         
          
          <View style={styles.singleLesson}>
            <View style={{marginRight:responsiveWidth(5)}}>
              <Image style={styles.subsImage} source={require('../../assets/images/ypa/calendar.png')} />
            </View>
            <View style={{ flex:1 }}>
              <Text style={styles.chapterCount} numberOfLines={1}>Subscription Date</Text>
              <Text style={styles.chapterTitle} ellipsizeMode='tail'>January 13, 2022</Text>
            </View>
          </View>

          <View style={styles.singleLesson}>
            <View style={{marginRight:responsiveWidth(5)}}>
              <Image style={styles.subsImage} source={require('../../assets/images/ypa/expired.png')} />
            </View>
            <View style={{ flex:1 }}>
              <Text style={styles.chapterCount} numberOfLines={1}>Expired on</Text>
              <Text style={styles.chapterTitle} ellipsizeMode='tail'>January 13, 2023</Text>
            </View>
          </View>
          


          <View style={{marginBottom:responsiveHeight(1.5),marginLeft:responsiveWidth(1.5),marginTop:responsiveHeight(1)}}>
          <Text style={styles.subsTitle}>Current Plan</Text>
          </View>



          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"}}>

            <View style={styles.singleLesson2}>
              <View>
                <Image style={styles.subsImage2} source={require('../../assets/images/ypa/completed-task.png')} />
              </View>
              <View style={{alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(0.4)}}>
                <Text style={styles.chapterCount2} numberOfLines={1}>Plan Name</Text>
                <Text style={styles.chapterTitle2} ellipsizeMode='tail'>Gold Plan</Text>
              </View>
            </View>

            <View style={styles.singleLesson2}>
              <View>
                <Image style={styles.subsImage2} source={require('../../assets/images/ypa/calendar.png')} />
              </View>
              <View style={{alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(0.4)}}>
                <Text style={styles.chapterCount2} numberOfLines={1}>Duration</Text>
                <Text style={styles.chapterTitle2} ellipsizeMode='tail'>365 Days</Text>
              </View>
            </View>

            <View style={styles.singleLesson2}>
              <View>
                <Image style={styles.subsImage2} source={require('../../assets/images/ypa/pound-symbol.png')} />
              </View>
              <View style={{alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(0.4)}}>
                <Text style={styles.chapterCount2} numberOfLines={1}>Amount</Text>
                <Text style={styles.chapterTitle2} ellipsizeMode='tail'>£30</Text>
              </View>
            </View>

            <View style={styles.singleLesson2}>
              <View>
                <Image style={styles.subsImage2} source={require('../../assets/images/ypa/debit-card.png')} />
              </View>
              <View style={{alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(0.4)}}>
                <Text style={styles.chapterCount2} numberOfLines={1}>Payment Mode</Text>
                <Text style={styles.chapterTitle2} ellipsizeMode='tail'>Online</Text>
              </View>
            </View>
            
          </View>

          <View style={{...styles.singleLesson,marginTop:responsiveHeight(0.5),justifyContent:"space-between"}}>
            <View style={{ }}>
              <Text style={styles.chapterTitle} ellipsizeMode='tail'>Auto Renewal</Text>
              <Text style={styles.chapterCount}>Your subscption will be automatically renewed after Jan 13, 2023.</Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => applyJob()}>
                <View style={styles.downloadbtn}>
                  <Text style={styles.downloadbtnText}>Turn Off</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>


          <View style={{marginBottom:responsiveHeight(1.5),marginLeft:responsiveWidth(1.5),marginTop:responsiveHeight(1)}}>
            <Text style={styles.subsTitle}>Subscription History</Text>
          </View>

          <View style={{...styles.singleLesson,justifyContent:"space-between"}}>
            <View style={{}}>
              <Text style={styles.chapterTitle} ellipsizeMode='tail'>Bronze Plan (180 Days)</Text>
              <Text style={styles.chapterCount} numberOfLines={1}>Jan 13, 2022 - Jul 12, 2021</Text>
              <Text style={styles.chapterCount} numberOfLines={1}>Payment Mode : Online</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={{...styles.chapterTitle2,alignSelf:"flex-end",fontSize: responsiveFontSize(3)}}>	£12</Text>
            </View>
          </View>
          <View style={{...styles.singleLesson,justifyContent:"space-between"}}>
            <View style={{}}>
              <Text style={styles.chapterTitle} ellipsizeMode='tail'>Bronze Plan (180 Days)</Text>
              <Text style={styles.chapterCount} numberOfLines={1}>Jan 13, 2022 - Jul 12, 2021</Text>
              <Text style={styles.chapterCount} numberOfLines={1}>Payment Mode : Online</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={{...styles.chapterTitle2,alignSelf:"flex-end",fontSize: responsiveFontSize(3)}}>	£12</Text>
            </View>
          </View>

        </View>



        {/* NO RESULT */}
        {/* <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(45)}}>
          <Image style={styles.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
          <Text style={styles.noDataTitle}>Nothing found</Text>
        </View> */}
        
      </ScrollView>

     

    </LinearGradient>
  );

}

const styles = StyleSheet.create({
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
    backgroundColor: "#dc3545",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal:responsiveHeight(2.5),
    height: responsiveHeight(5.1),
  },
  downloadbtnText: {
    fontSize: responsiveFontSize(1.8),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
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
    paddingVertical:responsiveHeight(2) 
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
    paddingHorizontal: responsiveWidth(3.5),
    paddingTop:responsiveHeight(2), 
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
    color: "#ffffff",
    fontFamily: "FuturaLT-Bold",
    textAlign:"center"
  },
  chapterCount: {
    fontSize: responsiveFontSize(1.5),
    color: "#ffffff",
    fontFamily: "FuturaLT",
    marginTop:responsiveHeight(0.6),
    width:responsiveWidth(52)
  },
  chapterTitle: {
    fontSize: responsiveFontSize(1.8),
    color: "#ffffff",
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
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth:1,
    borderColor:"#111111",
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
    backgroundColor: "rgba(0,0,0,0.85)",
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
    fontSize:responsiveFontSize(1.7),
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
  applyBtn:{
    backgroundColor:"#ffffff",
    borderRadius:7,
    alignItems:"center",
    justifyContent:"center",
    padding:responsiveHeight(1.5),
  },
  applyBtnText:{
    fontSize: responsiveFontSize(1.8),
    color: "#011c38",
    fontFamily: "FuturaLT-Bold",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  cancelBtn:{
    backgroundColor:"#012344",
    alignItems:"center",
    borderRadius: 7,
    justifyContent:"center",
    padding:responsiveHeight(1.5),
    marginRight: responsiveWidth(3),
  },
  cancelBtnText:{
    fontSize: responsiveFontSize(1.8),
    color: "#ffffff",
    fontFamily: "FuturaLT-Bold",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },


  
});
