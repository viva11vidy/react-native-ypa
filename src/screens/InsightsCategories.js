import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight, Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, ImageBackground, Animated, TouchableWithoutFeedback } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize, } from "react-native-responsive-dimensions";
import CheckBox from '@react-native-community/checkbox';
import RadioButton from 'radio-button-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faSearch, faSortAmountDown, faClock, faChevronLeft, faPlay, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../components/Pagination';
import RBSheet from "react-native-raw-bottom-sheet";
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { Shadow } from 'react-native-shadow-2';

import { useSelector, useDispatch } from 'react-redux';
import globals from '../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
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

export default InsightsCategories = props => {

  const scrollA = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  const selectedCategory = props.route.params && props.route.params.category ? props.route.params.category : null; 
  const insightCats = useSelector(state => state.common.insightCats); console.log(insightCats);
  const insightsUnderCat = useSelector(state => state.common.insightsUnderCat);

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
        if(insightsUnderCat.length > 0) {
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
          cids: selectedCategory._id
        }
        let data = await dispatch(commonActions.getInsightsUnderCat(params));
        if(data && data.list && data.list.length < perPage) {
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

  const goToInsightCategory = category => {
    props.navigation.push('Insights', {category: category});
  };

  const goToInsightDetails = insight => {
    props.navigation.push('InsightDetails', {insight: insight});
  };

  const _keyExtractor = (item, index) => item._id+index;

  const goBack = () => {
    props.navigation.goBack(null);
  };

  const renderHeader = () => {
    return (
      <>
        
        <View style={styles.bannerContainer}>
          <View style={stylesInline.bannerImageOverlay}></View>
          <Image style={stylesInline.bannerImage} source={{uri: selectedCategory.images[0].regular}} />
          
          <View style={{...styles.bar,position:"absolute",left:0}}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Image style={[styles.headerBackIcon]} source={require('../../assets/images/ypa/new-images/left-arrow-white.png')} />
              <Text style={[styles.title]}>Back</Text>
            </TouchableOpacity>
          </View>

          <View style={stylesInline.categoryTitleWrapper}>
            <Text style={stylesInline.categoryTitle} numberOfLines={2} ellipsizeMode='tail'>{selectedCategory.name}</Text>
            <Text style={stylesInline.categoryDesc} numberOfLines={6} ellipsizeMode='tail'>{selectedCategory.description}</Text>
          </View>
        </View>
      </>
    );
  };

  const renderEmptyContainer = () => {
    return(
      <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(20)}}>
        <Image style={stylesInline.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
        <Text style={stylesInline.noDataTitle}>No Insight Found</Text>
      </View>
    );
  };

  const renderInsight = (insight, index) => {
    return (
      <>
        <TouchableWithoutFeedback onPress={() => goToInsightDetails(insight)}>
          <View style={index % 2 == 0 ? stylesInline.workshopContentLeft : stylesInline.workshopContentRight}>
            <View style={{position:"relative"}}>

              { insight.en.images.length &&
                <Image style={stylesInline.workshopImage} source={{uri: insight.en.images[0].regular}} />
              }
              
            </View>
            <View style={stylesInline.workshopContentContainer}>
              <Text style={stylesInline.workshopTitle} numberOfLines={1} ellipsizeMode='tail'>{insight.en.name}</Text>
              <Text style={stylesInline.workshopDesc} numberOfLines={2} ellipsizeMode='tail'>{insight.en.short_description ? insight.en.short_description.replace('\n', '').replace('\r', '') : insight.en.description.replace('\n', '').replace('\r', '')}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
                <FontAwesomeIcon color={'#cbcbcb'} size={12} icon={faCalendarAlt} />
                <Text style={stylesInline.eventDateText}>{moment(insight.publish_date).format("MMM DD, YYYY")}</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </>
    );
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#ffffff', '#ffffff']} style={{...stylesInline.screen,flex: 1,justifyContent: 'center',alignItems: 'center',}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <ActivityIndicator size="large" color={'#007fff'} />
      </LinearGradient>
    );
  }

  return (



    <View style={{flex:1,backgroundColor:"#ffffff"}}>
      
     
        <View>
          <FlatList 
            style={{flex: 1,paddingBottom:responsiveHeight(5),minHeight:responsiveHeight(100)}}
            nestedScrollEnabled={true}
            contentContainerStyle={{paddingBottom: 10}}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{paddingHorizontal:responsiveWidth(3.2)}}
            numColumns={2}
            data={insightsUnderCat}
            keyExtractor={_keyExtractor}
            ListEmptyComponent={renderEmptyContainer()}
            ListHeaderComponent={renderHeader()}
            ListFooterComponent={isPaginating && <Pagination />}
            renderItem={({item, index, separators}) => {
              return renderInsight(item, index);
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
        </View>
        
        <View style={{minHeight:responsiveHeight(15)}}>

        </View>
        
      
      
      



      
    </View>












    // <LinearGradient colors={['#ffffff', '#ffffff']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>

    //   <View style={styles.backHeaderStyle}>
    //     <TouchableOpacity onPress={() => goBack()}>
    //       <View style={{ flexDirection: "row", alignItems: "center", height: responsiveHeight(9), paddingHorizontal: responsiveWidth(3),}}>
    //         <FontAwesomeIcon color={'#ffffff'} size={20} icon={faChevronLeft} />
    //         <Text style={styles.pageHeading}>Insights</Text>
    //       </View>
    //     </TouchableOpacity>
    //   </View>

      
    //   { selectedCategory && 
    //     <ImageBackground source={require('../../assets/images/ypa/homepage-bg.jpg')} imageStyle= 
    //     {{opacity:0.5}} resizeMode='cover' style={styles.mainbg}>
          
    //       <View style={{paddingHorizontal:responsiveWidth(3.2),paddingVertical:responsiveWidth(5)}}>
    //         <Text style={styles.selectedCategoryTitle} numberOfLines={2} ellipsizeMode='tail'>{selectedCategory.name}</Text>
    //         <View style={{marginTop:responsiveHeight(1.5)}}>
    //           <Text style={styles.selectedCategoryDesc} numberOfLines={3} ellipsizeMode='tail'>{selectedCategory.description}</Text>
    //         </View>
    //       </View>
          
    //     </ImageBackground>
       
    //     }




    //   <FlatList 
    //     style={{flex: 1,paddingBottom:responsiveHeight(5),}}
    //     nestedScrollEnabled={true}
    //     contentContainerStyle={{paddingBottom: 60}}
    //     showsVerticalScrollIndicator={false}
    //     numColumns={2}
    //     data={insights}
    //     keyExtractor={_keyExtractor}
    //     ListEmptyComponent={renderEmptyContainer()}
    //     ListHeaderComponent={renderHeader()}
    //     ListFooterComponent={isPaginating && <Pagination />}
    //     renderItem={({item, index, separators}) => {
    //       return renderEvent(item, index);
    //     }}
    //     refreshControl={
    //       <RefreshControl
    //         onRefresh={() => fetchData(true)}
    //         refreshing={isRefreshing}
    //         colors={['#007fff']}
    //         title="Pull to refresh"
    //         tintColor="#ffffff"
    //         titleColor="#ffffff"
    //       />
    //     }
    //     onEndReached={() => fetchData(false)}
    //     onEndReachedThreshold={0.5}
    //   />
    // </LinearGradient>
  );

}

