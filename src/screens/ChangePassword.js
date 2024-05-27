import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import {  StyleSheet, Text, View, ImageBackground, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight,  Picker, Keyboard, ActivityIndicator, I18nManager } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenWidth} from "react-native-responsive-dimensions";
import Input from '../ui/Input';
import LinearGradient from 'react-native-linear-gradient';

import { useSelector, useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';
import * as commonActions from '../store/actions/common';

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

export default ChangePassword = props => {

  const dispatch = useDispatch(); 
  const i18n = useSelector(state => state.common.i18n);
  const authUser = useSelector(state => state.auth.user);  
  const [isLoading, setIsLoading] = useState(false);
  
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      password: '',
      new_password: '',
      confirm_password: '',
    },
    inputValidities: {
      password: false,
      new_password: false,
      confirm_password: false,
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
    },
    [dispatchFormState]
  );

  const goBack = () => {
    props.navigation.goBack(null);
  };
  const demo = () => {
    console.log('demo function clicked');
  };

  const updatePassword = async () => {
    setIsLoading(true);
    let payload = {
      password: formState.inputValues.password,
      new_password: formState.inputValues.new_password,
    };
    try {
      await dispatch(authActions.updatePassword(payload));
      props.navigation.goBack();
      dispatch(commonActions.setSystemMessage('Password changed successfully.'));
    } catch (err) {
      console.log(err);      
      dispatch(commonActions.setSystemMessage(err.message));
    }
    setIsLoading(false);
  };
 
  return (
    <View style={styles.parentWrapper}>

      <ScrollView style={{ flex: 1,backgroundColor:"#ffffff",}}>

        <View style={{paddingBottom:responsiveHeight(10), paddingTop:responsiveHeight(4),}}>

          <View style={{marginTop: responsiveHeight(3),}}>
            <View style={{...styles.normalInputContainer}}>
              <Text style={styles.normalInputText}>Old Password</Text>
              <Input 
                id="password"
                secureTextEntry={true}
                selectionColor={'#333'}
                style={styles.input} 
                errorContainerStyle={styles.errorContainer}
                errorTextStyle={styles.errorText}
                placeholderTextColor="#999999" 
                placeholder="" 
                required
                errorText={'Enter your old password'}
                onInputChange={inputChangeHandler}
                validateOnChange={true}
                initialValue=""
              />
            </View>

            <View style={{...styles.normalInputContainer}}>
              <Text style={styles.normalInputText}>New Password</Text>
              <Input 
                id="new_password"
               
                selectionColor={'#333'}
                style={styles.input} 
                errorContainerStyle={styles.errorContainer}
                errorTextStyle={styles.errorText}
                placeholderTextColor="#999999" 
                placeholder="" 
                secureTextEntry={true}
                required
                minLength={6}
                maxLength={20}
                errorText={'Enter a password between 6 to 20 characters'}
                onInputChange={inputChangeHandler}
                validateOnChange={true}
                initialValue=""

                
                        
              />
            </View>

            <View style={{...styles.normalInputContainer}}>
              <Text style={styles.normalInputText}>Confirm Password</Text>
              <Input 
                id="confirm_password"
                secureTextEntry={true}
                selectionColor={'#333'}
                style={styles.input} 
                errorContainerStyle={styles.errorContainer}
                errorTextStyle={styles.errorText}
                placeholderTextColor="#999999" 
                placeholder="" 
                required
                equals={formState.inputValues.new_password}
                errorText={'Password should be matched'}
                onInputChange={inputChangeHandler}
                validateOnChange={true}
                initialValue=""
              />
            </View>


            <View style={styles.bottomButtonArea}>
              <TouchableOpacity style={{opacity: (formState.formIsValid && !isLoading ? 1 : 0.5 )}} disabled={!(formState.formIsValid && !isLoading)} onPress={() => updatePassword()}>
                <LinearGradient colors={['#3895fc', '#005ba6']} style={styles.solidButtonPrimary} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                  { !isLoading ?
                    <Text style={styles.solidButtonPrimaryText}>Change Password</Text> 
                  :
                    <ActivityIndicator size="small" color={'#ffffff'} />
                  }
                </LinearGradient>
              </TouchableOpacity>
            </View>
            

        



          </View>
        </View>
      </ScrollView>

    </View>
  );

 
}

