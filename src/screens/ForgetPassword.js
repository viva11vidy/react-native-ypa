import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView, TouchableHighlight, Keyboard, ActivityIndicator, TouchableWithoutFeedback, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { StackActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faLock, faUser, faMapMarkerAlt, faBuilding, faChevronDown, faMale, faUserGraduate, faUserCircle, faCalendar, faCalendarAlt, faFemale, faTransgender,faArrowLeft, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import Swiper from 'react-native-swiper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import RBSheet from "react-native-raw-bottom-sheet";

import { useSelector, useDispatch } from 'react-redux';

import Input from '../ui/Input';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
import { set } from 'react-native-reanimated';

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

export default ForgetPassword = props => {

  const dispatch = useDispatch();
  const emailID = props.route.params && props.route.params.email; 
  const phoneNumber = props.route.params && props.route.params.phone; 
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const countryCallingCode = '44';
  const [useEmailForLogin, setEmailForLogin] = useState(true);
  const [passwordSecured, setPasswordSecured] = useState(false);
  const [passwordSecured2, setPasswordSecured2] = useState(false);
  const [passwordShowing, setPasswordShowing] = useState(false);
  const [passwordShowing2, setPasswordShowing2] = useState(false);
  const [OTPRequestID, setOTPRequestID] = useState(''); 

  const swiper = useRef(null);
  const [swiperIndex, setSwiperIndex] = useState(0);

  const passwordField = useRef();
  const password2Field = useRef();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      (Platform.OS == 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'),
      e => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      (Platform.OS == 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'),
      e => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
    

  }, [dispatch]);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: emailID ? emailID : '',
      phone: phoneNumber ? phoneNumber : '',
      password: '',
      password2: '',
      otp: '',
    },
    inputValidities: {
      phone: useEmailForLogin || false,
      email: !useEmailForLogin || false,
      // email: !!emailID,
      password: false,
      password2: false,
      otp: false,
    },
    formIsValid: false
  });

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
      // console.log(inputIdentifier, inputValue.length);
      if (inputIdentifier == 'password') {
        if (inputValue.length > 0) {
          setPasswordSecured(true);
        } else {
          setPasswordSecured(false);

        }
      }
      if (inputIdentifier == 'password2') {
        if (inputValue.length > 0) {
          setPasswordSecured2(true);
        } else {
          setPasswordSecured2(false);

        }
      }
    },
    [dispatchFormState]
  );

  

  const goBack = () => {
    props.navigation.goBack(null);
  };

  const goToLogin = () => {
    props.navigation.navigate('Login');
  }
  
  const formSubmitClicked = () => {
    if(swiper.current.state.index == 0) {
      getOTP();
    } else {
      resetPassword();
      
    }
    
  }

  const getOTP = async () => {
    let payload = {
      platform:'Email',
      uique_platform_id: formState.inputValues.email,
      purpose:'Reset Password'
    }
    setIsLoading(true);
    try {
      let response = await dispatch(authActions.sendEmailOTP(payload));
      console.log(response);
      setOTPRequestID(response._id);
      swiper.current.scrollBy(1);
    } catch (err) {
      dispatch(commonActions.setSystemMessage(err.message));
    }
    setIsLoading(false);
  };
  
  const resetPassword = async () => {
    let payload = {
      otp_request_id: OTPRequestID,
      otp: formState.inputValues.otp,
      new_password: formState.inputValues.password,
    }
    setIsLoading(true);
    try {
      let response = await dispatch(authActions.forgotPwdReset(payload));
      dispatch(commonActions.setSystemMessage('Password has been updated successfully. Please login with new password'));
      goBack();
    } catch (err) {
      dispatch(commonActions.setSystemMessage(err.message));
    }
    setIsLoading(false);
  };
  

  return (
    <>
    <KeyboardAvoidingView
        keyboardVerticalOffset={ Platform.OS === 'ios' ? 0 : -500 }
        style={{ flex: 1 }}
        behavior="padding" >

        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <LinearGradient colors={['#ffffff', '#cee6ff']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
            <SafeAreaView style={{ width: '100%', height: '100%' }}>
              <Swiper scrollEnabled={false} index={0} showsPagination={!keyboardVisible} showsButtons={false} style={styles.wrapper} activeDotStyle={styles.activeDotStyle} dotStyle={styles.dotStyle} loop={false} ref={swiper} containerStyle={styles.wrapperInner} onIndexChanged={(index) => setSwiperIndex(index)}>
                <View style={{ height: "90%" }}>
                  <KeyboardAwareScrollView extraScrollHeight={-responsiveHeight(30)} showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
                    <View style={{ width: "100%", }}>


                      <View style={styles.middleArea}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={styles.middleAreaHeading}>Forgot Password?</Text>
                        </View>

                        <Text style={styles.middleAreaSubHeading}>Hey! Don't Worry</Text>
                        { useEmailForLogin == false ? <>
                        <Text style={styles.middleAreaSubHeading}>Please enter your mobile below. We will send you a code to verify.</Text>
                        </> : <>
                        <Text style={styles.middleAreaSubHeading}>Please enter your email address below. We will send you a code to verify.</Text>
                        </>
                        }

                        { useEmailForLogin == false ? <>
                          <View style={{ ...styles.normalInputContainer, marginTop: responsiveHeight(6), paddingLeft: responsiveWidth(5), }}>
                            <Text style={styles.mobileCodeText}>+{countryCallingCode}</Text>
                            <Input
                              id="phone"
                              style={{ ...styles.input, }}
                              autoCapitalize='none'
                              textContentType="none"
                              keyboardType="number-pad"
                              errorContainerStyle={styles.errorContainer}
                              errorTextStyle={styles.errorText}
                              selectionColor={'#222222'}
                              placeholderTextColor="#c5c3c3"
                              placeholder="Phone Number"
                              multiline={false}
                              onSubmitEditing={() => passwordField.current.focus()}
                              returnKeyType={'next'}
                              required
                              minLength={10}
                              maxLength={10}
                              errorText="Please enter 10 digit phone Number"
                              onInputChange={inputChangeHandler}
                              validateOnChange={true}
                              initialValue={formState.inputValues.phone}
                              initiallyValid={formState.inputValidities.phone}
                            />
                          </View>
                          <View style={styles.useAlternatetextWrapper}>
                            <TouchableOpacity onPress={() => {setEmailForLogin(true);}}>
                              <Text style={styles.useAlternatetext}>Use email instead</Text>
                            </TouchableOpacity>
                          </View>

                        </> : <>
                          <View style={{ ...styles.normalInputContainer, marginTop: responsiveHeight(6), paddingLeft: responsiveWidth(5), }}>
                            <Image style={styles.inputIcon} source={require('../../assets/images/ypa/new-images/grey-email.png')} />
                            <Input
                              id="email"
                              style={{ ...styles.input, }}
                              autoCapitalize='none'
                              textContentType="none"
                              errorContainerStyle={styles.errorContainer}
                              errorTextStyle={styles.errorText}
                              selectionColor={'#222222'}
                              placeholderTextColor="#c5c3c3"
                              placeholder="Email Address"
                              multiline={false}
                              required
                              email
                              errorText="Please enter a valid email address"
                              onInputChange={inputChangeHandler}
                              validateOnChange={true}
                              initialValue={formState.inputValues.email}
                              initiallyValid={formState.inputValidities.email}
                            />
                          </View>

                          <View style={styles.useAlternatetextWrapper}>
                            <TouchableOpacity onPress={() => {setEmailForLogin(false);}}>
                              <Text style={styles.useAlternatetext}>Use phone instead</Text>
                            </TouchableOpacity>
                          </View>

                        </> } 


                      </View>
                    </View>
                  </KeyboardAwareScrollView>
                </View>
                <View style={{ height: "90%" }}>
                  <KeyboardAwareScrollView extraScrollHeight={-responsiveHeight(30)} showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
                    <View style={{ width: "100%", }}>
                      <View style={styles.middleArea}>
                        <TouchableOpacity style={{ width: "100%" }} onPress={() => swiper.current.scrollBy(-1)} underlayColor='#fff'>
                          <View style={{...styles.backIconContainer,marginBottom:responsiveHeight(3)}}>
                            <Image style={styles.backIcon} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />
                            <Text style={{ color: "#222222", fontSize: responsiveFontSize(2.2), fontFamily: "Poppins-SemiBold", }}>Back</Text>
                          </View>
                        </TouchableOpacity>

                        <Text style={styles.middleAreaSubHeading}>Kindly enter the code below.</Text>
                        <Text style={styles.middleAreaSubHeading}>Create a new password to continue.</Text>

                        <View style={{ ...styles.normalInputContainer, marginTop: responsiveHeight(6), paddingLeft: responsiveWidth(5), }}>
                            <FontAwesomeIcon color={'#c5c3c3'} size={16} icon={faShieldAlt} />
                            <Input
                              id="otp"
                              style={{ ...styles.input, }}
                              autoCapitalize='none'
                              textContentType="none"
                              errorContainerStyle={styles.errorContainer}
                              errorTextStyle={styles.errorText}
                              selectionColor={'#222222'}
                              placeholderTextColor="#c5c3c3"
                              placeholder="Code"
                              multiline={false}
                              onSubmitEditing={() => passwordField.current.focus()}
                              returnKeyType={'next'}
                              required
                              errorText="OTP is required"
                              onInputChange={inputChangeHandler}
                              validateOnChange={true}
                              initialValue=""
                            />
                        </View>
                        
                        <View style={{ ...styles.normalInputContainer, paddingLeft: responsiveWidth(5), marginTop: responsiveHeight(3),}}>
                            <Image style={styles.inputIcon} source={require('../../assets/images/ypa/new-images/grey-lock.png')} />
                            <Input
                              ref={passwordField}
                              id="password"
                              style={styles.input2}
                              autoCapitalize='none'
                              errorContainerStyle={styles.errorContainer}
                              errorTextStyle={styles.errorText}
                              multiline={false}
                              onSubmitEditing={() => password2Field.current.focus()}
                              returnKeyType={'next'}
                              blurOnSubmit={true}
                              secureTextEntry={!passwordShowing}
                              required
                              minLength={6}
                              maxLength={20}
                              errorText="Enter a password between 6 to 20 characters"
                              onInputChange={inputChangeHandler}
                              validateOnChange={true}
                              initialValue=""
                            />
                            {!passwordSecured && <TouchableWithoutFeedback onPress={() => passwordField.current.focus()}><Text style={styles.passwordPlaceholder}>Password</Text></TouchableWithoutFeedback> }

                            <TouchableOpacity style={styles.inputIconContainer} onPress={() => setPasswordShowing(!passwordShowing)}>
                              {!passwordShowing ?
                                <FontAwesomeIcon color={'#222222'} size={20} icon={faEye} />
                                :
                                <FontAwesomeIcon color={'#222222'} size={20} icon={faEyeSlash} />
                              }
                            </TouchableOpacity>
                        </View>

                        <View style={{ ...styles.normalInputContainer, paddingLeft: responsiveWidth(5), marginTop: responsiveHeight(3), }}>
                            <Image style={styles.inputIcon} source={require('../../assets/images/ypa/new-images/grey-lock.png')} />
                            <Input
                              ref={password2Field}
                              id="password2"
                              style={styles.input2}
                              autoCapitalize='none'
                              errorContainerStyle={styles.errorContainer}
                              errorTextStyle={styles.errorText}
                              multiline={false}
                              onSubmitEditing={() => { formState.formIsValid && !isLoading ? formSubmitClicked() : null; Keyboard.dismiss(); }}
                              returnKeyType={'go'}
                              secureTextEntry={!passwordShowing2}
                              required
                              equals={formState.inputValues.password}
                              errorText="Confirm password should match"
                              onInputChange={inputChangeHandler}
                              validateOnChange={true}
                              initialValue=""
                            />
                            {!passwordSecured2 && <TouchableWithoutFeedback onPress={() => password2Field.current.focus()}><Text style={styles.passwordPlaceholder}>Confirm Password</Text></TouchableWithoutFeedback>}

                            <TouchableOpacity style={styles.inputIconContainer} onPress={() => setPasswordShowing2(!passwordShowing2)}>
                              {!passwordShowing2 ?
                                <FontAwesomeIcon color={'#222222'} size={20} icon={faEye} />
                                :
                                <FontAwesomeIcon color={'#222222'} size={20} icon={faEyeSlash} />
                              }
                            </TouchableOpacity>
                        </View>

                      </View>
                    </View>
                  </KeyboardAwareScrollView>
                </View>
              </Swiper>

              <View style={styles.bottomButtonArea}>
                <TouchableOpacity onPress={() => { formSubmitClicked(); Keyboard.dismiss(); }} 
                  style={{ ...styles.whiteFullButtonTouchable,
                  opacity: swiperIndex == 0 ? 
                        (formState.inputValidities.email && !isLoading ? 1 : 0.5) 
                      : 
                        (formState.formIsValid && !isLoading) ? 1 : 0.5 }} 
                  disabled={swiperIndex == 0 ? !(formState.inputValidities.email && !isLoading)
                      : !(formState.formIsValid && !isLoading)}
                  
                >
                  
                  <LinearGradient colors={['#3895fc', '#005ba6']} style={styles.walkthroughButtonSolid} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                    {!isLoading ?
                      <Text style={styles.walkthroughLinkRight}>{swiperIndex == 0 ? 'Send Code' : 'Change Password' }</Text>
                      :
                      <ActivityIndicator size="small" color={'#ffffff'} />
                    }
                  </LinearGradient>
                </TouchableOpacity>

                <View style={{ display: "flex", justifyContent: "center", flexDirection: "row", paddingHorizontal: 10, alignItems: "center", marginTop: 10 }}>
                  <TouchableOpacity onPress={() => goBack()}>
                    <Text style={styles.normalText}>Go back to <Text style={styles.boldText}>Login</Text></Text>
                  </TouchableOpacity>
                </View>
              </View>

            </SafeAreaView>        
          </LinearGradient>
        </TouchableWithoutFeedback>

      </KeyboardAvoidingView>
      {/* <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}
        style={{ flex: 1 }}
        behavior="padding" >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <LinearGradient colors={['#0041c4', '#1b58d4']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>

            <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%',}}>
              
              <View style={styles.middleArea}>

                <View style={styles.aboveBlue}>
                  <TouchableOpacity onPress={() => goBack()}>
                    <View style={styles.aboveBlueInner}>
                      <FontAwesomeIcon style={{marginRight:responsiveWidth(5)}} color={'#ffffff'} size={20} icon={faArrowLeft} />
                      <Text style={styles.middleAreaHeading}>Forgot Password </Text>
                    </View>
                  </TouchableOpacity>

                </View>


                <View  style={styles.belowWhite}>

                  <Swiper scrollEnabled={false} index={0} showsPagination={true} showsButtons={false} style={styles.wrapper} activeDotStyle={styles.activeDotStyle} dotStyle={styles.dotStyle} loop={false} ref={swiper} containerStyle={styles.wrapperInner} onIndexChanged={(index) => setSwiperIndex(index)}>
                    <View style={{ height: "100%", paddingHorizontal: responsiveWidth(4)}}>
                      <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
                        
                        <View style={{ width: "100%", }}>
                          <View style={{ flexDirection: "row", alignItems: "center",marginBottom:responsiveHeight(1.5) }}>
                            <Text style={styles.middleAreaHeadingLight}>Hey! Don't Worry</Text>
                          </View>

                          <Text style={styles.middleAreaSubHeading}>Please enter your email address below.</Text>
                          <Text style={styles.middleAreaSubHeading}>We will send you an OTP to verify.</Text>

                          <View style={{ ...styles.normalInputContainer, marginTop: responsiveHeight(6), paddingLeft: responsiveWidth(5), }}>
                            <FontAwesomeIcon color={'#0041c4'} size={20} icon={faEnvelope} />
                            <Input
                              id="email"
                              style={{ ...styles.input, }}
                              autoCapitalize='none'
                              textContentType="none"
                              errorContainerStyle={styles.errorContainer}
                              errorTextStyle={styles.errorText}
                              placeholderTextColor="#0041c4"
                              placeholder="Email Address"
                              multiline={false}
                              required
                              email
                              errorText="Please enter a valid email address"
                              onInputChange={inputChangeHandler}
                              validateOnChange={true}
                              initialValue={formState.inputValues.email}
                              initiallyValid={formState.inputValidities.email}
                            />
                          </View>

                        </View>
                        
                      </ScrollView>
                    </View>
                    <View style={{ height: "100%",paddingHorizontal: responsiveWidth(4) }}>
                      <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
                        
                        <View  style={{ width: "100%", }}>

                          <View style={{ flexDirection: "row", alignItems: "center",marginBottom:responsiveHeight(1.5) }}>
                            <Text style={styles.middleAreaHeadingLight}>OTP has been sent</Text>
                          </View>

                          <Text style={styles.middleAreaSubHeading}>Kindly enter the OTP below</Text>
                          <Text style={styles.middleAreaSubHeading}>Create a new password to continue</Text>


                          <View style={{ ...styles.normalInputContainer, marginTop: responsiveHeight(6), paddingLeft: responsiveWidth(5), }}>
                            <FontAwesomeIcon color={'#0041c4'} size={20} icon={faEnvelope} />
                            <Input
                              id="otp"
                              style={{ ...styles.input, }}
                              autoCapitalize='none'
                              textContentType="none"
                              errorContainerStyle={styles.errorContainer}
                              errorTextStyle={styles.errorText}
                              placeholderTextColor="#0041c4"
                              placeholder="OTP"
                              multiline={false}
                              onSubmitEditing={() => passwordField.current.focus()}
                              returnKeyType={'next'}
                              required
                              errorText="OTP is required"
                              onInputChange={inputChangeHandler}
                              validateOnChange={true}
                              initialValue=""
                            />
                          </View>
                          

                          <View style={{ ...styles.normalInputContainer, paddingLeft: responsiveWidth(5), }}>
                            <FontAwesomeIcon color={'#0041c4'} size={20} icon={faLock} />
                            <Input
                              ref={passwordField}
                              id="password"
                              style={styles.input2}
                              autoCapitalize='none'
                              errorContainerStyle={styles.errorContainer}
                              errorTextStyle={styles.errorText}
                              multiline={false}
                              onSubmitEditing={() => password2Field.current.focus()}
                              returnKeyType={'next'}
                              blurOnSubmit={true}
                              secureTextEntry={!passwordShowing}
                              required
                              minLength={6}
                              maxLength={20}
                              errorText="Enter a password between 6 to 20 characters"
                              onInputChange={inputChangeHandler}
                              validateOnChange={true}
                              initialValue=""
                            />
                            {!passwordSecured && <TouchableWithoutFeedback onPress={() => passwordField.current.focus()}><Text style={styles.passwordPlaceholder}>Password</Text></TouchableWithoutFeedback> }

                            <TouchableOpacity style={styles.inputIconContainer} onPress={() => setPasswordShowing(!passwordShowing)}>
                              {!passwordShowing ?
                                <FontAwesomeIcon color={'#0041c4'} size={24} icon={faEye} />
                                :
                                <FontAwesomeIcon color={'#0041c4'} size={24} icon={faEyeSlash} />
                              }
                            </TouchableOpacity>
                          </View>

                          <View style={{ ...styles.normalInputContainer, paddingLeft: responsiveWidth(5), }}>
                            <FontAwesomeIcon color={'#0041c4'} size={20} icon={faLock} />
                            <Input
                              ref={password2Field}
                              id="password2"
                              style={styles.input2}
                              autoCapitalize='none'
                              errorContainerStyle={styles.errorContainer}
                              errorTextStyle={styles.errorText}
                              multiline={false}
                              onSubmitEditing={() => { formState.formIsValid && !isLoading ? formSubmitClicked() : null; Keyboard.dismiss(); }}
                              returnKeyType={'go'}
                              secureTextEntry={!passwordShowing2}
                              required
                              equals={formState.inputValues.password}
                              errorText="Confirm password should match"
                              onInputChange={inputChangeHandler}
                              validateOnChange={true}
                              initialValue=""
                            />
                            {!passwordSecured2 && <TouchableWithoutFeedback onPress={() => password2Field.current.focus()}><Text style={styles.passwordPlaceholder}>Confirm Password</Text></TouchableWithoutFeedback>}

                            <TouchableOpacity style={styles.inputIconContainer} onPress={() => setPasswordShowing2(!passwordShowing2)}>
                              {!passwordShowing2 ?
                                <FontAwesomeIcon color={'#0041c4'} size={24} icon={faEye} />
                                :
                                <FontAwesomeIcon color={'#0041c4'} size={24} icon={faEyeSlash} />
                              }
                            </TouchableOpacity>
                          </View>
                          
                        </View>
                        
                      </ScrollView>
                    </View>
                  </Swiper>

                  <View style={styles.bottomButtonArea}>
                    <TouchableOpacity onPress={() => { formSubmitClicked(); Keyboard.dismiss(); }} 
                      style={{ ...styles.whiteFullButtonTouchable,
                      opacity: swiperIndex == 0 ? 
                            (formState.inputValidities.email && !isLoading ? 1 : 0.5) 
                          : 
                            (formState.formIsValid && !isLoading) ? 1 : 0.5 }} 
                      disabled={swiperIndex == 0 ? !(formState.inputValidities.email && !isLoading)
                          : !(formState.formIsValid && !isLoading)}
                      
                    >
                      <View style={{ ...styles.whiteFullButton, marginBottom: responsiveHeight(1.5) }}>
                        {!isLoading ?
                          <Text style={styles.whiteFullButtonText}>{swiperIndex == 0 ? 'Send OTP' : 'Change Password' }</Text>
                          :
                          <ActivityIndicator size="small" color={'#1761a0'} />
                        }
                      </View>
                    </TouchableOpacity>




                    <View style={{ display: "flex", justifyContent: "center", flexDirection: "row", paddingHorizontal: 10, alignItems: "center", marginTop: 10 }}>
                      <TouchableOpacity onPress={() => goBack()}>
                        <Text style={styles.normalText}>Go back to <Text style={styles.boldText}>Login</Text></Text>
                      </TouchableOpacity>
                    </View>
                  </View>


                </View>

              </View>

            </ScrollView>


          </LinearGradient>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView> */}
    </>
  );


}