const stylesInline = StyleSheet.create({
  mainbg: {
    width: responsiveWidth(100),
    height: responsiveHeight(18),
    resizeMode:"cover",
    marginBottom:responsiveHeight(1.5)
  },
  backHeaderStyle: {
    // backgroundColor: "transparent",
    backgroundColor: "#007fff",
    borderBottomWidth:1,
    borderColor:"#007fff",
    height: responsiveHeight(9),
    elevation: 0,
    shadowOpacity: 0,
    // position:"absolute",
    // top:0,
    width:responsiveWidth(100),
    // zIndex:9999

  },
  eventDateText: {
    fontSize: responsiveFontSize(1.5),
    color: "#333",
    fontFamily: "Poppins-Light",
    marginLeft: responsiveWidth(1.8),
    position: "relative",
    top: responsiveHeight(0.2)
  },
  secondaryPageHeading: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(3),
    color: "#ffffff"
  },
  pageHeading: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2.4),
    color: "#ffffff",
    position: "relative",
    top: 1,
    marginLeft: responsiveWidth(2)
  },
  noDataImage: {
    width: 75,
    resizeMode: "contain"
  },
  noDataTitle: {
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(2),
    color: "#222222",
    marginTop: 10
  },
  noDataSubTitle: {
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(2),
    color: "#888888",
    textAlign: "center"
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  secondaryHeaderStyle: {
    backgroundColor: "#2e80fe",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(3),
    height: responsiveHeight(9),
  },
  secondaryPageHeading: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(3),
    color: "#ffffff"
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
    justifyContent: "space-between"
  },
  singleFilter: {
    backgroundColor: "#ffffff",
    width: responsiveWidth(50),
    height: responsiveHeight(8),
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#ececec"
  },
  singleFilterText: {
    fontSize: responsiveFontSize(1.8),
    color: "#333",
    fontFamily: "Poppins-Light",
  },


  // WORSKHOPS
  workshopWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  workshopContent: {
    backgroundColor: "#ffffff",
    width: responsiveWidth(45.5),
    marginBottom: responsiveWidth(2.7),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    // paddingTop: responsiveWidth(2.5),
    // paddingBottom: responsiveWidth(2.7),
    // paddingHorizontal: responsiveWidth(2.5),
    borderRadius: 8
  },
  workshopContentLeft: {
    backgroundColor: "#fff",
    width: responsiveWidth(45.5),
    // marginLeft:responsiveWidth(3.2),
    borderRadius: 8, 
    borderWidth:1,
    borderColor:"#f1f1f1",
    marginTop:responsiveWidth(3.2)
  },
  workshopContentRight: {
    backgroundColor: "#fff",
    width: responsiveWidth(45.5),
    marginLeft: responsiveWidth(2.6),
    borderRadius: 8,
    borderWidth:1,
    borderColor:"#f1f1f1",
    marginTop:responsiveWidth(3.2)
  },
  blackBg:{
    position:"absolute",
    backgroundColor:"rgba(0, 0, 0, 0.5)",
    top:0,
    right:0,
    left:0,
    bottom:0,
    zIndex:2,
    alignItems:"center",
    justifyContent:"center"
  },
  playIcon:{
    position:"absolute",
    zIndex:2,
  },
  workshopImage: {
    width: "100%",
    resizeMode: "cover",
    height: responsiveHeight(15),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    // backgroundColor:"red"
  },
  bannerImage:{
    width: "100%",
    resizeMode: "cover",
    height: responsiveHeight(35),
  },
  bannerImageOverlay:{
    width: "100%",
    resizeMode: "cover",
    height: responsiveHeight(35),
    backgroundColor:"rgba(0,0,0,0.8)",
    position:"absolute",
    zIndex:1
  },
  categoryTitleWrapper:{
    position:"absolute",
    zIndex:1,
    bottom:responsiveHeight(1.6),
    left:responsiveWidth(3.5),
    right:responsiveWidth(4)
  },
  workshopContentContainer: {
    // alignItems: "center",
    // justifyContent: "center",
    paddingBottom: responsiveWidth(2.7),
    paddingHorizontal: responsiveWidth(2.5),
  },
  workshopTitle: {
    fontSize: responsiveFontSize(1.9),
    color: "#333",
    fontFamily: "Poppins-SemiBold",
    textAlign: "left",
    // backgroundColor:"red",
    marginTop: responsiveHeight(1.9),
    marginBottom: responsiveHeight(0.5),
  },
  workshopDesc: {
    fontSize: responsiveFontSize(1.8),
    color: "#333",
    fontFamily: "Poppins-Light",
    textAlign: "left",
    height:responsiveHeight(5),
    marginBottom: responsiveHeight(1.5),
    // backgroundColor:"red",
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
    fontFamily: "Poppins-Light",
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

  // Category
  categoryWrapper: {
    // width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    // backgroundColor:"red",
    // padding: responsiveWidth(3.2)
  },
  // JOBS
  jobWrapper: {
    // width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    
    // flexWrap: "wrap",
    // backgroundColor:"red",
    // padding: responsiveWidth(3.2)
  },
  categoryContent: {
    backgroundColor: "#ffffff",
    paddingVertical: responsiveWidth(2.5),
    paddingHorizontal: responsiveWidth(2.5),
    borderRadius: 8,
    borderWidth:1,
    borderColor:"#c1e1ff",
    marginRight:responsiveWidth(3)
  },
  categoryImage: {
    width: "100%",
    resizeMode: "cover",
    height: responsiveHeight(12),
    borderRadius:8
    // backgroundColor:"yellow"
  },
  selectedCategoryTitle:{
    fontSize: responsiveFontSize(2.2),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
  },
  selectedCategoryDesc:{
    fontSize: responsiveFontSize(1.8),
    color: "#ffffff",
    fontFamily: "Poppins-Light",
  },
  categoryTitle: {
    fontSize: responsiveFontSize(2.2),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
    marginBottom: responsiveHeight(1.5),
  },
  categoryDesc: {
    fontSize: responsiveFontSize(1.8),
    color: "#ffffff",
    fontFamily: "Poppins-Light",
    textAlign: "left",
    // marginBottom: responsiveHeight(1.5),
    // backgroundColor:"red",
    width: "100%"
  },
  categoryDateText: {
    fontSize: responsiveFontSize(1.5),
    color: "#222",
    fontFamily: "Poppins-Light",
    marginLeft: responsiveWidth(1.8),
    position: "relative",
    top: responsiveHeight(0.2)
  },


});
