import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import {  StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight,  Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, TouchableWithoutFeedback } from 'react-native';
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


export default MyWorkshops = props => {

  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  const mycourses = useSelector(state => state.auth.courses); 
  const [isLoading, setIsLoading] = useState(true);
  const [ongoingWorkshops, setOngoingWorkshops] = useState([]); 
  

  useEffect(() => {
    fetchData(true);
  }, [dispatch]);

  const fetchData = async refresh => {
    await getOngoingWorkshops();
    setIsLoading(false);
  };

  const getOngoingWorkshops = async () => {
    try {
      let params = {
        perpage: 1000,
        page: 1,
        studentID : authUser._id,
      }
      let data = await dispatch(authActions.getMyCourses(params));
      data = data.filter(myCourse => myCourse.course.length);
      if(data.length) {
        data.forEach((course, courseIndex) => {
          let overallProgressTotal = 0;
          course.course[0].content.forEach(content => {
            if(content.progress.length){
              overallProgressTotal += content.progress[0].progress_percent;
            }
          });
          data[courseIndex].overallProgress = Math.round(overallProgressTotal / course.course[0].content.length);
        });
        setOngoingWorkshops([...data]);
      } 
    } catch(err) {
      console.log(err.toString());
    } 
  };

  

  const goToWorkshopDetails = workshop => {
    props.navigation.push('WorkshopDetails', {workshop: workshop});
  };

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


  if (isLoading) {
    return (
      <LinearGradient colors={['#ebf1ff', '#ebf1ff']} style={{...styles.screen,flex: 1,justifyContent: 'center',alignItems: 'center',}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <ActivityIndicator size="large" color={'#007fff'} />
      </LinearGradient>
    );
  }



  return ( 
    <LinearGradient colors={['#ffffff', '#ebf1ff']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
     
      <View style={styles.backHeaderStyle}>
        <TouchableOpacity onPress={() => goBack()}>
          <View style={{ flexDirection: "row", alignItems: "center", height: responsiveHeight(9), paddingHorizontal: responsiveWidth(3),}}>
            <Image style={[styles.headerBackIcon,]} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />
            <Text style={styles.pageHeading}>My Workshops</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollview} contentContainerStyle={{paddingBottom: 10}}>

        {/* MAIN SEARCH RESULT */}
        
        <View>
        { ongoingWorkshops.length > 0 && <View style={styles.fullSearchArea}>

          { ongoingWorkshops.map((workshop, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => goToWorkshopDetails(workshop.course[0])}>
                <View style={styles.singleLesson}>
                  <View>
                    <Image style={styles.chapterImage} source={{uri: workshop.course[0].images[0].regular}} />
                    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(0,0,0,0.35)",}}>
                      <FontAwesomeIcon color={'#ffffff'} size={30} icon={faPlayCircle} />
                    </View>
                  </View>
                  <View style={{ paddingLeft: responsiveWidth(3),paddingVertical:responsiveHeight(1) }}>
                    <Text style={styles.chapterTitle} numberOfLines={1} ellipsizeMode='tail'>{workshop.course[0].name}</Text>
                    <Text style={styles.chapterCount} numberOfLines={2}>{workshop.course[0].description}</Text>
                    
                    <View style={styles.progressBarBg}>
                      <View style={{ ...styles.progressBar, ...(workshop.overallProgress ? { width: workshop.overallProgress+"%"} : {}) }}></View>
                    </View>
                    <Text style={{...styles.chapterCount, color:"#39847b"}}>{workshop.overallProgress}% Complete</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

        </View> }
        </View>
        

        



        {/* NO RESULT */}
        {ongoingWorkshops.length < 1 && <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(25)}}>
          <Image style={styles.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
          <Text style={styles.noDataTitle}>No Workshop found</Text>
        </View> }
        
      </ScrollView>


    </LinearGradient>
  );

}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  singleLesson: {
    backgroundColor: "#ffffff",
    borderWidth:1,
    borderColor:"#f1f1f1",
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    // justifyContent:"space-between",
    marginBottom:responsiveHeight(1.8),
    height:responsiveHeight(15)
  },
  chapterImage: {
    height: "100%",
    width: responsiveHeight(17),
    resizeMode: "cover",
  },
  chapterCount: {
    fontSize: responsiveFontSize(1.5),
    color: "#222222",
    fontFamily: "Poppins-Light",
    marginTop:responsiveHeight(0.6),
    width:responsiveWidth(52)
  },
  chapterTitle: {
    fontSize: responsiveFontSize(1.8),
    color: "#222222",
    fontFamily: "Poppins-SemiBold",
    width:responsiveWidth(52)
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
    backgroundColor: "#ffffff",
    height: responsiveHeight(9),
    borderBottomWidth:1,
    borderColor:"#f1f1f1"
  },
  secondaryPageHeading: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(3),
    color: "#ffffff"
  },
  pageHeading: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2.4),
    color: "#222222",
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
    fontFamily:"Poppins-Light",
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
    paddingTop: responsiveWidth(3.5),
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
    fontFamily:"Poppins-Light",
    color:"#222222"
  },
  searchNameBold:{
    fontSize:responsiveScreenFontSize(1.7),
    fontFamily:"Poppins-Light-Bold",
    color:"#222222"
  },
  searchCategoryName:{
    fontSize:responsiveScreenFontSize(1.3),
    fontFamily:"Poppins-Light",
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
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(2),
    color:"#000000",
    marginTop:responsiveHeight(0)
  },
  noDataSubTitle:{
    fontFamily:"Poppins-Light-Book",
    fontSize:responsiveFontSize(2),
    color:"#888888",
    textAlign:"center"
  },
  headerBackIcon:{
    height:responsiveHeight(2.3),
    width:responsiveHeight(2.3),
    resizeMode:"contain"
  },
  
});
