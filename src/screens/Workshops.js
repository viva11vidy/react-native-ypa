import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight, Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, PermissionsAndroid, LayoutAnimation } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenFontSize, } from "react-native-responsive-dimensions";
import CheckBox from '@react-native-community/checkbox';
import RadioButton from 'radio-button-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faSearch, faSortAmountDown, faClock } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../components/Pagination';
import RBSheet from "react-native-raw-bottom-sheet";
import LinearGradient from 'react-native-linear-gradient';
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

export default WorkshopsScreen = props => { 

  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  const courses = useSelector(state => state.common.courses);


  const sortSheetRef = useRef(null);
  const filterSheetRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("sector");
  const [jobSector, setJobSector] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [sortBy, setSortBy] = useState('created:-1');
  const [filterChange, setFilterChange] = useState(false);
  

  

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
        if(courses.length > 0) {
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
        let data = await dispatch(commonActions.getCourses(params));
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

  const applySort = sort => {
    setSortBy(sort);
    setFilterChange(state => !state);
  };
  const applyJobSector = jobsector => {
    setJobSector(jobsector);
  };

  const applyJobCompany = jobcompany => {
    setJobCompany(jobcompany);
  };

  const selectJobSector = jobsector => {
    // jobSectors.push(jobsector);
    // jobSectorSheetRef.current.close();
    // setSelectedJobSector(jobSectors);
    console.log(jobsector);
  };

  const goToWorkshopDetails = workshop => {
    props.navigation.push('WorkshopDetails', {workshop: workshop});
  };

  const _keyExtractor = (item, index) => item._id+index;

  const renderHeader = () => {
    return (
      <>
        <View style={{...styles.bottomFeaturedBorder,borderBottomColor:"transparent",}}>
          <View style={{...styles.filterHeader, marginVertical:responsiveHeight(2)}}>
            <TouchableOpacity onPress={() => filterSheetRef.current.open()}>
              <View style={styles.fButton}>
                <Text style={styles.fButtonTitle}>Filter</Text>
                <Image style={styles.fButtonImage} source={require('../../assets/images/ypa/new-images/filter-blue.png')} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sortSheetRef.current.open()}>
              <View style={{...styles.fButton, width:responsiveWidth(27),}}>
                <Text style={styles.fButtonTitle}>Sort By</Text>
                <Image style={styles.fButtonImage} source={require('../../assets/images/ypa/new-images/sort-blue.png')} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  const renderEmptyContainer = () => {
    return(
      <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(20)}}>
        <Image style={stylesInline.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
        <Text style={stylesInline.noDataTitle}>No Workshop Found</Text>
      </View>
    );
  };

  const renderCourse = (course, index) => {
    return (
      <>
        <TouchableOpacity onPress={() => goToWorkshopDetails(course)}>
          <View style={index % 2 == 0 ? stylesInline.workshopContentLeft : stylesInline.workshopContentRight}>
            <Image style={stylesInline.workshopImage} source={{uri: course.images[0].regular}} />
            <View style={stylesInline.workshopContentContainer}>
              <Text style={stylesInline.workshopTitle} numberOfLines={1} ellipsizeMode='tail'>{course.name}</Text>
              <Text style={stylesInline.workshopDesc} numberOfLines={3} ellipsizeMode='tail'>{course.description.replace('\n', '').replace('\r', '')}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#ffffff', '#eef6ff']} style={{...stylesInline.screen,flex: 1,justifyContent: 'center',alignItems: 'center',}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <ActivityIndicator size="large" color={'#006eff'} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#ffffff', '#eef6ff']} style={stylesInline.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>

      <View style={stylesInline.secondaryHeaderStyle}>
        <Text style={stylesInline.secondaryPageHeading}>Workshops</Text>
        <View style={{ flexDirection: "row", alignItems: "center", }}>
          
          <TouchableOpacity onPress={() => { authUser ? props.navigation.navigate('SearchResult') : dispatch(commonActions.setSignupPopup(1)) }}>
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
      <RBSheet
        ref={filterSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={responsiveHeight(76)}
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
              <Text style={styles.sheetTitle}>Filter Jobs</Text>
              <TouchableOpacity onPress={() => filterSheetRef.current.close()}>
                <Image style={styles.rbsheetClose} source={require('../../assets/images/ypa/new-images/close-blue.png')} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{height:responsiveHeight(55),flexDirection:"row"}}>

              
              <View style={styles.leftFilter}>
                <TouchableOpacity onPress={() => setActiveFilter('sector')}>
                  <View style={activeFilter == 'sector' ? styles.leftSingleFilterActive : styles.leftSingleFilter}>
                    <Text style={activeFilter == 'sector' ? styles.leftSingleFilterTextActive : styles.leftSingleFilterText}>Sector</Text>
                    {(activeFilter == 'sector') &&
                      <View style={styles.leftSingleFilterViewActive}></View>
                    }
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveFilter('companies')}>
                  <View style={activeFilter == 'companies' ? styles.leftSingleFilterActive : styles.leftSingleFilter}>
                    <Text style={activeFilter == 'companies' ? styles.leftSingleFilterTextActive : styles.leftSingleFilterText}>Companies</Text>
                    {(activeFilter == 'companies') &&
                      <View style={styles.leftSingleFilterViewActive}></View>
                    }
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.rightFilter}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:responsiveHeight(8)}}>

                  {/* Sector */}
                  {activeFilter == 'sector' &&
                  <View>
                    <TouchableOpacity style={styles.singleSheetOption} onPress={() => applyJobSector('')}>
                      <View style={styles.radioButtonPosition}>
                        <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={jobSector} value={''} onPress={() => applyJobSector('')} />
                      </View>
                      <Text style={styles.singleSheetText}>View All</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.singleSheetOption} onPress={() => applyJobSector('Accounting')}>
                      <View style={styles.radioButtonPosition}>
                        <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={jobSector} value={'Accounting'} onPress={() => applyJobSector('Accounting')} />
                      </View>
                      <Text style={styles.singleSheetText}>Accounting</Text>
                    </TouchableOpacity>
                  </View>
                  }

                  {/* Companies */}
                  {activeFilter == 'companies' &&
                  <View>
                    <TouchableOpacity style={styles.singleSheetOption} onPress={() => applyJobCompany('')}>
                      <View style={styles.radioButtonPosition}>
                        <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={jobCompany} value={''} onPress={() => applyJobCompany('')} />
                      </View>
                      <Text style={styles.singleSheetText}>View All</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.singleSheetOption} onPress={() => applyJobCompany('Amazon')}>
                      <View style={styles.radioButtonPosition}>
                        <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={jobCompany} value={'Amazon'} onPress={() => applyJobCompany('Amazon')} />
                      </View>
                      <Text style={styles.singleSheetText}>Amazon</Text>
                    </TouchableOpacity>
                  </View>
                  }
                </ScrollView>
              </View>
              

              

              <View style={{ height: responsiveHeight(8) }}></View>

            </ScrollView>

            <Shadow style={{width:responsiveWidth(100)}} distance={5} startColor={'#0000000d'} >
              <View style={styles.filterFooter}>
                <TouchableOpacity onPress={() => sortSheetRef.current.close()}>
                  <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.applyFilterButton}>
                    <Text style={styles.applyFilterButtonText}>APPLY FILTER</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Shadow>

          </View>
      </RBSheet>  


      {/* SORT BY SHEET */}
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
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => applySort('recent')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={sortBy} value={'recent'} onPress={() => applySort('recent')} />
                  </View>
                  <Text style={styles.singleSheetText}>Recently Added</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => applySort('atoz')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={sortBy} value={'atoz'} onPress={() => applySort('atoz')} />
                  </View>
                  <Text style={styles.singleSheetText}>Name: A to Z</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.singleSheetOption} onPress={() => applySort('ztoa')}>
                  <View style={styles.radioButtonPosition}>
                    <RadioButton outerCircleColor={"#0057b0"} outerCircleSize={18} outerCircleWidth={2} innerCircleColor={'#0057b0'} innerCircleSize={9} currentValue={sortBy} value={'ztoa'} onPress={() => applySort('ztoa')} />
                  </View>
                  <Text style={styles.singleSheetText}>Name: Z to A</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>


          </View>
      </RBSheet>

      <FlatList 
        style={{flex: 1,}}
        nestedScrollEnabled={true}
        contentContainerStyle={{paddingBottom: 60,}}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{paddingHorizontal: responsiveWidth(3.2)}}
        numColumns={2}
        data={courses}
        keyExtractor={_keyExtractor}
        ListEmptyComponent={renderEmptyContainer()}
        ListHeaderComponent={renderHeader()}
        ListFooterComponent={isPaginating && <Pagination />}
        renderItem={({item, index, separators}) => {
          return renderCourse(item, index);
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

      
    </LinearGradient>
  );

}

