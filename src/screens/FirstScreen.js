import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight, Keyboard, ActivityIndicator, PermissionsAndroid, SafeAreaView, Platform, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken, AuthenticationToken, LoginButton, GraphRequestManager, GraphRequest } from 'react-native-fbsdk-next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAlignRight, faAngleDoubleRight, faAngleRight, faArrowRight, faClock, faMapMarkedAlt, faMapMarkerAlt, faPoundSign, faSuitcase } from '@fortawesome/free-solid-svg-icons';
import appleAuth, { AppleButton, AppleAuthError } from '@invertase/react-native-apple-authentication';
import { sha256 } from 'react-native-sha256';

import RBSheet from "react-native-raw-bottom-sheet";

import { useSelector, useDispatch } from 'react-redux';
import { StackActions } from '@react-navigation/native';

import globals from './../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';

import styles from './StyleSheet';

export default FirstScreen = props => {

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseID, setFirebaseID] = useState('');
  const [firebaseNetwork, setFirebaseNetwork] = useState('');
  const[fAuthstateChanged, setFAuthstateChanged] = useState(false);
  const[linkProvider, setLinkProvider] = useState('');
  const[linkCredential, setLinkCredential] = useState(null);
  const socialSheetRef = useRef(null);

  useEffect(() => {
    authSignOut();

  }, [dispatch]);

  const authSignOut = useCallback(async () => {
    try {
      if(auth().currentUser) {
        auth().signOut();
      }
      LoginManager.logOut();
    } catch (err) {
      // console.log(err);
    }
    // GoogleSignin.isSignedIn().then(isSignedIn => {
    //   GoogleSignin.signOut();
    // }, err => {
    //   console.log('GoogleIsSignInError: ', err);
    // });
  }, []);

  useEffect(() => {
    if(firebaseNetwork != '' ) {
      const unsubscribe  = auth().onAuthStateChanged(onAuthStateChanged);
      return () => {
        unsubscribe();
      }
    } 
  }, [firebaseNetwork]);

  const onAuthStateChanged = (user) => {
    // console.log('user', user, firebaseNetwork, props.navigation.isFocused());
    if(firebaseNetwork != '' && user && user.uid && props.navigation.isFocused()) {
      socialLogin(user.uid, firebaseNetwork);
      setFirebaseNetwork('');

      setLinkCredential(async linkCredential => {
        if(linkCredential) {
          try {
            user.linkWithCredential(linkCredential);
          } catch (err) {
            // console.log('linkWithCredentialError', err);
          }
        }
        return null;
      });
    }
    if(user && user.uid) {
      // console.log(user.uid);
      setFirebaseID(user.uid);
    }
    
  };
  

  const socialLogin = async (firebaseID, firebaseNetwork) => {
    let payload = {
      fuid: firebaseID,
      network: firebaseNetwork,
    }
    setIsLoading(true);
    try {
      let authUser = await dispatch(authActions.socialLogin(payload));
      if(auth().currentUser) {
        await auth().signOut();
      }
      if(authUser.is_signup_complete === false) {
        goToSignupAdditional();
      } else {
        goToApp()
      }
    } catch (err) {
      dispatch(commonActions.setSystemMessage(err.message));
    }
    setIsLoading(false);
  };

  async function onGoogleButtonPress() {
    setFirebaseNetwork('google.com');
    try {
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();
    
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    
      // Sign-in the user with the credential
      return await auth().signInWithCredential(googleCredential);
      // return userCredential;
    } catch(err) {
      console.log('GoogleSignInButtonError: ', err);
    }
    
  }

  async function onFacebookButtonPress() {
    setFirebaseNetwork('facebook.com');
    try {
      if(Platform.OS != 'ios') {
        // Create a nonce and the corresponding
        // sha256 hash of the nonce
        const nonce = '467891';
        const nonceSha256 = await sha256(nonce);
        // Attempt login with permissions and limited login
        const result = await LoginManager.logInWithPermissions(
          ['public_profile', 'email'],
          'limited',
          nonceSha256,
        );
        if (result.isCancelled) {
          throw 'User cancelled the login process';
        }
        // Once signed in, get the users AuthenticationToken
        const data = await AuthenticationToken.getAuthenticationTokenIOS();
        if (!data) {
          throw 'Something went wrong obtaining authentication token';
        }
        // Create a Firebase credential with the AuthenticationToken
        // and the nonce (Firebase will validates the hash against the nonce)
        console.log(data, nonce, nonceSha256);
        const facebookCredential = auth.FacebookAuthProvider.credential(data.authenticationToken, nonce);
        // Sign-in the user with the credential
        return  await auth().signInWithCredential(facebookCredential);
        // return userCredential;
      } else {
        // Attempt login with permissions
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        if (result.isCancelled) {
          throw 'User cancelled the login process';
        }
        // Once signed in, get the users AccesToken
        const data = await AccessToken.getCurrentAccessToken();
        if (!data) {
          throw 'Something went wrong obtaining access token';
        }
        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
        // Sign-in the user with the credential
        return await auth().signInWithCredential(facebookCredential);
        // return userCredential;
      }
    } catch (err) {
      console.log('FacebookSignInButtonError: ', err);
      if(err.code == 'auth/account-exists-with-different-credential') {
        const infoRequest = await new GraphRequest('/me?fields=email', null, (error, result) => {
          if (error) {
            console.log('Error fetching data: ' + error.toString());
          } else {
            // console.log('GraphRequest', result);
            // console.log(result.picture.data.url);
            if(result.email) {
              onFirebaseSignInError(result.email, err.userInfo.authCredential);
            }
          }
        });
        await new GraphRequestManager().addRequest(infoRequest).start();
        
      }
      
    }
    
  }



  async function onAppleButtonPress() {
    setFirebaseNetwork('apple.com');
    try {
      // 1). start a apple sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      // console.log('appleAuthRequestResponse', appleAuthRequestResponse);
    
      // // 2). if the request was successful, extract the token and nonce
      const { identityToken, nonce } = appleAuthRequestResponse;
    
      // // can be null in some scenarios
      if (identityToken) {
        // 3). create a Firebase `AppleAuthProvider` credential
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
        // console.log('appleCredential', appleCredential);
    
        // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
        //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
        //     to link the account to an existing user
        const userCredential = await auth().signInWithCredential(appleCredential);
        // console.log('userCredential', userCredential);

        // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
        // console.warn(`Firebase authenticated via Apple, UID: ${userCredential.user.uid}`);


      } else {
        // handle this - retry?
      } 
    } catch(err) {
      console.log('AppleSignInButtonError: ', err);
    }
  }

  const onFirebaseSignInError = (errEmail, errCredential) => {
    auth().fetchSignInMethodsForEmail(errEmail).then(providers => {
      // console.log(providers);
      if(providers.length) {
        setLinkProvider(providers[0]);
        setLinkCredential(errCredential);
      }
    }, err => {
      console.log('fetchSignInMethodsForEmailError', err);
    });
  };

  const onSocialButtonPress = async (provider) => {
    switch(provider) {
      case 'google.com':
        return onGoogleButtonPress();
      case 'facebook.com':
        return onGoogleButtonPress();
      case 'apple.com':
        return onGoogleButtonPress();
    }
  };

  const goToSuccess = () => {
    try {
      props.navigation.replace('Welcome');
    } catch (err) { }
  };

  const goToSignupAdditional = () => {
    try {
      props.navigation.replace('SignUpAdditional');
    } catch (err) { }
  };

  const goToApp = () => {
    try {
      props.navigation.dispatch(StackActions.replace('AppNav'));
    } catch (err) { }
  };

  const goToLogin = () => {
    props.navigation.navigate('Login'); 
  }
  const goToSignUp = () => {
    props.navigation.navigate('SignUp');
  }
  const skipForNow = () => {
    props.navigation.dispatch(StackActions.replace('AppNav'));
  }

  return (

    <View>

      
      <Image style={stylesInLine.walkLogo} source={require('../../assets/images/ypa/app-logo-white.png')} />
      <View style={stylesInLine.overlay}></View>
      <Image source={require('../../assets/images/ypa/ypa-slide-7.jpg')} resizeMode='cover' style={stylesInLine.mainbg}/>
       
       <View style={stylesInLine.container}>

        <View style={stylesInLine.walkthroughButtonWrapper}>
          <TouchableOpacity style={stylesInLine.walkthroughButtonSolid} onPress={() => goToLogin()} disabled={isLoading}>
            <Text style={stylesInLine.walkthroughLinkRight}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={{height:responsiveHeight(2)}}></View>

        <View style={stylesInLine.walkthroughButtonWrapper}>
          <TouchableOpacity style={stylesInLine.walkthroughButtonOutline} onPress={() => goToSignUp()} disabled={isLoading}>
            <Text style={stylesInLine.walkthroughLinkLeft}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={{height:responsiveHeight(2)}}></View>


        <TouchableOpacity onPress={() => socialSheetRef.current.open()}>
          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
            <View style={stylesInLine.socialWrapper}>
              <View style={stylesInLine.socialIconWrapper}>
                <Image style={stylesInLine.socialIcon} source={require('../../assets/images/ypa/google-icon.png')} />
              </View>
              <View style={stylesInLine.socialIconWrapperLeft}>
                <Image style={stylesInLine.socialIcon} source={require('../../assets/images/ypa/fb-icon-dark.png')} />
              </View>
              {Platform.OS == 'ios' && appleAuth.isSupported && (
                <View style={stylesInLine.socialIconWrapperLeft}>
                  <Image style={stylesInLine.socialIcon} source={require('../../assets/images/ypa/apple-logo.png')} />
                </View>
              )}
            </View>
            <Text style={stylesInLine.socialText}>Login via Social Account</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => skipForNow()}>
          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(2.5)}}>
            <Text style={{...stylesInLine.socialText, textDecorationLine: 'underline'}}>Skip for now</Text>
          </View>
        </TouchableOpacity>


        {/* Login via Social Account */}
        <RBSheet
            ref={socialSheetRef}
            closeOnDragDown={true}
            closeOnPressMask={true}
            dragFromTopOnly={true}
            height={responsiveHeight(30)}
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
                overflow:"visible"
                //borderTopWidth:1,
                // borderColor:"red"
              },
              wrapper: {
                // overflow:"visible"
              },
              draggableIcon: {
                display:"none"
              }
            }}
          >
            <View style={styles.allCenter}>
              <View style={styles.rbHandle}></View>
            </View>

            <View style={{paddingVertical: responsiveHeight(2) }}>

              <View style={styles.sheetTitleContainer}>
                <Text style={styles.sheetTitle}>Login via Social Account</Text>
                <TouchableOpacity onPress={() => socialSheetRef.current.close()}>
                  <Image style={styles.rbsheetClose} source={require('../../assets/images/ypa/new-images/close-blue.png')} />
                </TouchableOpacity>
              </View>
              
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:responsiveWidth(4),paddingVertical:responsiveWidth(5)}}>
                
                <View>
                  <TouchableOpacity style={styles.singleSheetOption} onPress={() => onGoogleButtonPress()} disabled={isLoading}>
                    <View style={styles.radioButtonPosition}>
                    <View style={stylesInLine.socialIconWrapper}>
                      <Image style={stylesInLine.socialIcon} source={require('../../assets/images/ypa/google-icon.png')} />
                    </View>
                    </View>
                    <Text style={styles.singleSheetText}>Google</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.singleSheetOption} onPress={() => onFacebookButtonPress()} disabled={isLoading}>
                    <View style={styles.radioButtonPosition}>
                    <View style={stylesInLine.socialIconWrapper}>
                      <Image style={stylesInLine.socialIcon} source={require('../../assets/images/ypa/fb-icon-dark.png')} />
                    </View>
                    </View>
                    <Text style={styles.singleSheetText}>Facebook</Text>
                  </TouchableOpacity>
                  {Platform.OS == 'ios' && appleAuth.isSupported && (
                    <TouchableOpacity style={styles.singleSheetOption} onPress={() => onAppleButtonPress()}>
                      <View style={styles.radioButtonPosition}>
                      <View style={stylesInLine.socialIconWrapper}>
                        <Image style={stylesInLine.socialIcon} source={require('../../assets/images/ypa/apple-logo.png')} />
                      </View>
                      </View>
                      <Text style={styles.singleSheetText}>Apple</Text>
                    </TouchableOpacity>
                  )} 
                </View>

              </ScrollView>


            </View>
        </RBSheet>
        



          
        {/* <TouchableOpacity onPress={() => onGoogleButtonPress()} style={styles.blueFullButtonTouchable} disabled={isLoading}>
          <View style={styles.googleButton}>
            <Image style={styles.buttonIcon} source={require('../../assets/images/ypa/google-icon.png')} />
            <Text style={styles.googleButtontext}>Google</Text>
          </View>
        </TouchableOpacity>

        <View style={{height:responsiveHeight(2)}}></View>
        
        <TouchableOpacity onPress={() => onFacebookButtonPress()} style={styles.blueFullButtonTouchable} disabled={isLoading}>
          <View style={styles.fbButton}>
            <Image style={styles.buttonIcon} source={require('../../assets/images/ypa/fb-icon.png')} />
            <Text style={styles.fbButtontext}>Facebook</Text>
          </View>
        </TouchableOpacity> */}

        {/* {Platform.OS == 'ios' && appleAuth.isSupported && (
        <View style={{marginTop: 4,padding:4}}>
          <AppleButton
            cornerRadius={3}
            style={{ 
              width: "100%",
              height:responsiveHeight(6.5) ,
              fontSize:responsiveFontSize(2.5)
            }}
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            onPress={() => onAppleButtonPress()}
            disabled={isLoading}
          />
        </View>
       )}  */}




        {/* <View style={{padding:4}}>
          <TouchableOpacity onPress={() => goToLogin()} style={styles.whiteFullButtonTouchable} disabled={isLoading}>
            <View style={{...styles.whiteFullButton,}}>
              <Text style={styles.whiteFullButtonText}>Login</Text>
            </View>
          </TouchableOpacity>
        </View> */}

        {/* <View style={{marginTop: 4,padding:4}}>
          <TouchableOpacity onPress={() => goToSignUp()} style={styles.blueFullButtonTouchable} disabled={isLoading}>
            <View style={styles.blueFullButton}>
              <Text style={styles.blueFullButtonText}>Sign Up</Text>
            </View>
          </TouchableOpacity>
        </View> */}

        {/* <View style={{marginTop: 4,}}>
          <GoogleSigninButton
            style={{
              width: "100%",
              height:responsiveHeight(7.5) ,
              fontSize:responsiveFontSize(2.5),
              borderRadius:0,
            }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={onGoogleButtonPress}
            disabled={isLoading}
          />
        </View> */}

          
         

        {/* <Button
          title="Login with Facebook"
          style={{ 
            width: "100%",
            marginTop: 10,
            height:responsiveHeight(6.5) ,
            fontSize:responsiveFontSize(2.5),
            color: "#ffffff",
            fontFamily: "FuturaLT-Bold",
          }}
          onPress={onFacebookButtonPress}
          disabled={isLoading}
        /> */}

       

         

      </View>

      {linkProvider != '' &&
        <View style={stylesInLine.centeredView}>

          <View style={stylesInLine.mainAreaPopup}>
            <View style={stylesInLine.mainTitleWrapper}>
              <View style={{marginBottom:responsiveHeight(1),marginTop:-responsiveHeight(0.3)}}>
                <Text style={stylesInLine.mainTitlePopup}>Account already exists</Text>
              </View>
              <Text style={stylesInLine.mainTitlePopupLight}>
                You have already an account with that email address. Do you want to link your account with the existing one?
              </Text> 
            </View>

            <View style={stylesInLine.iconWrapperContainer}>
              <View style={stylesInLine.iconWrapper}>
                { linkProvider == 'google.com' && <Image style={stylesInLine.iconWrapperIcon} source={require('../../assets/images/ypa/google-icon.png')} /> }
                { linkProvider == 'facebook.com' && <Image style={stylesInLine.iconWrapperIcon} source={require('../../assets/images/ypa/fb-icon-dark.png')} /> }
                { linkProvider == 'apple.com' && <Image style={stylesInLine.iconWrapperIcon} source={require('../../assets/images/ypa/apple-icon-dark.png')} /> }
              </View>
              <View>
                <FontAwesomeIcon color={'#0099ff'} size={25} icon={faAngleDoubleRight} />
              </View>
              <View style={stylesInLine.iconWrapper}>
                { linkCredential && linkCredential.providerId == 'google.com' && <Image style={stylesInLine.iconWrapperIcon} source={require('../../assets/images/ypa/google-icon.png')} /> }
                { linkCredential && linkCredential.providerId == 'facebook.com' && <Image style={stylesInLine.iconWrapperIcon} source={require('../../assets/images/ypa/fb-icon-dark.png')} /> }
                { linkCredential && linkCredential.providerId == 'apple.com' && <Image style={stylesInLine.iconWrapperIcon} source={require('../../assets/images/ypa/apple-icon-dark.png')} /> }
              </View>
            </View>
            {/* apple-icon-dark.png */}
            {/* {linkProvider} with {linkCredential && linkCredential.providerId} */}

            
            {/* <View style={styles.popupBtnWraper}>
              <TouchableOpacity onPress={() => {setLinkProvider('');}}>
                <View style={styles.cancelBtn}>
                  <Text  style={styles.cancelBtnText}>No</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setTimeout(() => { setLinkProvider(''); }, 250);onSocialButtonPress(linkProvider); }}>
                <View style={styles.applyBtn}>
                  <Text style={styles.applyBtnText}>Yes</Text>
                </View>
              </TouchableOpacity>
            </View> */}
            <View style={stylesInLine.popupBtnWraper}>
              <TouchableOpacity onPress={() => {setLinkProvider('');}}>
                <LinearGradient colors={['#ddd', '#ddd']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={stylesInLine.applyFilterButtonCancel}>
                  <Text style={stylesInLine.applyFilterButtonCancelText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setTimeout(() => { setLinkProvider(''); }, 250);onSocialButtonPress(linkProvider); }}>
                <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...stylesInLine.applyFilterButton, width:responsiveWidth(26),}}>
                  <Text style={stylesInLine.applyFilterButtonText}>Yes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>


          </View>
        </View>
      }


    </View>


  );

}

