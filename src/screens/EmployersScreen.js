import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight, Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, TouchableWithoutFeedback, ViewToken } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/core';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize, } from "react-native-responsive-dimensions";
import RadioButton from 'radio-button-react-native';
import { Shadow } from 'react-native-shadow-2';
import Swiper from 'react-native-swiper';
// import tinycolor from 'tinycolor2';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faSearch, faSortAmountDown } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../components/Pagination';
import RBSheet from "react-native-raw-bottom-sheet";
import LinearGradient from 'react-native-linear-gradient';
import { htmlToText } from 'html-to-text';
import Marquee from '../components/MarqueeComponent';

import { useSelector, useDispatch } from 'react-redux';
import globals from '../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
import styles from './StyleSheet';


import NotificationListener from '../navigation/NotificationListener';
import { useSharedValue } from 'react-native-reanimated';

import * as Animatable from 'react-native-animatable';

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

export default EmployersScreen = props => {

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const authUser = useSelector(state => state.auth.user);
  const companies = useSelector(state => state.common.companies);
  const featuredCompanies = useSelector(state => state.common.featuredCompanies);

  const sortSheetRef = useRef(null);
  const swiper = useRef();

  const [searchText, setSearchText] = useState(props.route.params && props.route.params.searchText ? props.route.params.searchText : '');
  const [sortBy, setSortBy] = useState('name:1');

  const [isLoading, setIsLoading] = useState(true);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noMoreContent, setNoMoreContent] = useState(false);
  const perPage = 30;
  const [page, setPage] = useState(1);
  const [filterChange, setFilterChange] = useState(false);

  const [demoIndex, setDemoIndex] = useState(0);
  
  const [scrollAmount, setScrollAmount] = useState(0);

  useEffect(() => {
    fetchData(true);
  }, [dispatch, filterChange]);

  useEffect(()=> {
    if(isFocused && props.route.params && props.route.params.searchText && props.route.params.searchText != searchText) {
      applySearchText(props.route.params.searchText);
    } 
  }, [isFocused]);

  const fetchData = refresh => {
    if(refresh) {
      if(isLoading) {
        try {
          dispatch(commonActions.getCompanies({featured: true,perpage: 30}));
        } catch (error) {}
        
      }
    }
    setPage(async page => {
      let pageToFetch = await page;
      if(refresh) { //first load or pull to refresh
        pageToFetch = 1;
        setNoMoreContent(false);
        if(companies.length > 0) {
          setIsRefreshing(true);
        }
      } else { //pagination
        if(noMoreContent) return pageToFetch; 
        pageToFetch = pageToFetch + 1;
        setIsPaginating(true);
      }
      try {
        let params = {
          q: searchText.toLowerCase(),
          sort: sortBy,
          perpage: perPage,
          page: pageToFetch,
        }
        let data = await dispatch(commonActions.getCompanies(params));
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


  const applySearchText = async text => {
    setSearchText(text);
    await dispatch(commonActions.setCompanies([]));
    setIsPaginating(true);
    setFilterChange(state => !state);
  };

  const applySort = async sort => {
    sortSheetRef.current.close();
    setSortBy(sort);
    await dispatch(commonActions.setCompanies([]));
    setIsPaginating(true);
    setFilterChange(state => !state);
    
  }; 

  const goToEmployerDetails = company => {
    props.navigation.navigate('EmployerDetails', {company: company});
  }

  

  const _keyExtractor = (item, index) => item._id+index;

  const renderHeader = () => {
    return (
      <>
        
      
      
        {/* Featured EMPLOYERS */}
        { featuredCompanies && featuredCompanies.length > 0 && <>
          <View>
            <View style={styles.featuredBG}>
              <Image style={{width:responsiveWidth(100),height:responsiveHeight(20),}} source={require('../../assets/images/ypa/bg-9.jpg')} />
            </View>


            <View style={{...styles.featureTitle,marginTop:responsiveHeight(3)}}>
              <Image style={styles.featureStar} source={require('../../assets/images/ypa/new-images/blue-star.png')} />
              <Text style={{...styles.psTitle,position:"relative",top:responsiveHeight(0.3),color:"#222"}}>FEATURED EMPLOYERS</Text>
              <Image style={styles.featureStar} source={require('../../assets/images/ypa/new-images/blue-star.png')} />
            </View>
            
          
              <View style={{...styles.swipperWrapper,height:responsiveWidth(30)}}>
                <Marquee 
                  style={{}}
                  data={featuredCompanies} 
                  keyExtractor={_keyExtractor}
                  renderItem={({item, index}) => {
                    return renderFeaturedCompany(item, index);
                  }} 
                  speed={2}
                />
              </View>
           
            
            
          </View>
        
        </> }

        





        <RBSheet
          ref={sortSheetRef}
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
              <Text style={styles.sheetTitle}>Sort By</Text>
              <TouchableOpacity onPress={() => sortSheetRef.current.close()}>
                <Image style={styles.rbsheetClose} source={require('../../assets/images/ypa/new-images/close-blue.png')} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:responsiveWidth(4),paddingVertical:responsiveWidth(5)}}>
              
              <View>
                
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => applySort('name:1')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={sortBy} value={'name:1'} onPress={() => applySort('name:1')} />
                  </View>
                  <Text style={styles.singleSheetText}>Name: A to Z</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => applySort('name:-1')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={sortBy} value={'name:-1'} onPress={() => applySort('name:-1')} />
                  </View>
                  <Text style={styles.singleSheetText}>Name: Z to A</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => applySort('created:-1')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={sortBy} value={'created:-1'} onPress={() => applySort('created:-1')} />
                  </View>
                  <Text style={styles.singleSheetText}>Recently Added</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>


          </View>
      </RBSheet>











        

        
      </>
    );
  };

  const handleScroll = (event) => {
    setScrollAmount(event.nativeEvent.contentOffset.y);
  }

  const onViewableItemsChanged = ({
    viewableItems,changed
  }) => {
  //  console.log(viewableItems[0].index);
   setDemoIndex(viewableItems[0].index);
  };
  const viewabilityConfigCallbackPairs = useRef([
    { onViewableItemsChanged },
  ]);

  const renderEmptyContainer = () => {
    return(
      <View style={{alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(0)}}>
        <Image style={styles.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
        <Text style={styles.noDataTitle}>No Employer Found</Text>
      </View>
    );
  };

  const renderFilter = (company, index) => {
    return (
     
      <View style={{...(scrollAmount > 270 ? styles.bottomFeaturedBorder : styles.bottomFeatured), paddingHorizontal: 0}}>
        <View style={{paddingHorizontal:responsiveWidth(5),backgroundColor:"#ffffff"}}>
          <View style={{...styles.filterHeader, justifyContent:"flex-end", marginVertical:responsiveHeight(2)}}>
            <TouchableOpacity onPress={() => sortSheetRef.current.open()}>
              <View style={{...styles.fButton, width:responsiveWidth(27),backgroundColor:"#cee6fe"}}>
                <Text style={styles.fButtonTitle}>Sort By</Text>
                <Image style={styles.fButtonImage} source={require('../../assets/images/ypa/new-images/sort-blue.png')} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        { searchText!= '' && <View style={{paddingBottom: responsiveWidth(3.2)}}>
          <View style={{backgroundColor:"#ffffff",padding:responsiveWidth(3),borderRadius:6, marginBottom:-responsiveWidth(3)}}>
            <Text style={styles.contentDesc}>Showing results for <Text style={{color:"#2498fd"}}>"{searchText}"</Text></Text>
            <TouchableOpacity style={styles.searchButtonEmptyContainer} onPress={() => applySearchText('')}>
              <Image style={styles.searchEmptyButton} source={require('../../assets/images/ypa/close-circle-grey.png')} />
            </TouchableOpacity>
          </View>
        </View> }
      </View>
     
    );
  };

  const renderCompany = (company, index) => {
    return (
      <>

        <View style={index % 2 == 0 ? styles.leftContent : styles.rightContent}>
          <TouchableOpacity onPress={() => goToEmployerDetails(company)}>
            <Shadow style={{width:responsiveWidth(100)}} distance={5} startColor={'#00000005'} >
              <View style={index % 2 == 0 ? styles.singleContentLeft : styles.singleContentRight}>
                <Image style={styles.contentImage} source={{uri: company.color_images[0].regular}} />
                <Text style={styles.companyName} numberOfLines={1}>{company.name}</Text>
                <Text style={styles.companyDesc} numberOfLines={4}>
                  {htmlToText(company.description, {wordwrap: false})}
                </Text>
              </View>
            </Shadow>
          </TouchableOpacity>
        </View>
        

      </>
    );
  };

  const renderFeaturedCompany = (company, index) => {
    return (
      <TouchableWithoutFeedback key={index} onPress={() => goToEmployerDetails(company)}>
        <View style={{...styles.singleFeaturedWrapper}} >
          <Shadow style={{width:responsiveWidth(100)}} distance={5} startColor={'#0000000d'} >
            <LinearGradient colors={['#11bcfc', '#0051ad']} style={{...styles.singleFeaturedInner, padding:responsiveWidth(2),}} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              
              <View style={{justifyContent:"flex-end",flexDirection:"row"}}>
                { company.images.length && company.images[0].regular && <Image style={{...styles.singleFeaturedEmployerImage, width:responsiveWidth(40),height:responsiveWidth(25)}} source={{uri: company.images[0].regular}} /> }
              </View>
            </LinearGradient>
          </Shadow>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  

  if (isLoading) {
    return ( 
      <LinearGradient colors={['#ffffff', '#ffffff']} style={{...styles.screen,flex: 1,justifyContent: 'center',alignItems: 'center',}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <ActivityIndicator size="large" color={'#007fff'} />
      </LinearGradient>
    );
  }


  const getData = (data) => {
    const updatedData = ["sticky", "sticky", ...data]
    return updatedData;
  }

  return ( 
    <LinearGradient colors={['#ffffff', '#ffffff']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
      <Shadow style={{width:responsiveWidth(100)}} distance={5} startColor={'#0000000d'} >

        <View style={{...styles.mainHeader, backgroundColor:"#ffffff",borderBottomWidth:0}}>
          <View>
            <View style={styles.sideBySide}>
              <Text animation="zoomInUp" style={{...styles.pageName}}>Employers</Text>
            </View>
          </View>
          <View style={styles.sideBySide}>
            <TouchableOpacity onPress={() => { props.navigation.navigate('SearchResult', {from: 'EmployersPage'}) }}>
              <View style={{marginRight:responsiveWidth(7)}}>
                <Image style={styles.headerSearchIcon} source={require('../../assets/images/ypa/new-images/search-blue.png')} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
              <LinearGradient colors={['#3895fc', '#005ba6']} style={styles.menuButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.menuLongLine}></View>
                <View style={styles.menuMediumLine}></View>
                <View style={styles.menuSmallLine}></View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Shadow>

      

      <FlatList style={{flex: 1, padding: responsiveWidth(0)}}

        onScroll={event  => handleScroll(event)} 
        viewabilityConfigCallbackPairs={
          viewabilityConfigCallbackPairs.current
        }


        nestedScrollEnabled={true}
        contentContainerStyle={{paddingBottom: 60}}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={getData(companies)}
        keyExtractor={_keyExtractor}
        ListEmptyComponent={renderEmptyContainer()}
        ListHeaderComponent={renderHeader()}
        ListFooterComponent={isPaginating && <Pagination />}
        renderItem={({item, index, separators}) => {
          if(index > 1) {
            return renderCompany(item, index);
          } else {
            return renderFilter(item, index);
          }
        }}
        refreshControl={
          <RefreshControl
            onRefresh={() => fetchData(true)}
            refreshing={isRefreshing}
            colors={['#0051ad']}
            title="Pull to Refresh"
            tintColor="#0051ad"
            titleColor="#0051ad"
          />
        }
        onEndReached={() => fetchData(false)}
        onEndReachedThreshold={0.5}
        stickyHeaderIndices={[1]}
      />
      
      { !isPaginating && companies.length == 0 && renderEmptyContainer() }





      
    </LinearGradient>
  );

}

// const styles = StyleSheet.create({
//   // No DATA CSS
//   noDataImage: {
//     width: 125,
//     resizeMode: "contain"
//   },
//   noDataTitle: {
//     fontFamily: "FuturaLT-Bold",
//     fontSize: responsiveFontSize(2.5),
//     color: "#141517",
//     marginTop: 10
//   },
//   noDataSubTitle: {
//     fontFamily: "FuturaLT-Book",
//     fontSize: responsiveFontSize(2),
//     color: "#888888",
//     textAlign: "center"
//   },
//   screen: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   secondaryHeaderStyle: {
//     backgroundColor: "#007fff",
//     flexDirection: "row",
//     alignItems: "center", 
//     justifyContent: "space-between",
//     paddingHorizontal: responsiveWidth(3),
//     height: responsiveHeight(9),
//     borderBottomWidth:1,
//     borderColor:"#007fff",
//     elevation:5,
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowColor: 'black',
//     shadowOpacity: 0.4,
//     shadowRadius: 5,
//   },
//   secondaryPageHeading: {
//     fontFamily: "Poppins-SemiBold",
//     fontSize: responsiveFontSize(3),
//     color: "#ffffff"
//   },
//   headerIcon: {
//     marginHorizontal: responsiveWidth(3.5),
//   },
//   headerIconRight: {
//     marginLeft: responsiveWidth(3.5),
//   },

//   parentWrapper: {
//     flex: 1,
//     backgroundColor: "#f0f7ff",
//   },
//   scrollview: {
//     height: '100%',
//     padding: responsiveWidth(3.2)
//   },

//   topFilterBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between"
//   },
//   singleFilter: {
//     backgroundColor: "#ffffff",
//     width: responsiveWidth(50),
//     height: responsiveHeight(8),
//     flexDirection:"row",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRightWidth: 1,
//     borderColor: "#ececec"
//   },
//   singleFilterText: {
//     fontSize: responsiveFontSize(1.8),
//     color: "#333",
//     fontFamily: "FuturaLT-Book",
//   },
//   filterActivated :{
//     // position:"absolute",
//     height:responsiveHeight(2),
//     width:responsiveHeight(2),
//     alignItems:"center",justifyContent:"center",
//     borderRadius:50,
//     backgroundColor:"#2e80fe",
//     marginLeft:responsiveWidth(1.5),
    
//   },
//   filterActivatedText:{
//     fontSize: responsiveFontSize(1.2),
//     color: "#ffffff",
//     fontFamily: "FuturaLT-Book",
//     position:"relative",
//     top:responsiveHeight(0.05)
//   },
//   filterActivatedHeader :{
//     position:"absolute",
//     borderWidth:1,
//     top:-8,
//     right:-1.5,
//     borderColor:"#ffffff",
//     height:9,
//     width:9,
//     borderRadius:50,
//     backgroundColor:"#26beaf",
//     marginLeft:responsiveWidth(1.5)
//   },

//   contentWrapper: {
//     width: "100%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     flexWrap: "wrap"
//   },
//   singleContent: {
//     backgroundColor: "#ffffff",
//     width: responsiveWidth(45.5),
//     marginBottom: responsiveWidth(2.7),
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: responsiveWidth(2.5),
//     paddingBottom: responsiveWidth(2.7),
//     paddingHorizontal: responsiveWidth(2.5),
//     borderRadius: 8
//   },
//   whiteBorderLeft:{
//     width: responsiveWidth(41.5),
//     top:responsiveHeight(1.6),
//     left:responsiveWidth(3.2),
//     height: responsiveHeight(9),
//     backgroundColor:"#ffffff",
//     position:"absolute",
//     zIndex:1,
//   },
//   whiteBorderRight:{
//     width: responsiveWidth(41.5),
//     top:responsiveHeight(1.6),
//     left:responsiveWidth(3.2),
//     height: responsiveHeight(9),
//     backgroundColor:"#ffffff",
//     position:"absolute",
//     zIndex:1,
//   },
//   leftContent:{
//     marginTop: responsiveWidth(3.2),
//     marginRight: responsiveWidth(5),
//     marginLeft:responsiveWidth(4)
//   },
//   singleContentLeft: {
//     backgroundColor: "#ffffff",
//     width: responsiveWidth(43.5),
//     // marginBottom: responsiveWidth(5),
//     // marginRight: responsiveWidth(5),
//     zIndex:2,
//     position:"relative",
//     elevation:5,
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowColor: 'black',
//     shadowOpacity: 0.4,
//     shadowRadius: 5,
//     // alignItems: "center",
//     // justifyContent: "center",
//     // paddingTop: responsiveWidth(2.5),
//     // paddingBottom: responsiveWidth(2.7),
//     // paddingHorizontal: responsiveWidth(2.5),
//     // borderRadius: 8
//   },
//   rightContent:{
//     marginTop: responsiveWidth(3.2),
//     // marginBottom: responsiveWidth(5),
//   },
//   singleContentRight: {
//     position:"relative",
//     backgroundColor: "#ffffff",
//     width: responsiveWidth(43.5),
//     // marginBottom: responsiveWidth(5),
//     zIndex:2,
//     elevation:5,
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowColor: 'black',
//     shadowOpacity: 0.4,
//     shadowRadius: 5,
//   },
//   empContentWrapper:{
//     borderTopWidth:1,
//     borderTopColor:"#eaeaea",
//     width: responsiveWidth(45.5),
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: responsiveWidth(2.7),
//     paddingBottom: responsiveWidth(2.7),
//     paddingHorizontal: responsiveWidth(2.5),
//   },
//   contentImageWrapper:{
//     paddingVertical: responsiveWidth(1.25),
//     paddingHorizontal: responsiveWidth(2.5),
//   },
//   contentImage: {
//     width: "100%",
//     resizeMode: "contain",
//     height: responsiveHeight(9),
    
//     // backgroundColor:"red"
//   },
//   contentTitle: {
//     fontSize: responsiveFontSize(1.9),
//     color: "#ffffff",
//     fontFamily: "Poppins-SemiBold",
//     textAlign: "left",
//     // backgroundColor:"red",
//     width: "100%",
//     marginTop: responsiveHeight(1),
//     marginBottom: responsiveHeight(0.5),
//   },
//   contentDesc: {
//     fontSize: responsiveFontSize(1.6),
//     color: "#ffffff",
//     fontFamily: "FuturaLT",
//     textAlign: "left",
//     // backgroundColor:"red",
//     width: "100%"
//   },


  
//   // RB SHEET

//   sheetTitleContainer: {
//     borderBottomWidth: 1,
//     borderColor: "#e6e6e6",
//     paddingBottom: responsiveHeight(1),
//     marginBottom: responsiveHeight(4)
//   },
//   sheetTitle: {
//     fontSize: responsiveFontSize(2.3),
//     // lineHeight:responsiveFontSize(2.1),
//     fontFamily: "FuturaLT-Bold",
//     color: "#222222",
//     textAlign: "center"
//   },
//   singleSheetOption: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "flex-start",
//     // marginBottom: responsiveHeight(0.5),
//     // backgroundColor:"red",
//     paddingBottom: responsiveHeight(3),
//   },
//   singleSheetText: {
//     fontSize: responsiveFontSize(1.9),
//     fontFamily: "FuturaLT-Book",
//     color: "#333333",
//     textAlign: "center"
//   },
//   checkboxContainer: {
//     flexDirection: "row",
//     marginBottom: 20,
//     alignItems: "center"
//   },
//   label: {
//     alignSelf: "center",
//     fontSize: responsiveFontSize(1.9),
//     marginLeft: 5,
//     // lineHeight:responsiveFontSize(2.1),
//     fontFamily: "Poppins-SemiBold",
//     color: "#ffffff",
//     textAlign: "center"
//   },


//   // RADIO
//   radioButtonPosition :{
//     // position:"absolute", 
//     // top: responsiveWidth(5), 
//     // right:responsiveWidth(5),
//     // zIndex:1
//     marginRight:responsiveWidth(3)
//   },
//   searchButtonEmptyContainer:{
//     position:"absolute",
//     // right:responsiveWidth(2),
//     // top:responsiveHeight(1.3)
//     top: 0, left: 0, right: responsiveWidth(3), bottom: 0, justifyContent: 'center', alignItems: 'flex-end'
//   },
//   searchEmptyButton:{
//     height:responsiveWidth(5.5),
//     width:responsiveWidth(5.5),
//     resizeMode:"contain",
//   },
//   searchIcon:{
//     width: responsiveHeight(3.4),
//     width: responsiveHeight(3.4),
//     resizeMode: 'contain',
//   },

// });
