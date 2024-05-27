import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight, Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, Animated } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize, } from "react-native-responsive-dimensions";
import CheckBox from '@react-native-community/checkbox';
import RadioButton from 'radio-button-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faSearch, faSortAmountDown, faClock, faCalendarDay, faTimes, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../components/Pagination';
import RBSheet from "react-native-raw-bottom-sheet";
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

import { useSelector, useDispatch } from 'react-redux';
import globals from '../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';

import NotificationListener from '../navigation/NotificationListener';

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

export default BookEvents = props => {

  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  // const events = useSelector(state => state.common.events);
  const events = [0,1];

  const [selectedSort, setSelectedSort] = useState('Name A to Z');
  const sortSheetRef = useRef(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const [selectedJobSector, setSelectedJobSector] = useState(false);
  const jobSectorSheetRef = useRef(null);

  const [selectedCompany, setSelectedCompany] = useState(false);

  const [bookEventType, setBookEventType] = useState('upcoming');
  const [calendarPopup, setCalendarPopup] = useState(false);

  const companySheetRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noMoreContent, setNoMoreContent] = useState(false);
  const perPage = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchData(true);
  }, [dispatch]);

  const fetchData = refresh => {
    setPage(async page => {
      let pageToFetch = await page;
      if(refresh) { //first load or pull to refresh
        pageToFetch = 1;
        setNoMoreContent(false);
        if(events.length > 0) {
          setIsRefreshing(true);
        }
      } else { //pagination
        if(noMoreContent) return pageToFetch; 
        pageToFetch = pageToFetch + 1;
        setIsPaginating(true);
      }
      try {
        let params = {
          perpage: perPage,
          page: pageToFetch,
        }
        let data = await dispatch(commonActions.getEvents(params));
        if(data.length < perPage) {
          setNoMoreContent(true);
        } else {
          setNoMoreContent(false);
        }
      } catch(err) {
        console.log(err.toString());
      } 
      setIsLoading(false);
      setIsPaginating(false);
      setIsRefreshing(false);
      return pageToFetch;
    });
  };

  
  const goToBookEventDetails= () => {
    props.navigation.push('BookEventDetails');
  };

  const selectSort = sort => {
    sortSheetRef.current.close();
    setSelectedSort(sort);
  };

  const selectJobSector = jobsector => {
    // jobSectors.push(jobsector);
    // jobSectorSheetRef.current.close();
    // setSelectedJobSector(jobSectors);
    console.log(jobsector);
  };

  const openCalendarPopup = () => {
    setCalendarPopup(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver:true
    }).start();
    
  }

  const closeCalendarPopup = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver:true
    }).start();
    setTimeout(() => {
      setCalendarPopup(false)
    }, 225);
  }

 
  
  const goBack = () => {
    props.navigation.goBack();
  }

  const _keyExtractor = (item, index) => item._id+index;

  const renderHeader = () => {
    return (
      <>
        
      </>
    );
  };

  const renderEmptyContainer = () => {
    return(
      <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(20)}}>
        <Image style={styles.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
        <Text style={styles.noDataTitle}>No Event Found</Text>
      </View>
    );
  };

  const renderEvent = (event, index) => {
    return (
      <>
        {/* <TouchableOpacity onPress={() => goToBookEventDetails(event)}>
          <View style={index % 2 == 0 ? styles.eventContentLeft : styles.eventContentRight}>
            <Image style={styles.eventImage} source={{uri: event.company[0].images[0].regular}} />
            <Text style={styles.eventTitle} numberOfLines={2} ellipsizeMode='tail'>{event.title}</Text>
            <Text style={styles.eventDesc} numberOfLines={3} ellipsizeMode='tail'>{event.description.replace('\n', '').replace('\r', '')}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
              <FontAwesomeIcon color={'#ffffff'} size={14} icon={faClock} />
              <Text style={styles.eventDateText}>{moment(event.event_date).format("DD/MM/YYYY, hh:mm A")}</Text>
            </View>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => goToBookEventDetails(event)}>
          <View style={index % 2 == 0 ? styles.eventContentLeft : styles.eventContentRight}>
            <Image style={styles.eventImage}  source={require('../../assets/images/ypa/category-1.jpg')}/>
            <Text style={styles.eventTitle} numberOfLines={2} ellipsizeMode='tail'>Young Professionals Summer Work Experience Event - Thursday 20th July 2023</Text>
            <Text style={styles.eventDesc} numberOfLines={3} ellipsizeMode='tail'>The Young Professionals Summer Work Experience Event is back! Secure your place today and meet some of the worlds biggest employers. You will have the opportunity to take part in workshops, hear from C-Level keynote speakers, up skill yourself with professionals all whilst taking full advantage of the incredible industry knowledge and learning opportunities on the day. On top of all of this you will have plenty of time for networking and having those all important 1-1 conversation to secure yourself an opportunity over a longer period of time. We will be releasing more and more employers closer to the time. We have limited places so please book on if you want to attend.</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
              <FontAwesomeIcon color={'#ffffff'} size={14} icon={faClock} />
              <Text style={styles.eventDateText}>July 20, 2023</Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#ebf1ff', '#ebf1ff']} style={{...styles.screen,flex: 1,justifyContent: 'center',alignItems: 'center',}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
      <ActivityIndicator size="large" color={'#007fff'} />
    </LinearGradient>
    );
  }


  return (
    <LinearGradient colors={['#ebf1ff', '#ebf1ff']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>


      <View style={styles.backHeaderStyle}>
        <TouchableOpacity onPress={() => goBack()}>
          <View style={{ flexDirection: "row", alignItems: "center", height: responsiveHeight(9), paddingHorizontal: responsiveWidth(3),}}>
            <FontAwesomeIcon color={'#ffffff'} size={20} icon={faChevronLeft} />
            <Text style={styles.pageHeading}>In Person Events</Text>
          </View>
        </TouchableOpacity>
      </View>

      

      {/* TOP FILTER BAR */}
      <View style={styles.topFilterBar}>
        <TouchableOpacity onPress={() => setBookEventType('upcoming')}>
          <View style={styles.singleFilter}>
            <Text style={styles.singleFilterText}>Upcoming</Text>
            { bookEventType == 'upcoming' &&
              <View style={styles.activeTab}></View>
            }
            
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setBookEventType('archived')}>
          <View style={{ ...styles.singleFilter, borderColor: "#111111" }}>
            <Text style={styles.singleFilterText}>Archived</Text>
            { bookEventType == 'archived' &&
              <View style={styles.activeTab}></View>
            }
          </View>
        </TouchableOpacity>
      </View>
      


      {/* POPUP CALENDAR */}
      {calendarPopup == true ?
      <Animated.View style={{...styles.calendarPopup,opacity: fadeAnim}}>
        <View style={styles.mainAreaPopup}>
          
          <View style={styles.closePopup}>
            <TouchableOpacity style={styles.closePopupTouch} onPress={() => closeCalendarPopup()}>
              <FontAwesomeIcon color={'#013b75'} size={18} icon={faTimes} />
            </TouchableOpacity>
          </View>
          <View style={{width:"100%"}}>
            
            <Calendar 
              onDayPress={(day) => {goToEventDate(day)}}
              style={{
                // borderWidth: 1,
                // borderColor: "#aaaaab",
                // height: 375,
                // borderRadius:8,
              }}
              theme={{
                backgroundColor: '#013b75',
                calendarBackground: '#013b75',
                textSectionTitleColor: '#ffffff', // sun mon tue
                textSectionTitleDisabledColor: '#d9e1e8',
                selectedDayBackgroundColor: '#ffffff',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#009b97',
                dayTextColor: '#ffffff', // month number current month 1,2,3,4
                textDisabledColor: '#d9e1e8',
                dotColor: '#009b97',
                selectedDotColor: '#ffffff',
                arrowColor: '#ffffff',
                disabledArrowColor: '#d9e1e8',
                monthTextColor: '#ffffff', // top month text color
                indicatorColor: '#ff0000',
                textDayFontFamily: 'FuturaLT',
                textMonthFontFamily: 'FuturaLT',
                textDayHeaderFontFamily: 'FuturaLT-Bold',
                textDayFontSize: responsiveFontSize(1.8),
                textMonthFontSize: responsiveFontSize(1.8),
                textDayHeaderFontSize: responsiveFontSize(1.5)
              }}
              markedDates={{
                // '2022-01-16': {selected: true, marked: false, selectedColor: '#2498fd'},
                // '2022-01-17': {selected: true, marked: false, selectedColor: '#2498fd'},
              }}
            />




          </View>
          <View style={styles.popupBtnWraper}>
           
            <View style={styles.blueCircle}></View>
            <Text style={styles.blueCircleText}>Event</Text>
          
          </View>
        </View>
      </Animated.View>
        :
        <></>
      }

      
      {/* <View style={{flex: 1, padding: responsiveWidth(3.2),flexDirection:"row"}}>
        <TouchableOpacity onPress={() => goToBookEventDetails()}>
          <View style={styles.eventContentLeft}>
            <Image style={styles.eventImage}  source={require('../../assets/images/ypa/empty-search.png')} />
            <Text style={styles.eventTitle} numberOfLines={2} ellipsizeMode='tail'>ajhsduyasdhjakjshd</Text>
            <Text style={styles.eventDesc} numberOfLines={3} ellipsizeMode='tail'>jhsakd asjdha sdakjsd asdkj</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
              <FontAwesomeIcon color={'#ffffff'} size={14} icon={faClock} />
              <Text style={styles.eventDateText}>adsasdasd</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.eventContentRight}>
            <Image style={styles.eventImage}  source={require('../../assets/images/ypa/empty-search.png')} />
            <Text style={styles.eventTitle} numberOfLines={2} ellipsizeMode='tail'>ajhsduyasdhjakjshd</Text>
            <Text style={styles.eventDesc} numberOfLines={3} ellipsizeMode='tail'>jhsakd asjdha sdakjsd asdkj</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
              <FontAwesomeIcon color={'#ffffff'} size={14} icon={faClock} />
              <Text style={styles.eventDateText}>adsasdasd</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View> */}

     

      <FlatList 
        style={{flex: 1, padding: responsiveWidth(3.2)}}
        nestedScrollEnabled={true}
        contentContainerStyle={{paddingBottom: 60}}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={events}
        keyExtractor={_keyExtractor}
        ListEmptyComponent={renderEmptyContainer()}
        ListHeaderComponent={renderHeader()}
        ListFooterComponent={isPaginating && <Pagination />}
        renderItem={({item, index, separators}) => {
          return renderEvent(item, index);
        }}
        refreshControl={
          <RefreshControl
            onRefresh={() => fetchData(true)}
            refreshing={isRefreshing}
            colors={['#007fff']}
            title="Pull to refresh"
            tintColor="#ffffff"
            titleColor="#ffffff"
          />
        }
        onEndReached={() => fetchData(false)}
        onEndReachedThreshold={0.5}
      />
     

     
      <View style={styles.calendar}>
        <TouchableOpacity style={{height:responsiveHeight(7),width:responsiveHeight(7),alignItems:"center",justifyContent:"center",}} onPress={() => openCalendarPopup()}>
          <FontAwesomeIcon color={'#ffffff'} size={30} icon={faCalendarDay} />
        </TouchableOpacity>
      </View>
     

     
    </LinearGradient>
  );

}

