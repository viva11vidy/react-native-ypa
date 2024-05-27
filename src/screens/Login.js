import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight, Keyboard, ActivityIndicator, TouchableWithoutFeedback, Platform } from 'react-native';
import { StackActions, CommonActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Shadow } from 'react-native-shadow-2';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faLock, faPhoneAlt, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';

import { useSelector, useDispatch } from 'react-redux';

import Input from '../ui/Input';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';

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

export default Login = props => {

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const countryCallingCode = '44';
  const [useEmailForLogin, setEmailForLogin] = useState(true);
  const [passwordSecured, setPasswordSecured] = useState(false);
  const [passwordShowing, setPasswordShowing] = useState(false);

  const passwordField = useRef();



  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      phone: '',
      email: '',
      password: '',
    },
    inputValidities: {
      phone: useEmailForLogin || false,
      email: !useEmailForLogin || false,
      password: true,
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
    },
    [dispatchFormState]
  );

  useEffect(() => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: '',
      isValid: true,
      input: useEmailForLogin ? 'phone'  : 'email'
    });
  }, [useEmailForLogin]);

  const login = async () => {
    var payload = {
      user: useEmailForLogin ? formState.inputValues.email : '+'+countryCallingCode+formState.inputValues.phone,
      password: formState.inputValues.password,
    };
    setIsLoading(true);
    try {
      let authUser = await dispatch(authActions.login(payload));
      if(authUser.is_signup_complete === false) {
        goToSignupAdditional();
      } else {
        goToApp();
      }
    } catch (err) {
      dispatch(commonActions.setSystemMessage(err.message));
    }
    setIsLoading(false);
  };

  const goToApp = () => {
    try {
      props.navigation.dispatch(StackActions.replace('AppNav'));
    } catch (err) { }
  };

  const goToSignupAdditional = () => {
    try {
      // props.navigation.replace('SignUpAdditional');
      props.navigation.dispatch(
        CommonActions.reset({
           index: 0,
           routes: [{ name: "SignUpAdditional" }],
       })
      );
    } catch (err) { }
  };

  const goBack = () => {
    props.navigation.goBack(null);
  };

  const goToForgetPassword = () => {
    if(useEmailForLogin) {
      props.navigation.navigate('ForgetPassword', {email: formState.inputValues.email});
    } else {
      props.navigation.navigate('ForgetPassword', {phone: formState.inputValues.phone});
    }
  };

  const goToSignUp = () => {
    props.navigation.replace('SignUp');
  }

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}
        style={{ flex: 1 }}
        behavior="padding" >
        
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

            <LinearGradient colors={['#ffffff', '#cee6ff']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>

            <SafeAreaView style={{ width: '100%', height: '100%' }}>

              <TouchableOpacity style={{ width: "100%" }} onPress={() => goBack()} underlayColor='#fff'>
                <View style={styles.backIconContainer}>
                  <Image style={styles.backIcon} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />
                  <Text style={{ color: "#222222", fontSize: responsiveFontSize(2), fontFamily: "Poppins-SemiBold", }}>Back</Text>
                </View>
              </TouchableOpacity>


              <KeyboardAwareScrollView extraScrollHeight={-responsiveHeight(30)} showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
                <View style={{ width: "100%" }}>


                  <View style={styles.middleArea}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={styles.middleAreaHeading}>Welcome Back!</Text>
                    </View>

                    <View style={{marginBottom: responsiveHeight(6)}}>
                      <Text style={styles.middleAreaSubHeading}>We are happy to see you again</Text>
                      <Text style={styles.middleAreaSubHeading}>Login to your account</Text>
                    </View>

                    {/* <Shadow distance={8} startColor={'#00a8ff61'} finalColor={'#004f780a'} offset={[0, 0]}> */}
                    { useEmailForLogin == false ? <>
                        <View style={{ ...styles.normalInputContainer, paddingLeft: responsiveWidth(4.5), }}>
                          {/* <FontAwesomeIcon color={'#ffffff'} size={20} icon={faPhoneAlt} /> */}
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
                            initialValue=""
                          />
                        </View> 

                        <View style={styles.useAlternatetextWrapper}>
                          <TouchableOpacity onPress={() => {setEmailForLogin(true);}}>
                            <Text style={styles.useAlternatetext}>Use email instead</Text>
                          </TouchableOpacity>
                        </View>

                      </> : <>
                        <View style={{ ...styles.normalInputContainer, paddingLeft: responsiveWidth(5),}}>
                          <Image style={styles.inputIcon} source={require('../../assets/images/ypa/new-images/grey-email.png')} />
                          <Input
                            id="email"
                            style={{ ...styles.input,}}
                            autoCapitalize='none'
                            textContentType="none"
                            keyboardType="email-address"
                            errorContainerStyle={styles.errorContainer}
                            errorTextStyle={styles.errorText}
                            selectionColor={'#222222'}
                            placeholderTextColor="#c5c3c3"
                            placeholder="Email Address"
                            multiline={false}
                            onSubmitEditing={() => passwordField.current.focus()}
                            returnKeyType={'next'}
                            required
                            email
                            errorText="Please enter a valid email address"
                            onInputChange={inputChangeHandler}
                            validateOnChange={true}
                            initialValue=""
                          />
                          
                        </View>

                        <View style={styles.useAlternatetextWrapper}>
                          <TouchableOpacity onPress={() => {setEmailForLogin(false);}}>
                            <Text style={styles.useAlternatetext}>Use phone instead</Text>
                          </TouchableOpacity>
                        </View>

                      </> } 
                    {/* </Shadow> */}
                     

                    <View style={{ ...styles.normalInputContainer, marginTop: responsiveHeight(3), paddingLeft: responsiveWidth(5), }}>
                      <Image style={styles.inputIcon} source={require('../../assets/images/ypa/new-images/grey-lock.png')} />
                      <Input
                        ref={passwordField}
                        id="password"
                        style={styles.input2}
                        autoCapitalize='none'
                        errorContainerStyle={styles.errorContainer}
                        errorTextStyle={styles.errorText}
                        // placeholderTextColor="#ffffff"  
                        // placeholder={"Enter Password"}
                        // blurOnSubmit={true}
                        onSubmitEditing={() => { formState.formIsValid && !isLoading ? login() : null; Keyboard.dismiss(); }}
                        returnKeyType={'go'}
                        secureTextEntry={!passwordShowing}
                        // onFocus={() => console.log('focus')}
                        // onBlur={() => console.log('blur')}
                        required
                        errorText="Password is required"
                        onInputChange={inputChangeHandler}
                        validateOnChange={true}
                        initialValue=""
                      />
                      {!passwordSecured && <TouchableWithoutFeedback onPress={() => passwordField.current.focus()}><Text style={styles.passwordPlaceholder}>Enter Password</Text></TouchableWithoutFeedback>}

                      <TouchableOpacity style={styles.inputIconContainer} onPress={() => setPasswordShowing(!passwordShowing)}>
                        {!passwordShowing ?
                          <FontAwesomeIcon color={'#222222'} size={20} icon={faEye} />
                          :
                          <FontAwesomeIcon color={'#222222'} size={20} icon={faEyeSlash} />
                        }
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity  onPress={() => goToForgetPassword()}><Text style={styles.whiteLink}>Forgot your Password ?</Text></TouchableOpacity>

                  </View>
                </View>
              </KeyboardAwareScrollView>

             

              <View style={styles.bottomButtonArea}>
                {/* <TouchableOpacity onPress={() => {login(); Keyboard.dismiss();}} style={{ ...styles.whiteFullButtonTouchable, opacity: (formState.formIsValid && !isLoading ? 1 : 0.5) }} disabled={!(formState.formIsValid && !isLoading)}>
                  <View style={{ ...styles.whiteFullButton, marginBottom: responsiveHeight(1.5) }}>
                    {!isLoading ?
                      <Text style={styles.whiteFullButtonText}>Login</Text>
                      :
                      <ActivityIndicator size="small" color={'#1761a0'} />
                    }
                  </View>
                </TouchableOpacity> */}

                <View style={styles.walkthroughButtonWrapper}>
                  <TouchableOpacity onPress={() => {login(); Keyboard.dismiss();}}  style={{opacity: (formState.formIsValid && !isLoading ? 1 : 0.5) }} disabled={!(formState.formIsValid && !isLoading)}>
                    <LinearGradient colors={['#3895fc', '#005ba6']} style={styles.walkthroughButtonSolid} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                      {!isLoading ?
                        <Text style={styles.walkthroughLinkRight}>Login</Text>
                        :
                        <ActivityIndicator size="small" color={'#ffffff'} />
                      }
                    </LinearGradient>
                  </TouchableOpacity>
                </View>




                <View style={{ display: "flex", justifyContent: "center", flexDirection: "row", paddingHorizontal: 10, alignItems: "center",marginTop:10 }}>
                  <TouchableOpacity onPress={() => goToSignUp()}>
                    <Text style={styles.normalText}>Don't have an account ? <Text style={styles.boldText}>Sign Up</Text></Text>
                  </TouchableOpacity>
                </View>
              </View>

              </SafeAreaView>
            </LinearGradient>
          </TouchableWithoutFeedback>
        
      </KeyboardAvoidingView>
    </>
  );


}

