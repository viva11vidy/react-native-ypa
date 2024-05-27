import React from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight, responsiveWidth, responsiveFontSize, } from "react-native-responsive-dimensions";
import DeviceInfo from 'react-native-device-info';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Shadow } from 'react-native-shadow-2';
import { faBars, faBriefcase, faCertificate, faList, faPlay, faPlayCircle, faSearch, faSignOutAlt, faUser, faVideo } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../store/actions/auth';
import * as commonActions from '../store/actions/common';
import { StackActions } from '@react-navigation/native';
import moment from 'moment';

export function DrawerComponent(props) {

  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);

  const logout = async () => {
    try {
      await dispatch(authActions.logout());
    } catch (err) {
      // dispatch(commonActions.setSystemMessage(err.message));
    }
  };

  const goToRegister = () => {
    props.navigation.dispatch(StackActions.replace('AuthNav'));
  }

  const goToDynamicPage = url => {
    props.navigation.push('DynamicPage', {url: url}); 
  };

  return (
    <LinearGradient colors={['#0051ad', '#0067d0']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>

      <View style={{paddingHorizontal:responsiveWidth(2)}}>
        <View style={{alignItems:"center",justifyContent:"center",paddingTop:responsiveHeight(3),justifyContent:"center"}}>
          <Image style={styles.drawerImage} source={require('../../assets/images/ypa/new-images/app-logo-white.png')} resizeMode='contain'/>
        </View>
      </View>
    


    


    <ScrollView style={styles.header}>
      


      <View style={styles.allMenuContainer}>

        {/* <TouchableOpacity onPress={() => { props.navigation.closeDrawer(); props.navigation.navigate('EventTypesPage')}}>
          <View style={styles.singleMenuItem}>
            <View style={styles.leftArea}>
              <Image style={styles.menuIcon} source={require('../../assets/images/ypa/new-images/home-white.png')} />
            </View>
            <View style={styles.rightArea}>
              <Text style={styles.menuTitle}>Events Type</Text>
            </View>
          </View>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={() => { props.navigation.closeDrawer(); props.navigation.navigate('HomePage'); }}>
          <View style={styles.singleMenuItem}>
            <View style={styles.leftArea}>
              <Image style={styles.menuIcon} source={require('../../assets/images/ypa/new-images/home-white.png')} />
            </View>
            <View style={styles.rightArea}>
              <Text style={styles.menuTitle}>Home</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { props.navigation.closeDrawer(); props.navigation.navigate('OpportunitiesPage'); }}>
          <View style={styles.singleMenuItem}>
            <View style={styles.leftArea}>
              <Image style={styles.menuIcon} source={require('../../assets/images/ypa/new-images/rocket-white.png')} />
            </View>
            <View style={styles.rightArea}>
              <Text style={styles.menuTitle}>Opportunities</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { props.navigation.closeDrawer(); props.navigation.navigate('EmployersPage'); }}>
          <View style={styles.singleMenuItem}>
            <View style={styles.leftArea}>
              <Image style={styles.menuIcon} source={require('../../assets/images/ypa/new-images/briefcase-white.png')} />
            </View>
            <View style={styles.rightArea}>
              <Text style={styles.menuTitle}>Employers</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { props.navigation.closeDrawer(); props.navigation.navigate('EventsScreen'); }}>
          <View style={styles.singleMenuItem}>
            <View style={styles.leftArea}>
              <Image style={styles.menuIcon} source={require('../../assets/images/ypa/new-images/event-white.png')} />
            </View>
            <View style={styles.rightArea}>
              <Text style={styles.menuTitle}>Industry Events</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { props.navigation.closeDrawer(); props.navigation.navigate('EventMediaList'); }}>
          <View style={styles.singleMenuItem}>
            <View style={styles.leftArea}>
              <Image style={styles.menuIcon} source={require('../../assets/images/ypa/new-images/past-events-white.png')} />
            </View>
            <View style={styles.rightArea}>
              <Text style={styles.menuTitle}>Past Events</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { props.navigation.closeDrawer(); props.navigation.navigate('Insights'); }}>
          <View style={styles.singleMenuItem}>
            <View style={styles.leftArea}>
              <Image style={styles.menuIcon} source={require('../../assets/images/ypa/new-images/bulb-white.png')} />
            </View>
            <View style={styles.rightArea}>
              <Text style={styles.menuTitle}>Insights</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { props.navigation.closeDrawer(); authUser ? props.navigation.navigate('Notifications') : goToRegister(); }}>
          <View style={styles.singleMenuItem}>
            <View style={styles.leftArea}>
              <Image style={styles.menuIcon} source={require('../../assets/images/ypa/new-images/heart-white.png')} />
            </View>
            <View style={styles.rightArea}>
              <Text style={styles.menuTitle}>Talent Spot</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => { props.navigation.closeDrawer(); authUser ? props.navigation.navigate('AppliedJobs') : goToRegister(); }}>
          <View style={styles.singleMenuItem}>
            <View style={styles.leftArea}>
              <Image style={styles.menuIcon} source={require('../../assets/images/ypa/new-images/check-white.png')} />
            </View>
            <View style={styles.rightArea}>
              <Text style={styles.menuTitle}>Applied Jobs</Text>
            </View>
          </View>
        </TouchableOpacity>

 

        <View style={styles.divider}></View>

        <TouchableOpacity onPress={() => { props.navigation.closeDrawer(); goToDynamicPage('help-and-support'); }}>
          <View style={styles.singleMenuItem}>
            
            <View style={styles.rightArea}>
              <Text style={styles.menuTitleSmall}>Help & Support</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { props.navigation.closeDrawer(); props.navigation.navigate('ContactUs'); }}>
          <View style={styles.singleMenuItem}>
            
            <View style={styles.rightArea}>
              <Text style={styles.menuTitleSmall}>Contact Us</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { props.navigation.closeDrawer(); goToDynamicPage('terms-of-services'); }}>
          <View style={styles.singleMenuItem}>
            
            <View style={styles.rightArea}>
              <Text style={styles.menuTitleSmall}>Terms of services</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { props.navigation.closeDrawer(); goToDynamicPage('privacy-policy'); }}>
          <View style={styles.singleMenuItem}>
            
            <View style={styles.rightArea}>
              <Text style={styles.menuTitleSmall}>Safeguarding</Text>
            </View>
          </View>
        </TouchableOpacity>

        













        

        

      </View>



      



    </ScrollView>


    

    <View style={{paddingHorizontal:responsiveWidth(4)}}>
      <View style={styles.divider}></View>
    </View>

    <View style={styles.sideBySide}>

      

      { authUser ? <>
        
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
          <View style={{width:responsiveWidth(40)}}>
          <TouchableOpacity style={styles.userInfo} onPress={() => { props.navigation.closeDrawer(); authUser ? props.navigation.navigate('ProfilePage') : null; }}>
            <Image style={styles.userImage} source={{uri: authUser.profile_picture}} resizeMode="cover" />
            <View style={{width:responsiveWidth(30)}}>
              <Text style={styles.userName} numberOfLines={1}>{authUser.name}</Text>
              {/* <Text style={styles.userEmail}>Member since {moment(authUser.created).format("MMM DD, YYYY")}</Text> */}
              <Text style={styles.userEmail}>{authUser.email}</Text>
            </View>
          </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => { props.navigation.closeDrawer(); authUser ? logout() : null; }}>
            <Image style={styles.logout} source={require('../../assets/images/ypa/new-images/exit-white.png')} resizeMode="contain" />
          </TouchableOpacity>
        </View>

      </>: <>
        <TouchableOpacity style={styles.userInfo} onPress={() => { props.navigation.closeDrawer();goToRegister(); }}>
          <Image style={styles.userImage} source={require('../../assets/images/ypa/userImage.png')} resizeMode="cover" />
          <View>
            <Text style={styles.guest}>Guest User</Text>
            <Text style={styles.clickToLogin}>Click here to login</Text>
          </View>
        </TouchableOpacity>

        
      </> }

      
    </View>

    {/* <View style={styles.bottomArea}>
      <Text style={styles.versiontext}>Version {DeviceInfo.getVersion()}</Text>
    </View> */}

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    
    // backgroundColor:"yellow",
    width:responsiveWidth(60)
  },
  sideBySide:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    // backgroundColor:"red",
    paddingHorizontal: responsiveWidth(4),
    paddingBottom:responsiveHeight(3)
  },
  logout:{
    width:responsiveWidth(6),
    height:responsiveHeight(6),
  },
  drawerImage:{
    width:responsiveWidth(60),
    resizeMode:"contain",
    height:responsiveHeight(10),
  },
  divider:{
    height:1,
    backgroundColor:"#ffffff",
    opacity:0.2,
    marginBottom:responsiveHeight(3)
  },
  parentWrapper:{
    flex:1,
    borderLeftWidth:0,
    borderColor:"#013b75"
  },
  header: {
    width: "100%",
    //height:responsiveHeight(20),
    //backgroundColor:"red",
    paddingTop:responsiveHeight(2),
  },
  hr:{ 
    height:1,
    backgroundColor:"#ffffff",
    width:"100%",
    marginBottom:responsiveHeight(3.5),
    marginTop:responsiveHeight(1),
    opacity:0.4
  },
  laserLightWrapper:{
    marginBottom:responsiveHeight(3.5),
    marginTop:responsiveHeight(1),
    // position:"absolute",
    // bottom:-responsiveHeight(3.8),
    // left:responsiveWidth(5),
    // right:responsiveWidth(5),
  },
  laserLight:{
    width:responsiveWidth(56),
    height:responsiveHeight(4),
    resizeMode:"contain",
    // backgroundColor:"red"
    // left:0,
    // right:0,
  },
  topWhiteCircleWrapper: {
    position: "absolute",
    top: -responsiveWidth(10),
    right: -responsiveWidth(10),
  },
  topWhiteCircle: {
    height: responsiveWidth(25),
    width: responsiveWidth(25),
    borderRadius: 200,
    backgroundColor: "#ffffff",
   
  },
 
  userImage: {
    height: responsiveWidth(13),
    width: responsiveWidth(13),
    resizeMode: "contain",
    borderRadius: 500,
    marginRight: responsiveWidth(2.5)
  },
  guest: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2),
    color: "#ffffff",
  },
  clickToLogin:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(1.5),
    color: "#ffffff",
  },
  userName: {
    fontFamily: "FuturaLT-Bold",
    fontSize: responsiveFontSize(2.1),
    color: "#ffffff",
  },
  userEmail: {
    fontFamily: "FuturaLT",
    fontSize: responsiveFontSize(1.5),
    color: "#ffffff",
    opacity:0.4
  },
  userMobile: {
    fontFamily: "FuturaLT",
    fontSize: responsiveFontSize(1.5),
    color: "#ffffff",
  },
  location: {
    fontSize: responsiveFontSize(1.6),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",

  },


  allMenuContainer: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop:responsiveHeight(1)
  //  backgroundColor:"red"
  },
  singleMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveHeight(3.8)
  },
  leftArea: {
    // backgroundColor: "#0065cb",
    // height: responsiveWidth(8.5),
    // width: responsiveWidth(8.5),
    // alignItems:"center",
    // justifyContent:"center",
    // borderRadius: 8,
    marginRight: responsiveWidth(6),
    // marginTop: -responsiveFontSize(0.7),
  },
  menuIcon: {
    height: responsiveWidth(5),
    width: responsiveWidth(5),
    resizeMode: "contain",
  },
  menuTitle: {
    fontSize: responsiveFontSize(2.1),
    lineHeight: responsiveFontSize(2.5),
    color: "#ffffff",
    fontFamily: "Poppins-Light"
  },
  menuTitleSmall: {
    fontSize: responsiveFontSize(1.8),
    lineHeight: responsiveFontSize(2.2),
    color: "#ffffff",
    fontFamily: "Poppins-Light"
  },
  menuSubTitle: {
    fontSize: responsiveFontSize(1.4),
    lineHeight: responsiveFontSize(2.5),
    color: "#ffffff",
    fontFamily: "FuturaLT"
  },
  bottomArea: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    // backgroundColor:"green",
    alignItems: "center",
    justifyContent: "center"
  },
  menuLogo: {
    height: responsiveWidth(8),
    width: responsiveWidth(35),
    resizeMode: "contain",

  },
  versiontext: {
    marginBottom: 10,
    marginTop: 5,
    color: "#ffffff",
    opacity: 0.5,
    fontFamily: "FuturaLT",
    fontSize: responsiveFontSize(1.5),
    color: "#ffffff",
  }




});