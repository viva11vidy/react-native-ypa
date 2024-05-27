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
import { Shadow } from 'react-native-shadow-2';

import { useSelector, useDispatch } from 'react-redux';
import globals from '../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
import styles from './StyleSheet';

export default AppliedJobs = props => {

  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]); 

  useEffect(() => {
    fetchData(true);
  }, [dispatch]);

  const fetchData = async refresh => {
    await getAppliedJobs();
    setIsLoading(false);
  };

  const getAppliedJobs= async () => {
    try {
      let params = {
        perpage: 1000,
        page: 1,
        stud : authUser._id,
      }
      let data = await dispatch(authActions.getMyAppliedJobs(params));
      
      if(data.length) {
        data.reverse();
        setAppliedJobs([...data]);
      } 
    } catch(err) {
      console.log(err.toString());
    } 
  };

  const goBack = () => {
    props.navigation.goBack(null);
  };

  const goToJobDetails = job => {
    props.navigation.navigate('OpportunityDetails', {job, job});
  }


  if (isLoading) {
    return (
      <LinearGradient colors={['#ffffff', '#cee6ff']} style={{...styles.screen,flex: 1,justifyContent: 'center',alignItems: 'center',}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <ActivityIndicator size="large" color={'#007fff'} />
      </LinearGradient>
    );
  }



  return ( 
    <LinearGradient colors={['#ffffff', '#cee6ff']} style={{flex: 1}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
      <Shadow style={{width:responsiveWidth(100)}} distance={5} startColor={'#0000000d'} >
        <View style={styles.mainHeader}>
          <View>
            <View style={styles.sideBySide}>
              <Text style={styles.pageName}>Applied Jobs</Text>
            </View>
          </View>
          <View style={styles.sideBySide}>
            <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
              <LinearGradient colors={['#3895fc', '#005ba6']} style={styles.menuButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.menuLongLine}></View>
                <View style={styles.menuMediumLine}></View>
                <View style={styles.menuSmallLine}></View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Shadow>

      

      <ScrollView showsVerticalScrollIndicator={false} style={stylesInline.scrollview} contentContainerStyle={{paddingBottom: 10,}}>

       

       

        {/* MAIN SEARCH RESULT */}
        { appliedJobs.length > 0 && <View style={stylesInline.fullSearchArea}>
          <Text style={stylesInline.topText}>You have applied for {appliedJobs.length} job{appliedJobs.length > 1 && <Text>s</Text>}</Text>
          { appliedJobs.map((job, index) => {
            return (
              <TouchableOpacity key={index} style={{ width: "100%" }} onPress={() => goToJobDetails(job)}>
                <View key={index} style={stylesInline.singleLesson}>
                  <View style={{ }}>
                    <Text style={stylesInline.chapterTitle} numberOfLines={2} ellipsizeMode='tail'>{job.job.info.title}</Text>
                    <Text style={stylesInline.chapterCount} numberOfLines={1}>{job.company[0].name}</Text>
                    <View style={stylesInline.jobDateWrapper}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={stylesInline.jobDateText}>Applied On : {moment(job.created).format("MMM DD,YYYY")}</Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <Image style={stylesInline.companyImage} source={{uri: job.company[0].color_images[0].regular}} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}


        </View> }



        {/* NO RESULT */}
        {appliedJobs.length < 1 && <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(45)}}>
          <Image style={stylesInline.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
          <Text style={stylesInline.noDataTitle}>No Job Application found</Text>
        </View> }
        
      </ScrollView>

     

    </LinearGradient>
  );

}

const stylesInline = StyleSheet.create({
  topText:{
    fontSize: responsiveFontSize(2),
    color: "#666",
    textAlign:"center",
    fontFamily: "Poppins-Light",
    marginBottom:responsiveHeight(2),
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  jobDateWrapper: {
    flexDirection: "row",
    marginTop:responsiveHeight(0.8)
  },
  jobDateText: {
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(1.8),
    color: "#888888",
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
    fontFamily: "FuturaLT-Book",
  },
  singleLesson: {
    borderWidth:1,
    borderColor:"#f1f1f1",
    backgroundColor:"#ffffff",
    borderRadius:8,  
    overflow:"hidden",
    marginBottom:responsiveHeight(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between",
    paddingHorizontal: responsiveWidth(3),
    paddingBottom:responsiveHeight(1),
    paddingTop: responsiveHeight(1.2),
  },
  chapterImage: {
    height: responsiveHeight(13.5),
    width: responsiveHeight(17),
    resizeMode: "cover",
  },
  chapterCount: {
    fontSize: responsiveFontSize(1.9),
    color: "#222",
    fontFamily: "Poppins-Light",
    marginTop:responsiveHeight(0.8),
    width:responsiveWidth(52)
  },
  chapterTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2),
    color: "#333",
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
    backgroundColor: "#007fff",
    height: responsiveHeight(9),
    // borderBottomWidth:1,
    // borderColor:"#111111",
    elevation: 0,
    shadowOpacity: 0,
    // borderBottomWidth: 0,
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
    fontFamily: "Poppins-SemiBold",
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
    paddingTop: responsiveHeight(2.5),
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
    fontFamily:"Poppins-SemiBold",
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
    fontFamily:"Poppins-SemiBold",
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
  
});
