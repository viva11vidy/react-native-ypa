import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import {  StyleSheet, Text, View, ImageBackground, Image, Button, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, TouchableHighlight, TouchableWithoutFeedback, Keyboard, Modal, ActivityIndicator, FlatList, RefreshControl, LayoutAnimation  } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenWidth} from "react-native-responsive-dimensions";
import moment from 'moment';
import Pagination from '../components/Pagination';
import { Shadow } from 'react-native-shadow-2';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSortAmountDown, faClock, faSuitcase, faPoundSign, faMapMarkerAlt,faTimesCircle, faTrashAlt, faTrash, faCheckCircle, faBookmark, faBriefcase, faMoneyBill, faMoneyBillAlt, faMoneyBillWave, faMoneyBillWaveAlt, faInfoCircle, faCalendar, faCalendarAlt  } from '@fortawesome/free-solid-svg-icons';

import { useSelector, useDispatch } from 'react-redux';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
import styles from './StyleSheet';

export default Notifications = props => {

  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  const unreadNotifications = useSelector(state => state.auth.unreadNotifications);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginating, setIsPaginating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noMoreContent, setNoMoreContent] = useState(false);
  const perPage = 100;
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSingleVisible, setModalSingleVisible] = useState('');
  const updatedData = props.route.params && props.route.params.update;  //console.log(updatedData);

  useEffect(() => {
    if(updatedData) {
      setNotifications(notifications => {
        notifications.forEach(element => {
          if(element.dependent_obj[0]._id == updatedData._id) {
            element.dependent_obj[0].talentspot_application[0].response = updatedData.response;
          }
        });
        return [...notifications];
      });
      
    }
  }, [updatedData]);

  const setAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      update: {
        type: LayoutAnimation.Types.easeIn,
        springDamping: 0.7,
      },
    });
    LayoutAnimation.configureNext({
      duration: 500,
      create: {
        type: LayoutAnimation.Types.easeIn,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
      },
    });
  };

  useEffect(() => {
    fetchData(true);
  }, [dispatch]);

  const fetchData = refresh => {
    
    setPage(async page => {
      let pageToFetch = await page;
      if(refresh) { //first load or pull to refresh
        pageToFetch = 1;
        setNoMoreContent(false);
        if(notifications.length > 0) {
          setIsRefreshing(true);
        }
      } else { //pagination
        if(noMoreContent) return pageToFetch; 
        pageToFetch = pageToFetch + 1;
        setIsPaginating(true);
      }
      
      try {
        let data = await dispatch(authActions.getNotifications(perPage, pageToFetch)); 
        data.forEach(element => {
          let dependentObject = JSON.parse(element.dependent);
          element.entityValue = dependentObject.entity;
          
        });
        // console.log(data.map(el => el?._id));
        if(refresh) {
          setNotifications([...data]);
        } else {
          data.forEach(notification => notifications.push(notification));
          setNotifications([...notifications]);
        }
        if(data.length < perPage) {
          setNoMoreContent(true);
        } else {
          setNoMoreContent(false);
        }
      } catch(err) {
  
      }
      setIsLoading(false);
      setIsPaginating(false);
      setIsRefreshing(false);
      return pageToFetch;
    });
  }

  const _keyExtractor = (item, index) => item._id+index;

  const removeAllNotifications = async nid => {
    try {
      await dispatch(authActions.removeAllNotifications(nid));
      setAnimation();
      setNotifications([]);
      dispatch(authActions.setUnreadNotifications(0));

    } catch(err) {
      commonActions.setSystemMessage('Unknown error occured');
    }
  };

  const removeNotification = async nid => {
    try {
      await dispatch(authActions.removeNotification(nid));
      let index = notifications.findIndex(el => el._id == nid);
      if(!notifications[index].read && unreadNotifications > 0) {
        dispatch(authActions.setUnreadNotifications(unreadNotifications-1));
      }
      notifications.splice(index, 1);
      setAnimation();
      setNotifications([...notifications]);
      

    } catch(err) {
      commonActions.setSystemMessage('Unknown error occured');
    }
  };

  const readNotification = async nid => {
    try {
      await dispatch(authActions.readNotification(nid));
      let index = notifications.findIndex(el => el._id == nid);
      notifications[index] = {...notifications[index], read: true};
      setAnimation();
      setNotifications([...notifications]);
      if(unreadNotifications > 0) {
      dispatch(authActions.setUnreadNotifications(unreadNotifications-1));
      }
    } catch(err) {
      commonActions.setSystemMessage('Unknown error occured');
    }
  };

  const goToNotification = (notification) => {
    console.log(notification);
    if(!notification.read) {
      readNotification(notification._id);
    }
    try {
      
      if(notification.dependent) {
        let dependent = JSON.parse(notification.dependent);
        if(dependent.entity == 'Job' && notification.dependent_obj.length) {
          props.navigation.navigate('OpportunityDetails', {job: {_id:notification.dependent_obj[0]}});
        }
        if(dependent.entity == 'Event' && notification.dependent_obj.length) {
          props.navigation.navigate('EventDetails', {event: notification.dependent_obj[0]});
        }
        if(dependent.entity == 'Talentspot') {
          props.navigation.navigate('NotificationDetail', { 
            notification: {
              _id: dependent._id, 
              data: notification.dependent_obj && notification.dependent_obj.length ? notification.dependent_obj[0] : null,
            } 
          });
        }

      } else if(notification.notitype == 'app-exclusive') {
        props.navigation.navigate('NotificationDetail', { notification: notification });
      }
      
    } catch(err) {}

  };

  const goBack = () => {
    props.navigation.goBack(null);
  };
  const demo = () => {
    console.log('demo function clicked');
  };

  const renderEmptyContainer = () => {
    return(
      <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(25)}}>
        <Image style={styles.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
        <Text style={styles.noDataTitle}>Nothing Found</Text>
        {/* <Text style={styles.noDataSubTitle}>It seens like you haven't started follwing anyone</Text> */}
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <>
      <View>
 
        <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => null} >
          <View style={styles.centeredView}>
            <LinearGradient colors={['#ffffff', '#ffffff']} style={{...styles.mainAreaPopup,paddingTop:responsiveHeight(2),}} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
              <View style={styles.mainTitleWrapper}>
                <View style={{}}>
                  <Text style={styles.mainTitlePopup}>Are you sure ?</Text>
                </View>
                <Text style={styles.mainTitlePopupLight}>You want to clear all notifications</Text>
              </View>
              <View style={styles.popupBtnWraper}>
                <TouchableOpacity onPress={() => {setModalVisible(false);}}>
                  <LinearGradient colors={['#ddd', '#ddd']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.applyFilterButtonCancel}>
                    <Text style={styles.applyFilterButtonCancelText}>Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {setModalVisible(false);removeAllNotifications();}}>
                  <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.applyFilterButton, width:responsiveWidth(26),}}>
                    <Text style={styles.applyFilterButtonText}>Delete</Text>
                  </LinearGradient>
                </TouchableOpacity>


                
              </View>
            </LinearGradient>


          </View>
        
        
      
        </Modal>

        <Modal animationType="fade" transparent={true} visible={modalSingleVisible != ''} onRequestClose={() => null} >
          <View style={styles.centeredView}>
           
            <LinearGradient colors={['#ffffff', '#ffffff']} style={{...styles.mainAreaPopup,paddingTop:responsiveHeight(2),}} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
              <View style={styles.mainTitleWrapper}>
                <View style={{}}>
                  <Text style={styles.mainTitlePopup}>Are you sure ?</Text>
                </View>
                <Text style={styles.mainTitlePopupLight}>You want to clear this notification</Text>
              </View>
              <View style={styles.popupBtnWraper}>
                <TouchableOpacity onPress={() => {setModalSingleVisible(false);}}>
                  <LinearGradient colors={['#ddd', '#ddd']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.applyFilterButtonCancel}>
                    <Text style={styles.applyFilterButtonCancelText}>Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setTimeout(() => { setModalSingleVisible(false); }, 250);removeNotification(modalSingleVisible); }}>
                  <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.applyFilterButton, width:responsiveWidth(26),}}>
                    <Text style={styles.applyFilterButtonText}>Delete</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>


          </View>
        </Modal>
        
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent:"center",paddingHorizontal:responsiveWidth(4),marginBottom:responsiveHeight(5)}}>
        { notifications.length > 0 &&
          <TouchableOpacity  onPress={() => {setModalVisible(true);}}>
            <View style={{...styles.fButton, width:responsiveWidth(26),height:responsiveHeight(5)}}>
              
              <FontAwesomeIcon color={'#0059b6'} size={13} icon={faTrashAlt} />
              
              <Text style={{...styles.fButtonTitle, fontSize: responsiveFontSize(1.8),lineHeight:responsiveHeight(2.5),}}>Clear All</Text> 
            </View>
          </TouchableOpacity>
        }
        </View>
        
      </View>
      </>
    );
  };

  const renderItem = item => {
    return (
      <TouchableOpacity onPress={() => goToNotification(item)}>
        <View style={{paddingHorizontal:responsiveWidth(3)}}>

        
          <View style={{...styles.singleTalentSpot, ...(!item.read ? {borderColor: '#63a3e9'} : {})}}>
            <View style={styles.singleJobTop}>
              <View style={styles.singleJobTitleWrapper}>
                { item.dependent_obj && item.dependent_obj.length > 0 && 
                  <Text numberOfLines={2} style={{...styles.singleJobTitle,width:responsiveWidth(65)}}>{item.dependent_obj[0].title}</Text> 
                }
                {item.dependent_obj && item.dependent_obj.length > 0 && item.dependent_obj[0].company && item.dependent_obj[0].company.length > 0 && (item.dependent_obj[0].company[0].color_images.length || item.dependent_obj[0].company[0].images.length) > 0 &&
                <View style={styles.singleJobImageWrapper}>
                  <Image style={styles.singleJobImage} source={{uri: (item.dependent_obj[0].company[0].color_images[0].regular || item.dependent_obj[0].company[0].images[0].regular)}} />
                </View>
                }
              </View>
              
              <Text style={styles.singleJobSubTitle} numberOfLines={1}>{item.dependent_obj[0].company[0].name}</Text>

              <View style={styles.sideBySide}>
                <Text style={styles.singleJobSubTitle}>{item.notification}</Text>
              </View>

              
              { item.dependent_obj.length > 0 && item.dependent_obj[0].talentspot_application  && item.dependent_obj[0].talentspot_application.length > 0 && item.dependent_obj[0].talentspot_application[0].response == 'Accepted' &&
                <View style={{...styles.sideBySide, marginVertical:responsiveHeight(1)}}>
                  <View style={{marginRight:responsiveWidth(2),top:-responsiveHeight(0.1)}}>
                    <FontAwesomeIcon color={'green'} size={15} icon={faCheckCircle} />
                  </View>
                  <Text style={styles.bottomAreaTextGreen}>Accepted</Text>
                </View>
              }

              { item.dependent_obj.length > 0 && item.dependent_obj[0].talentspot_application && item.dependent_obj[0].talentspot_application.length > 0 && item.dependent_obj[0].talentspot_application[0].response == 'Rejected' &&
                <View style={{...styles.sideBySide, marginVertical:responsiveHeight(1)}}>
                  <View style={{marginRight:responsiveWidth(2),top:-responsiveHeight(0.1)}}>
                    <FontAwesomeIcon color={'red'} size={15} icon={faTimesCircle} />
                  </View>
                  <Text style={styles.bottomAreaTextRed}>Rejected</Text>
                </View>
              }

              {/* {(item.dependent_obj[0].salary)  &&
                <View style={{...styles.sideBySide, marginVertical:responsiveHeight(1)}}>
                  <View style={{marginRight:responsiveWidth(2),top:-responsiveHeight(0.1)}}>
                    <FontAwesomeIcon color={'grey'} size={15} icon={faInfoCircle} />
                  </View>
                  <Text style={{...styles.bottomAreaTextRed, color:"grey"}}>Job</Text>
                </View>
              }

              {item.dependent_obj[0].event_date &&
                <View style={{...styles.sideBySide, marginVertical:responsiveHeight(1)}}>
                  <View style={{marginRight:responsiveWidth(2),top:-responsiveHeight(0.1)}}>
                    <FontAwesomeIcon color={'grey'} size={15} icon={faInfoCircle} />
                  </View>
                  <Text style={{...styles.bottomAreaTextRed, color:"grey"}}>Event</Text>
                </View>
              } */}
              

            </View>
            
            <LinearGradient colors={['#f0f0f0', '#f0f0f0']} style={{...styles.singleJobFooter}} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>

              <View style={styles.sideBySide}>
                <View style={styles.sideBySide}>
                  <FontAwesomeIcon color={'#444444'} size={13} icon={faCalendarAlt} />
                  <Text style={{...styles.singleJobFooterText, marginLeft:responsiveWidth(2),color:"#444444"}}>{moment(item.created).format("DD.MM.YYYY")}</Text>
                </View>
                {item.entityValue == 'Job' &&
                  <View style={styles.sideBySide}>
                    <FontAwesomeIcon color={'#444444'} size={13} icon={faInfoCircle} />
                    <Text style={{...styles.singleJobFooterText, marginLeft:responsiveWidth(2),color:"#444444"}}>Job</Text>
                  </View>
                }
                {item.entityValue == 'Event' &&
                  <View style={styles.sideBySide}>
                    <FontAwesomeIcon color={'#444444'} size={13} icon={faInfoCircle} />
                    <Text style={{...styles.singleJobFooterText, marginLeft:responsiveWidth(2),color:"#444444"}}>Event</Text>
                  </View>
                }
              </View>
              
              <View style={styles.sideBySide}>
                <TouchableOpacity  onPress={() => {setModalSingleVisible(item._id);}}>

                  <View style={styles.sideBySide}>
                    <Text style={{...styles.singleJobFooterText, marginRight:responsiveWidth(2),color:"#a91f1f"}}>Delete</Text>
                    <FontAwesomeIcon color={'#a91f1f'} size={14} icon={faTimesCircle} />
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
          
        </View>
      </TouchableOpacity>
    );
  };

  if(isLoading) {
    return (
      <LinearGradient colors={['#ebf1ff', '#ebf1ff']} style={{...styles.screen,flex: 1,justifyContent: 'center',alignItems: 'center',}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <ActivityIndicator size="large" color={'#007fff'} />
      </LinearGradient>
    );
  }

  return (
    //  <FlatList 
    //     style={{ flex: 1,backgroundColor:"#ffffff"}}
    //     scrollEnabled={!isSwiping}
    //     nestedScrollEnabled={true}
    //     data={notifications}
    //     keyExtractor={_keyExtractor}
    //     ListHeaderComponent={renderHeader()}
    //     ListFooterComponent={isPaginating && <Pagination />}
    //     renderItem={({item, index, separators}) => {
    //       return renderItem(item);
    //     }}
    //     refreshControl={
    //       <RefreshControl
    //         onRefresh={() => fetchData(true)}
    //         refreshing={isRefreshing}
    //         colors={['#ffc100']}
    //         title="Pull to refresh"
    //         tintColor="#1198cd"
    //         titleColor="#1198cd"
    //       />
    //     }
    //     onEndReached={() => fetchData(false)}
    //     onEndReachedThreshold={0.5}
    //   /> 
    <LinearGradient colors={['#ffffff', '#ffffff']} style={{ flex: 1,backgroundColor:"#ffffff"}}>
      {/* <Shadow style={{width:responsiveWidth(100),zIndex:1000}} distance={5} startColor={'#0000000d'} > */}
        <View style={styles.mainHeader}>
          <View>
            <View style={styles.sideBySide}>
              <Text style={styles.pageName}>Talent Spot</Text>
            </View>
          </View>
          <View style={styles.sideBySide}>
            <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
              <LinearGradient colors={['#3895fc', '#005ba6']} style={styles.menuButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.menuLongLine}></View>
                <View style={styles.menuMediumLine}></View>
                <View style={styles.menuSmallLine}></View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      {/* </Shadow> */}
      <FlatList 
        style={{paddingTop:responsiveWidth(4)}}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        data={notifications}
        keyExtractor={_keyExtractor}
        ListEmptyComponent={renderEmptyContainer()}
        ListFooterComponent={renderHeader()}
        renderItem={({item, index, separators}) => {
          return renderItem(item);
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

// const styles = StyleSheet.create({

//   rowFront: {
//     alignItems: 'center',
//     backgroundColor: '#CCC',
//     borderBottomColor: 'black',
//     borderBottomWidth: 1,
//     justifyContent: 'center',
//     height: 50,
//   },
//   rowBack: {
//     alignItems: 'center',
//     backgroundColor: '#DDD',
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingLeft: 15,
//   },
//   screen: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   backContainer:{
//     height:responsiveWidth(10),
//     width:responsiveWidth(10),
//     backgroundColor:"#ffffff",  
//     paddingHorizontal:responsiveWidth(3),
//     paddingVertical:responsiveHeight(3),
//   },
//   backButton:{
//     height:responsiveWidth(6),
//     width:responsiveWidth(8),
//     transform: [{ rotate: '180deg' }]
//   },
//   headingContainer:{
//     flexDirection:"row",
//     alignItems:"center",
//     justifyContent:"space-between",
//   },
//   pageHeading:{
//     fontFamily:"FuturaLT-Bold",
//     fontSize:responsiveFontSize(2.4),
//     color:"#333333"
//   },
//   pageSubHeading:{
//     fontFamily:"FuturaLT-Book",
//     fontSize:responsiveFontSize(1.6),
//     color:"#ffffff"
//   },
//   singleOption:{
    
//     // backgroundColor:"#013b75",
//     backgroundColor:"#0065cb",
    
//     width:responsiveWidth(94),
//     marginLeft:responsiveWidth(3.2),
//     marginBottom:responsiveHeight(2),
//     borderRadius:9,
//     // overflow:"hidden"
//     // marginBottom:10,
//     elevation:5,
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowColor: 'black',
//     shadowOpacity: 0.4,
//     shadowRadius: 5,
//   },
//   topAreaTS:{
//     flexDirection:"row",
//     alignItems:"center",
//     justifyContent:"space-between",
//     backgroundColor:"#007fff",
//     padding:responsiveWidth(3),
//     paddingVertical:responsiveWidth(2)
//   },
//   topAreaTSText:{
//     fontFamily:"FuturaLT-Book",
//     fontSize:responsiveFontSize(1.6),
//     color:"#ffffff"
//   },
//   backOrangeContainer:{
//     height:responsiveHeight(10),
//     flexDirection:"row",justifyContent:"flex-end"
//   },
//   userImage:{
//     height:responsiveHeight(7),
//     width:responsiveHeight(7),
//     borderRadius:100,
//     resizeMode:"contain"
//   },
//   companyImageContainer:{
//     height:responsiveHeight(10),
//     width:responsiveHeight(9),
//     // backgroundColor:"red",
//     alignItems:"flex-start",
//     justifyContent:"flex-start"
//   },
//   companyImage:{
//     height:responsiveHeight(7),
//     width:responsiveHeight(9),
//     resizeMode:"contain"
//   },
//   pagetitle:{
//     fontFamily:"FuturaLT-Bold",
//     fontSize:responsiveFontSize(2),
//     color:"#ffffff",
//   },
//   pagetitleLight:{
//     fontFamily:"FuturaLT",
//     fontSize:responsiveFontSize(1.8),
//     color:"#ffffff",
//   },
//   pageSubTitle:{
//     fontFamily:"FuturaLT-Book",
//     fontSize:responsiveFontSize(1.4),
//     color:"#ffffff",
//   },
//   deleteButtonContainer:{
//     backgroundColor:"#eb7d1e",
//     height: "100%",
//     justifyContent:"center",
//     width:75,
//     // paddingLeft:25,
//     flexDirection:"row",
//     alignItems:"center"
//     // alignItems: 'center',
//     // backgroundColor: '#DDD',
//     // flex: 1,
//     // flexDirection: 'row',
//     // justifyContent: 'space-between',
//     // paddingLeft: 15,
//   },
//   deleteImage:{
//     height: responsiveWidth(7),
//     width: responsiveWidth(5),
//     resizeMode:"contain",
//   },


//   // MODAL VIEW
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: 'rgba(0,0,0,0.65)',
//   },
//   modalView: {
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: responsiveHeight(4),
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5
//   },
//   openButton: {
//     backgroundColor: "#F194FF",
//     borderRadius: 10,
//     paddingTop: responsiveHeight(1),
//     paddingBottom: responsiveHeight(0.5),
//     paddingHorizontal: responsiveWidth(4),
//     // elevation: 2,
//     marginHorizontal:responsiveWidth(2)
//   },
//   textStyleCancel:{
//     fontFamily:"FuturaLT",
//     fontSize:responsiveFontSize(1.8),
//     color:"#888888",
//     textAlign: "center"
//   },
//   textStyle: {
//     fontFamily:"FuturaLT",
//     fontSize:responsiveFontSize(1.8),
//     color:"#222222",
//     textAlign: "center"
//   },
//   modalTextMain: {
//     fontFamily:"Poppins-SemiBold",
//     fontSize:responsiveFontSize(1.9),
//     color:"#333"
//   },
//   modalTextSub: {
//     fontFamily:"FuturaLT",
//     fontSize:responsiveFontSize(1.7),
//     color:"#666666",
//     marginBottom: responsiveHeight(1.8),
//     textAlign: "center"
//   },
//   // MODAL VIEW

//    // No DATA CSS

//    noDataImage:{
//     width:100,
//     resizeMode:"contain"
//   },
//   noDataTitle:{
//     fontFamily:"FuturaLT",
//     fontSize:responsiveFontSize(2.5),
//     color:"#000000",
//     marginTop:10
//   },
//   noDataSubTitle:{
//     fontFamily:"FuturaLT-Book",
//     fontSize:responsiveFontSize(2),
//     color:"#888888",
//     textAlign:"center"
//   },

//   secondaryHeaderStyle: {
//     backgroundColor: "#007fff",
//     borderBottomWidth:1,
//     borderColor:"#007fff",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: responsiveWidth(3),
//     height: responsiveHeight(8),
//     marginBottom:responsiveHeight(2.6),
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
//     fontFamily: "FuturaLT-Bold",
//     fontSize: responsiveFontSize(3),
//     color: "#ffffff"
//   },
//   headerIcon: {
//     marginHorizontal: responsiveWidth(3.5),
//   },




//   // POPUP
//   applyPopup:{
//     position:"absolute",
//     top:0,
//     bottom:0,
//     right:0,
//     left:0,
//     zIndex:99999,
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.65)",
//     alignItems:"center",
//     justifyContent:"center",
//     padding:responsiveWidth(9)
//   },


//   mainAreaPopup:{
//     backgroundColor:"#007fff",
//     alignItems:"center",
//     justifyContent:"center",
//     position:"relative",
//     alignSelf:"center",
//     padding:responsiveWidth(4),
//     borderRadius:10,
//     paddingTop:responsiveHeight(5.5),
//     width:responsiveWidth(90)
//   },
//   popupImageWrapper:{
//     backgroundColor:"#007fff",
//     position:"absolute",
//     top:-responsiveHeight(5),
//     padding:responsiveHeight(1.6),
//     borderRadius:50
//   },
//   popupImage:{
//     height:responsiveHeight(7),
//     width:responsiveHeight(7),
//     resizeMode:"contain"
//   },
//   mainTitleWrapper:{
//     flexWrap:"wrap",
//     alignItems:"center",
//     justifyContent:"center"
//   },
//   mainTitlePopup:{
//     fontFamily: "FuturaLT-Bold",
//     textAlign:"center",
//     fontSize:responsiveFontSize(2.2),
//     color:"#ffffff"
//   },
//   mainTitlePopupLight:{
//     fontFamily: "FuturaLT",
//     textAlign:"center",
//     fontSize:responsiveFontSize(2.2),
//     color:"#ffffff"
//   },
//   mainTitlePopupBold:{
//     fontFamily: "FuturaLT-Bold",
//     textAlign:"center",
//     color:"#ffffff",
//     fontSize:responsiveFontSize(2.2)
//   },
//   popupBtnWraper:{
//     flexDirection:"row",
//     flexWrap:"wrap",
//     alignItems:"center",
//     justifyContent:"center",
//     marginTop:responsiveHeight(3)
//   },
//   // cancelBtn:{
//   //   backgroundColor: "#dcdcdc",
//   //   marginRight: responsiveWidth(3),
//   //   borderRadius:6,
//   //   paddingVertical:responsiveHeight(1.4),
//   //   width:responsiveWidth(26)
//   // },
//   // cancelBtnText:{
//   //   fontFamily: "FuturaLT-Book",
//   //   textAlign:"center",
//   //   fontSize:responsiveFontSize(1.8),
//   //   color: "#333",
//   // },
//   // applyBtn:{
//   //   backgroundColor: "#0066ca",
//   //   marginRight: responsiveWidth(2),
//   //   borderRadius:6,
//   //   paddingVertical:responsiveHeight(1.4),
//   //   width:responsiveWidth(26)
//   // },
//   // applyBtnText:{
//   //   fontFamily: "FuturaLT-Book",
//   //   textAlign:"center",
//   //   fontSize:responsiveFontSize(1.8),
//   //   color: "#ffffff",
//   // },



//   applyBtn:{
//     backgroundColor:"#ffffff",
//     // borderRadius:7,
//     alignItems:"center",
//     justifyContent:"center",
//     padding:responsiveHeight(1.5),
//   },
//   applyBtnText:{
//     fontSize: responsiveFontSize(2),
//     color: "#011c38",
//     fontFamily: "FuturaLT-Bold",
//     textTransform: 'uppercase',
//     textShadowColor: 'rgba(57, 158, 255, 0.4)',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 8,
//   },

//   cancelBtn:{
//     backgroundColor:"#0065cb",
//     alignItems:"center",
//     justifyContent:"center",
//     padding:responsiveHeight(1.5),
//     marginRight: responsiveWidth(3),
//   },
//   cancelBtnText:{
//     fontSize: responsiveFontSize(2),
//     color: "#ffffff",
//     fontFamily: "FuturaLT-Bold",
//     textTransform: 'uppercase',
//     textShadowColor: 'rgba(57, 158, 255, 1)',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 8,
//   },




//   bottomAreaTextGreen:{
//     fontSize: responsiveFontSize(1.6),
//     color: "#49d900",
//     fontFamily: "FuturaLT",
//   },
//   bottomAreaTextRed:{
//     fontSize: responsiveFontSize(1.6),
//     color: "#ff2212",
//     fontFamily: "FuturaLT",
//   }

// });
