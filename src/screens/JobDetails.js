import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView, TouchableHighlight, Keyboard, ScrollView, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, Animated, Platform, TouchableWithoutFeedback } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize, } from "react-native-responsive-dimensions";
import { StackActions } from '@react-navigation/native';
import RadioButton from 'radio-button-react-native';
// import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faSearch, faSortAmountDown, faClock, faSuitcase, faPoundSign, faMapMarkerAlt, faBookmark, faBriefcase, faMoneyBill, faMoneyBillAlt, faMoneyBillWave, faMoneyBillWaveAlt } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../components/Pagination';
import RBSheet from "react-native-raw-bottom-sheet";
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import moment from 'moment';
import ScaledImage from 'react-native-scalable-image';
import { WebView } from 'react-native-webview';
import { Shadow } from 'react-native-shadow-2';
import HTMLView from 'react-native-htmlview';
import * as Animatable from 'react-native-animatable';

import { useSelector, useDispatch } from 'react-redux';
import globals from '../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';

import NotificationListener from '../navigation/NotificationListener';
import styles from './StyleSheet';

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

const fontUrl = Platform.select({
  ios: "Poppins-Light.ttf",
  android: "file:///android_asset/fonts/Poppins-Light.ttf",
});

const HTML = `
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>

    @font-face {
      font-family: 'Poppins-Light'; 
      src: url('${fontUrl}') format('truetype')
    }

    body {
      font-size:14px;
      color:#222222;
      font-family: 'Poppins-Light';
    }
    p {
      color:#222222;
      font-size: 14px;
      font-family: 'Poppins-Light';
      margin-bottom:0
    }
  </style>
`
;

