import React, { useState, useEffect, useReducer, useCallback, useRef,   } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight, Keyboard, ActivityIndicator, PermissionsAndroid, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import RBSheet from "react-native-raw-bottom-sheet";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faSearch, faSortAmountDown, faChevronLeft, faDotCircle, faEllipsisV, faUserAlt, faEnvelope, faCalendar, faIdBadge, faMale, faUserGraduate, faSchool, faStreetView, faHeartbeat, faBriefcase, faBook, faGlobe, faMapMarker, faPhone, faMapMarkedAlt, faPhoneAlt, faMapMarked, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { StackActions } from '@react-navigation/native';
import moment from 'moment';
// import MapView from 'react-native-maps';
import { Shadow } from 'react-native-shadow-2';

import globals from './../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';

export default ContactUs = props => {

  const dispatch = useDispatch();
  const settings = useSelector(state => state.common.settings); 
  const authUser = useSelector(state => state.auth.user);
  const mycourses = useSelector(state => state.auth.courses);console.log(authUser.profile);
  const [interestedJobSectors, setInterestedJobSectors] = useState([]); console.log(interestedJobSectors);
  const profileOptionSheetRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(commonActions.getSettings());
  }, [dispatch]);

  const openUrl = uri => {
    props.navigation.navigate('WebPage', {uri: uri});
  }

  const callUs = phone => {
    var url = 'tel://'+phone;
    if(Linking.canOpenURL(url)) {
      Linking.openURL(url);
    }
  }

  const openLocation = (location) => {
    var url = 'https://www.google.com/maps/search/?api=1' + encodeURI(`&query=${location}`);
    if(Linking.canOpenURL(url)) {
      Linking.openURL(url);
    }
  }

  const goBack = () => {
    props.navigation.goBack();
  }
  
  const goToContactUsForm = () => {
    props.navigation.navigate('ContactUsForm');
  }

  return (

    <LinearGradient colors={['#ffffff', '#e5f1ff']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>

      <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileHeaderWrapper}>
          <Image style={styles.mainBg} source={require('../../assets/images/ypa/map.jpg')} />
          {/* <MapView
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          /> */}
        </View>

        

        <View style={styles.infoBg}>

          <Shadow distance={5} startColor={'#0000000d'} >
            <LinearGradient colors={['#3895fc', '#005ba6']} style={{...styles.profileNumberWrapper}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
              
              <TouchableOpacity onPress={() => {Linking.canOpenURL('mailto://'+settings.customerSupportEmail) ? Linking.openURL('mailto://'+settings.customerSupportEmail) : null ;}}>
                <View style={styles.profileInfo}>
                  <View style={styles.profileInfoIconWrapper}>
                    <FontAwesomeIcon color={'#ffffff'} size={18} icon={faEnvelope} />
                  </View>
                  <View>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.content}>{settings.customerSupportEmail}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openUrl(settings.customerSupportWebSite)}>
                <View style={styles.profileInfo}>
                  <View style={styles.profileInfoIconWrapper}>
                    <FontAwesomeIcon color={'#ffffff'} size={18} icon={faGlobe} />
                  </View>
                  <View>
                    <Text style={styles.label}>Website</Text>
                    <Text style={styles.content}>{settings.customerSupportWebSite}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity  onPress={() => openLocation(settings.customerSupportAddress)}>
                <View style={styles.profileInfo}>
                  <View style={styles.profileInfoIconWrapper}>
                    <FontAwesomeIcon color={'#ffffff'} size={18} icon={faMapMarkerAlt} />
                  </View>
                  <View>
                    <Text style={styles.label}>Address</Text>
                    <Text style={styles.content}>{settings.customerSupportAddress}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {settings.customerSupportContactNumber != '' &&
              <TouchableOpacity onPress={() => callUs(settings.customerSupportContactNumber)}>
                <View style={styles.profileInfo}>
                  <View style={styles.profileInfoIconWrapper}>
                    <FontAwesomeIcon color={'#ffffff'} size={18} icon={faPhoneAlt} />
                  </View>
                  <View>
                    <Text style={styles.label}>Company Number</Text>
                    <Text style={styles.content}>{settings.customerSupportContactNumber}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              }

            </LinearGradient>
          </Shadow>
          
          <View style={{marginVertical:responsiveHeight(3),alignItems:"center",justifyContent:"center"}}>
            <View style={{marginBottom:responsiveHeight(2)}}>
              <Text style={styles.socialText}>Connect with us</Text>
            </View>
            <View style={styles.socialWrapper}>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/youngprouk/')}>
                <View style={styles.socialIconWrapper}>
                  <Image style={styles.socialIcon} source={require('../../assets/images/ypa/instagram.png')} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/youngprouk')}>
                <View style={styles.socialIconWrapper}>
                  <Image style={styles.socialIcon} source={require('../../assets/images/ypa/twitter.png')} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/company/young-professionals-uk/')}>
                <View style={styles.socialIconWrapper}>
                  <Image style={styles.socialIcon} source={require('../../assets/images/ypa/linkedin.png')} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/Young-Professionals-UK-572303492948211/')}>
                <View style={styles.socialIconWrapper}>
                  <Image style={styles.socialIcon} source={require('../../assets/images/ypa/fb-icon-dark.png')} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.tiktok.com/@youngprouk')}>
                <View style={styles.socialIconWrapper}>
                  <Image style={styles.socialIcon} source={require('../../assets/images/ypa/tik-tok.png')} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          


          <TouchableOpacity onPress={() => {goToContactUsForm()}}>
            <View style={{...styles.walkthroughButtonWrapper,justifyContent:"center",marginTop:responsiveHeight(1)}}>
              <View style={{...styles.walkthroughButtonSolid,width:"100%"}}>
                <Text style={styles.walkthroughLinkRight}>Have anything to say ? Click here</Text>
              </View>
            </View>
          </TouchableOpacity>



          

          
          
         







          


















          {/* <Text style={styles.myInfo}>My Information</Text> */}
          

        </View>
        

      </ScrollView>
    </LinearGradient>
    
  );


}

