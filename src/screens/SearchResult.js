import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import {  StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight,  Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation, SectionList } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import LinearGradient from 'react-native-linear-gradient';
import ScaledImage from 'react-native-scalable-image';
import { useScrollToTop } from '@react-navigation/native';

import Swiper from 'react-native-swiper'
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize,} from "react-native-responsive-dimensions";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faChevronRight, faClipboard, faClipboardList, faCog, faCogs, faCommentAlt, faHeart, faHouseUser, faQuestionCircle, faSearch, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
// import Swiper from 'react-native-swiper';
import moment from 'moment';
import RBSheet from "react-native-raw-bottom-sheet";
import Input from '../ui/Input';
import { debounce } from "lodash";
import Pagination from '../components/Pagination';

import { useSelector, useDispatch } from 'react-redux';
import globals from '../config/globals';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
import styles from './StyleSheet';

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

export default SearchResult = props => {

  const dispatch = useDispatch();
  
  const authUser = useSelector(state => state.auth.user);
  const searchFrom = props.route.params.from;
  const searchEntity = searchFrom == 'HomePage' ? 'OpportunitiesPage' : searchFrom;
  const [searchText, setSearchText] = React.useState('');
  const emptyData = [];
  const [suggestions, setSuggestions] = useState(emptyData);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noMoreContent, setNoMoreContent] = useState(false);
  const perPage = 1000;
  const [page, setPage] = useState(1);
  const refSearchText = useRef(null);

  useEffect(() => {
    if(refSearchText) {
      refSearchText.current.focus();
    }

  }, [dispatch]);

  

 

  const goBack = () => {
    props.navigation.goBack(null);
  };

  const goBackAndPerformSearch = searchText => {
    props.navigation.navigate(searchFrom, {
      searchText: searchText
    });
  };

  const goToDetails = item => {
    switch(searchEntity) {
      case 'OpportunitiesPage':
        props.navigation.push('OpportunityDetails', { job: item }); 
        break;
      case 'EventsScreen':
        props.navigation.push('EventDetails', { event: item }); 
        break;
      case 'EmployersPage':
        props.navigation.push('EmployerDetails', { company: item });
        break;
    }
    
  };


  const setSearchTextFetchData = useCallback(debounce(searchText => {
    if(searchText.length < 3) return false;
    setSuggestions(emptyData);
    setIsLoading(true);
    fetchData(searchText, true);

  }, 750), [dispatch]);

  const fetchData = async (searchText, refresh) => {
    setPage(async page => {
      let pageToFetch = await page;
      if(refresh) { //first load or pull to refresh
        pageToFetch = 1;
        setNoMoreContent(false);
        if(suggestions.length > 0) {
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
          q: searchText
        }
        let data = null;
        switch(searchEntity) {
          case 'OpportunitiesPage':
            data = await dispatch(commonActions.getJobSuggestions(params));
            break;
          case 'EventsScreen':
            data = await dispatch(commonActions.getEventSuggestions(params));
            break;
          case 'EmployersPage':
            data = await dispatch(commonActions.getCompanySuggestions(params));
            break;
          case 'EventMediaList':
            data = await dispatch(commonActions.getPastEventSuggestions(params));
            break;
        }
        console.log(data)
        
        if(data.entities) {
          data.entities = data.entities.map(entity => {
            return {...entity, company: entity.company_info };
          });
        }
        
        if(refresh) {
          if(data.entities.length == 0 && data.keywords.length == 0) {
            setSuggestions(emptyData);
          } else {
            setSuggestions([{title: 'entities', data: [...data.entities]}, {title: 'keywords', data: [...data.keywords]}]);
          }
        } else {
          setSuggestions(suggestions => {
            data.entities.forEach(item => suggestions[0].data.push(item));
            data.keywords.forEach(item => suggestions[1].data.push(item));
            return suggestions;
          });
        }
        if(data.length < perPage) {
          setNoMoreContent(true);
        } else {
          setNoMoreContent(false);
        }
      } catch(err) {
        console.log(err);
      } 
      setIsLoading(false);
      setIsPaginating(false);
      setIsRefreshing(false);
      return pageToFetch;
    });
  };

  const _keyExtractor = (item, index) => item._id+index;

  const renderEmptyContainer = () => {
    return(
      <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(20)}}>
        <Image style={stylesInline.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
        <Text style={stylesInline.noDataTitle}>Nothing found</Text>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <>
        
      </>
    );
  };

  const renderItem = item => { 
    return (
      <View style={stylesInline.singleSearchArea}>
        <TouchableOpacity onPress={() => {goToDetails(item);}}>
          
          {/* { item.company && item.company.length && item.company[0].color_images ? 
            <Image style={{...stylesInline.productImage, width:responsiveWidth(12), height:responsiveWidth(12)}} source={{uri: item.company[0].color_images[0].regular}} />
          : 
            <>
            { item.images && item.images.length ? 
              <Image style={{...stylesInline.productImage, width:responsiveWidth(12), height:responsiveWidth(12)}} source={{uri: item.images[0].regular}} />
            :
              <Image style={stylesInline.productImage} source={require('../../assets/images/ypa/footer-opportunities-active.png')} />
            }
            </>
          } */}

        </TouchableOpacity>
        <TouchableOpacity style={{}} onPress={() => {goToDetails(item);}}>
        <View style={{...stylesInline.searchContentContainer, width: responsiveWidth(94)}}>
          
            <View style={{width:responsiveWidth(94)}}>
              <ParsedText style={stylesInline.searchName} numberOfLines={1} ellipsizeMode='tail' parse={
              searchText == '' ? [] :
              [
                {pattern: new RegExp(searchText, 'gi'), style: stylesInline.searchNameBold},
              ]}>{item.en ? item.en.title : (item.title ? item.title : item.name)} 
              </ParsedText>
            </View>
          
        </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSuggestion = item => {
    return (
      <View style={stylesInline.singleSearchArea}>
        <Image style={stylesInline.productImageSmall} source={require('../../assets/images/ypa/grey-search.png')} />
        <View style={stylesInline.searchContentContainer}>

        <TouchableOpacity onPress={() => {/*setSearchText(item.keyword);setSearchTextFetchData(item.keyword);*/goBackAndPerformSearch(item.keyword);}}>
          <View style={{width:responsiveWidth(64)}}>
            <ParsedText style={stylesInline.searchName} numberOfLines={1} ellipsizeMode='tail' parse={
            searchText == '' ? [] :
            [
              {pattern: new RegExp(searchText, 'gi'), style: stylesInline.searchNameBold},
            ]}>{item.keyword}  
            </ParsedText>
          </View>
        </TouchableOpacity>
         


          <TouchableOpacity style={stylesInline.topLeftArrowContainer} onPress={() => {/*setSearchText(item.keyword);setSearchTextFetchData(item.keyword);*/goBackAndPerformSearch(item.keyword);}}>
            <Image style={stylesInline.topLeftArrow} source={require('../../assets/images/ypa/up-arrow-grey.png')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };


  return ( 
    <LinearGradient colors={['#ffffff', '#ffffff']} style={{flex: 1}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
    
      


        <View style={styles.mainHeader}>
          
          <View style={{width:responsiveWidth(10),height:responsiveHeight(7),justifyContent:"center"}}>
            <TouchableOpacity onPress={() => goBack()}>
              <Image style={[stylesInline.headerBackIcon,]} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.sideBySide}>
            <View style={stylesInline.searchContainer}>
              <TextInput
                ref={refSearchText}
                selectionColor={'#222222'}
                placeholder={searchEntity == 'OpportunitiesPage' ? 'Search Opportunity' : searchEntity == 'EventsScreen' ? 'Search Event' : searchEntity == 'EmployersPage' ? 'Search Employer' : "Type anything to search" }
                style={stylesInline.searchInput}
                placeholderTextColor="#222222" 
                required
                onChangeText={text => {setSearchText(text);setSearchTextFetchData(text);}}
                value={searchText}
              />

              <TouchableOpacity style={stylesInline.searchButtonEmptyContainer} onPress={() => {setSearchText('');}}>
                <Image style={stylesInline.searchEmptyButton} source={require('../../assets/images/ypa/close-circle-grey.png')} />
              </TouchableOpacity>

            </View>
          </View>
        </View>        

          
        { isLoading ?
          <LinearGradient colors={['transparent', 'transparent']} style={{...stylesInline.screen,paddingTop:responsiveHeight(20)}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
            <ActivityIndicator size="large" color={'#005bb6'} />
          </LinearGradient>
        :
        <>
          { searchText.length < 3 ? 
          
            <View style={{flex:1,alignItems:"center",justifyContent:"center", marginTop:responsiveHeight(0)}}>
              <Image style={stylesInline.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
              <Text style={stylesInline.noDataTitle}>Please enter search text</Text>
              <Text style={stylesInline.noDataSubTitle}>minimum 3 characters</Text>
            </View>

          :
 
            <SectionList
              style={{flex: 1,}}
              nestedScrollEnabled={true}
              contentContainerStyle={{paddingBottom: 60,}}
              showsVerticalScrollIndicator={false}
              sections={suggestions}
              renderSectionHeader={({ section: { title } }) => (
                <></>
              )}
              keyExtractor={_keyExtractor}
              ListEmptyComponent={renderEmptyContainer()}
              ListHeaderComponent={renderHeader()}
              ListFooterComponent={isPaginating && <Pagination />}
              renderItem={({item, index, separators}) => {
                if(!item.keyword) {
                  return renderItem(item);
                } else {
                  return renderSuggestion(item);
                }
              }}
              refreshControl={
                <RefreshControl
                  onRefresh={() => fetchData(searchText, true)}
                  refreshing={isRefreshing}
                  colors={['#007fff']}
                  title="Pull to refresh"
                  tintColor="#ffffff"
                  titleColor="#ffffff"
                />
              }
              // onEndReached={() => fetchData(searchText, false)}
              // onEndReachedThreshold={0.5}
            />

            }
          </>

        }
        
        


    
    </LinearGradient>
  );

}

const stylesInline = StyleSheet.create({
  pageHeading: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2.2),
    color: "#222",
    position: "relative",
    top: 1,
    marginLeft: responsiveWidth(2)
  },
  headerBackIcon:{
    height:responsiveHeight(2.3),
    width:responsiveHeight(2.3),
    resizeMode:"contain"
  },


  backHeaderStyle: {
    // backgroundColor: "transparent",
    backgroundColor: "#007fff",
    height: responsiveHeight(9),
    borderBottomWidth:1,
    borderColor:"#007fff",
    elevation: 0,
    shadowOpacity: 0,
    // borderBottomWidth: 0,
    position:"absolute",
    top:0,
    width:responsiveWidth(100),
    zIndex:9999

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
  parentWrapper:{
    flex:1,
    backgroundColor:"#0065cb",
  },
  scrollview:{
    height: '100%',
  },
  searchContainer:{
    backgroundColor:"#f1f1f1",
    paddingHorizontal:responsiveWidth(3),
    paddingVertical:1.5,
    borderRadius:6,
    flexDirection:"row",
    marginLeft:responsiveWidth(1)
  },
  searchInput:{
    fontSize:responsiveScreenFontSize(1.9),
    fontFamily:"Poppins-Light",
    paddingTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(0.6),
    // backgroundColor:"red",
    width:responsiveWidth(77),
    color:"#222"
  },
  searchButtonContainer:{
    position:"absolute",
    right:responsiveWidth(2),
    top:responsiveHeight(0.75)
  },
  searchButton:{
    height:responsiveWidth(7.5),
    width:responsiveWidth(7.5),
    resizeMode:"contain",
  },
  searchButtonEmptyContainer:{
    position:"absolute",
    right:responsiveWidth(2),
    top:responsiveHeight(1.3)
  },
  searchEmptyButton:{
    height:responsiveWidth(5.5),
    width:responsiveWidth(5.5),
    resizeMode:"contain",
  },
  backButton:{
    height:responsiveWidth(5),
    width:responsiveWidth(7),
    transform: [{ rotate: '180deg' }],
    marginRight:responsiveWidth(3)
  },




  fullSearchArea:{
    // backgroundColor:"#e7e7e7",
    height:"100%",
    paddingTop: responsiveHeight(9),
  },
  singleSearchArea:{
    flexDirection:"row",
    alignItems:"center",
    // backgroundColor:"red",
    paddingHorizontal:responsiveWidth(3),
    height:responsiveHeight(8)
  },
  productImage:{
    width:responsiveWidth(8),
    height:responsiveWidth(8),
    resizeMode:"contain",
    marginRight:responsiveWidth(3.5),
  },
  productImageSmall:{
    width:responsiveWidth(12),
    height:responsiveWidth(5),
    resizeMode:"contain",
    marginRight:responsiveWidth(3.5),
  },
  searchContentContainer:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    width:responsiveWidth(79),
    height:responsiveHeight(8),
    borderBottomWidth:1,
    borderBottomColor:"#f1f1f1",
  },
  searchName:{
    fontSize:responsiveScreenFontSize(1.9),
    fontFamily:"Poppins-Light",
    color:"#222"
  },
  searchNameBold:{
    fontSize:responsiveScreenFontSize(1.9),
    fontFamily:"Poppins-SemiBold",
    color:"#222"
  },
  searchCategoryName:{
    fontSize:responsiveScreenFontSize(1.3),
    fontFamily:"Poppins-Light",
    color:"#1444cc"
  },
  topLeftArrowContainer:{
    padding:responsiveWidth(2.5)
  },
  topLeftArrow:{
    height:responsiveWidth(4),
    width:responsiveWidth(4),
    transform: [{ rotate: '-45deg' }],
    marginLeft:responsiveWidth(3)
  },
  // No DATA CSS

  noDataImage:{
    width:responsiveWidth(20),
    resizeMode:"contain"
  },
  noDataTitle:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(2),
    color:"#222222",
    marginTop:responsiveHeight(0)
  },
  noDataSubTitle:{
    fontFamily:"Poppins-Light",
    fontSize:responsiveFontSize(2),
    color:"#222222",
    textAlign:"center"
  },
  
});
