import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView, TouchableHighlight, Keyboard, ActivityIndicator, TouchableWithoutFeedback, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackActions } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faPhoneAlt, faLock, faUser, faMapMarkerAlt, faBuilding, faChevronDown, faMale, faUserGraduate, faUserCircle, faCalendar, faCalendarAlt, faFemale, faTransgender } from '@fortawesome/free-solid-svg-icons';
import Swiper from 'react-native-swiper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import RBSheet from "react-native-raw-bottom-sheet";

import { useSelector, useDispatch } from 'react-redux';

import Input from '../ui/Input';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
import { set } from 'react-native-reanimated';

import styles from './StyleSheet';

export default SignUpAdditional = props => {

  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  const location = useSelector(state => state.common.location);
  const area = useSelector(state => state.common.area);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const swiper = useRef(null);
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [datePickerIsVisible, setdatePickerIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedGender, setSelectedGender] = useState('Gender');
  const genderSheetRef = useRef(null);

  const [selectedEthnicity, setSelectedEthnicity] = useState('Ethnicity');
  const ethnicitySheetRef = useRef(null);

  const [selectedStudy, setSelectedStudy] = useState('Study Level');
  const studySheetRef = useRef(null);

  const [enteredSchool, setEnteredSchool] = useState('');
  const [enteredPlaceOfStudy, setEnteredPlaceOfStudy] = useState('');
  const postcodeField = useRef();
  const schoolField = useRef();



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

  const showDatePicker = () => {
    setdatePickerIsVisible(true);
  };

  const hideDatePicker = () => {
    setdatePickerIsVisible(false);
  };

  const handleConfirm = (datetime) => {
    hideDatePicker();
    setSelectedDate(moment(datetime).format('L'));
  };

  const selectGender = gender => {
    genderSheetRef.current.close();
    setSelectedGender(gender);
  };

  const selectEthnicity = ethnicity => {
    ethnicitySheetRef.current.close();
    setSelectedEthnicity(ethnicity);
  };

  const selectStudy = study => {
    studySheetRef.current.close();
    setSelectedStudy(study);
  };



  const goToSuccess = () => {
    try {
      props.navigation.replace('Welcome');
    } catch (err) { }
  };

  const signUpClicked = () => {
    updateProfile();
  }

  const updateProfile = async () => {
    let payload = {
      dob: moment(selectedDate).toISOString(),
      ethnicity: selectedEthnicity,
      gender: selectedGender,
      study_level: selectedStudy,
      institute : enteredSchool,
      current_study_place: enteredPlaceOfStudy,
    }
    setIsLoading(true);
    try {
      let authUser = await dispatch(authActions.updateProfile(payload));
      goToSuccess();
    } catch (err) {
      dispatch(commonActions.setSystemMessage(err.message));
    }
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await dispatch(authActions.logout());
    } catch (err) {

    }
  };

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={ Platform.OS === 'ios' ? 0 : -500 }
        style={{ flex: 1 }}
        behavior="padding" >

        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <LinearGradient colors={['#ffffff', '#cee6ff']} style={stylesInline.container} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
            <SafeAreaView style={{ width: '100%', height: '100%' }}>
              <Swiper scrollEnabled={false} index={0} showsPagination={false} showsButtons={false} style={stylesInline.wrapper} activeDotStyle={stylesInline.activeDotStyle} dotStyle={stylesInline.dotStyle} loop={false} ref={swiper} containerStyle={stylesInline.wrapperInner} onIndexChanged={(index) => setSwiperIndex(index)}>

                <View style={{ height: "100%" }}>
                  <KeyboardAwareScrollView extraScrollHeight={-responsiveHeight(30)} showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
                    <View style={{ width: "100%", }}>
                      <View style={stylesInline.middleArea}>

                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center'}}>
                          <Text style={stylesInline.middleAreaHeading}>Complete your profile</Text>
                        </View>

                        <TouchableOpacity onPress={() => showDatePicker()}>
                          <View style={{ ...stylesInline.normalInputContainer, marginTop: responsiveHeight(5), paddingLeft: responsiveWidth(5), justifyContent: "flex-start" }}>
                            <Image style={stylesInline.inputIcon} source={require('../../assets/images/ypa/new-images/grey-calendar.png')} />

                            {selectedDate == null ?
                              <Text style={stylesInline.rbtext}>Date of birth</Text>
                              :
                              <Text style={stylesInline.rbtext}>{selectedDate}</Text>
                            }

                            <View style={stylesInline.rbDownIcon}>
                              <FontAwesomeIcon color={'#222222'} size={18} icon={faChevronDown} />
                            </View>
                          </View>
                        </TouchableOpacity>

                        {/* DATE PICKER */}
                        <DateTimePickerModal
                          isVisible={datePickerIsVisible} headerTextIOS="Select Date"
                          mode="date"
                          date={selectedDate ? new Date(selectedDate) : new Date()}
                          onConfirm={handleConfirm}
                          onCancel={hideDatePicker}
                        />

                        <TouchableOpacity onPress={() => ethnicitySheetRef.current.open()}>
                          <View style={{ ...stylesInline.normalInputContainer, marginTop: responsiveHeight(3), paddingLeft: responsiveWidth(5), justifyContent: "flex-start" }}>
                            <Image style={stylesInline.inputIcon} source={require('../../assets/images/ypa/new-images/grey-user.png')} />

                            <Text style={stylesInline.rbtext}>{selectedEthnicity}</Text>
                            <View style={stylesInline.rbDownIcon}>
                              <FontAwesomeIcon color={'#222222'} size={18} icon={faChevronDown} />
                            </View>
                          </View>
                        </TouchableOpacity>



                        {/* ethnicitySheetRef */}
                        <RBSheet
                            ref={ethnicitySheetRef}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            dragFromTopOnly={true}
                            height={responsiveHeight(45)}
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
                                <Text style={styles.sheetTitle}>Select Ethnicity</Text>
                                <TouchableOpacity onPress={() => ethnicitySheetRef.current.close()}>
                                  <Image style={styles.rbsheetClose} source={require('../../assets/images/ypa/new-images/close-blue.png')} />
                                </TouchableOpacity>
                              </View>
                              
                              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:responsiveWidth(4),paddingVertical:responsiveWidth(5)}}>
                                
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Asian or Asian British: Bangladeshi/Asian British')}>
                                  <Text style={styles.singleSheetText}>Asian or Asian British: Bangladeshi/Asian British</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Asian or Asian British: Indian/Asian British')}>
                                  <Text style={styles.singleSheetText}>Asian or Asian British: Indian/Asian British</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Asian or Asian British: Other Asian Background')}>
                                  <Text style={styles.singleSheetText}>Asian or Asian British: Other Asian Background</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Asian or Asian British: Pakistan/Asian British')}>
                                  <Text style={styles.singleSheetText}>Asian or Asian British: Pakistan/Asian British</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Black or Black British: African/Black British')}>
                                  <Text style={styles.singleSheetText}>Black or Black British: African/Black British</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Black or Black British: Caribbean/Black British')}>
                                  <Text style={styles.singleSheetText}>Black or Black British: Caribbean/Black British</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Black or Black British: Other Black Background')}>
                                  <Text style={styles.singleSheetText}>Black or Black British: Other Black Background</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Chinese or other ethnic group: Chinese')}>
                                  <Text style={styles.singleSheetText}>Chinese or other ethnic group: Chinese</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('MENA (Middle Eastern and North African)')}>
                                  <Text style={styles.singleSheetText}>MENA (Middle Eastern and North African)</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Mixed: Other Mixed Background')}>
                                  <Text style={styles.singleSheetText}>Mixed: Other Mixed Background</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Mixed: White & African Black Mixed')}>
                                  <Text style={styles.singleSheetText}>Mixed: White & African Black Mixed</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Mixed: White & Caribbean Black Mixed')}>
                                  <Text style={styles.singleSheetText}>Mixed: White & Caribbean Black Mixed</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Mixed: White Asian Mixed')}>
                                  <Text style={styles.singleSheetText}>Mixed: White Asian Mixed</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('White: British')}>
                                  <Text style={styles.singleSheetText}>White: British</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('White: Irish')}>
                                  <Text style={styles.singleSheetText}>White: Irish</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Mixed: Other Mixed Background')}>
                                  <Text style={styles.singleSheetText}>Mixed: Other Mixed Background</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('White: Other White Background')}>
                                  <Text style={styles.singleSheetText}>White: Other White Background</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Other Ethnic Background')}>
                                  <Text style={styles.singleSheetText}>Other Ethnic Background</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Prefer not to say')}>
                                  <Text style={styles.singleSheetText}>Prefer not to say</Text>
                                </TouchableOpacity>
                                <View style={{ height: responsiveHeight(5) }}></View>

                              </ScrollView>


                            </View>
                        </RBSheet>


                        

                        







                        <TouchableOpacity onPress={() => genderSheetRef.current.open()}>
                          <View style={{ ...stylesInline.normalInputContainer, marginTop: responsiveHeight(3), paddingLeft: responsiveWidth(5), justifyContent: "flex-start" }}>
                            {selectedGender == 'Male' ?
                              <FontAwesomeIcon color={'#c5c3c3'} size={18} icon={faMale} />
                            :
                            selectedGender == 'Female' ?
                              <FontAwesomeIcon color={'#c5c3c3'} size={18} icon={faFemale} />
                            :
                            selectedGender == 'Other' ?
                              <FontAwesomeIcon color={'#c5c3c3'} size={18} icon={faTransgender} />
                            :
                              <FontAwesomeIcon color={'#c5c3c3'} size={18} icon={faMale} />
                            }
                            <Text style={stylesInline.rbtext}>{selectedGender ? selectedGender : 'Gender'}</Text>
                            <View style={stylesInline.rbDownIcon}>
                              <FontAwesomeIcon color={'#222222'} size={18} icon={faChevronDown} />
                            </View>
                          </View>
                        </TouchableOpacity>



                        {/* genderSheetRef */}
                        <RBSheet
                            ref={genderSheetRef}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            dragFromTopOnly={true}
                            height={responsiveHeight(35)}
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
                                <Text style={styles.sheetTitle}>Select Gender</Text>
                                <TouchableOpacity onPress={() => genderSheetRef.current.close()}>
                                  <Image style={styles.rbsheetClose} source={require('../../assets/images/ypa/new-images/close-blue.png')} />
                                </TouchableOpacity>
                              </View>
                              
                              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:responsiveWidth(4),paddingVertical:responsiveWidth(5)}}>
                                <TouchableOpacity style={stylesInline.singleSheetOption} onPress={() => selectGender('Male')}>
                                  <Text style={stylesInline.singleSheetText}>Male</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={stylesInline.singleSheetOption} onPress={() => selectGender('Female')}>
                                  <Text style={stylesInline.singleSheetText}>Female</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={stylesInline.singleSheetOption} onPress={() => selectGender('Prefer not to say')}>
                                  <Text style={stylesInline.singleSheetText}>Prefer not to say</Text>
                                </TouchableOpacity>
                                <View style={{ height: responsiveHeight(5) }}></View>
                              </ScrollView>


                            </View>
                        </RBSheet>


                        <TouchableOpacity onPress={() => studySheetRef.current.open()}>
                          <View style={{ ...stylesInline.normalInputContainer, marginTop: responsiveHeight(3), paddingLeft: responsiveWidth(5), justifyContent: "flex-start" }}>
                            <FontAwesomeIcon color={'#c5c3c3'} size={18} icon={faUserGraduate} />
                            <Text style={stylesInline.rbtext}>{selectedStudy}</Text>
                            <View style={stylesInline.rbDownIcon}>
                              <FontAwesomeIcon color={'#222222'} size={18} icon={faChevronDown} />
                            </View>
                          </View>
                        </TouchableOpacity>


                        {/* studySheetRef */}
                        <RBSheet
                          ref={studySheetRef}
                          closeOnDragDown={true}
                          closeOnPressMask={true}
                          dragFromTopOnly={true}
                          height={responsiveHeight(35)}
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
                              <Text style={styles.sheetTitle}>Select Study Level</Text>
                              <TouchableOpacity onPress={() => studySheetRef.current.close()}>
                                <Image style={styles.rbsheetClose} source={require('../../assets/images/ypa/new-images/close-blue.png')} />
                              </TouchableOpacity>
                            </View>
                            
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:responsiveWidth(4),paddingVertical:responsiveWidth(5)}}>
                              <TouchableOpacity style={stylesInline.singleSheetOption} onPress={() => selectStudy('Y10 / S3')}>
                                <Text style={stylesInline.singleSheetText}>Y10 / S3</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={stylesInline.singleSheetOption} onPress={() => selectStudy('Y11 / S4')}>
                                <Text style={stylesInline.singleSheetText}>Y11 / S4</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={stylesInline.singleSheetOption} onPress={() => selectStudy('Y12 / S5')}>
                                <Text style={stylesInline.singleSheetText}>Y12 / S5</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={stylesInline.singleSheetOption} onPress={() => selectStudy('Y13 / S6')}>
                                <Text style={stylesInline.singleSheetText}>Y13 / S6</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={stylesInline.singleSheetOption} onPress={() => selectStudy('Y14')}>
                                <Text style={stylesInline.singleSheetText}>Y14</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={stylesInline.singleSheetOption} onPress={() => selectStudy('University')}>
                                <Text style={stylesInline.singleSheetText}>University</Text>
                              </TouchableOpacity>
                              <View style={{ height: responsiveHeight(5) }}></View>
                            </ScrollView>


                          </View>
                        </RBSheet>
                        

                        <View style={{ ...stylesInline.normalInputContainer, marginTop: responsiveHeight(3), paddingLeft: responsiveWidth(5), }}>
                          <FontAwesomeIcon color={'#c5c3c3'} size={18} icon={faBuilding} />
                          <TextInput
                            ref={schoolField}
                            style={{ ...stylesInline.input, paddingLeft:responsiveWidth(1.5)}}
                            placeholderTextColor="#222222"
                            placeholder="School / College Institution"
                            multiline={false}
                            onSubmitEditing={() => postcodeField.current.focus()}
                            returnKeyType={'next'}
                            onChangeText={text => setEnteredSchool(text)}
                          />
                        </View>

                        <View style={{ ...stylesInline.normalInputContainer, marginTop: responsiveHeight(3), paddingLeft: responsiveWidth(5), }}>
                          <FontAwesomeIcon color={'#c5c3c3'} size={18} icon={faMapMarkerAlt} />
                          <TextInput
                            ref={postcodeField}
                            style={{ ...stylesInline.input, paddingLeft:responsiveWidth(1.5) }}
                            placeholderTextColor="#222222"
                            placeholder="Postcode"
                            multiline={false}
                            onSubmitEditing={() => { selectedDate && selectedEthnicity != 'Ethnicity' && selectedGender != 'Gender' && selectedStudy != 'Study Level' && !isLoading ? signUpClicked() : null; Keyboard.dismiss(); }}
                            returnKeyType={'go'}
                            onChangeText={text => setEnteredPlaceOfStudy(text)}
                          />
                        </View>











                      </View>
                    </View>
                  </KeyboardAwareScrollView>
                </View>
              </Swiper>

              <View style={stylesInline.bottomButtonArea}>
                <TouchableOpacity onPress={() => {signUpClicked();Keyboard.dismiss();}} 
                  style={{ ...stylesInline.whiteFullButtonTouchable, 
                  opacity: (selectedDate && selectedEthnicity != 'Ethnicity' && selectedGender != 'Gender' && selectedStudy != 'Study Level' && !isLoading) ? 1 : 0.5 
                          }} 
                  disabled={!(selectedDate && selectedEthnicity != 'Ethnicity' && selectedGender != 'Gender' && selectedStudy != 'Study Level' && !isLoading)}
                >
                  
                  <LinearGradient colors={['#3895fc', '#005ba6']} style={stylesInline.walkthroughButtonSolid} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                    {!isLoading ?
                      <Text style={stylesInline.walkthroughLinkRight}>Submit</Text>
                      :
                      <ActivityIndicator size="small" color={'#ffffff'} />
                    }
                  </LinearGradient>




                </TouchableOpacity>




                <View style={{ display: "flex", justifyContent: "center", flexDirection: "row", paddingHorizontal: 10, alignItems: "center", marginTop: 10 }}>
                  <TouchableOpacity onPress={() => logout()}>
                    <Text style={stylesInline.normalText}>{authUser && authUser.name && 'Not '+authUser.name.split(' ')[0]+' ? '} <Text style={stylesInline.boldText}>Logout</Text></Text>
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

const stylesInline = StyleSheet.create({


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
    backgroundColor: '#ffffff',
    width: 10,
    height: 10,
    borderRadius: 50,
    borderColor: '#ffffff',
    borderWidth: 1,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 0,
    marginBottom: responsiveHeight(0),
  },
  dotStyle: {
    backgroundColor: '#ffffff',
    width: 10,
    height: 10,
    borderRadius: 50,
    opacity: 0.4,
    borderColor: '#ffffff',
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
    color: '#222222',
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
    zIndex: 1,
    // backgroundColor:'red'
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
    zIndex: 1,
    // backgroundColor:'red'
  },
  passwordPlaceholder: {
    fontSize: responsiveFontSize(2.1),
    fontFamily: "Poppins-Light",
    color: '#ffffff',
    position: "absolute",
    left: responsiveWidth(15),
    zIndex: 0,
    top: Platform.OS === 'ios' ? responsiveHeight(2.5) : responsiveHeight(3),
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
    right: responsiveWidth(5),
    top: responsiveHeight(2.0),
    // backgroundColor:"red",
    zIndex: 5,
    paddingVertical: 10,
    paddingLeft: 15,
    paddingRight: 0
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