export default OpportunityDetails = props => {

  const scrollA = useRef(new Animated.Value(0)).current;

  const scrollY = new Animated.Value(0);
  

  const HEADER_MAX_HEIGHT = responsiveHeight(48);
  const HEADER_MIN_HEIGHT = responsiveHeight(9);
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const dispatch = useDispatch();

  const job = props.route.params.job;
  const savedJobs = useSelector(state => state.auth.savedJobs);
  // const [job, setJob] = useState(props.route.params.job);

  // const [job, setJob] = useState('63456ad07f32a9491d8a7b26');

  const [textShown, setTextShown] = useState(false);
  const [lengthMore,setLengthMore] = useState(false);

  const authUser = useSelector(state => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]); 

  const [selectedSort, setSelectedSort] = useState('Name A to Z');
  const [loginPopup, setLoginPopup] = useState(false);
  const [applyPopup, setApplyPopup] = useState(false);
  const [registerYourInterestPopup, setRegisterYourInterestPopup] = useState(false);
  const sortSheetRef = useRef(null);
  const swiper = useRef();
  const [swipeIndex, setSwipeIndex] = useState(0);
  const scrollRef = useRef();
  const [htmlHeight, setHtmlHeight] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

  const [webViewHeight, setWebViewHeight] = useState(null);
  const onMessage = (event) => {
    // console.log(event.nativeEvent.data);
    let data = JSON.parse(event.nativeEvent.data);
    setWebViewHeight(data.height);
  }
  const injectedJavaScript=`
    setTimeout(function() { 
      window.ReactNativeWebView.postMessage(
        JSON.stringify({height: Math.max(document.body.offsetHeight, document.body.scrollHeight), index: 0})
      );
    }, 500);
  `;

  useEffect(() => {
    fetchData(true);
    
  }, [dispatch]);

  const fetchData = async refresh => {
    if(!job.title) {
      try {
        let res = await dispatch(commonActions.getJobs({id: job._id}));
        if(res.length) {
          setJob(res[0]);
        }
      } catch (error) {
        
      }
      
    }
    authUser && await getAppliedJobs();
    authUser && await getSavedJobs();
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
        setAppliedJobs([...data]);
      } 
    } catch(err) {
      console.log(err.toString());
    } 
  };

  // useEffect(() => {
  //   console.log('-----------------------------------------------')
  //   console.log(swiper.current.state.index);
  // }, []);

  const goToEmployerDetails = company => {
    props.navigation.navigate('EmployerDetails', {company: company});
  }

  const goToRegister = () => {
    setLoginPopup(false);
    props.navigation.dispatch(StackActions.replace('AuthNav'));
  }

  const goToEditProfile = () => {
    setApplyPopup(false);
    props.navigation.navigate('EditProfile');
  }
  

  const swipe = (index) => {

    // console.log(swiper.current.state.index);
    // if(swiper.current.state.index == 0) {
    // console.log(index);
    setSwipeIndex(index);
    
    if (index > 1) {
      // console.log('asas');
      scrollRef.current?.scrollTo({
        x: 400,
        animated: true,
      });
    } else if (index < 2) {
      scrollRef.current?.scrollTo({
        x: 0,
        animated: true,
      });
    }

    // } else if(swiper.current.state.index == 1) {
    //   setSwipeIndex(1)
    // }else if(swiper.current.state.index == 2) {
    //   setSwipeIndex(2)
    // }else if(swiper.current.state.index == 3) {
    //   setSwipeIndex(3)
    // }
  };

  const loginModal = () => {
    setLoginPopup(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver:true
    }).start();
  }

  const applyJobModal = () => {
    setApplyPopup(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver:true
    }).start();
  }

  const registerYourInterest = async () => {
    try {
      let data = {
        job : job._id
      }
      let response = await dispatch(authActions.applyJob(data));
      setAppliedJobs(appliedJobs => [...appliedJobs, response]);
      setRegisterYourInterestPopup(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver:true
      }).start();
    } catch(err) {
      console.log(err.toString());
    } 
    
  }


  
  const applyJob = async () => {
    setApplyPopup(false);
    if(typeof job.url == 'string' && job.url != '') {
      openUrl(job.url);
    }
    try {
      let data = {
        job : job._id
      }
      let response = await dispatch(authActions.applyJob(data));
      setAppliedJobs(appliedJobs => [...appliedJobs, response]);
    } catch(err) {
      console.log(err.toString());
    } 
  }

  const openUrl = uri => {
    props.navigation.navigate('WebPage', {uri: uri});
  }

  const addToWishlist = async eid => { 
    try {
      let response = await dispatch(authActions.addToWishlist(eid, 'Job'));
      dispatch(authActions.setSavedJobs([{...response, job: [{...job}]}], false));
    } catch(err) {
      commonActions.setSystemMessage('Unknown error occured');
    }
  };

  const removeFromWishlist = async eid => { 
    try {
      let res = await dispatch(authActions.removeFromWishlist(eid));
      let savedIndex = savedJobs.findIndex(savedJob => savedJob._id == res._id);
      dispatch(authActions.setSavedJobs([{...savedJobs[savedIndex]}], false));
      
    } catch(err) {
      commonActions.setSystemMessage('Unknown error occured');
    }
  };

  const getSavedJobs = async () => {
    try {
      let savedJobs = await dispatch(authActions.getMyWishlist({page: 1, perpage: 10000, type: 'Job'}));
    } catch (error) {}
  }; 


  find_dimesions = (layout) => {
    const {x, y, width, height} = layout;
    setHtmlHeight(height);
  }
  

  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  }

  const onTextLayout = useCallback(e =>{
    setLengthMore(e.nativeEvent.lines.length >=4); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  },[]);

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const imageOpacityReverse = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 2],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -70],
    extrapolate: 'clamp',
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const textColor = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 2],
    outputRange: ['#ffffff', '#000000']
  });
  
  const bgColor = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: ['rgba(0, 0, 0, 0.5)', '#ffffff']
  });


  if(!job.title && isLoading) {
    return(
      <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(20)}}>
        <ActivityIndicator size="large" color={'#007fff'} />
      </View>
    );
  }


  if(!job.title && !isLoading) {
    return(
      <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(20)}}>
        <Image style={styles.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
        <Text style={styles.noDataTitle}>No Job Found</Text>
      </View>
    );
  }

  return (

    <View>
      
      

    <Modal visible={loginPopup} animationType="fade" transparent={true} onRequestClose={() => null} >    
      <View style={styles.centeredView}>
        <LinearGradient colors={['#ffffff', '#ffffff']} style={{...styles.mainAreaPopup,paddingTop:responsiveHeight(2)}} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
          <View style={styles.mainTitleWrapper}>
            <View style={{}}>
              <Text style={styles.mainTitlePopup}>Account Verification Required</Text>
            </View>
            
            <View style={{paddingTop:responsiveHeight(1)}}>
              <Text style={styles.mainTitlePopupLight}>You need to login first to apply for this job</Text>
            </View>

            
          </View>
          <View style={styles.popupBtnWraper}>
            <TouchableOpacity onPress={() => setLoginPopup(false)}>
              <LinearGradient colors={['#ddd', '#ddd']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.applyFilterButtonCancel}>
                <Text style={styles.applyFilterButtonCancelText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goToRegister()}>
              <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.applyFilterButton, width:responsiveWidth(28),}}>
                <Text style={styles.applyFilterButtonText}>Go to Login</Text>
              </LinearGradient>
            </TouchableOpacity>


            
          </View>
        </LinearGradient>


      </View>
    </Modal>

    <Modal visible={applyPopup} animationType="fade" transparent={true} onRequestClose={() => null} >    
      <View style={styles.centeredView}>
        <LinearGradient colors={['#ffffff', '#ffffff']} style={{...styles.mainAreaPopup,paddingTop:responsiveHeight(2)}} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
          <View style={styles.mainTitleWrapper}>
            <View style={{}}>
              <Text style={styles.mainTitlePopup}>Are you sure ?</Text>
            </View>
            
            <View style={{paddingTop:responsiveHeight(1)}}>
              <Text style={styles.mainTitlePopupLight}>Make sure you have</Text>
                <TouchableOpacity onPress={() => goToEditProfile()}>
                  
                  <Text style={{...styles.mainTitlePopupLight,fontFamily:"Poppins-SemiBold"}}>updated your profile</Text>
                  
                </TouchableOpacity> 
              <Text style={styles.mainTitlePopupLight}>before applying for this job</Text>
            </View>

            
          </View>
          <View style={styles.popupBtnWraper}>
            <TouchableOpacity onPress={() => setApplyPopup(false)}>
              <LinearGradient colors={['#ddd', '#ddd']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.applyFilterButtonCancel}>
                <Text style={styles.applyFilterButtonCancelText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => applyJob()}>
              <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.applyFilterButton, width:responsiveWidth(26),}}>
                <Text style={styles.applyFilterButtonText}>Apply</Text>
              </LinearGradient>
            </TouchableOpacity>


            
          </View>
        </LinearGradient>


      </View>
    </Modal>

    <Modal visible={registerYourInterestPopup} animationType="fade" transparent={true} onRequestClose={() => null} >    
      <View style={styles.centeredView}>
        <LinearGradient colors={['#ffffff', '#ffffff']} style={{...styles.mainAreaPopup,paddingTop:responsiveHeight(2)}} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
          <View style={styles.mainTitleWrapper}>
            <View style={{}}>
              <Text style={styles.mainTitlePopup}>Thank You!</Text>
            </View>
            
            <View style={{paddingTop:responsiveHeight(1)}}>
              <Text style={styles.mainTitlePopupLight}>Thanks for showing your interest. We will get back to you when the job will be live.</Text>
            </View>

            
          </View>
          <View style={styles.popupBtnWraper}>
            <TouchableOpacity onPress={() => setRegisterYourInterestPopup(false)}>
              <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.applyFilterButton, width:responsiveWidth(26),}}>
                <Text style={styles.applyFilterButtonText}>Close</Text>
              </LinearGradient>
            </TouchableOpacity>


            
          </View>
        </LinearGradient>


      </View>
    </Modal>



               
      <View>
        <ScrollView scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],{useNativeDriver: false}
        )}>
          <View style={styles.scrollViewContent}>

            

            { ((job.locations && job.locations.length > 0) || job.location) && <>
              <View style={styles.sideBySide}>
                <Image style={styles.salaryIcon} source={require('../../assets/images/ypa/new-images/map-marker-blue.png')} />
                <Text style={styles.jdLocation}>
                  {job.locations && job.locations.length > 0 ? <>
                    {job.locations.map((single, index) => {
                      return (<Text key={index}>{single} {index < job.locations.length - 1 ? ", " : " "}</Text>)
                    })}
                  </> : <>
                    <Text>{job.location}</Text>
                  </>}
                  
                </Text>
              </View>
            </> }

            <View style={styles.jdOptionWrapper}>
              <Shadow distance={5} startColor={'#0000000d'} >
                <View style={styles.jdSingleOption}>
                  <Image style={styles.jdSingleOptionIcon} source={require('../../assets/images/ypa/new-images/clock-blue.png')} />
                  <Text style={styles.jdSingleOptionTitle}>Posted</Text>
                  <Text style={styles.jdSingleOptionSubTitle}>{moment(job.created).format("DD/MM/YYYY")}</Text>
                </View>
              </Shadow>

              <Shadow distance={5} startColor={'#0000000d'} >
                <View style={styles.jdSingleOption}>
                  <Image style={styles.jdSingleOptionIcon} source={require('../../assets/images/ypa/new-images/building-blue.png')} />
                  <Text style={styles.jdSingleOptionTitle}>Job Sector</Text>
                  <Text style={styles.jdSingleOptionSubTitle}>{job.category[0].name}</Text>
                </View>
              </Shadow>
            </View>

            <View style={{height:responsiveHeight(2.2)}}></View>

            <Shadow distance={5} startColor={'#0000000d'} >
              <View style={{...styles.jdSingleOption, width: responsiveWidth(92), }}>
                <Image style={styles.jdSingleOptionIcon} source={require('../../assets/images/ypa/new-images/list-blue.png')} />
                <Text style={styles.jdSingleOptionTitle}>Job Role</Text>
                <Text style={styles.jdSingleOptionSubTitle}>{job.type}</Text>
              </View>
            </Shadow>

            <Text style={{...styles.jdMainContentTitle, marginTop:responsiveHeight(6), marginBottom:responsiveHeight(3)}}>About Job</Text>

            {job.description &&
              <Text style={styles.jdMainContent}>{job.description}</Text>
            }
            
            {/* <WebView  
              originWhitelist={['*']}
              source={{ html: `<body><div>`+HTML+(job.long_description && job.long_description.length? job.long_description : job.description)+`</div></body>`, baseUrl: '' }}
              scrollEnabled={false}
              onMessage={onMessage}
              injectedJavaScript={injectedJavaScript}
              style={{flex: 0, height: webViewHeight,backgroundColor:"#ffffff",marginLeft:-responsiveWidth(2)}}
              
            />
            
            {
              lengthMore ? 
              <Text style={styles.jdMainContentMore} onPress={toggleNumberOfLines}>
                {textShown ? 'Read less' : 'Read more'}
              </Text>
              :null
            } */}

            {job.long_description &&
            <>
              <View style={{marginTop:responsiveHeight(2)}} onLayout={(event) => { this.find_dimesions(event.nativeEvent.layout) }}>
                <View style={textShown ? stylesHTML.nothing : stylesHTML.fourLine}>
                  <HTMLView
                    value={job.long_description.replace(/(\r\n|\n|\r)/gm, '').replace(/<p>&nbsp;<\/p>/g, '').replace(/<li>/g, '<p>')}
                    stylesheet={stylesHTML}
                    addLineBreaks={false}
                    lineBreak={''}
                  />
                </View>
              </View>

              {htmlHeight > 80 &&
                <Text style={styles.jdMainContentMore} onPress={toggleNumberOfLines}>
                  {textShown ? 'Read less' : 'Read more'}
                </Text>
              }
            </>
            }




            <View style={styles.tagWrapper}>

            { job.keywords.map((keyword, index) => {
              return (<View key={index} style={styles.singleTag}>
                <Text style={styles.singleTagText}>{keyword}</Text>
              </View>);
            })}
            </View>



            <View style={styles.jdCompanyWrapper}>
              <View style={{...styles.jobDetailsCompanyLogoWrapper, marginRight:responsiveWidth(6), borderColor:"#f1f1f1", borderWidth:1}}>
                <Image style={styles.jobDetailsCompanyLogo} source={{uri: job.company[0].color_images[0].regular}} />
              </View>
              <View>
                <Text style={styles.jobCompanyName}>{job.company[0].name}</Text>
                <TouchableOpacity onPress={() => goToEmployerDetails(job.company[0])}>
                  <Text style={styles.jobKnowMore}>Know More</Text>
                </TouchableOpacity>
              </View>
            </View>
            


          </View>
        </ScrollView>


        <Animated.View style={[styles.header, {height: headerHeight}]}>

          <Animated.View style={[styles.jdContentWrapper,{opacity: imageOpacity}]}>

          
            <Animatable.View animation="fadeInDown" delay={50} style={styles.jobDetailsCompanyLogoWrapper}>
              <Image style={styles.jobDetailsCompanyLogo} source={{uri: job.company[0].color_images[0].regular}} />
            </Animatable.View>

            <Animatable.Text animation="fadeInLeft" delay={100} style={styles.jdCompanyTitle}>{job.company[0].name}</Animatable.Text>
            <Animatable.Text animation="fadeInLeft" delay={200} style={styles.jdTitle} numberOfLines={3}>{job.title}</Animatable.Text>

            <Animatable.View animation="fadeInLeft" delay={300} style={styles.sideBySide}>
              <Image style={styles.salaryIcon} source={require('../../assets/images/ypa/new-images/coin-white.png')} />
              <Text style={styles.jdSalary}>{job.salary}</Text>
            </Animatable.View>
          </Animated.View>


          <Animated.View style={[styles.bgOverlay, {backgroundColor:bgColor},{height: headerHeight}]}></Animated.View>
          
          
          <Animated.Image animation="fadeIn" delay={100} style={[styles.backgroundImage, {opacity: imageOpacity ,transform: [{translateY: imageTranslate}]},]} source={{uri: job.images[0].regular}}/>

          <Animated.Image style={{position:"absolute",top:0, width:responsiveWidth(100),height:headerHeight,opacity: imageOpacity, transform: [{translateY: imageTranslate}]}} source={require('../../assets/images/ypa/bg-9.jpg')} />


          <View style={styles.bar}>

            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Animated.Image style={[styles.headerBackIcon,{opacity: imageOpacity,zIndex:101},]} source={require('../../assets/images/ypa/new-images/left-arrow-white.png')} />
              <Animated.Image style={[styles.headerBackIcon,]} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />
              <Animated.Text style={[styles.title, {color:textColor}]}>Back</Animated.Text>
            </TouchableOpacity>
          

            <Animated.View style={[styles.headerBorder,{opacity: imageOpacityReverse}]}></Animated.View>
          </View>

 
        </Animated.View>

        
        { !isLoading && <View style={styles.jdFooter}>
          <Shadow distance={5} startColor={'#0000000d'} >
            <View style={styles.jdFooterInner}>
              <Text style={styles.jdFooterText}>Interested ?</Text>
              <View style={styles.sideBySide}>
                { authUser && <>
                  { savedJobs.findIndex(savedJob => savedJob.job[0]._id == job._id) ===  -1 ? <>
                    <TouchableWithoutFeedback onPress={()=> addToWishlist(job._id)}>
                      <View style={styles.jobSaveButton}>
                        <Image style={styles.jobSaveButtonImage} source={require('../../assets/images/ypa/new-images/ribbon-outline-blue.png')} />
                      </View>
                    </TouchableWithoutFeedback>
                  </> : <>
                    <TouchableWithoutFeedback onPress={()=> removeFromWishlist(job._id)}>
                      <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.jobSaveButton, borderColor:"transparent",}}>
                        <Image style={styles.jobSaveButtonImage} source={require('../../assets/images/ypa/new-images/ribbon-white.png')} />
                      </LinearGradient>
                    </TouchableWithoutFeedback>
                  </> }
                </> }

                {job.show_apply_button &&
                  <>
                  { !isLoading && appliedJobs.findIndex(ajob => ajob.job.info._id == job._id) === -1 && <TouchableOpacity onPress={() => authUser ? applyJobModal() : loginModal()}>
                    <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.applyFilterButton, width:responsiveWidth(35),}}>
                      <Text style={styles.applyFilterButtonText}>Apply Now</Text>
                    </LinearGradient>
                  </TouchableOpacity> }
                  { !isLoading && appliedJobs.findIndex(ajob => ajob.job.info._id == job._id) !== -1 && <TouchableOpacity onPress={() => typeof job.url == 'string' && job.url != '' ? openUrl(job.url) : null}>
                    <LinearGradient colors={['#616161', '#424242']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.applyFilterButton, width:responsiveWidth(35),}}>
                      <Text style={styles.applyFilterButtonText}>Re Apply</Text>
                    </LinearGradient>
                  </TouchableOpacity> }
                  </>
                }

                {!job.show_apply_button &&
                  <TouchableOpacity onPress={() => authUser ? registerYourInterest() : loginModal()}>
                    <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.applyFilterButton, width:responsiveWidth(41),}}>
                      <Text style={styles.applyFilterButtonText}>Register Interest</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                } 

              </View>
            </View>
          </Shadow>
        </View> }
        
      </View>

      




    </View>
  );

}


const stylesHTML = StyleSheet.create({
  strong: {
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
    textAlign:"left"
    // color: '#FF3366',
  },
  p:{
    fontFamily: "Poppins-Light",
    marginTop: 0,
    marginBottom: 10,
  },
  h2:{
    fontFamily: "Poppins-SemiBold",
    fontSize:responsiveFontSize(2.5),
    marginBottom: 10,
  },
  fourLine:{
    maxHeight:120,
    overflow:"hidden"
  }
});