const styles = StyleSheet.create({


  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  wrapper: {
    // backgroundColor:"red",
    height: "100%",
  },
  wrapperInner: {
    // backgroundColor:"black",
    // paddingBottom:"20%"
  },
  activeDotStyle: {
    backgroundColor: '#222222',
    width: 9,
    height: 9,
    borderRadius: 50,
    borderColor: '#222222',
    opacity: 0.8,
    borderWidth: 1,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 0,
    marginBottom: responsiveHeight(0),
  },
  dotStyle: {
    backgroundColor: '#222222',
    width: 9,
    height: 9,
    borderRadius: 50,
    opacity: 0.4,
    borderColor: '#222222',
    borderWidth: 1,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 0,
    marginBottom: responsiveHeight(0),
  },
  backIconContainer: {
    width: "100%",
    marginTop: responsiveHeight(1.5),
    flexDirection: "row",
    alignItems: "center"
  },
  backIcon: {
    height: responsiveHeight(2.4),
    width: responsiveWidth(2.4),
    resizeMode: 'contain',
    marginRight: 10,
    marginTop: -responsiveWidth(0.5)
  },
  middleArea: {
    paddingTop: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(5),
    width: "100%",
    paddingBottom: 20,
  },
  logo: {
    height: responsiveHeight(12),
    width: responsiveWidth(22),
    resizeMode: 'contain',
    marginTop: responsiveWidth(15),
  },
  whiteFullButtonTouchable: {
    width: "100%",
  },
  whiteFullButton: {
    backgroundColor: "#ffffff",
    // borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    padding: responsiveHeight(1.5),
    height: responsiveHeight(7),
  },
  whiteFullButtonText: {
    fontSize: responsiveFontSize(2.5),
    color: "#011c38",
    fontFamily: "Poppins-SemiBold",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  whiteLink: {
    fontSize: responsiveFontSize(1.8),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
    textAlign: "right",
    marginTop: responsiveHeight(4)
  },
  middleAreaHeading: {
    fontSize: responsiveFontSize(3.4),
    fontFamily: "Poppins-SemiBold",
    color: "#222222",
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(1.5),
  },
  wave: {
    height: responsiveHeight(4),
    width: responsiveWidth(7),
    resizeMode: 'contain',
    marginLeft: responsiveWidth(2),
    marginTop: responsiveHeight(0.8)
  },
  middleAreaSubHeading: {
    fontSize: responsiveFontSize(2.1),
    fontFamily: "Poppins-Light",
    color: "#222222",
    lineHeight: responsiveFontSize(3)
  },
  flagInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: '#ffffff',
    borderWidth: 1,
    // borderRadius: 5,
    justifyContent: "space-between",
    // backgroundColor:"blue",
    marginHorizontal: responsiveWidth(6.3),
    paddingHorizontal: 10
  },
  normalInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: '#e2e1e1',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "space-between",
    width:responsiveWidth(90),
    // overflow:"hidden"
    height: responsiveHeight(8),
    marginBottom: responsiveHeight(0),
    backgroundColor: '#ffffff',
  },
  rbtext: {
    fontFamily: "Poppins-Light",
    color: '#ffffff',
    fontSize: responsiveFontSize(2.12),
    paddingLeft: responsiveWidth(5),
    position: "relative",
    top: responsiveHeight(0.3)
  },
  rbDownIcon: {
    position: "absolute",
    right: responsiveWidth(5),
  },
  flagImage: {
    width: responsiveWidth(8) + 25,
    marginRight: 10,
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
    // backgroundColor:"#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: responsiveWidth(5)
  },
  input: {
    marginLeft: 0,
    paddingRight: responsiveWidth(5),
    paddingLeft: responsiveWidth(5),
    paddingTop: Platform.OS === 'ios' ? responsiveHeight(0) : responsiveHeight(2),
    fontSize: responsiveFontSize(2.1),
    fontFamily: "Poppins-Light",
    color: '#222222',
    // textAlign: "left",
    textAlignVertical:"top",
    width:"90%",
    //flex: 1,
    zIndex: 1
  },
  input2: {
    marginLeft: 0,
    paddingRight: responsiveWidth(5),
    paddingLeft: responsiveWidth(5),
    paddingTop: Platform.OS === 'ios' ? responsiveHeight(0) : responsiveHeight(1.5),
    fontSize: responsiveFontSize(2.3),
    fontFamily: "Poppins-Light",
    color: '#222222',
    // textAlign: "left",
    width:"90%",
    zIndex: 1
  },
  passwordPlaceholder: {
    fontSize: responsiveFontSize(2.1),
    fontFamily: "Poppins-Light",
    color: '#c5c3c3',
    position: "absolute",
    left: responsiveWidth(15),
    zIndex: 0,
    top: Platform.OS === 'ios' ? responsiveHeight(2.7) : responsiveHeight(2.5),
  },
  errorContainer: {
    marginVertical: 0,
    position: "absolute",
    bottom: Platform.OS === 'ios' ? -responsiveHeight(2.5) : -responsiveHeight(1),
    left: 20
  },
  errorText: {
    color: '#ffffff',
    fontSize: responsiveFontSize(1.5),
    fontFamily: "Poppins-Light",
  },
  bottomButtonArea: {
    // backgroundColor:"red",
    width: "100%",
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(0),
    paddingBottom: responsiveHeight(2.5)
  },
  mainButtonText: {
    fontSize: responsiveFontSize(2),
    color: "#1c75bc",
    fontFamily: "Poppins-SemiBold",
  },
  mainButton: {
    backgroundColor: "#ffffff",
    height: responsiveHeight(7),
    width: "100%",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    marginVertical: 15,
    // borderRadius: 10
  },
  normalText: {
    fontSize: responsiveFontSize(1.9),
    color: "#0056b3",
    fontFamily: "Poppins-Light",
  },
  boldText: {
    fontSize: responsiveFontSize(1.9),
    color: "#0056b3",
    fontFamily: "Poppins-SemiBold",
  },
  passwordEye: {
    height: responsiveHeight(3),
    width: responsiveHeight(3),
    resizeMode: 'contain',
  },
  inputIconContainer: {
    position: "absolute",
    right: responsiveWidth(2),
    top: responsiveHeight(2.5),
    // backgroundColor:"red",
    zIndex: 5,
    paddingHorizontal:responsiveWidth(2)
  },


  // RB SHEET

  sheetTitleContainer: {
    borderBottomWidth: 1,
    borderColor: "#e6e6e6",
    paddingBottom: responsiveHeight(2),
    marginBottom: responsiveHeight(2)
  },
  sheetTitle: {
    fontSize: responsiveFontSize(2.1),
    // lineHeight:responsiveFontSize(2.1),
    fontFamily: "Poppins-SemiBold",
    color: "#333333",
    textAlign: "center"
  },
  singleSheetOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: responsiveHeight(0.5),
    // backgroundColor:"red",
    paddingVertical: responsiveHeight(1.5),
  },
  singleSheetText: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: "Poppins-Light",
    color: "#333333",
    textAlign: "center"
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center"
  },
  label: {
    alignSelf: "center",
    fontSize: responsiveFontSize(1.9),
    marginLeft: 5,
    // lineHeight:responsiveFontSize(2.1),
    fontFamily: "Poppins-SemiBold",
    color: "#ffffff",
    textAlign: "center"
  },
  mobileCodeText:{
    fontSize: responsiveFontSize(2.1),
    fontFamily: "Poppins-Light",
    color: '#c5c3c3',
  },
  useAlternatetextWrapper:{
    flexDirection:"row",
    justifyContent:"flex-end",
    paddingTop:responsiveHeight(2)
  },
  useAlternatetext: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: "Poppins-SemiBold",
    color: '#0056b3',
  },
  inputIcon:{
    height: responsiveHeight(2.5),
    width: responsiveHeight(2.5),
    resizeMode: 'contain',
  },
  walkthroughButtonWrapper: {
    // position: "absolute",
    // bottom: responsiveHeight(2.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  walkthroughButtonOutline:{
    width:"100%",
    height:responsiveHeight(7.5),
    borderRadius:8,
    borderWidth:1,
    borderColor:'#ffffff',
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    
  },
  walkthroughButtonSolid:{
    width:responsiveWidth(90),
    height:responsiveHeight(7.5),
    borderRadius:8,
    backgroundColor:'#ffffff',
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center"
  },
  walkthroughLinkRight: {
    fontSize: responsiveFontSize(2.1),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
  },
  walkthroughLinkLeft: {
    fontSize: responsiveFontSize(2.1),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
  },

});
