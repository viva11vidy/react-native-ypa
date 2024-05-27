import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight, Keyboard, ActivityIndicator, PermissionsAndroid, Animated,TouchableWithoutFeedback  } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import RBSheet from "react-native-raw-bottom-sheet";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faSearch, faSortAmountDown, faChevronLeft, faDotCircle, faEllipsisV, faUserAlt, faEnvelope, faPhoneAlt, faCalendar, faIdBadge, faMale, faUserGraduate, faSchool, faStreetView, faHeartbeat, faBriefcase, faBook } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { StackActions } from '@react-navigation/native';
import moment from 'moment';
import { Shadow } from 'react-native-shadow-2';


import globals from './../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
import styles from './StyleSheet';

export default ProfileScreen = props => {

  const scrollA = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user); 
  const mycourses = useSelector(state => state.auth.courses).filter(myCourse => myCourse.course.length); 
  const [certificates, setCertificates] = useState([]); 
  const [selectedSectorOfInterest, setSelectedSectorOfInterest] = useState(authUser && authUser.profile && authUser.profile.interested_job_sectors ? authUser.profile.interested_job_sectors : []);
  const [interestedJobSectors, setInterestedJobSectors] = useState([]); 
  const profileOptionSheetRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData(true);
  }, [dispatch]);

  const fetchData = async refresh => {
    await getInterestedJobSectors();
    await getCertificates();
    setIsLoading(false);
  };

  const getInterestedJobSectors = async () => {
    let params = {
      perpage: 1000,
      page: 1,
    }
    try {
      let data = await dispatch(commonActions.getCategories(params));
      if(data.length) {
        setInterestedJobSectors(data);
      }
    } catch(err) {
      console.log(err.toString());
    } 
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

  const goToLogin = () => {
    props.navigation.navigate('Login'); 
  }
  const goToSignUp = () => {
    props.navigation.navigate('SignUp');
  }

  const goToEditProfile = () => {
    props.navigation.navigate('EditProfile');
  }

  const goBack = () => {
    props.navigation.goBack();
  }
  
  const goToChangePassword = () => {
    props.navigation.navigate('ChangePassword');
  }


  if(!authUser) {
    return <></>;
  }


  state = {
    animation: new Animated.Value(0),
  };


  toggleOpen = () => {
    Animated.timing(this.state.animation, {
      toValue: 1,
      duration: 800

    }).start()


  };



  const scaleInterpolate = this.state.animation.interpolate(

    {
      inputRange: [0, 1],
      outputRange: [0, 10]
    }

  )
  backgroundStyle = {
    transform: [
      {
        scale: scaleInterpolate,
      }
    ]

  }
  
 
  return (
    <>
    <View style={{flex:1,backgroundColor:"#005ba6"}}>
      <Shadow style={{width:responsiveWidth(100)}} distance={5} startColor={'#0000000d'} >
        <View style={{...styles.mainHeader, backgroundColor:"#3895fc",borderBottomColor:"#50a1ff",}}>
          <View>
            <View style={styles.sideBySide}>
              <Text style={{...styles.pageName,color:"#ffffff"}}>Profile</Text>
            </View>
          </View>
          <View style={styles.sideBySide}>
            <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
              <LinearGradient colors={['#ffffff', '#ffffff']} style={styles.menuButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={{...styles.menuLongLine, backgroundColor:"#3895fc",}}></View>
                <View style={{...styles.menuMediumLine, backgroundColor:"#3895fc",}}></View>
                <View style={{...styles.menuSmallLine, backgroundColor:"#3895fc",}}></View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Shadow>
      <Animated.ScrollView
        // onScroll={e => console.log(e.nativeEvent.contentOffset.y)}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollA}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bannerContainer}>
          <Animated.View style={{...styles.banner(scrollA), height:responsiveHeight(27)}}>
            <LinearGradient colors={['#3895fc', '#005ba6']} style={{height:"100%",paddingHorizontal:responsiveWidth(3),paddingTop:responsiveHeight(4)}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>

              <View style={styles.sideBySide}>
                <Image style={stylesInline.profileBg} source={{uri: authUser.profile_picture}} />
                <View style={{marginLeft:responsiveWidth(5)}}>
                  <Text style={stylesInline.profileTitle}>{authUser.name}</Text>
                  <View style={{marginTop:responsiveHeight(0.4)}}></View>
                  <Text style={stylesInline.profileEmail}>{authUser.email}</Text>
                </View>
              </View>

              <View style={{...styles.sideBySide, marginTop:responsiveHeight(4),justifyContent:"space-between"}}>
                <View style={styles.sideBySide}>
                  <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center",marginRight:responsiveWidth(6)}}>
                    <Text style={stylesInline.profileUpText}>{moment().diff(authUser.profile.dob, 'years', false)} Years</Text>
                    <Text style={stylesInline.profileDownText}>Age</Text>
                  </View>
                  <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <Text  style={stylesInline.profileUpText}>{moment(authUser.created).format("MMM DD, YYYY")}</Text>
                    <Text style={stylesInline.profileDownText}>Member Since</Text>
                  </View>
                </View>
                <View>
                  <TouchableOpacity  onPress={() => {goToEditProfile()}}>
                    <View style={styles.outlineButtonWhite}>
                      <Text style={styles.outlineButtonWhiteText}>Edit Profile</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              
              

            </LinearGradient>
          </Animated.View>
        </View>


        <View style={styles.profileBottom}>
          <Text style={styles.profileSectionHeading}>About Me</Text>
          <View style={{marginBottom:responsiveHeight(4)}}>
            <Text style={styles.profileBio}>{authUser.profile.bio}</Text>
          </View>



          <Text style={styles.profileSectionHeading}>Personal Info</Text>


          <View style={stylesInline.profileInfo}>
            <View style={stylesInline.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#619bca'} size={14} icon={faUserAlt} />
            </View>
            <View>
              <Text style={stylesInline.label}>Name</Text>
              <Text style={stylesInline.content}>{authUser.name}</Text>
            </View>
          </View>
          
          { authUser.email && <View style={stylesInline.profileInfo}>
            <View style={stylesInline.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#619bca'} size={19} icon={faEnvelope} />
            </View>
            <View>
              <Text style={stylesInline.label}>Email ID</Text>
              <Text style={stylesInline.content}>{authUser.email}</Text>
            </View>
          </View> }

          { authUser.complete_mobile_number && <View style={stylesInline.profileInfo}>
            <View style={stylesInline.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#619bca'} size={19} icon={faPhoneAlt} />
            </View>
            <View>
              <Text style={stylesInline.label}>Phone</Text>
              <Text style={stylesInline.content}>{authUser.complete_mobile_number}</Text>
            </View>
          </View> }

          <View style={stylesInline.profileInfo}>
            <View style={stylesInline.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#619bca'} size={19} icon={faCalendar} />
            </View>
            <View>
              <Text style={stylesInline.label}>DOB</Text>
              <Text style={stylesInline.content}>{moment(authUser.profile.dob).format("MMM DD, YYYY")}</Text>
            </View>
          </View>
          <View style={stylesInline.profileInfo}>
            <View style={stylesInline.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#619bca'} size={19} icon={faIdBadge} />
            </View>
            <View>
              <Text style={stylesInline.label}>Ethnicity</Text>
              <Text style={stylesInline.content}>{authUser.profile.ethnicity}</Text>
            </View>
          </View>
          <View style={stylesInline.profileInfo}>
            <View style={stylesInline.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#619bca'} size={19} icon={faMale} />
            </View>
            <View>
              <Text style={stylesInline.label}>Gender:</Text>
              <Text style={stylesInline.content}>{authUser.gender}</Text>
            </View>
            { authUser.profile.current_study_place && <View style={stylesInline.profileInfo}>
              <View style={stylesInline.profileInfoIconWrapper}>
                <FontAwesomeIcon color={'#619bca'} size={19} icon={faStreetView} />
              </View>
              <View>
                <Text style={stylesInline.label}>Postcode</Text>
                <Text style={stylesInline.content}>{authUser.profile.current_study_place}</Text>
              </View>
            </View> }
          </View>
          


          
          
          {/* <View style={{marginBottom:responsiveHeight(2)}}></View> */}

          <Text style={styles.profileSectionHeading}>Professional Info</Text>


          <View style={stylesInline.profileInfo}>
            <View style={stylesInline.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#619bca'} size={19} icon={faUserGraduate} />
            </View>
            <View>
              <Text style={stylesInline.label}>Level of study:</Text>
              <Text style={stylesInline.content}>{authUser.profile.study_level}</Text>
            </View>
          </View>

          { authUser.profile.institute && <View style={stylesInline.profileInfo}>
            <View style={stylesInline.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#619bca'} size={19} icon={faSchool} />
            </View>
            <View>
              <Text style={stylesInline.label}>School</Text>
              <Text style={stylesInline.content}>{authUser.profile.institute}</Text>
            </View>
          </View> }

          { selectedSectorOfInterest.map(sid => interestedJobSectors.find(sector => sector._id == sid)?.name).length > 0 && <View style={stylesInline.profileInfo}>
            <View style={stylesInline.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#619bca'} size={19} icon={faHeartbeat} />
            </View>
            <View>
              <Text style={stylesInline.label}>Interested Sectors:</Text>
              <Text style={stylesInline.content}>{selectedSectorOfInterest.map(sid => interestedJobSectors.find(sector => sector._id == sid)?.name).join(', ')}</Text>
            </View>
          </View> }

          { authUser.profile.skills && authUser.profile.skills.length > 0 && <View style={stylesInline.profileInfo}>
            <View style={stylesInline.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#619bca'} size={19} icon={faBriefcase} />
            </View>
            <View>
              <Text style={stylesInline.label}>Skills:</Text>
              <Text style={stylesInline.content}>{authUser.profile.skills.join(', ')}</Text>
            </View>
          </View> }




          {authUser.profile.subjects.length > 0 && 
          <View style={stylesInline.profileInfo}>
            <View style={stylesInline.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#619bca'} size={19} icon={faBook} />
            </View>
            <View style={{width:responsiveWidth(80)}}>
              <Text style={{...stylesInline.label,marginBottom:10}}>Subjects:</Text>
              { authUser.profile.subjects.map((subject, index) => {
                return (
                  <View key={index} style={stylesInline.singleSubject}>
                    <Text style={stylesInline.contentSubject}><Text style={stylesInline.contentSubjectDark}>Name:</Text> {subject.subject}</Text>
                    <Text style={stylesInline.contentSubject}><Text style={stylesInline.contentSubjectDark}>Grade:</Text> {subject.grade}</Text>
                    <Text style={stylesInline.contentSubject}><Text style={stylesInline.contentSubjectDark}>Actual / Predicted:</Text> {subject.type}</Text>
                  </View>
                );
              })}
            </View>
          </View> 
          }

          <View style={{width:"100%",flexDirection:"row", alignItems:"center",justifyContent:"space-between"}}>
            <TouchableOpacity onPress={() => {props.navigation.navigate('MyWorkshops')}}>
              <LinearGradient colors={['#3895fc', '#005ba6']} style={{...styles.solidButtonPrimary,width:responsiveWidth(46)}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                <Text style={styles.solidButtonPrimaryText}>My Workshops</Text> 
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {props.navigation.navigate('MyCertificates')}}>
              <LinearGradient colors={['#3895fc', '#005ba6']} style={{...styles.solidButtonPrimary,width:responsiveWidth(46)}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                <Text style={styles.solidButtonPrimaryText}>Certificates</Text> 
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{width:"100%",marginTop:responsiveHeight(1)}}>
            <TouchableOpacity onPress={() => {goToChangePassword()}}>
              <LinearGradient colors={['#3895fc', '#005ba6']} style={styles.solidButtonPrimary} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                <Text style={styles.solidButtonPrimaryText}>Change Password</Text> 
              </LinearGradient>
            </TouchableOpacity>
          </View>

          

          <View style={{width:"100%"}}>
            
          </View>

          



        </View>
      </Animated.ScrollView>
    </View>
    






















    {false &&
      <ScrollView style={styles.container}>


          

        <RBSheet
          ref={profileOptionSheetRef}
          closeOnDragDown={true}
          closeOnPressMask={true}
          dragFromTopOnly={true}
          height={responsiveHeight(26)}
          animationType={'none'}
          customStyles={{
            container: {
              opacity: 1,
              position: "absolute",
              zIndex: 2,
              bottom: 0,
              backgroundColor: "#ffffff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              //borderTopWidth:1,
              // borderColor:"red"
            },
            draggableIcon: {
              backgroundColor: "#999999"
            }
          }}
        >
          <View style={{ paddingHorizontal: responsiveHeight(2), paddingVertical: responsiveHeight(0.5) }}>
            <View style={styles.sheetTitleContainer}>
              <Text style={styles.sheetTitle}>Options</Text>
            </View>
            <ScrollView style={styles.sheetScroll}>

              <TouchableOpacity onPress={() => {profileOptionSheetRef.current.close();goToEditProfile()}}>
                <View style={styles.singleSheetOption}>
                  <Text style={styles.singleSheetText}>Edit Profile</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {profileOptionSheetRef.current.close(); goToChangePassword()}}>
                <View style={styles.singleSheetOption}>
                  <Text style={styles.singleSheetText}>Change Password</Text>
                </View>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </RBSheet>
        



        <View style={styles.profileHeaderWrapper}>

          {/* <TouchableOpacity style={styles.profileBackButton} onPress={() => goBack()}>
            <View style={styles.profileBackButtonView}>
              <FontAwesomeIcon color={'#ffffff'} size={20} icon={faChevronLeft} />
              <Text style={styles.pageHeading}>Profile</Text>
            </View>
          </TouchableOpacity> */}

          <View style={styles.profileBackButton}>
            <View style={styles.profileBackButtonView}>
              <Text style={styles.pageHeading}>Profile</Text>
            </View>
          </View>

          
            <View style={styles.profileOptionButton} >
              <View style={{ flexDirection: "row", alignItems: "center", }}>
                {/* <TouchableOpacity style={styles.profileOptionButtonView} onPress={() => profileOptionSheetRef.current.open()}>
                  <FontAwesomeIcon color={'#ffffff'} size={25} icon={faEllipsisV} />
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.profileOptionButtonView} onPress={() => props.navigation.toggleDrawer()}>
                  <FontAwesomeIcon color={'#007fff'} size={30} icon={faBars} />
                </TouchableOpacity>
              </View>
            </View>
        

          <Image style={styles.mainBg} source={require('../../assets/images/ypa/homepage-bg-light.png')} />
          <View style={styles.headerContentWrapper}>
            <Image style={styles.profileBg} source={{uri: authUser.profile_picture}} />
            <Text  style={styles.profileTitle}>{authUser.name}</Text>
            <View style={{marginVertical:responsiveHeight(0.5)}}>
              <Text  style={styles.profileAge}>{moment().diff(authUser.profile.dob, 'years', false)} Years</Text>
            </View>
            <Text  style={styles.profileJoining}>Member since {moment(authUser.created).format("MMM DD, YYYY")}</Text>
          </View>


        </View>












        






        

        <View style={styles.infoBg}>

          {/* <View style={styles.profileNumberWrapper}>
            <View style={styles.singleProfileNumber}>
              <Text style={styles.profileNumber}>{mycourses.length}</Text>
              <Text style={styles.profileText}>Workshops</Text>
            </View>
            <View style={styles.singleProfileNumber}>
              <Text style={styles.profileNumber}>{certificates.length}</Text>
              <Text style={styles.profileText}>Completed</Text>
            </View>
          </View> */}


          <Text style={styles.bio}>
            {authUser.profile.bio}
          </Text>



        




          <Text style={styles.myInfo}>Personal Info</Text>


          <View style={styles.profileInfo}>
            <View style={styles.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#ffffff'} size={19} icon={faUserAlt} />
            </View>
            <View>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.content}>{authUser.name}</Text>
            </View>
          </View>
          
          { authUser.email && <View style={styles.profileInfo}>
            <View style={styles.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#ffffff'} size={19} icon={faEnvelope} />
            </View>
            <View>
              <Text style={styles.label}>Email ID</Text>
              <Text style={styles.content}>{authUser.email}</Text>
            </View>
          </View> }

          { authUser.complete_mobile_number && <View style={styles.profileInfo}>
            <View style={styles.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#ffffff'} size={19} icon={faPhoneAlt} />
            </View>
            <View>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.content}>{authUser.complete_mobile_number}</Text>
            </View>
          </View> }

          <View style={styles.profileInfo}>
            <View style={styles.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#ffffff'} size={19} icon={faCalendar} />
            </View>
            <View>
              <Text style={styles.label}>DOB</Text>
              <Text style={styles.content}>{moment(authUser.profile.dob).format("MMM DD, YYYY")}</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#ffffff'} size={19} icon={faIdBadge} />
            </View>
            <View>
              <Text style={styles.label}>Ethnicity</Text>
              <Text style={styles.content}>{authUser.profile.ethnicity}</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#ffffff'} size={19} icon={faMale} />
            </View>
            <View>
              <Text style={styles.label}>Gender:</Text>
              <Text style={styles.content}>{authUser.gender}</Text>
            </View>
          </View>


          <View style={styles.laserLightWrapper}>
            {/* <Image style={styles.laserLight} source={require('../../assets/images/ypa/laser-1.png')} /> */}
          </View>


          
          


          <Text style={styles.myInfo}>Professional Info</Text>


          <View style={styles.profileInfo}>
            <View style={styles.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#ffffff'} size={19} icon={faUserGraduate} />
            </View>
            <View>
              <Text style={styles.label}>Level of study:</Text>
              <Text style={styles.content}>{authUser.profile.study_level}</Text>
            </View>
          </View>

          { authUser.profile.institute && <View style={styles.profileInfo}>
            <View style={styles.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#ffffff'} size={19} icon={faSchool} />
            </View>
            <View>
              <Text style={styles.label}>School</Text>
              <Text style={styles.content}>{authUser.profile.institute}</Text>
            </View>
          </View> }
          
          { authUser.profile.current_study_place && <View style={styles.profileInfo}>
            <View style={styles.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#ffffff'} size={19} icon={faStreetView} />
            </View>
            <View>
              <Text style={styles.label}>Postcode</Text>
              <Text style={styles.content}>{authUser.profile.current_study_place}</Text>
            </View>
          </View> }

          { selectedSectorOfInterest.map(sid => interestedJobSectors.find(sector => sector._id == sid)?.name).length > 0 && <View style={styles.profileInfo}>
            <View style={styles.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#ffffff'} size={19} icon={faHeartbeat} />
            </View>
            <View>
              <Text style={styles.label}>Interested Sectors:</Text>
              <Text style={styles.content}>{selectedSectorOfInterest.map(sid => interestedJobSectors.find(sector => sector._id == sid)?.name).join(', ')}</Text>
            </View>
          </View> }

          { authUser.profile.skills && authUser.profile.skills.length > 0 && <View style={styles.profileInfo}>
            <View style={styles.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#ffffff'} size={19} icon={faBriefcase} />
            </View>
            <View>
              <Text style={styles.label}>Skills:</Text>
              <Text style={styles.content}>{authUser.profile.skills.join(', ')}</Text>
            </View>
          </View> }




          {authUser.profile.subjects.length > 0 && 
          <View style={styles.profileInfo}>
            <View style={styles.profileInfoIconWrapper}>
              <FontAwesomeIcon color={'#ffffff'} size={19} icon={faBook} />
            </View>
            <View style={{width:responsiveWidth(80)}}>
              <Text style={{...styles.label,marginBottom:10}}>Subjects:</Text>
              { authUser.profile.subjects.map((subject, index) => {
                return (
                  <View key={index} style={styles.singleSubject}>
                    <Text style={styles.contentSubject}><Text style={styles.contentSubjectDark}>Name:</Text> {subject.subject}</Text>
                    <Text style={styles.contentSubject}><Text style={styles.contentSubjectDark}>Grade:</Text> {subject.grade}</Text>
                    <Text style={styles.contentSubject}><Text style={styles.contentSubjectDark}>Actual / Predicted:</Text> {subject.type}</Text>
                  </View>
                );
              })}
            </View>
          </View> 
          }



          <View style={{height:25}}>

          </View>


          <View style={styles.bottomButtonArea}>
            <TouchableOpacity onPress={() => {goToEditProfile()}}>
              <View style={styles.companyButton}>
                <Text style={styles.companyButtonText}>Edit Profile</Text> 
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomButtonArea}>
            <TouchableOpacity onPress={() => {goToChangePassword()}}>
              <View style={{...styles.companyButton,backgroundColor:"#0065cb"}}>
                <Text style={{...styles.companyButtonText,color:"#ffffff"}}>Change Password</Text> 
              </View>
            </TouchableOpacity>
          </View>















          {/* <Text style={styles.myInfo}>My Information</Text> */}
          

        </View>
        

      </ScrollView>
    }
    </>
    
    
  );


}

const stylesInline = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    backgroundColor: "#038cfc",
    position: "absolute",
    width: 60,
    height: 60,
    bottom: 20,
    right: 20,
    borderRadius: 30,
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: '#038cfc',
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#333",
    shadowOpacity: 0.8,
    shadowOffset: { x: 2, y: 0 },
    shadowRadius: 2,
    borderRadius: 30,
    // position: "absolute",
    bottom: 20,
    right: 20,
  },
  text: {
    color: "#FFF",
  },








  container: {
    flex: 1,
    backgroundColor:"#000000"
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
  pageHeading: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(3),
    color: "#007fff",
    position: "relative",
    top: 1,
    marginLeft: responsiveWidth(2)
  },
  profileHeaderWrapper:{
    height:responsiveHeight(35),
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
    top:responsiveHeight(8),
    position:"absolute",
    alignItems:"center",
    // justifyContent:"center"
  },
  profileBg:{
    height:responsiveHeight(9),
    width:responsiveHeight(9),
    resizeMode:"cover",
    borderRadius:100,
    borderWidth:2,
    borderColor:"#ffffff",
    // elevation:10
  },
  profileTitle:{
    fontSize: responsiveFontSize(2.2),
    color: "#ffffff",
    fontFamily: "Poppins-Bold",
  },
  profileEmail:{
    fontSize: responsiveFontSize(1.8),
    color: "#ffffff",
    fontFamily: "Poppins-Light",
    opacity:0.8
  },
  profileUpText:{
    fontSize: responsiveFontSize(1.8),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
  },
  profileDownText:{
    fontSize: responsiveFontSize(1.6),
    color: "#ffffff",
    fontFamily: "Poppins-Light",
    opacity:0.8
  },
  profileAge:{
    fontSize: responsiveFontSize(2.2),
    color: "#007fff",
    fontFamily: "Poppins-Light",
    marginVertical:responsiveHeight(0.1),
    opacity:1
  },
  profileJoining:{
    fontSize: responsiveFontSize(2.2),
    color: "#007fff",
    fontFamily: "Poppins-Light",
    opacity:0.9
  },


  profileNumberWrapper:{
    position:"absolute",
    zIndex:99999,
    top:-responsiveHeight(6),
    width:responsiveWidth(90),
    alignSelf:"center",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-evenly",
    // borderWidth:2,
    // borderColor:"#007bff",
    backgroundColor:"#013b75",
    borderRadius:10,
    paddingVertical:responsiveHeight(0.5),
    elevation:5
  },
  singleProfileNumber:{
    alignItems:"center",
    justifyContent:"center"
  },
  profileNumber:{
    fontSize: responsiveFontSize(4.1),
    color: "#2498fd",
    fontFamily: "Poppins-SemiBold",
    height:responsiveHeight(6),
  },
  profileText:{
    fontFamily: "Poppins-Light",
    color: "#ffffff",
    fontSize: responsiveFontSize(2.1),
  },




  infoBg:{
    backgroundColor:"#ebf1ff",
    height:"100%",
    paddingTop:responsiveHeight(0),
    width:responsiveWidth(100),
    paddingHorizontal:responsiveWidth(5)
  },
  myInfo:{
    fontSize: responsiveFontSize(2.4),
    fontFamily: "Poppins-SemiBold",
    color: "#000000",
    marginBottom:responsiveHeight(2.5)
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
    width:responsiveWidth(90),
    height:responsiveHeight(7),
    resizeMode:"contain",
    // backgroundColor:"red"
    // left:0,
    // right:0,
  },
  profileInfo:{
    marginBottom:responsiveHeight(2),
    flexDirection:"row",
    // alignItems:"center",
    // justifyContent:"space-between",
  },
  profileInfoIconWrapper:{
    height:responsiveWidth(10),
    width:responsiveWidth(10),
    borderRadius:10,
    alignItems:"center",
    justifyContent:"center",
    marginRight:15,
    backgroundColor:"#f4faff",
  },
  label:{
    fontSize: responsiveFontSize(1.8),
    fontFamily: "Poppins-SemiBold",
    color: "#000000",
    // width:responsiveWidth(30)
  },
  content:{
    fontSize: responsiveFontSize(1.8),
    fontFamily: "Poppins-Light",
    color: "#000000",
    marginTop:responsiveHeight(0),
    width:responsiveWidth(80)

    // paddingLeft:responsiveWidth(2)
  },
  contentSubject:{
    fontSize: responsiveFontSize(1.9),
    fontFamily: "Poppins-Light",
    color: "#000000",
    marginTop:responsiveHeight(0),

    
  },
  contentSubjectDark:{
    fontSize: responsiveFontSize(1.7),
    fontFamily: "Poppins-SemiBold",
    color: "#000",
   
  },

  bio:{
    fontSize: responsiveFontSize(2),
    fontFamily: "Poppins-Light",
    color: "#000000",
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
    fontFamily: "Poppins-SemiBold",
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
    borderColor:"#eeeeee",
    borderRadius:6,
    padding:8,
    marginBottom:10,
    width:responsiveWidth(73) 
  },

  bottomButtonArea:{
    //backgroundColor:"red",
    // width: responsiveWidth(100),
    //paddingHorizontal:responsiveWidth(5),
    paddingBottom:responsiveHeight(2),
    paddingTop:responsiveHeight(0),
    // marginVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  companyButton: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width:responsiveWidth(90),
    height: responsiveHeight(6.5),
  },
  companyButtonText: {
    fontSize: responsiveFontSize(2.5),
    color: "#0065cb",
    fontFamily: "Poppins-SemiBold",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },




});