const styles = StyleSheet.create({


  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  backIconContainer: {
    width: "100%",
    marginTop: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(4),
    flexDirection: "row",
    alignItems: "center"
  },
  backIcon: {
    height: responsiveHeight(2),
    width: responsiveWidth(2),
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
  whiteFullButtonTouchable:{
    width:"100%",
  },
  whiteFullButton:{
    backgroundColor:"#ffffff",
    // borderRadius:7,
    alignItems:"center",
    justifyContent:"center",
    // padding:responsiveHeight(1.5),
    height:responsiveHeight(7),
  },
  whiteFullButtonText:{
    fontSize: responsiveFontSize(2.5),
    color: "#222222",
    fontFamily: "Poppins-SemiBold",
  },
  whiteLink:{
    fontSize: responsiveFontSize(1.7),
    color: "#0056b3",
    fontFamily: "Poppins-SemiBold",
    textAlign:"right",
    marginTop:responsiveHeight(2.5)
  },
  middleAreaHeading: {
    fontSize: responsiveFontSize(3.4),
    fontFamily: "Poppins-SemiBold",
    color: "#222222",
    marginTop: responsiveHeight(4),
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
    //backgroundColor:"red",
    width: "100%",
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(0),
    paddingBottom:responsiveHeight(2.5)
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