const styles = StyleSheet.create({

  companyButton: {
    backgroundColor: "#007fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width:"100%",
    height: responsiveHeight(6.5),
  },
  companyButtonText: {
    fontSize: responsiveFontSize(2.5),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
  },
 
  parentWrapper:{
    flex:1,
    backgroundColor:"#ffffff",
  },
  categoryName:{
    fontFamily:"Poppins-SemiBold",
    fontSize:responsiveFontSize(2.8),
    color:"#5f5f5f",
    marginBottom:10,
    marginTop: responsiveWidth(3),
  },
  locationPin:{
    height:responsiveHeight(2.5),
    width:responsiveHeight(2.5),
    resizeMode:"contain",
    marginRight:responsiveWidth(3),
  },
  searchSection: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height:responsiveWidth(15),
    width: responsiveWidth(100),
  },
  searchInputBorderLess:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(1.9),
    color:"#5f5f5f",
    borderRadius:8,
    paddingHorizontal:responsiveWidth(2),
    paddingTop:responsiveWidth(1),
    paddingBottom:responsiveWidth(1),
    flex:1,
    flexDirection:"row",
    alignItems:"center"
  },
  
  searchInput:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(1.9),
    color:"#5f5f5f",
    borderColor:"#eaeaea",
    borderRadius:8,
    paddingHorizontal: responsiveWidth(3.2),
    height:responsiveHeight(7),
    flexDirection:"row",
    alignItems:"center",
    // backgroundColor: 'red',
    marginBottom:responsiveHeight(6),
  },
  searchInputText:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(1.9),
    color:"#5f5f5f",
    paddingTop:responsiveWidth(1),
  },

  
  backContainer:{
    height:responsiveWidth(10),
    width:responsiveWidth(10),
    backgroundColor:"#ffffff",  
    paddingHorizontal:responsiveWidth(3),
    paddingVertical:responsiveHeight(3),
  },
  backButton:{
    height:responsiveWidth(6),
    width:responsiveWidth(8),
    transform: [{ rotate: '180deg' }]
  },
  headingContainer:{
    paddingHorizontal:responsiveWidth(3),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-end",
    marginTop:responsiveHeight(2.5),
  },
  pageHeading:{
    fontFamily:"Poppins-SemiBold",
    fontSize:responsiveFontSize(3),
    color:"#5f5f5f",
    margin:0,
    lineHeight:responsiveFontSize(4),
  },
  pageHeadingButton:{
    backgroundColor:"#2498fd",
    paddingTop:responsiveWidth(0.8),
    paddingBottom:responsiveWidth(0.8),
    paddingHorizontal:responsiveWidth(3),
    borderRadius:9
  },
  pageHeadingButtonText:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(1.8),
    color:"#ffffff"
  },
  singleOption:{
    paddingHorizontal:responsiveWidth(3),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    marginBottom:responsiveHeight(2.5),
  },
  userImage:{
    height:responsiveHeight(8),
    width:responsiveHeight(8),
    borderRadius:100
  },
  pagetitle:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(2.2),
    color:"#5f5f5f",
    marginLeft:responsiveWidth(3)
  },
  pageSubTitle:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(1.8),
    lineHeight:responsiveFontSize(2.2),
    color:"#5f5f5f",
    marginLeft:responsiveWidth(3.2)
  },
  imageContainer:{
    flexDirection:"row", 
    width:'100%', 
    alignItems: "center", 
    justifyContent:"space-between", 
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(6),
    paddingHorizontal:responsiveWidth(3.2)
  },
  singleImageUploadBG:{
    backgroundColor: '#e3e3e3',
    height: responsiveWidth(21),
    width: responsiveWidth(21),
    borderRadius: 20,
    alignItems:"center",
    justifyContent: 'center',
    position: "relative"
  },
  singleImageUploadBGImage:{
    height: responsiveWidth(21),
    width: responsiveWidth(21),
    resizeMode:"contain",
    borderRadius: 20,
  },
  addButton:{
    height: responsiveWidth(7),
    width: responsiveWidth(7),
    resizeMode:"contain"
  },
  btnSection:{
    position: "absolute",
    height: responsiveWidth(7),
    width: responsiveWidth(7),
    resizeMode:"contain",
    right: -9,
    top: -9,
    zIndex: 2,
  },
  imageRemoveIcon:{
    width: '100%',
    height: '100%',
  },
  profileImage:{
    height:responsiveHeight(14),
    width:responsiveHeight(14),
    borderRadius:50,
    alignSelf:"center",
    marginBottom:25,
    marginTop:10
  },
  profileImageShadow:{
    height:responsiveHeight(14),
    width:responsiveHeight(14),
    borderRadius:50,
    zIndex:2,
    top:responsiveHeight(1.5),
    position:"absolute",
  },
  normalInputContainer:{
    paddingHorizontal:responsiveWidth(3.5),
    marginBottom:responsiveHeight(6),
    // backgroundColor:"green",
    flex:1,
    //height:responsiveHeight(7)
  },
  discountText:{
    paddingBottom:responsiveHeight(6),
    fontFamily:"Poppins-SemiBold",
    fontSize: responsiveFontSize(3),
    color:"green",
    marginLeft:5
  },
  normalInputText:{
    fontFamily:"Poppins-SemiBold",
    fontSize: responsiveFontSize(1.7),
    color:"#222222",
    position:"absolute",
    top:-responsiveHeight(1.4),
    left:responsiveWidth(6),
    backgroundColor:"#ffffff",
    zIndex:2,
    paddingHorizontal:responsiveWidth(2.5)
  },
  simpleInputText:{
    fontFamily:"Poppins-SemiBold",
    fontSize: responsiveFontSize(1.7),
    color:"#000000",
    marginLeft:responsiveWidth(3),
    marginBottom:responsiveHeight(1.5)
  },
  input:{
    marginLeft: 0,
    paddingHorizontal:responsiveWidth(3),
    fontFamily:"Poppins-Light",
    fontSize: responsiveFontSize(1.9),
    // fontWeight: '700',
    borderColor:"#cecece",
    height:responsiveHeight(8),
    borderWidth:1,
    borderRadius:6,
    color: '#222222',
    textAlign : 'left',
    // width:"100%",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  viewInput:{
    fontFamily:"Poppins-Light",
    fontSize: responsiveFontSize(1.8),
    color: '#000000',
    width:responsiveWidth(78),
  },
  inputText:{
    marginLeft: 0,
    paddingRight: 15,
    fontFamily:"Poppins-Light",
    paddingTop:responsiveHeight(0),
    paddingBottom:11,
    fontSize: responsiveFontSize(1.8),
    lineHeight:responsiveFontSize(2),
    color: '#5f5f5f',
    textAlign: "left",
  },
  errorContainer: {
    // margin: 0,
    position: "absolute",
    bottom: -29,
    left:10
  },
  errorText: {
    color: 'red',
    fontFamily:"Poppins-Light",
    fontSize: responsiveFontSize(1.6),
  },


  pickerArrow:{
    height:responsiveWidth(4.5),
    width:responsiveWidth(2.5),
    resizeMode:"contain",
    transform: [{ rotate: '270deg' }],
    position:"absolute",
    right:15,
    top:responsiveHeight(2.5),
  },



  
  sheetTitleContainer:{
    borderBottomWidth:1,
    borderColor:"#e6e6e6",
    paddingBottom:responsiveHeight(2),
    marginBottom:responsiveHeight(2)
  },
  sheetTitle:{
    fontSize: responsiveFontSize(2.1),
    // lineHeight:responsiveFontSize(2.1),
    fontFamily:"Poppins-SemiBold",
    color:"#5f5f5f",
    textAlign:"center"
  },
  singleSheetOption:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start",
    flexWrap:"wrap",
    marginBottom:responsiveHeight(0.5),
    // backgroundColor:"red",
    paddingVertical:responsiveHeight(1.5),
  },
  singleSheetText:{
    fontSize: responsiveFontSize(2),
    fontFamily:"Poppins-Light",
    color:"#5f5f5f",
    width:responsiveWidth(80)
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems:"center"
  },
  label: {
    alignSelf: "center",
    fontSize: responsiveFontSize(1.9),
    marginLeft:5,
    // lineHeight:responsiveFontSize(2.1),
    fontFamily:"Poppins-SemiBold",
    color:"#ffffff",
    textAlign:"center"
  },
  



  
  categoryContainer:{
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center",
    justifyContent:"flex-start",
    width:"100%",
    paddingHorizontal:responsiveWidth(2.5),
  },
  singleCategory:{
    borderWidth:1.5,
    backgroundColor:"#ffffff",
    borderColor:"#0085c3",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    paddingHorizontal:10,
    height:responsiveWidth(10),
    borderRadius:10,
    marginHorizontal:8,
    marginVertical:5
  },
  singleCategoryName:{
    fontSize: responsiveFontSize(1.9),
    fontFamily:"Poppins-Light",
    color:"#1198cd"
  },
  singleCategoryClose:{
    height:responsiveWidth(5),
    width:responsiveScreenWidth(5),
    resizeMode:"contain",
    marginLeft:responsiveWidth(2)
  },


  bottomButtonArea:{
    // backgroundColor:"red",
    width: "100%",
    paddingHorizontal:responsiveWidth(5),
    paddingBottom:responsiveHeight(2),
    paddingTop:responsiveHeight(0),
    // marginVertical: 15,
  },
  mainButtonText:{
    fontSize: responsiveFontSize(1.8),
    color:"#ffffff",
    fontFamily:"Poppins-Light",
  },
  mainButton:{
    backgroundColor: "#2498fd",
    height: responsiveHeight(6),
    width: "100%",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    marginVertical: 15,
    borderRadius: 50
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


  // RADIO
  radioButtonPosition: {
    // position:"absolute", 
    // top: responsiveWidth(5), 
    // right:responsiveWidth(5),
    // zIndex:1
    marginRight: responsiveWidth(3)
  },






  profileInfo:{
    paddingHorizontal:responsiveWidth(3.5),
    marginBottom:responsiveHeight(0.8),
    marginTop:-responsiveHeight(1)
    // alignItems:"center",
    // justifyContent:"space-between",
  },
  profileInfoIconWrapper:{
    height:responsiveWidth(12),
    width:responsiveWidth(12),
    borderRadius:50,
    alignItems:"center",
    justifyContent:"center",
    marginRight:15,
    backgroundColor:"#dff0ff",
  },
  label:{
    fontSize: responsiveFontSize(1.8),
    fontFamily: "Poppins-SemiBold",
    color: "#5f5f5f",
    // width:responsiveWidth(30)
  },
  content:{
    fontSize: responsiveFontSize(2),
    fontFamily: "Poppins-Light",
    color: "#b1b1b1",
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
    color: "#000000",
  },

  bio:{
    fontSize: responsiveFontSize(2),
    fontFamily: "Poppins-Light",
    color: "#222222",
    marginTop:responsiveHeight(0),
    marginBottom:responsiveHeight(4),
  },

  singleSubject:{
    borderWidth:1,
    borderColor:"#e4e4e4",
    borderRadius:6,
    padding:responsiveWidth(3.2),
    width:responsiveWidth(80),
    marginBottom:10,
  },


  // POPUP
  applyPopup:{
    position:"absolute",
    top:0,
    bottom:0,
    right:0,
    left:0,
    zIndex:99999,
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems:"center",
    justifyContent:"center",
    padding:responsiveWidth(9)
  },


  mainAreaPopup:{
    backgroundColor:"#ffffff",
    alignItems:"center",
    justifyContent:"center",
    position:"relative",
    padding:responsiveWidth(4),
    borderRadius:10,
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
  mainTitleWrapper:{
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center",
    justifyContent:"center"
  },
  mainTitlePopup:{
    fontFamily: "Poppins-Light",
    textAlign:"center",
    fontSize:responsiveFontSize(2),
  },
  mainTitlePopupSub:{
    fontFamily: "FuturaLT",
    textAlign:"center",
    fontSize:responsiveFontSize(1.8),
  },
  mainTitlePopupBold:{
    fontFamily: "Poppins-SemiBold",
    textAlign:"center",
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
    backgroundColor: "#dcdcdc",
    marginRight: responsiveWidth(3),
    borderRadius:6,
    paddingVertical:responsiveHeight(1.4),
    width:responsiveWidth(26)
  },
  cancelBtnText:{
    fontFamily: "Poppins-Light",
    textAlign:"center",
    fontSize:responsiveFontSize(1.8),
    color: "#333",
  },
  applyBtn:{
    backgroundColor: "#d74949",
    marginRight: responsiveWidth(2),
    borderRadius:6,
    paddingVertical:responsiveHeight(1.4),
    width:responsiveWidth(26)
  },
  applyBtnText:{
    fontFamily: "Poppins-Light",
    textAlign:"center",
    fontSize:responsiveFontSize(1.8),
    color: "#ffffff",
  },

  inputIcon:{
    height:responsiveHeight(2.1),
    width:responsiveHeight(2.1),
    resizeMode:"contain"
  },
  solidButtonPrimary:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    borderRadius:8,
    paddingHorizontal:responsiveWidth(4),
    height:responsiveHeight(6.2),
    width:"100%"
  },
  solidButtonPrimaryText:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(1.9),
    color: "#ffffff",
  },
  mainTitlePopup:{
    fontFamily: "Poppins-SemiBold",
    textAlign:"center",
    fontSize:responsiveFontSize(2.3),
    color:"#222",
    marginBottom:responsiveHeight(0.5)
  },
  mainTitlePopupLight:{
    fontFamily: "Poppins-Light",
    textAlign:"center",
    fontSize:responsiveFontSize(2),
    color:"#222"
  },
  mainTitlePopupBold:{
    fontFamily: "Poppins-Bold",
    textAlign:"center",
    color:"#222",
    fontSize:responsiveFontSize(2.2)
  },
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
  backHeaderStyleInner:{
    width:responsiveScreenWidth(100),
    height: responsiveHeight(9),
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: responsiveWidth(3),
    borderBottomWidth:1,
    borderBottomColor:"#f1f1f1",
    backgroundColor:"#ffffff"
  },
  headerBackIcon:{
    height:responsiveHeight(2.3),
    width:responsiveHeight(2.3),
    resizeMode:"contain"
  },

  pageHeading: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2.2),
    color: "#222",
    position: "relative",
    top: 1,
    marginLeft: responsiveWidth(2)
  },

});