const stylesInline = StyleSheet.create({
  noDataImage: {
    width: 100,
    resizeMode: "contain"
  },
  noDataTitle: {
    fontFamily: "FuturaLT",
    fontSize: responsiveFontSize(2.5),
    color: "#ffffff",
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
    backgroundColor: "#ffffff",
    borderBottomWidth:1,
    borderColor:"#f1f1f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(3),
    height: responsiveHeight(9),
  },
  secondaryPageHeading: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(3),
    color: "#222222"
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
    borderBottomWidth: 1,
    borderColor: "#f1f1f1"
  },
  singleFilter: {
    backgroundColor: "#ffffff",
    width: responsiveWidth(50),
    height: responsiveHeight(8),
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#f1f1f1"
  },
  singleFilterText: {
    fontSize: responsiveFontSize(1.8),
    color: "#222222",
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
    backgroundColor: "#ffffff",
    width: responsiveWidth(45.5),
    marginBottom: responsiveWidth(2.7),
    borderColor:"#f1f1f1",
    borderWidth:1,
    marginTop:responsiveHeight(0),
    // alignItems: "center",
    // justifyContent: "center",
    overflow: "hidden",
    // paddingTop: responsiveWidth(2.5),
    // paddingBottom: responsiveWidth(2.7),
    // paddingHorizontal: responsiveWidth(2.5),
    borderRadius: 8
  },
  workshopContentRight: {
    backgroundColor: "#ffffff",
    width: responsiveWidth(45.5),
    marginLeft: responsiveWidth(2.6),
    marginBottom: responsiveWidth(2.7),
    borderColor:"#f1f1f1",
    borderWidth:1,
    marginTop:responsiveHeight(0),
    // alignItems: "center",
    // justifyContent: "center",
    overflow: "hidden",
    // paddingTop: responsiveWidth(2.5),
    // paddingBottom: responsiveWidth(2.7),
    // paddingHorizontal: responsiveWidth(2.5),
    borderRadius: 8
  },

  workshopImage: {
    width: "100%",
    resizeMode: "cover",
    height: responsiveHeight(15),
    // backgroundColor:"red"
  },
  workshopContentContainer: {
    // alignItems: "center",
    // justifyContent: "center",
    paddingBottom: responsiveWidth(2.7),
    paddingHorizontal: responsiveWidth(2.5),
  },
  workshopTitle: {
    fontSize: responsiveFontSize(1.9),
    color: "#222222",
    fontFamily: "Poppins-SemiBold",
    textAlign: "left",
    // backgroundColor:"red",
    marginTop: responsiveHeight(1.9),
    marginBottom: responsiveHeight(0.5),
  },
  workshopDesc: {
    fontSize: responsiveFontSize(1.7),
    color: "#222222",
    fontFamily: "Poppins-Light",
    textAlign: "left",
    height:responsiveHeight(8),
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

  searchIcon:{
    width: responsiveHeight(3.4),
    width: responsiveHeight(3.4),
    resizeMode: 'contain',
  },

});
