
import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import {  StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight,  Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation } from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize,} from "react-native-responsive-dimensions";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Input from '../ui/Input';
import CheckBox from '@react-native-community/checkbox';
import RadioButton from 'radio-button-react-native';
import RBSheet from "react-native-raw-bottom-sheet";


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

// const inputChangeHandler = useCallback(
//   (inputIdentifier, inputValue, inputValidity) => {
//     dispatchFormState({
//       type: FORM_INPUT_UPDATE,
//       value: inputValue,
//       isValid: inputValidity,
//       input: inputIdentifier
//     });
//   },
//   [dispatchFormState]
// );



export default AddressEditNew = props => {

  
  const EthnicitySheetRef = useRef(null);
  const GenderSheetRef = useRef(null);

  const [selectedEthnicity, setSelectedEthnicity] = useState('Asian or Asian British');
  const [selectedGender, setSelectedGender] = useState('Male');



  const goToProductDetails = () => {
    props.navigation.push('ProductDetails'); 
  };
  
  const selectEthinicity = ethnicity => {
    EthnicitySheetRef.current.close();
    setSelectedEthnicity(ethnicity);
  };
  const selectGender = gender => {
    GenderSheetRef.current.close();
    setSelectedGender(gender);
  };





  return ( 
    <View style={styles.parentWrapper}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollview} contentContainerStyle={{paddingBottom: 10}}>
      




      {/* Ethnicity */}
      <RBSheet
        ref={EthnicitySheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={responsiveHeight(36)}
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
            <Text style={styles.sheetTitle}>Select Ethnicity</Text>
          </View>
          <ScrollView style={styles.sheetScroll}>

            <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthinicity('Asian or Asian British')}>
              <View style={styles.radioButtonPosition}>
                <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Asian or Asian British'} onPress={() => selectEthinicity('Asian or Asian British')} />
              </View>
              <Text style={styles.singleSheetText}>Asian or Asian British</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthinicity('Black or Black British')}>
              <View style={styles.radioButtonPosition}>
                <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Black or Black British'} onPress={() => selectEthinicity('Black or Black British')} />
              </View>
              <Text style={styles.singleSheetText}>Black or Black British</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthinicity('Mixed')}>
              <View style={styles.radioButtonPosition}>
                <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Mixed'} onPress={() => selectEthinicity('Mixed')} />
              </View>
              <Text style={styles.singleSheetText}>Mixed</Text>
            </TouchableOpacity>

            <View style={{ height: responsiveHeight(8) }}></View>

          </ScrollView>
        </View>
      </RBSheet>
      {/* Ethnicity END */}



      {/* Gender */}
      <RBSheet
        ref={GenderSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={responsiveHeight(36)}
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
            <Text style={styles.sheetTitle}>Select Gender</Text>
          </View>
          <ScrollView style={styles.sheetScroll}>

            <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectGender('Male')}>
              <View style={styles.radioButtonPosition}>
                <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedGender} value={'Male'} onPress={() => selectGender('Male')} />
              </View>
              <Text style={styles.singleSheetText}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectGender('Female')}>
              <View style={styles.radioButtonPosition}>
                <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedGender} value={'Female'} onPress={() => selectGender('Female')} />
              </View>
              <Text style={styles.singleSheetText}>Female</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectGender('Other')}>
              <View style={styles.radioButtonPosition}>
                <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedGender} value={'Other'} onPress={() => selectGender('Other')} />
              </View>
              <Text style={styles.singleSheetText}>Other</Text>
            </TouchableOpacity>

            <View style={{ height: responsiveHeight(8) }}></View>

          </ScrollView>
        </View>
      </RBSheet>
      {/* Gender END */}










      <View style={{padding:responsiveWidth(3)}}>

        <View style={styles.addressSection}>
          <View style={{height:10}}></View>
          <View style={styles.normalInputContainer}>
            <Text style={styles.normalInputText}>Name</Text>
            <Input 
              id="address"
              style={{...styles.input}} 
              errorContainerStyle={styles.errorContainer}
              errorTextStyle={styles.errorText}
              placeholderTextColor="#999999" 
              placeholder={"Enter Name"} 
              multiline={true} 
              // onInputChange={inputChangeHandler}
              errorText="Enter a valid name"
            />
          </View>
          <View style={styles.normalInputContainer}>
            <Text style={styles.normalInputText}>Date of birth</Text>
            <Input 
              id="address"
              style={{...styles.input}} 
              errorContainerStyle={styles.errorContainer}
              errorTextStyle={styles.errorText}
              placeholderTextColor="#999999" 
              placeholder={"Enter Name"} 
              multiline={true} 
              // onInputChange={inputChangeHandler}
              errorText="Enter a valid name"
            />
          </View>
          <View style={styles.normalInputContainer}>
            <Text style={styles.normalInputText}>Ethnicity</Text>
            <TouchableOpacity onPress={() => EthnicitySheetRef.current.open()}>
              <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>{selectedEthnicity}</Text>
                <View style={styles.dropdownIcon}>
                  <FontAwesomeIcon color={'#222222'} size={19} icon={faChevronDown} />
                  </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.normalInputContainer}>
            <Text style={styles.normalInputText}>Gender</Text>
            <TouchableOpacity onPress={() => GenderSheetRef.current.open()}>
              <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>{selectedGender}</Text>
                <View style={styles.dropdownIcon}>
                  <FontAwesomeIcon color={'#222222'} size={19} icon={faChevronDown} />
                  </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.normalInputContainer}>
            <Text style={styles.normalInputText}>Level of Study</Text>
            <Input 
              id="address"
              style={{...styles.input}} 
              errorContainerStyle={styles.errorContainer}
              errorTextStyle={styles.errorText}
              placeholderTextColor="#999999" 
              placeholder={"Enter Name"} 
              multiline={true} 
              // onInputChange={inputChangeHandler}
              errorText="Enter a valid name"
            />
          </View>
          <View style={styles.normalInputContainer}>
            <Text style={styles.normalInputText}>School / College</Text>
            <Input 
              id="address"
              style={{...styles.input}} 
              errorContainerStyle={styles.errorContainer}
              errorTextStyle={styles.errorText}
              placeholderTextColor="#999999" 
              placeholder={"Enter Name"} 
              multiline={true} 
              // onInputChange={inputChangeHandler}
              errorText="Enter a valid name"
            />
          </View>
          <View style={styles.normalInputContainer}>
            <Text style={styles.normalInputText}>Post Code</Text>
            <Input 
              id="address"
              style={{...styles.input}} 
              errorContainerStyle={styles.errorContainer}
              errorTextStyle={styles.errorText}
              placeholderTextColor="#999999" 
              placeholder={"Enter Name"} 
              multiline={true} 
              // onInputChange={inputChangeHandler}
              errorText="Enter a valid name"
            />
          </View>
          <View style={styles.normalInputContainer}>
            <Text style={styles.normalInputText}>Sectors of Interest</Text>
            <Input 
              id="address"
              style={{...styles.input}} 
              errorContainerStyle={styles.errorContainer}
              errorTextStyle={styles.errorText}
              placeholderTextColor="#999999" 
              placeholder={"Enter Name"} 
              multiline={true} 
              // onInputChange={inputChangeHandler}
              errorText="Enter a valid name"
            />
          </View>
          <View style={styles.normalInputContainer}>
            <Text style={styles.normalInputText}>Skills</Text>
            <Input 
              id="address"
              style={{...styles.input}} 
              errorContainerStyle={styles.errorContainer}
              errorTextStyle={styles.errorText}
              placeholderTextColor="#999999" 
              placeholder={"Enter Name"} 
              multiline={true} 
              // onInputChange={inputChangeHandler}
              errorText="Enter a valid name"
            />
          </View>
          <View style={styles.normalInputContainer}>
            <Text style={styles.normalInputText}>Subject</Text>
            <Input 
              id="address"
              style={{...styles.input}} 
              errorContainerStyle={styles.errorContainer}
              errorTextStyle={styles.errorText}
              placeholderTextColor="#999999" 
              placeholder={"Enter Name"} 
              multiline={true} 
              // onInputChange={inputChangeHandler}
              errorText="Enter a valid name"
            />
          </View>
          <View style={styles.normalInputContainer}>
            <Text style={styles.normalInputText}>Bio</Text>
            <Input 
              id="address"
              style={{...styles.input}} 
              errorContainerStyle={styles.errorContainer}
              errorTextStyle={styles.errorText}
              placeholderTextColor="#999999" 
              placeholder={"Enter Name"} 
              multiline={true} 
              // onInputChange={inputChangeHandler}
              errorText="Enter a valid name"
            />
          </View>
        </View> 


        <TouchableOpacity>
          <View style={styles.companyButton}>
            <Text style={styles.companyButtonText}>Save Profile</Text>
          </View>
        </TouchableOpacity>

      </View>

      




      </ScrollView>
    </View>
  );

}