const styles = StyleSheet.create({
  socialIcon:{
    height:22,
    width:22,
    resizeMode:"contain",
  },
  socialIconWrapper:{
    height:responsiveHeight(6),
    width:responsiveHeight(6),
    backgroundColor:"#ffffff",
    borderRadius:40,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    borderWidth:1,
    marginHorizontal:responsiveWidth(1.5),
    borderColor:"#f1f1f1"
  },
  socialText:{
    fontSize: responsiveFontSize(1.9),
    color: "#222222",
    fontFamily: "Poppins-Light",
  },
  socialWrapper:{
    flexDirection:"row",
    alignItems:"center",
  },
  container: {
    flex: 1,
    backgroundColor:"#ffffff",
    // backgroundColor:"green"
  },
  backHeaderStyle: {
    // backgroundColor: "transparent",
    backgroundColor: "#007fff",
    height: responsiveHeight(9),
    borderBottomWidth:1,
    borderColor:"#007fff",
    elevation: 0,
    shadowOpacity: 0,
    // borderBottomWidth: 0,
    position:"absolute",
    top:0,
    width:responsiveWidth(100),
    zIndex:9999

  },
  pageHeading: {
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(2.4),
    color: "#ffffff",
    position: "relative",
    top: 1,
    marginLeft: responsiveWidth(2)
  },
  profileBackButton:{
    position:"absolute",
    left: responsiveWidth(3),
    top:responsiveHeight(2),
    zIndex:999999
  },
  profileBackButtonView:{
    flexDirection:"row",
    alignItems:"center",
  },
  profileOptionButton:{
    position:"absolute",
    right: responsiveWidth(3),
    top:responsiveHeight(2),
    zIndex:999999
  },
  profileOptionButtonView:{
    padding:responsiveHeight(1),
  },


  profileHeaderWrapper:{
    height:responsiveHeight(41),
    width: responsiveWidth(100),
    backgroundColor:"#ffffff",
    flexDirection:"row",
    justifyContent:"center"
  },
  mainBg: {
    height: responsiveHeight(41),
    width: responsiveWidth(100),
    // backgroundColor:"red"
  },
  headerContentWrapper:{
    paddingTop:responsiveHeight(3),
    position:"absolute",
    alignItems:"center",
    // justifyContent:"center"
  },
  profileBg:{
    height:responsiveHeight(14),
    width:responsiveHeight(14),
    resizeMode:"cover",
    borderRadius:100,
    borderWidth:3,
    borderColor:"#ffffff",
    marginBottom:responsiveHeight(2),
    // elevation:10
  },
  profileTitle:{
    fontSize: responsiveFontSize(3),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
  },
  profileAge:{
    fontSize: responsiveFontSize(2.2),
    color: "#ffffff",
    fontFamily: "Poppins-Light",
    marginVertical:responsiveHeight(0.1),
    opacity:1
  },
  profileJoining:{
    fontSize: responsiveFontSize(2.2),
    color: "#ffffff",
    fontFamily: "Poppins-Light",
    opacity:0.9
  },


  profileNumberWrapper:{
    // position:"absolute",
    // zIndex:99999,
    marginTop:-responsiveHeight(15),
    width:responsiveWidth(90),
    alignSelf:"center",
    flexDirection:"column",
    elevation:4,
    borderRadius:10,
    paddingVertical:responsiveHeight(2)
  },
  singleProfileNumber:{
    alignItems:"center",
    justifyContent:"center"
  },
  profileNumber:{
    fontSize: responsiveFontSize(4.1),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
    height:responsiveHeight(6),
  },
  profileText:{
    fontFamily: "Poppins-Light",
    color: "#525252",
    fontSize: responsiveFontSize(2.1),
  },




  infoBg:{
    // backgroundColor:"red",
    // height:"100%",
    // flex:1,
    paddingVertical:responsiveHeight(8),
    paddingHorizontal:responsiveWidth(5),
    // padd
  },
  myInfo:{
    fontSize: responsiveFontSize(2.4),
    fontFamily: "Poppins-SemiBold",
    color: "#333333",
    marginBottom:responsiveHeight(2.5)
  },
  hr:{
    marginTop:responsiveHeight(1),
    marginBottom:responsiveHeight(2.5),
    height:1,
    backgroundColor:"#ced4da",
  },
  profileInfo:{
    marginBottom:responsiveHeight(2),
    paddingHorizontal:responsiveWidth(4),
    flexDirection:"row",
    // backgroundColor:"red",
    // alignItems:"center",
    // justifyContent:"space-between",
  },
  profileInfoIconWrapper:{
    height:responsiveWidth(11),
    width:responsiveWidth(11),
    borderRadius:50,
    alignItems:"center",
    justifyContent:"center",
    marginRight:15,
    backgroundColor:"#0065cb",
  },
  label:{
    fontSize: responsiveFontSize(2),
    fontFamily: "Poppins-SemiBold",
    color: "#ffffff",
    // width:responsiveWidth(30)
  },
  content:{
    fontSize: responsiveFontSize(1.9),
    fontFamily: "Poppins-Light",
    color: "#ffffff",
    opacity:0.8,
    marginTop:responsiveHeight(0),
    width:responsiveWidth(66),

    // paddingLeft:responsiveWidth(2)
  },
  contentSubject:{
    fontSize: responsiveFontSize(1.9),
    fontFamily: "Poppins-Light",
    color: "#ffffff",
    opacity:0.8,
    marginTop:responsiveHeight(0),
  },
  contentSubjectDark:{
    fontSize: responsiveFontSize(1.7),
    fontFamily: "Poppins-SemiBold",
    color: "#5f5f5f",
  },

  bio:{
    fontSize: responsiveFontSize(2),
    fontFamily: "Poppins-Light",
    color: "#222222",
    marginTop:responsiveHeight(0),
    marginBottom:responsiveHeight(4),
  },





  
  // RB SHEET

  sheetTitleContainer: {
    borderBottomWidth: 1,
    borderColor: "#e6e6e6",
    paddingBottom: responsiveHeight(1),
    marginBottom: responsiveHeight(4)
  },
  sheetTitle: {
    fontSize: responsiveFontSize(2.3),
    // lineHeight:responsiveFontSize(2.1),
    fontFamily: "Poppins-Light",
    color: "#222222",
    textAlign: "center"
  },
  singleSheetOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    // marginBottom: responsiveHeight(0.5),
    // backgroundColor:"red",
    paddingBottom: responsiveHeight(2.5),
  },
  singleSheetText: {
    fontSize: responsiveFontSize(2),
    fontFamily: "Poppins-Light",
    color: "#333333",
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center"
  },

  singleSubject:{
    borderWidth:1,
    borderColor:"#e4e4e4",
    borderRadius:6,
    padding:8,
    marginBottom:10,
    width:responsiveWidth(73)
  },
  companyButton: {
    backgroundColor:"#ffffff",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    padding:responsiveHeight(1.5),
    height: responsiveHeight(7.1),
    marginTop: responsiveHeight(2), 
  },
  companyButtonText: {
    fontSize: responsiveFontSize(1.8),
    color: "#007fff",
    fontFamily: "Poppins-Light",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  companyButtonText2: {
    fontSize: responsiveFontSize(1.9),
    color: "#007fff",
    fontFamily: "Poppins-Light",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  walkthroughButtonWrapper: {
    // position: "absolute",
    // bottom: responsiveHeight(2.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  walkthroughButtonOutline:{
    width:responsiveWidth(44),
    height:responsiveHeight(7.5),
    borderRadius:8,
    borderWidth:1,
    borderColor:'#ffffff',
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center"
  },
  walkthroughButtonSolid:{
    width:responsiveWidth(44),
    height:responsiveHeight(7.5),
    borderRadius:8,
    backgroundColor:'#ffffff',
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center"
  },
  walkthroughLinkRight: {
    fontSize: responsiveFontSize(2.1),
    color: "#222222",
    fontFamily: "Poppins-SemiBold",
  },
  walkthroughLinkLeft: {
    fontSize: responsiveFontSize(2.1),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
  },


});
