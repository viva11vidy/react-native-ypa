import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import {  StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight,  Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, Platform, PermissionsAndroid, LayoutAnimation, TouchableWithoutFeedback } from 'react-native';
import ScaledImage from 'react-native-scalable-image';
import { useScrollToTop } from '@react-navigation/native';
import Swiper from 'react-native-swiper'
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize,} from "react-native-responsive-dimensions";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faChevronRight, faClipboard, faClipboardList, faCog, faCogs, faCommentAlt, faDownload, faHeart, faHouseUser, faPlayCircle, faQuestionCircle, faSearch, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
// import Swiper from 'react-native-swiper';
import moment from 'moment';
import Pagination from '../components/Pagination';
import RBSheet from "react-native-raw-bottom-sheet";
import Input from '../ui/Input';
import LinearGradient from 'react-native-linear-gradient';
import RNFetchBlob from 'rn-fetch-blob';

import { useSelector, useDispatch } from 'react-redux';
import globals from '../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';


export default MyCertificates = props => {

  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const [certificates, setCertificates] = useState([]); 

  useEffect(() => {
    fetchData(true);
  }, [dispatch]);

  const fetchData = async refresh => {
    await getCertificates();
    setIsLoading(false);
  };

  const getCertificates= async () => {
    try {
      let params = {
        perpage: 1000,
        page: 1,
        sid : authUser._id,
      }
      let data = await dispatch(authActions.getMyCertificates(params));
      if(data.length) {
        setCertificates([...data]);
      } 
    } catch(err) {
      console.log(err.toString());
    } 
  };

  const downloadFile = (certificate_id) => {
    if(!certificate_id) return;
    const { dirs } = RNFetchBlob.fs;
    const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const remoteFileUrl = globals.get('appConfig').apiUrl+'students/fetch-certificate/'+certificate_id;
    const fileName = remoteFileUrl.split('/').pop()+'.pdf';
    const fileExtension = fileName.split('.').pop();
    const configfb = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        title: fileName,
        path: `${dirToSave}/${fileName}`,
        mediaScannable: true,
        notification: true,
      }
    };
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.addAndroidDownloads.title,
        path: configfb.addAndroidDownloads.path,
        appendExt: fileExtension,
      },
      android: configfb,
    });
    // console.log(configOptions);

    RNFetchBlob.config(configOptions)
    .fetch('GET', remoteFileUrl, {})
    .then((res) => {
      if (Platform.OS === "ios") {
        RNFetchBlob.fs.writeFile(configOptions.path, res.data, 'base64');
        RNFetchBlob.ios.previewDocument(configOptions.path);
      }
      if (Platform.OS == 'android') {
        dispatch(commonActions.setSystemMessage('Certificate downloaded'));
      }
      console.log('The file saved to ', res);
    })
    .catch((e) => {
      console.log(e.message);
      console.log('The file saved to ERROR', e.message)
    });
  };

  const getDownloadPermissionAndDownload = async (certificate_id) => {
    if (Platform.OS == 'ios') {
      downloadFile(certificate_id);
    } else {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadFile(certificate_id);
        } else {
          dispatch(commonActions.setNotificationMessage('You need to give storage permission to download the file'));
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const goBack = () => {
    props.navigation.goBack(null);
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#ffffff', '#ebf1ff']} style={{...styles.screen,flex: 1,justifyContent: 'center',alignItems: 'center',}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
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
            <Text style={styles.pageHeading}>Certificates</Text>
          </View>
        </TouchableOpacity>
      </View>



      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollview} contentContainerStyle={{paddingBottom: 10}}>

        
        {/* MAIN SEARCH RESULT */}
        { certificates.length > 0 && <View style={styles.fullSearchArea}>
         
          { certificates.map((certificate, index) => {
            return (
              <View key={index} style={styles.singleLesson}>
                <View style={{ }}>
                  <Text style={styles.chapterTitle} ellipsizeMode='tail'>{certificate.course.info.name}</Text>
                  <Text style={styles.chapterCount} numberOfLines={1}>{moment(certificate.created).format("MMM DD,YYYY")}</Text>
                  
                  <Text style={{...styles.chapterCount, color:"#222222"}}>{certificate.certificate_id}</Text>
                </View>

                <View>
                  <TouchableOpacity onPress={() => getDownloadPermissionAndDownload(certificate._id)}>
                    <LinearGradient colors={['#3895fc', '#005ba6']} style={styles.downloadbtn} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                      <Image style={[styles.headerBackIcon,]} source={require('../../assets/images/ypa/new-images/download-white.png')} />
                      {/* <Text style={styles.downloadbtnText}>Download</Text> */}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

        </View> }



        {/* NO RESULT */}
        {certificates.length < 1 && <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(45)}}>
          <Image style={styles.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
          <Text style={styles.noDataTitle}>No Certificate found</Text>
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
  downloadbtn: {
    backgroundColor: "#ffffff",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal:responsiveHeight(2),
    height: responsiveHeight(5.1),
  },
  downloadbtnText: {
    fontSize: responsiveFontSize(1.8),
    color: "#ffffff",
    fontFamily: "Poppins-Light",
    marginLeft:responsiveWidth(2)
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
    fontSize: responsiveFontSize(1.5),
    color: "#222222",
    opacity:0.7,
    fontFamily: "Poppins-Light",
    marginTop:responsiveHeight(0.6),
    width:responsiveWidth(52)
  },
  chapterTitle: {
    fontSize: responsiveFontSize(1.8),
    color: "#222222",
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
    padding:responsiveWidth(3.2)
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
    fontFamily:"Poppins-Light",
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
