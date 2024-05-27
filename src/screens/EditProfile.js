import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import {  StyleSheet, Text, View, ImageBackground, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight,  Picker, Keyboard, ActivityIndicator, I18nManager, Animated } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenWidth} from "react-native-responsive-dimensions";
import { useIsFocused } from '@react-navigation/core';
import Input from '../ui/Input';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CheckBox from '@react-native-community/checkbox';
import RadioButton from 'radio-button-react-native';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

import { useSelector, useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';
import * as commonActions from '../store/actions/common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faChevronDown, faTimesCircle, faCamera, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import RBSheet from "react-native-raw-bottom-sheet";



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

const keySkills = [
  {
    "id": "0",
    "name": "Teamwork",
    "checked": false
  },
  {
    "id": "1",
    "name": "Commercial Awareness",
    "checked": false
  },
  {
    "id": "2",
    "name": "Analysing and Investigating",
    "checked": false
  },
  {
    "id": "3",
    "name": "Initiative ",
    "checked": false
  },
  {
    "id": "4",
    "name": "Drive and Passion ",
    "checked": false
  },
  {
    "id": "5",
    "name": "Time Management",
    "checked": false
  },
  {
    "id": "6",
    "name": "Negotiating ",
    "checked": false
  },
  {
    "id": "7",
    "name": "Leadership",
    "checked": false
  },
  {
    "id": "8",
    "name": "Maths",
    "checked": false
  },
  {
    "id": "9",
    "name": "Computing Skills",
    "checked": false
  },
  {
    "id": "10",
    "name": "Self Awareness",
    "checked": false
  },
  {
    "id": "11",
    "name": "Confidence",
    "checked": false
  },
  {
    "id": "12",
    "name": "Integrity",
    "checked": false
  },
  {
    "id": "13",
    "name": "Independence",
    "checked": false
  },
  {
    "id": "14",
    "name": "Developing Professionalism",
    "checked": false
  },
  {
    "id": "15",
    "name": "Action Planning",
    "checked": false
  },
  {
    "id": "16",
    "name": "Decision Making",
    "checked": false
  },
  {
    "id": "17",
    "name": "Creativity",
    "checked": false
  },
  {
    "id": "18",
    "name": "Business Skills",
    "checked": false
  },
  {
    "id": "19",
    "name": "Developing self and Others",
    "checked": false
  },
  {
    "id": "20",
    "name": "Innovation and Change",
    "checked": false
  },
  {
    "id": "21",
    "name": "Communication",
    "checked": false
  },
  {
    "id": "22",
    "name": "Collaborating",
    "checked": false
  },
  {
    "id": "23",
    "name": "Results Orientated",
    "checked": false
  }
  
]

export default EditProfile = props => {

  const dispatch = useDispatch(); 
  const isFocused = useIsFocused();
  const authUser = useSelector(state => state.auth.user);  
  const [profileImage, setProfileImage] = useState({profile_picture: authUser && authUser.profile_picture ? authUser.profile_picture : null, thumb_profile_picture: authUser && authUser.thumb_profile_picture ? authUser.thumb_profile_picture : null});
  const [isProfileImageUploading, setProfileImageUploading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(authUser.profile.dob ? moment(authUser.profile.dob).format('DD-MM-YYYY') : null);
  const [selectedEthnicity, setSelectedEthnicity] = useState(authUser.profile && authUser.profile.ethnicity ? authUser.profile.ethnicity : 'Asian or Asian British: Bangladeshi/Asian British ');
  const [selectedGender, setSelectedGender] = useState(authUser.gender ? authUser.gender : 'Male');
  const [selectedStudyLevel, setSelectedStudyLevel] = useState(authUser.profile && authUser.profile.study_level ? authUser.profile.study_level : 'Y10 / S3'); 
  const [selectedSectorOfInterest, setSelectedSectorOfInterest] = useState(authUser.profile && authUser.profile.interested_job_sectors ? authUser.profile.interested_job_sectors : []);
  const [selectedSkills, setSelectedSkills] = useState(authUser.profile && authUser.profile.skills ? authUser.profile.skills : []); 
  const [selectedSubjects, setSelectedSubjects] = useState(authUser.profile && authUser.profile.subjects ? authUser.profile.subjects : []); 
  const [interestedJobSectors, setInterestedJobSectors] = useState([]); 
  
  const [isVisible, setIsVisible] = useState(false);
  const imageSheetRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const [deleteSubjectPopup, setDeleteSubjectPopup] = useState(-1);

  const ethnicitySheetRef = useRef(null);
  const studyLevelSheetRef = useRef(null);
  const genderSheetRef = useRef(null);
  const sectorOfInterestSheetRef = useRef(null);
  const skillsSheetRef = useRef(null);
  
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: authUser ? authUser.name : '',
      institute: authUser && authUser.profile.institute ? authUser.profile.institute : '',
      study_place: authUser && authUser.profile.current_study_place ? authUser.profile.current_study_place : '',
      bio: authUser && authUser.profile.bio ? authUser.profile.bio : '',
    },
    inputValidities: {
      name: authUser ? true : false,
      institute: true,
      study_place: true,
      bio: true,
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

  useEffect(() => {
    fetchData(true);
  }, [dispatch]);

  useEffect(()=> {
    if(isFocused && props.route.params && props.route.params.newSubject) {
      setSelectedSubjects(subjects => {
        subjects.push(props.route.params.newSubject);
        return [...subjects];
      })
    } 
  }, [isFocused]);

  const fetchData = async refresh => {
    await getInterestedJobSectors();
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

  const openDeletePopup = (index) => {
    setDeleteSubjectPopup(index);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver:true
    }).start();
    
  }

  const showDatePicker = () => {
    setIsVisible(true);
  };

  const hideDatePicker = () => {
    setIsVisible(false);
  };
 
  const handleConfirm = (datetime) => {
    hideDatePicker();
    setSelectedDate(moment(datetime).format('DD-MM-YYYY'));
    
  };

  const updateProfile = async () => {
    setIsLoading(true);
    let payload = {
      name: formState.inputValues.name,
      dob: moment(selectedDate, 'DD-MM-YYYY').toDate(),
      ethnicity: selectedEthnicity,
      gender: selectedGender,
      study_level: selectedStudyLevel,
      profile_institute: formState.inputValues.institute,
      current_study_place: formState.inputValues.study_place,
      interested_job_sectors: selectedSectorOfInterest.toString(),
      skills: selectedSkills.toString(),
      subjects: JSON.stringify(selectedSubjects),
      profile_bio: formState.inputValues.bio,
    };
    // console.log(payload); return ;
    try {
      await dispatch(authActions.updateProfile(payload));
      props.navigation.goBack();
    } catch (err) {
      console.log(err);      
      dispatch(commonActions.setSystemMessage(err.message));
    }
    setIsLoading(false);
  };

  const showImagePicker = () => {
    imageSheetRef.current.open();
  }

  const chooseImage = (sourcIndex) => {
    imageSheetRef.current.close();
    let options = {
      mediaType: 'photo',
      width: 800,
      height: 800,
      forceJpg: true,
      cropping: true
    };

    setTimeout(() => {
      switch(sourcIndex) {
        case 0:
          ImagePicker.openCamera(options).then(image => {
            uploadImage(image);
            setImage(image);
          }, err => {
            console.log(err.toString());
          }); 
          break;
        case 1:
          ImagePicker.openPicker(options).then(image => {
            uploadImage(image);
            setImage(image);
          }, err => {
            console.log(err.toString());
          }); 
          break;
        case 2:
        default:
          break;
      }
    }, 300);
    
    
  }

  const setImage = (image) => {
    setProfileImage({profile_picture: image.path, thumb_profile_picture: image.path}); 
  };

  const uploadImage = async (image) => {

    setProfileImageUploading(true);
    const data = new FormData();
    data.append('image', {
      uri: image.path,
      type: image.mime,
      name: image.modificationDate+'.jpeg'
    });
     try {
      await dispatch(authActions.uploadProfilePicture(data));
    } catch (err) {
      setProfileImage({profile_picture: authUser.profile_picture ? authUser.profile_picture : null, thumb_profile_picture: authUser.thumb_profile_picture ? authUser.thumb_profile_picture : null});
      dispatch(commonActions.setSystemMessage(err.message));
    }
    setProfileImageUploading(false);

  };

  const goBack = () => {
    props.navigation.goBack(null);
  };
  const demo = () => {
    console.log('demo function clicked');
  };

  const goToSubjectAdd = () => {
    props.navigation.navigate('SubjectAdd');
  };
  

  const selectEthnicity = ethnicity => {
    ethnicitySheetRef.current.close();
    setSelectedEthnicity(ethnicity);
  };

  const selectStudyLevel = studyLevel => {
    studyLevelSheetRef.current.close();
    setSelectedStudyLevel(studyLevel);
  };

  const selectGender = gender => {
    genderSheetRef.current.close();
    setSelectedGender(gender);
  };

  return (
    <View style={styles.parentWrapper}>

      <TouchableOpacity onPress={() => goBack()}>
        <View style={styles.backHeaderStyleInner}>

          {/* <FontAwesomeIcon color={'#ffffff'} size={20} icon={faChevronLeft} /> */}
          <Image style={[styles.headerBackIcon,]} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />

          {/* <Text style={styles.pageHeading}>{children}</Text> */}
          <Text style={styles.pageHeading}>Back</Text>
        </View>
      </TouchableOpacity>



      {deleteSubjectPopup != -1 ?
        <View style={styles.applyPopup}>
          <View style={styles.mainAreaPopup}>
            <View style={styles.mainTitleWrapper}>
              <Text style={styles.mainTitlePopup}>Are you sure ?</Text> 
              <Text style={styles.mainTitlePopupLight}>You want to remove this subject</Text>
            </View>
            <View style={styles.popupBtnWraper}>
                <TouchableOpacity  onPress={() => setDeleteSubjectPopup(-1)}>
                  <LinearGradient colors={['#ddd', '#ddd']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.applyFilterButtonCancel}>
                    <Text style={styles.applyFilterButtonCancelText}>Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {setSelectedSubjects(subjects => {subjects.splice(deleteSubjectPopup, 1);return [...subjects];});setDeleteSubjectPopup(-1);}}>
                  <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.applyFilterButton, width:responsiveWidth(26),}}>
                    <Text style={styles.applyFilterButtonText}>Remove</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              
          </View>
        </View>
        :
        <></>
      }





      <ScrollView style={{ flex: 1,backgroundColor:"#ffffff",}} showsVerticalScrollIndicator={false}>

        <View style={{paddingBottom:responsiveHeight(10), paddingTop:responsiveHeight(1),}}>

          <View style={{marginTop: responsiveHeight(0),}}>


            <View style={{position:"relative",alignItems:"center",justifyContent:"center",alignSelf:"center",marginVertical:responsiveHeight(3)}}>
              <TouchableOpacity onPress={() => !isProfileImageUploading ? showImagePicker() : null }>
                <Image style={{...styles.profileImage, opacity: isProfileImageUploading ? 0.5 : 1}} source={{uri: profileImage.thumb_profile_picture}} />
                <LinearGradient colors={['transparent', '#000000']} style={styles.profileImageShadow} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}></LinearGradient>
                { !isProfileImageUploading && <FontAwesomeIcon color={'#ffffff'} size={18} icon={ faCamera } style={{position:"absolute",zIndex:2,right:responsiveWidth(11.2),bottom:responsiveHeight(5)}} /> }
              </TouchableOpacity>
            </View>

            <RBSheet
              ref={imageSheetRef}
              closeOnDragDown={true}
              closeOnPressMask={true}
              dragFromTopOnly={true}
              height={responsiveHeight(30)}
              animationType={'none'}
              customStyles={{
                container:{
                  opacity:1,
                  position:"absolute",
                  zIndex:2,
                  bottom:0,
                  backgroundColor:"#ffffff",
                  borderTopLeftRadius:20,
                  borderTopRightRadius:20,
                  //borderTopWidth:1,
                  // borderColor:"red"
                },
                draggableIcon: {
                  backgroundColor: "#999999"
                }
              }}
            >
              <View style={{padding:responsiveHeight(2)}}>
                <View style={styles.sheetTitleContainer}>
                  <Text style={styles.sheetTitle}>{'Select Image Source'}</Text>
                </View>
                <ScrollView style={styles.sheetScroll}>
                  <TouchableOpacity style={styles.singleSheetOption} onPress={() => chooseImage(0)}>
                    <Text style={styles.singleSheetText}>{'Camera'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.singleSheetOption} onPress={() => chooseImage(1)}>
                    <Text style={styles.singleSheetText}>{'Gallery'}</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </RBSheet>
            

            <View style={{...styles.normalInputContainer}}>
              <Text style={styles.normalInputText}>Full Name</Text>
              <Input 
                id="name"
                selectionColor={'#333'}
                style={styles.input} 
                errorContainerStyle={styles.errorContainer}
                errorTextStyle={styles.errorText}
                placeholderTextColor="#999999" 
                placeholder="" 
                multiline={true} 
                required
                minLength={3}
                errorText={'Enter your full name'}
                onInputChange={inputChangeHandler}
                validateOnChange={true}
                initialValue={formState.inputValues.name}
                initiallyValid={formState.inputValidities.name}
              />
            </View>

            <View style={{...styles.normalInputContainer}}>
              <Text style={styles.normalInputText}>Date of birth</Text>
              <TouchableOpacity onPress={() => showDatePicker()}>
                <View style={{...styles.input, paddingTop:responsiveHeight(0.5)}}>
                  { selectedDate == null ?
                    <Text style={styles.viewInput}>Set your date of birth</Text>
                  :
                    <Text style={styles.viewInput}>{selectedDate}</Text>
                  }
                  <FontAwesomeIcon color={'#000000'} size={18} icon={faCalendarAlt} />
                </View>
              </TouchableOpacity>
            </View>

            <DateTimePickerModal
              isVisible={isVisible} headerTextIOS={'Select Date'}
              mode="date"
              date={selectedDate ? moment(selectedDate, 'DD-MM-YYYY').toDate() : new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />

 
            <View style={{...styles.normalInputContainer}}>
              <Text style={styles.normalInputText}>Ethnicity</Text>
              <TouchableOpacity onPress={() => ethnicitySheetRef.current.open()}>
                <View style={{...styles.input, paddingTop:responsiveHeight(0.5)}}>
                  <Text style={styles.viewInput} numberOfLines={1}>{selectedEthnicity}</Text>
                  <Image style={{...styles.inputIcon,transform: [{ rotate: '-90deg'}]}} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />
                </View>
              </TouchableOpacity>
            </View>

            <RBSheet
              ref={ethnicitySheetRef}
              closeOnDragDown={true}
              closeOnPressMask={true}
              dragFromTopOnly={true}
              height={responsiveHeight(50)}
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

                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Asian or Asian British: Bangladeshi/Asian British')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Asian or Asian British: Bangladeshi/Asian British'} onPress={() => selectEthnicity('Asian or Asian British: Bangladeshi/Asian British')} />
                  </View>
                  <Text style={styles.singleSheetText}>Asian or Asian British: Bangladeshi/Asian British</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Asian or Asian British: Indian/Asian British')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Asian or Asian British: Indian/Asian British'} onPress={() => selectEthnicity('Asian or Asian British: Indian/Asian British')} />
                  </View>
                  <Text style={styles.singleSheetText}>Asian or Asian British: Indian/Asian British</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Asian or Asian British: Other Asian Background')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Asian or Asian British: Other Asian Background'} onPress={() => selectEthnicity('Asian or Asian British: Other Asian Background')} />
                  </View>
                  <Text style={styles.singleSheetText}>Asian or Asian British: Other Asian Background</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Asian or Asian British: Pakistan/Asian British')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Asian or Asian British: Pakistan/Asian British'} onPress={() => selectEthnicity('Asian or Asian British: Pakistan/Asian British')} />
                  </View>
                  <Text style={styles.singleSheetText}>Asian or Asian British: Pakistan/Asian British</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Black or Black British: African/Black British')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Black or Black British: African/Black British'} onPress={() => selectEthnicity('Black or Black British: African/Black British')} />
                  </View>
                  <Text style={styles.singleSheetText}>Black or Black British: African/Black British</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Black or Black British: Caribbean/Black British')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Black or Black British: Caribbean/Black British'} onPress={() => selectEthnicity('Black or Black British: Caribbean/Black British')} />
                  </View>
                  <Text style={styles.singleSheetText}>Black or Black British: Caribbean/Black British</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Black or Black British: Other Black Background')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Black or Black British: Other Black Background'} onPress={() => selectEthnicity('Black or Black British: Other Black Background')} />
                  </View>
                  <Text style={styles.singleSheetText}>Black or Black British: Other Black Background</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Chinese or other ethnic group: Chinese')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Chinese or other ethnic group: Chinese'} onPress={() => selectEthnicity('Chinese or other ethnic group: Chinese')} />
                  </View>
                  <Text style={styles.singleSheetText}>Chinese or other ethnic group: Chinese</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('MENA (Middle Eastern and North African)')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'MENA (Middle Eastern and North African)'} onPress={() => selectEthnicity('MENA (Middle Eastern and North African)')} />
                  </View>
                  <Text style={styles.singleSheetText}>MENA (Middle Eastern and North African)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Mixed: Other Mixed Background')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Mixed: Other Mixed Background'} onPress={() => selectEthnicity('Mixed: Other Mixed Background')} />
                  </View>
                  <Text style={styles.singleSheetText}>Mixed: Other Mixed Background</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Mixed: White & African Black Mixed')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Mixed: White & African Black Mixed'} onPress={() => selectEthnicity('Mixed: White & African Black Mixed')} />
                  </View>
                  <Text style={styles.singleSheetText}>Mixed: White & African Black Mixed</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Mixed: White & Caribbean Black Mixed')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Mixed: White & Caribbean Black Mixed'} onPress={() => selectEthnicity('Mixed: White & Caribbean Black Mixed')} />
                  </View>
                  <Text style={styles.singleSheetText}>Mixed: White & Caribbean Black Mixed</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Mixed: White Asian Mixed')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Mixed: White Asian Mixed'} onPress={() => selectEthnicity('Mixed: White Asian Mixed')} />
                  </View>
                  <Text style={styles.singleSheetText}>Mixed: White Asian Mixed</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('White: British')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'White: British'} onPress={() => selectEthnicity('White: British')} />
                  </View>
                  <Text style={styles.singleSheetText}>White: British</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('White: Irish')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'White: Irish'} onPress={() => selectEthnicity('White: Irish')} />
                  </View>
                  <Text style={styles.singleSheetText}>White: Irish</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Mixed: Other Mixed Background')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Mixed: Other Mixed Background'} onPress={() => selectEthnicity('Mixed: Other Mixed Background')} />
                  </View>
                  <Text style={styles.singleSheetText}>Mixed: Other Mixed Background</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('White: Other White Background')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'White: Other White Background'} onPress={() => selectEthnicity('White: Other White Background')} />
                  </View>
                  <Text style={styles.singleSheetText}>White: Other White Background</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Other Ethnic Background')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Other Ethnic Background'} onPress={() => selectEthnicity('Other Ethnic Background')} />
                  </View>
                  <Text style={styles.singleSheetText}>Other Ethnic Background </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectEthnicity('Prefer not to say')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedEthnicity} value={'Prefer not to say'} onPress={() => selectEthnicity('Prefer not to say')} />
                  </View>
                  <Text style={styles.singleSheetText}>Prefer not to say</Text>
                </TouchableOpacity>

                <View style={{ height: responsiveHeight(15) }}></View>

              </ScrollView>
            </View>
            </RBSheet>



            {/* Gender */}
            <View style={{...styles.normalInputContainer}}>
              <Text style={styles.normalInputText}>Gender</Text>
              <TouchableOpacity onPress={() => genderSheetRef.current.open()}>
                <View style={{...styles.input, paddingTop:responsiveHeight(0.5)}}>
                  <Text style={styles.viewInput}>{selectedGender}</Text>
                  <Image style={{...styles.inputIcon,transform: [{ rotate: '-90deg'}]}} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />
                </View>
              </TouchableOpacity>
            </View>

            <RBSheet
              ref={genderSheetRef}
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

                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectGender('Prefer not to say')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedGender} value={'Prefer not to say'} onPress={() => selectGender('Prefer not to say')} />
                  </View>
                  <Text style={styles.singleSheetText}>Prefer not to say</Text>
                </TouchableOpacity>


                <View style={{ height: responsiveHeight(8) }}></View>

              </ScrollView>
            </View>
            </RBSheet>



            {/* Level Of Study */}
            <View style={{...styles.normalInputContainer}}>
              <Text style={styles.normalInputText}>Level of Study</Text>
              <TouchableOpacity onPress={() => studyLevelSheetRef.current.open()}>
                <View style={{...styles.input, paddingTop:responsiveHeight(0.5)}}>
                  <Text style={styles.viewInput}>{selectedStudyLevel}</Text>
                  <Image style={{...styles.inputIcon,transform: [{ rotate: '-90deg'}]}} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />
                </View>
              </TouchableOpacity>
            </View>

            <RBSheet
              ref={studyLevelSheetRef}
              closeOnDragDown={true}
              closeOnPressMask={true}
              dragFromTopOnly={true}
              height={responsiveHeight(50)}
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
                <Text style={styles.sheetTitle}>Select Study Level</Text>
              </View>
              <ScrollView style={styles.sheetScroll}>

                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectStudyLevel('Y10 / S3')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedStudyLevel} value={'Y10 / S3'} onPress={() => selectStudyLevel('Y10 / S3')} />
                  </View>
                  <Text style={styles.singleSheetText}>Y10 / S3</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectStudyLevel('Y11 / S4')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedStudyLevel} value={'Y11 / S4'} onPress={() => selectStudyLevel('Y11 / S4')} />
                  </View>
                  <Text style={styles.singleSheetText}>Y11 / S4</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectStudyLevel('Y12 / S5')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedStudyLevel} value={'Y12 / S5'} onPress={() => selectStudyLevel('Y12 / S5')} />
                  </View>
                  <Text style={styles.singleSheetText}>Y12 / S5</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectStudyLevel('Y13/S6')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedStudyLevel} value={'Y13/S6'} onPress={() => selectStudyLevel('Y13/S6')} />
                  </View>
                  <Text style={styles.singleSheetText}>Y13/S6</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectStudyLevel('Y14')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedStudyLevel} value={'Y14'} onPress={() => selectStudyLevel('Y14')} />
                  </View>
                  <Text style={styles.singleSheetText}>Y14</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.singleSheetOption} onPress={() => selectStudyLevel('University')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#222"} outerCircleSize={22} outerCircleWidth={2} innerCircleColor={'#222'} innerCircleSize={11} currentValue={selectedStudyLevel} value={'University'} onPress={() => selectStudyLevel('University')} />
                  </View>
                  <Text style={styles.singleSheetText}>University</Text>
                </TouchableOpacity>

                <View style={{ height: responsiveHeight(15) }}></View>

              </ScrollView>
            </View>
            </RBSheet>



            <View style={{...styles.normalInputContainer}}>
              <Text style={styles.normalInputText}>School / College</Text>
              <Input 
                id="institute"
                selectionColor={'#333'}
                style={styles.input} 
                errorContainerStyle={styles.errorContainer}
                errorTextStyle={styles.errorText}
                placeholderTextColor="#999999" 
                placeholder="" 
                multiline={true} 
                errorText={'Enter your school / college'}
                onInputChange={inputChangeHandler}
                validateOnChange={true}
                initialValue={formState.inputValues.institute}
                initiallyValid={formState.inputValidities.institute}
              />
            </View>

            <View style={{...styles.normalInputContainer}}>
              <Text style={styles.normalInputText}>Postcode</Text>
              <Input 
                id="study_place"
                selectionColor={'#333'}
                style={styles.input} 
                errorContainerStyle={styles.errorContainer}
                errorTextStyle={styles.errorText}
                placeholderTextColor="#999999" 
                placeholder="" 
                multiline={true} 
                errorText={'Enter your postcode'}
                onInputChange={inputChangeHandler}
                validateOnChange={true}
                initialValue={formState.inputValues.study_place}
                initiallyValid={formState.inputValidities.study_place}
              />
            </View>




            {/* Sector Of Interest */}
            <View style={{...styles.normalInputContainer}}>
              <Text style={styles.normalInputText}>Sector of Interest</Text>
              <TouchableOpacity onPress={() => sectorOfInterestSheetRef.current.open()}>
                <View style={{...styles.input, paddingTop:responsiveHeight(0.5)}}>
                  {selectedSectorOfInterest.length > 0 ?
                    <Text numberOfLines={2} ellipsizeMode='tail' style={styles.viewInput}>{selectedSectorOfInterest.map(sid => interestedJobSectors.find(sector => sector._id == sid)?.name).join(', ')}</Text>
                  :
                    <Text style={styles.viewInput}>Select your sector of interest</Text>
                  }
                  <Image style={{...styles.inputIcon,transform: [{ rotate: '-90deg'}]}} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />
                </View>
              </TouchableOpacity>
            </View>

            <RBSheet
              ref={sectorOfInterestSheetRef}
              closeOnDragDown={true}
              closeOnPressMask={true}
              dragFromTopOnly={true}
              height={responsiveHeight(75)}
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
                <Text style={styles.sheetTitle}>Sector of Interest</Text>
              </View>
              <ScrollView style={styles.sheetScroll}>
              
                
                { interestedJobSectors.map((sector, index) => {
                  return (
                    <View key={index} style={styles.singleSheetOption}>
                      <View style={styles.radioButtonPosition}>
                      <CheckBox
                        disabled={false}
                        value={selectedSectorOfInterest.indexOf(sector._id) !== -1}
                        onValueChange={(newValue) => setSelectedSectorOfInterest(sectors => {
                          try {
                            if(newValue) {
                              sectors.push(sector._id);
                            } else {
                              let delIndex = sectors.indexOf(sector._id);
                              sectors.splice(delIndex, 1);
                            }
                          } catch(e) {}
                          return [...sectors];
                        })}
                        tintColors={{ true: '#222222', false: '#222222' }}
                        tintColor="#222222"
                        onCheckColor="#1c75bc"
                        onFillColor="#222222"
                        onTintColor="#1c75bc"
                      />
                      </View>
                      <Text style={styles.singleSheetText}>{sector.name}</Text>
                    </View>
                  );
                })}

                <View style={{ height: responsiveHeight(15) }}></View>

              </ScrollView>
            </View>
            </RBSheet>






            {/* Skills */}
            <View style={{...styles.normalInputContainer}}>
              <Text style={styles.normalInputText}>Skills</Text>
              <TouchableOpacity onPress={() => skillsSheetRef.current.open()}>
                <View style={{...styles.input, paddingTop:responsiveHeight(0.5)}}>
                  {selectedSkills.length > 0 ?
                    <Text numberOfLines={2} ellipsizeMode='tail' style={styles.viewInput}>{selectedSkills.join(', ')}</Text>
                  :
                    <Text style={styles.viewInput}>Select your skills</Text>
                  }
                  
                  <Image style={{...styles.inputIcon,transform: [{ rotate: '-90deg'}]}} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />
                </View>
              </TouchableOpacity>
            </View>

            <RBSheet
              ref={skillsSheetRef}
              closeOnDragDown={true}
              closeOnPressMask={true}
              dragFromTopOnly={true}
              height={responsiveHeight(75)}
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
                <Text style={styles.sheetTitle}>Skills</Text>
              </View>
              
              <ScrollView style={styles.sheetScroll}>

                { keySkills.map((skill, index) => {
                  return (
                    <View key={index} style={styles.singleSheetOption}>
                      <View style={styles.radioButtonPosition}>
                      <CheckBox
                        disabled={false}
                        value={selectedSkills.indexOf(skill.name) !== -1}
                        onValueChange={(newValue) => setSelectedSkills(skills => {
                          try {
                            if(newValue) {
                              skills.push(skill.name);
                            } else {
                              let delIndex = skills.indexOf(skill.name);
                              skills.splice(delIndex, 1);
                            }
                          } catch(e) {}
                          return [...skills];
                        })}
                        tintColors={{ true: '#222222', false: '#222222' }}
                        tintColor="#222222"
                        onCheckColor="#1c75bc"
                        onFillColor="#222222"
                        onTintColor="#1c75bc"
                      />
                      </View>
                      <Text style={styles.singleSheetText}>{skill.name}</Text>
                    </View>
                  );
                })}
                
                <View style={{ height: responsiveHeight(15) }}></View>

              </ScrollView>
            </View>
            </RBSheet>




            {/* SUBJECT */}
            <View style={styles.profileInfo}>
              <Text style={styles.simpleInputText}>Subjects</Text>

              { selectedSubjects.map((subject, index) => {
                return (
                  <View key={index} style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:responsiveHeight(1.5)}}>
                    <View style={styles.singleSubject}>
                      <Text style={styles.contentSubject}><Text style={styles.contentSubjectDark}>Name:</Text> {subject.subject}</Text>
                      <Text style={styles.contentSubject}><Text style={styles.contentSubjectDark}>Grade:</Text> {subject.grade}</Text>
                      <Text style={styles.contentSubject}><Text style={styles.contentSubjectDark}>Actual / Predicted:</Text> {subject.type}</Text>
                    </View>
                    <TouchableOpacity onPress={() => openDeletePopup(index)}>
                      <FontAwesomeIcon color={'#d74949'} size={22} icon={faTimesCircle} />
                    </TouchableOpacity>
                  </View>
                );
              })}

              

            </View> 

            <View style={{...styles.bottomButtonArea,marginBottom:responsiveHeight(2),}}>
              <TouchableOpacity onPress={() => goToSubjectAdd()}>
                <View style={{alignItems:"center",justifyContent:"center",width:"100%"}}>
                  <Text style={{...styles.companyButtonText,color: "#007fff",fontSize: responsiveFontSize(2), fontFamily: "Poppins-Light",}}>Add Subject</Text>
                </View>
              </TouchableOpacity>
            </View>


            <View style={{...styles.normalInputContainer}}>
              <Text style={styles.normalInputText}>Bio</Text>
              <Input 
                id="bio"
                selectionColor={'#333'}
                style={{...styles.input,height:responsiveHeight(20),textAlignVertical: 'top'}} 
                errorContainerStyle={styles.errorContainer}
                errorTextStyle={styles.errorText}
                placeholderTextColor="#999999" 
                placeholder="" 
                multiline={true} 
                errorText={'Enter about yourself'}
                onInputChange={inputChangeHandler}
                validateOnChange={true}
                initialValue={formState.inputValues.bio}
                initiallyValid={formState.inputValidities.bio}
              />
            </View>
              






            <View style={styles.bottomButtonArea}>
              <TouchableOpacity style={{opacity: (formState.formIsValid && !isLoading ? 1 : 0.5 )}} disabled={!(formState.formIsValid && !isLoading)} onPress={() => updateProfile()}>
                <LinearGradient colors={['#3895fc', '#005ba6']} style={styles.solidButtonPrimary} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                  { !isLoading ?
                    <Text style={styles.solidButtonPrimaryText}>Save Profile</Text> 
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