const styles = StyleSheet.create({
  
  parentWrapper:{
    flex:1,
    backgroundColor:"#ffffff",
  },
  scrollview:{
    height: '100%',
  },
  breadcrumbWrapper:{
    flexDirection:"row",
    alignItems:"center",
    flexWrap:"wrap",
    marginBottom:10
  },
  breadcrumbText:{
    fontFamily:"FuturaLT",
    fontSize:responsiveFontSize(2),
    color:"#333333",
  },
  breadcrumbarrow:{
    height:responsiveHeight(1.2),
    width:responsiveHeight(1.2),
    marginHorizontal:8,
    resizeMode:"contain"
  },
  categoryName:{
    fontFamily:"FuturaLT-Bold",
    fontSize:responsiveFontSize(2.8),
    color:"#333333",
  },
  addressSectionHeading:{
    textAlign:"right",
    fontFamily:"Poppins-SemiBold",
    fontSize:responsiveFontSize(2),
    color:"#2e80fe",
    marginBottom:0,
  },
  addressIcon:{
    height:responsiveWidth(5),
    width:responsiveWidth(5),
    resizeMode:"contain",
    marginRight:5
  },
  addressSection:{
    paddingHorizontal:responsiveWidth(1),
    paddingVertical:responsiveWidth(3),
    paddingBottom:0,
    backgroundColor:"#ffffff",
    // borderBottomWidth:1,
    marginBottom:responsiveHeight(1),
    // borderColor:"#ececec",
    // borderRadius:10
  },
  normalInputContainer:{
    // paddingHorizontal:responsiveWidth(3.5),
    marginBottom:responsiveHeight(4),
    // backgroundColor:"green",
    flex:1,
    //height:responsiveHeight(7)
  },
  normalInputText:{
    fontFamily:"Poppins-SemiBold",
    fontSize: responsiveFontSize(2),
    color:"#2e80fe",
    position:"absolute",
    top:-12,
    left:responsiveWidth(3),
    backgroundColor:"#ffffff",
    zIndex:2,
    paddingHorizontal:responsiveWidth(2)
  },
  dropdown:{
    marginLeft: 0,
    paddingRight: responsiveWidth(20),
    paddingLeft: responsiveWidth(5),
    paddingTop:responsiveHeight(2.2),
    paddingBottom:responsiveHeight(1.8),
    borderColor:"#2e80fe",
    borderWidth:1.5,
    borderRadius:6,
    // alignItems:"center",
    justifyContent:"center"
    // width:"100%",
  },
  dropdownIcon:{
    position:"absolute",
    right:responsiveWidth(5),
  },
  dropdownText:{
    fontFamily:"FuturaLT-Book",
    fontSize: responsiveFontSize(2),
    color: '#222222',
    textAlign: "left",
  },
  input:{
    marginLeft: 0,
    paddingRight: responsiveWidth(5),
    paddingLeft: responsiveWidth(5),
    fontFamily:"FuturaLT-Book",
    paddingTop:responsiveHeight(2),
    paddingBottom:responsiveHeight(2),
    fontSize: responsiveFontSize(2),
    borderColor:"#2e80fe",
    borderWidth:1.5,
    borderRadius:6,
    color: '#222222',
    textAlign: "left",
    // width:"100%",
  },
  errorContainer: {
    // margin: 0,
    position: "absolute",
    bottom: -29,
    left:10
  },
  errorText: {
    color: 'red',
    fontFamily:"FuturaLT-Book",
    fontSize: responsiveFontSize(1.6),
  },
  checkoutCartButton:{
    alignSelf:"center",
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: responsiveHeight(1.2),
    width:"90%",
    backgroundColor: "#2e80fe",
    borderRadius: 50,
    marginTop:responsiveHeight(3),
    marginBottom:responsiveHeight(2),
  },
  checkoutCartButtonText:{
    color:"#ffffff",
    fontFamily:"Poppins-SemiBold",
    fontSize:responsiveFontSize(2),
  },
  spacer:{
    height:responsiveWidth(5)
  },

  companyButton: {
    backgroundColor: "#2e80fe",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: responsiveHeight(1.5),
    height: responsiveHeight(8),
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2)
  },
  companyButtonText: {
    fontSize: responsiveFontSize(2.2),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
    marginRight: responsiveWidth(3)
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
    fontFamily: "FuturaLT-Bold",
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
    fontFamily: "FuturaLT-Book",
    color: "#333333",
    textAlign: "center",
    marginLeft:responsiveWidth(2)
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center"
  },



  
  
});