const stylesInLine = StyleSheet.create({
  socialText:{
    fontSize: responsiveFontSize(1.7),
    color: "#ffffff",
    fontFamily: "Poppins-Light",
    marginLeft:responsiveWidth(3)
  },
  socialWrapper:{
    flexDirection:"row",
    alignItems:"center",
  },
  socialIconWrapper:{
    height:responsiveHeight(4),
    width:responsiveHeight(4),
    backgroundColor:"#ffffff",
    borderRadius:40,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    borderWidth:1,
    borderColor:"#f1f1f1"
  },
  socialIconWrapperLeft:{
    height:responsiveHeight(4),
    width:responsiveHeight(4),
    backgroundColor:"#ffffff",
    borderRadius:40,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    marginLeft:-responsiveWidth(2),
    borderWidth:1,
    borderColor:"#f1f1f1"
  },
  socialIcon:{
    height:15,
    width:15,
    resizeMode:"contain",
  },
  mainbg: {
    position:"absolute",
    height:responsiveHeight(100),
    width:responsiveWidth(100),
    zIndex:1
  },
  overlay:{
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height:responsiveHeight(100),
    width:responsiveWidth(100),
    zIndex:2,
    position:"absolute",
  },
  container: {
    height:responsiveHeight(100),
    width:responsiveWidth(100),
    alignItems:"center",
    justifyContent:"flex-end",
    position:"relative",
    zIndex:3,
    paddingHorizontal:responsiveWidth(5),
    paddingBottom:responsiveHeight(2)
  },
  walkLogo:{
    height:responsiveHeight(10),
    width:responsiveWidth(95),
    // backgroundColor:"red",
    resizeMode:"contain",
    top:responsiveHeight(10),
    position:"absolute",
    zIndex:3,
    left:responsiveWidth(2.5)
  },
  logo: {
    height: responsiveHeight(10),
    width: responsiveWidth(36),
    resizeMode: 'contain',
    // backgroundColor:"red"
  },
  title: {
    fontSize: responsiveFontSize(2.2),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
    marginVertical: responsiveHeight(3.5)
  },
  whiteFullButtonTouchable:{
    width:"100%",
  },
  whiteFullButton:{
    backgroundColor:"#ffffff",
    // borderRadius:7,
    alignItems:"center",
    justifyContent:"center",
    paddingHorizontal:responsiveHeight(1.5),
    height:responsiveHeight(6.5),
    borderRadius:3
  },
  whiteFullButtonText:{
    fontSize: responsiveFontSize(2.5),
    color: "#011c38",
    fontFamily: "FuturaLT-Bold",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  blueFullButtonTouchable:{
    width:"100%",
  },
  blueFullButton:{
    backgroundColor:"#012344",
    alignItems:"center",
    justifyContent:"center",
    paddingHorizontal:responsiveHeight(1.5),
    height:responsiveHeight(6.5),
    borderRadius:3
  },
  blueFullButtonText:{
    fontSize: responsiveFontSize(2.5),
    color: "#ffffff",
    fontFamily: "FuturaLT-Bold",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  googleButton:{
    backgroundColor:"#ffffff",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    width:responsiveWidth(90),
    height:responsiveHeight(7.5),
    borderRadius:8,
  },

  fbButton:{
    backgroundColor:"#3b579d",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    width:responsiveWidth(90),
    height:responsiveHeight(7.5),
    borderRadius:8,
  },
  buttonIcon:{
    height:20,
    width:20,
    resizeMode:"contain",
    marginRight:24
  },
  fbButtontext:{
    fontSize: responsiveFontSize(1.7),
    color: "#ffffff",
    fontFamily: "Poppins-Light",
  },
  googleButtontext:{
    fontSize: responsiveFontSize(1.7),
    color: "#757575",
    fontFamily: "Poppins-Light",
  },













  
  mainAreaPopup:{
    backgroundColor:"#ffffff",
    alignItems:"center",
    justifyContent:"center",
    position:"relative",
    alignSelf:"center",
    padding:responsiveWidth(4),
    paddingTop:responsiveWidth(6),
    borderRadius:10,
    width:responsiveWidth(90)
  },
  popupImageWrapper:{
    backgroundColor:"#ffffff",
    position:"absolute",
    top:-responsiveHeight(5),
    padding:responsiveHeight(1.6),
    borderRadius:50
  },
  popupImage:{
    height:responsiveHeight(7),
    width:responsiveHeight(7),
    resizeMode:"contain"
  },
  iconWrapperContainer:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    width:"100%",
    marginTop:responsiveHeight(3),
    marginBottom:responsiveHeight(1)
  },
  iconWrapper:{
    backgroundColor:"#f1f1f1",
    padding:responsiveHeight(0.8),
    borderRadius:50,
    marginHorizontal:responsiveHeight(2)
  },
  iconWrapperIcon:{
    height:responsiveHeight(3.5),
    width:responsiveHeight(3.5),
    resizeMode:"contain"
  },
  mainTitleWrapper:{
    flexWrap:"wrap",
    alignItems:"center",
    justifyContent:"center"
  },
  mainTitlePopup:{
    fontFamily: "Poppins-SemiBold",
    textAlign:"center",
    fontSize:responsiveFontSize(2.2),
    color:"#222222"
  },
  mainTitlePopupLight:{
    fontFamily: "Poppins-Light",
    textAlign:"center",
    fontSize:responsiveFontSize(2.1),
    color:"#222222",
    marginTop:responsiveHeight(1)
  },
  mainTitlePopupBold:{
    fontFamily: "Poppins-SemiBold",
    textAlign:"center",
    color:"#ffffff",
    fontSize:responsiveFontSize(2.2)
  },
  popupBtnWraper:{
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center",
    justifyContent:"center",
    marginTop:responsiveHeight(3)
  },
  cancelBtn:{
    backgroundColor:"#012344",
    alignItems:"center",
    justifyContent:"center",
    padding:responsiveHeight(1.5),
    marginRight: responsiveWidth(3),
    paddingHorizontal:responsiveWidth(6)
  },
  cancelBtnText:{
    fontSize: responsiveFontSize(2),
    color: "#ffffff",
    fontFamily: "FuturaLT-Bold",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  applyBtn:{
    backgroundColor:"#ffffff",
    // borderRadius:7,
    alignItems:"center",
    justifyContent:"center",
    padding:responsiveHeight(1.5),
    paddingHorizontal:responsiveWidth(6)
  },
  applyBtnText:{
    fontSize: responsiveFontSize(2),
    color: "#011c38",
    fontFamily: "FuturaLT-Bold",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  // MODAL VIEW
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.8)',
    position:"absolute",
    top:0,
    left:0,
    right:0,
    bottom:0
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: responsiveHeight(4),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 10,
    paddingTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(0.5),
    paddingHorizontal: responsiveWidth(4),
    // elevation: 2,
    marginHorizontal:responsiveWidth(2)
  },
  textStyleCancel:{
    fontFamily:"FuturaLT",
    fontSize:responsiveFontSize(1.8),
    color:"#888888",
    textAlign: "center"
  },
  textStyle: {
    fontFamily:"FuturaLT",
    fontSize:responsiveFontSize(1.8),
    color:"#222222",
    textAlign: "center"
  },
  modalTextMain: {
    fontFamily:"FuturaLT-Book",
    fontSize:responsiveFontSize(1.9),
    color:"#333"
  },
  modalTextSub: {
    fontFamily:"FuturaLT",
    fontSize:responsiveFontSize(1.7),
    color:"#666666",
    marginBottom: responsiveHeight(1.8),
    textAlign: "center"
  },
  // MODAL VIEW


  popupBtnWraper:{
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center",
    justifyContent:"center",
    marginTop:responsiveHeight(3)
  },
  applyFilterButtonCancel:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"#eaf4fe",
    borderRadius:8,
    width:responsiveWidth(26),marginRight:responsiveWidth(3),
    height:responsiveHeight(6)
  },
  applyFilterButtonCancelText:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(2),
    color: "#222",
  },
  applyFilterButton:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"#eaf4fe",
    borderRadius:8,
    width:responsiveWidth(40),
    height:responsiveHeight(6)
  },
  applyFilterButtonText:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(2),
    color: "#ffffff",
  },
  walkthroughButtonWrapper: {
    width:responsiveWidth(100),
    // position: "absolute",
    // bottom: responsiveHeight(2.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  walkthroughButtonOutline:{
    width:responsiveWidth(90),
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
    color: "#222222",
    fontFamily: "Poppins-SemiBold",
  },
  walkthroughLinkLeft: {
    fontSize: responsiveFontSize(2.1),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
  },



});