const styles = StyleSheet.create({

  backHeaderStyle: {
    // backgroundColor: "transparent",
    backgroundColor: "#007fff",
    height: responsiveHeight(9),
    // borderBottomWidth:1,
    // borderColor:"#111111",
    elevation: 0,
    shadowOpacity: 0,
    // borderBottomWidth: 0,
    // position:"absolute",
    // top:0,
    width:responsiveWidth(100),
    zIndex:9999

  },
  pageHeading: {
    fontFamily: "FuturaLT-Bold",
    fontSize: responsiveFontSize(2.4),
    color: "#ffffff",
    position: "relative",
    top: 1,
    marginLeft: responsiveWidth(2)
  },
  secondaryPageHeading: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(3),
    color: "#ffffff"
  },

  calendar:{
    position:"absolute",
    bottom:responsiveWidth(7),
    right:responsiveWidth(7),
    height:responsiveHeight(7),
    width:responsiveHeight(7),
    backgroundColor:"#0182ff",
    borderRadius:50,
    alignItems:"center",
    justifyContent:"center",
    elevation:5
  },
  
  bookEventButton: {
    backgroundColor: "#f9516a",
    // borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: responsiveHeight(1.5),
    height: responsiveHeight(6),
  },
  bookEventButtonText: {
    fontSize: responsiveFontSize(1.9),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
  },
  // No DATA CSS
  noDataImage: {
    width: 100,
    resizeMode: "contain"
  },
  noDataTitle: {
    fontFamily: "FuturaLT-Book",
    fontSize: responsiveFontSize(2.5),
    color: "#222222",
    marginTop: 10
  },
  noDataSubTitle: {
    fontFamily: "FuturaLT-Book",
    fontSize: responsiveFontSize(2),
    color: "#888888",
    textAlign: "center"
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
 
  headerIcon: {
    marginHorizontal: responsiveWidth(3.5),
  },
  headerIconRight: {
    marginLeft: responsiveWidth(3.5),
  },

  parentWrapper: {
    flex: 1,
    backgroundColor: "#f0f7ff",
  },
  scrollview: {
    height: '100%',
    padding: responsiveWidth(3.2)
  },

  topFilterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0065cb",
  },
  singleFilter: {
    backgroundColor: "#0065cb",
    width: responsiveWidth(50),
    height: responsiveHeight(8),
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#0065cb",
    position:"relative"
  },
  singleFilterText: {
    fontSize: responsiveFontSize(1.8),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
  },
  activeTab:{
    position:"absolute",
    bottom:0,
    left:0,
    right:0,
    height:responsiveHeight(0.5),
    backgroundColor:"#ffffff"
  },


  // Events
  eventWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    backgroundColor: 'red',
  },
  eventContent: {
    backgroundColor: "#013b75",
    width: responsiveWidth(45.5),
    marginBottom: responsiveWidth(2.7),
    paddingTop: responsiveWidth(2.5),
    paddingBottom: responsiveWidth(2.7),
    paddingHorizontal: responsiveWidth(2.5),
    borderRadius: 8
  },
  eventContentLeft: {
    backgroundColor: "#0065cb",
    width: responsiveWidth(45.5),
    marginBottom: responsiveWidth(2.7),
    paddingTop: responsiveWidth(2.5),
    paddingBottom: responsiveWidth(2.7),
    paddingHorizontal: responsiveWidth(2.5),
    borderRadius: 8
  },
  eventContentRight: {
    backgroundColor: "#0065cb",
    width: responsiveWidth(45.5),
    marginLeft: responsiveWidth(2.6),
    marginBottom: responsiveWidth(2.7),
    paddingTop: responsiveWidth(2.5),
    paddingBottom: responsiveWidth(2.7),
    paddingHorizontal: responsiveWidth(2.5),
    borderRadius: 8
  },
  eventImage: {
    width: "100%",
    resizeMode: "contain",
    height: responsiveHeight(9),
    // backgroundColor:"yellow"
  },
  eventTitle: {
    fontSize: responsiveFontSize(1.9),
    color: "#ffffff",
    fontFamily: "FuturaLT-Bold",
    textAlign: "left",
    // backgroundColor:"red",
    width: "100%",
    height: responsiveHeight(7),
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(0.5),
  },
  eventDesc: {
    fontSize: responsiveFontSize(1.6),
    color: "#ffffff",
    fontFamily: "FuturaLT",
    textAlign: "left",
    marginBottom: responsiveHeight(1.5),
    // backgroundColor:"red",
    height: responsiveHeight(7),
    width: "100%"
  },
  eventDateText: {
    fontSize: responsiveFontSize(1.5),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
    marginLeft: responsiveWidth(1.8),
    position: "relative",
    top: responsiveHeight(0.2)
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
    paddingBottom: responsiveHeight(3),
  },
  singleSheetText: {
    fontSize: responsiveFontSize(2),
    fontFamily: "FuturaLT-Book",
    color: "#333333",
    textAlign: "center",
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








  // POPUP
  calendarPopup:{
    position:"absolute",
    top:0,
    bottom:0,
    right:0,
    left:0,
    zIndex:999999,
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems:"center",
    justifyContent:"center",
  },
  closePopup:{
    position:"absolute",
    top:-responsiveHeight(2),
    right:-responsiveWidth(2),
    
    alignItems:"center",
    justifyContent:"center",
    elevation:5,
    zIndex:5,
  },
  closePopupTouch:{
    borderRadius:50,
    height:responsiveHeight(5),
    width:responsiveHeight(5),
    backgroundColor:"#ffffff",
    alignItems:"center",
    justifyContent:"center",
  },


  mainAreaPopup:{
    backgroundColor:"#013b75",
    alignItems:"center",
    justifyContent:"center",
    position:"relative",
    borderRadius:10,
    paddingTop:responsiveHeight(2.5),
    paddingBottom:responsiveHeight(0.5),
    paddingHorizontal:responsiveWidth(1),
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
  mainTitleWrapper:{
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center",
    justifyContent:"center"
  },
  mainTitlePopup:{
    fontFamily: "FuturaLT-Book",
    textAlign:"center",
    fontSize:responsiveFontSize(2.2),
  },
  mainTitlePopupBold:{
    fontFamily: "FuturaLT-Bold",
    textAlign:"center",
    fontSize:responsiveFontSize(2.2)
  },
  popupBtnWraper:{
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center",
    // backgroundColor:"red",
    width:"100%",
    justifyContent:"flex-start",
    marginVertical:responsiveHeight(1),
    paddingTop:responsiveHeight(1),
    paddingLeft:responsiveWidth(5),
    borderTopWidth:1,
    borderColor:"#0063c5"
  },
  cancelBtn:{
    backgroundColor: "#dcdcdc",
    marginRight: responsiveWidth(3),
    borderRadius:6,
    paddingVertical:responsiveHeight(1.4),
    width:responsiveWidth(26)
  },
  cancelBtnText:{
    fontFamily: "FuturaLT-Book",
    textAlign:"center",
    fontSize:responsiveFontSize(1.8),
    color: "#333",
  },
  applyBtn:{
    backgroundColor: "#0066ca",
    marginRight: responsiveWidth(2),
    borderRadius:6,
    paddingVertical:responsiveHeight(1.4),
    width:responsiveWidth(26)
  },
  applyBtnText:{
    fontFamily: "FuturaLT-Book",
    textAlign:"center",
    fontSize:responsiveFontSize(1.8),
    color: "#ffffff",
  },
  blueCircle:{
    backgroundColor:"#2498fd",
    borderRadius:50,
    height:responsiveHeight(1.6),
    width:responsiveHeight(1.6),
    marginRight:responsiveWidth(2)
  },
  blueCircleText:{
    fontFamily: "FuturaLT-Book",
    fontSize:responsiveFontSize(1.6),
    color: "#ffffff",
  }

});
