import React, { useState, useEffect, useReducer, useCallback, useRef, useMemo } from 'react';
import {  StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Dimensions, PermissionsAndroid, Platform, Linking, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faChevronLeft, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';

import { useSelector, useDispatch } from 'react-redux';
import * as commonActions from '../store/actions/common';
import * as authActions from '../store/actions/auth';
import styles from './StyleSheet';
import { Shadow } from 'react-native-shadow-2';


export default NotficationDetail = props => {

  const dispatch = useDispatch();
  const [notification, setNotification] = useState(props.route.params && props.route.params.notification); 
  const [initialData, setInitialData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);

  useEffect(() => {
    if(notification && !notification.data) {
      fetchData();
    } else {
      setInitialData(true);
      setIsLoading(false);
    }
  }, [dispatch]);

  const fetchData = async () => {
    try {
      let data = await dispatch(commonActions.getTalentSpots({id: notification._id}));
      if(data.length) {
        let application = await dispatch(authActions.getMyTalentSpots({tspid: notification._id}));
        // console.log(application.length);
        if(application.length) {
          // console.log('rg');
          data[0].talentspot_application = application;
        }
        // console.log(data[0]);
        setNotification(notification => {
          return {...notification, data: data[0]};
        });
      }
      setIsLoading(false);
    } catch (error) { 
      // console.log(error);
    }
    
  };

  const responseToTalentSpot = async (tsid, response) => {
    try {
      let params = {
        tsid: tsid,
        response: response,
      };
      let data = await dispatch(authActions.responseToTalentSpot(params));

      setNotification(notification => {
        notification.data.talentspot_application[0].response = response;
        return {...notification};
      });
      if(response == 'Accepted') {
        setModalVisible(true);
      }
    } catch(err) {
      console.log(err);
      commonActions.setSystemMessage('Unknown error occured');
    }
  };
 
  const goBack = () => {
    if(initialData && notification.data && notification.data.talentspot_application && notification.data.talentspot_application.length) {
      props.navigation.navigate('Notifications', { update: {id: notification.data._id, response: notification.data.talentspot_application[0].response }});
    } else {
      props.navigation.goBack();
    }
    
  };

  if(isLoading) {
    return (
      <LinearGradient colors={['#ebf1ff', '#ebf1ff']} style={{...styles.screen,flex: 1,justifyContent: 'center',alignItems: 'center',}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <ActivityIndicator size="large" color={'#007fff'} />
      </LinearGradient>
    );
  }

  if(!isLoading && !notification.data) {
    return (
      <View style={{flex:1,alignItems:"center",justifyContent:"center",marginTop:responsiveHeight(20)}}>
        <Image style={styles.noDataImage} source={require('../../assets/images/ypa/empty-search.png')} />
        <Text style={styles.noDataTitle}>Nothing Found</Text>
        {/* <Text style={styles.noDataSubTitle}>It seens like you haven't started follwing anyone</Text> */}
      </View>
    );
  }

  return(<>

    <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => null} >
      <View style={styles.centeredView}>
        <LinearGradient colors={['#ffffff', '#ffffff']} style={styles.mainAreaPopup} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
          <View style={styles.mainTitleWrapper}>
            <View style={{}}>
              <Text style={styles.mainTitlePopup}>Request Accepted</Text>
            </View>
            <Text style={styles.mainTitlePopupLight}>Thank you, we will contact you soon for next step.</Text>
          </View>
          <View style={styles.popupBtnWraper}>
            <TouchableOpacity onPress={() => {setModalVisible(false);}}>
              <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.applyFilterButton, width:responsiveWidth(26),}}>
                <Text style={styles.applyFilterButtonText}>Close</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>



    <Modal animationType="fade" transparent={true} visible={modal2Visible} onRequestClose={() => null} >
      <View style={styles.centeredView}>
        <LinearGradient colors={['#ffffff', '#ffffff']} style={styles.mainAreaPopup} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
          <View style={styles.mainTitleWrapper}>
            <View style={{}}>
              <Text style={styles.mainTitlePopup}>Are you sure ?</Text>
            </View>
            <Text style={styles.mainTitlePopupLight}>You are about to reject Talent Spot Invitation.</Text>
          </View>
          <View style={styles.popupBtnWraper}>
            <TouchableOpacity onPress={() => {setModal2Visible(false);}}>
              <LinearGradient colors={['#ddd', '#ddd']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.applyFilterButtonCancel}>
                <Text style={styles.applyFilterButtonCancelText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { responseToTalentSpot(notification.data.talentspot_application[0]._id, 'Rejected'); setModal2Visible(false); }}>
              <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.applyFilterButton, width:responsiveWidth(26),}}>
                <Text style={styles.applyFilterButtonText}>Confirm</Text>
              </LinearGradient>
            </TouchableOpacity>


            
          </View>
        </LinearGradient>


      </View>
    </Modal>
    

    <LinearGradient colors={['#ffffff', '#dfefff']} style={{flex:1}} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
      
      <View style={{...styles.mainHeader,borderBottomColor:"#ffffff",backgroundColor:"transparent"}}>
        <TouchableOpacity onPress={() => goBack()}>
          <View style={styles.sideBySide}>
            <Image style={[styles.headerBackIcon,]} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />
            <Text style={{...styles.pageSubName, paddingLeft:responsiveWidth(6)}}>Back</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: responsiveWidth(3.2),paddingBottom:0,justifyContent:"space-between"}}>
        <View>
            { notification.data.company && notification.data.company.length > 0 && notification.data.company[0].images.length > 0 &&
              <View style={styles.notificationDetailImageWrapper}>
                <Image style={styles.notificationDetailImage} source={{uri: notification.data.company[0].color_images[0].regular}} />
              </View>
            }
            <Text style={{...styles.singleJobTitle, fontSize: responsiveFontSize(2.4),}}>{notification.data.title}</Text>
            <Text style={{...styles.singleJobSubTitle, fontSize: responsiveFontSize(2),}}>{notification.data.description}</Text>
        </View>
      </ScrollView>

        
      { notification.data.talentspot_application && notification.data.talentspot_application.length > 0 && notification.data.talentspot_application[0].response == 'Not Responded' && 
        <View style={{marginBottom: responsiveWidth(3.2),flexDirection:"row",justifyContent:"center"}}> 
          <TouchableOpacity onPress={() => responseToTalentSpot(notification.data.talentspot_application[0]._id, 'Accepted') } style={styles.whiteFullButtonTouchable}>
          <LinearGradient colors={['#3399fe', '#0057b0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.applyFilterButton, width:responsiveWidth(35),}}>
              <Text style={styles.applyFilterButtonText}>Accept</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModal2Visible(true)} style={{marginLeft:responsiveWidth(3)}}>
            <LinearGradient colors={['#df4545', '#a91f1f']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{...styles.applyFilterButton, width:responsiveWidth(35),}}>
              <Text style={styles.applyFilterButtonText}>Reject</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      }
      
      { notification.data.talentspot_application && notification.data.talentspot_application.length > 0 && notification.data.talentspot_application[0].response == 'Accepted' &&
        <View style={styles.notificationDetailBottomArea}>
          <View style={{marginRight:responsiveWidth(2)}}>
            <FontAwesomeIcon color={'#0c8929'} size={20} icon={faCheckCircle} />
          </View>
          <Text style={styles.notificationDetailBottomAreaText}>Accepted</Text>
        </View>
      }

      { notification.data.talentspot_application && notification.data.talentspot_application.length > 0 && notification.data.talentspot_application[0].response == 'Rejected' &&
        <View style={styles.notificationDetailBottomArea}>
          <View style={{marginRight:responsiveWidth(2)}}>
            <FontAwesomeIcon color={'red'} size={20} icon={faTimesCircle} />
          </View>
          <Text style={styles.notificationDetailBottomAreaText}>Rejected</Text>
        </View>
      }
      
      {/* { true && <View>
        <TouchableOpacity onPress={() => responseToTalentSpot(notification.data.talentspot_application[0]._id, 'Accepted') }><Text>Accept</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setModal2Visible(true)}><Text>Reject</Text></TouchableOpacity>
      </View> } */} 

      

    </LinearGradient>
  </>);
}

// const styles = StyleSheet.create({
//   bottomArea:{
//     padding: responsiveWidth(3.2),
//     paddingTop:responsiveHeight(2),
//     paddingBottom:responsiveHeight(2.5),
//     flexDirection:"row",
//     alignItems:"center",
//     justifyContent:"center",
//     borderTopWidth:1,
//     borderColor:"#afd7ff",
//     marginHorizontal:-responsiveWidth(3.2)
//   },
//   bottomAreaText:{
//     fontFamily: "FuturaLT",
//     fontSize: responsiveFontSize(2.2),
//     color: "#222222",
//   },
//   noInternetImage:{
//     height: responsiveHeight(18),
//     width:responsiveWidth(30),
//     //backgroundColor:"red"
//   },
//   makeProfileButton:{
//     marginRight:'auto',
//     marginLeft:'auto',
//     marginTop:0,
//     paddingTop:11,
//     paddingBottom:11,
//     backgroundColor:'#23395B',
//     borderRadius: 28,
//     borderWidth: 1,
//     borderColor: '#707070',
//     width: responsiveWidth(45),
//   },
//   makeProfileButtonText:{
//     color:'#fff',
//     textAlign:'center',
//     paddingLeft : 0,
//     paddingRight : 0,
//     fontSize: responsiveFontSize(2.8),
//     fontWeight: '700',
//     //fontStyle: 'italic',
//   },
//   container: {
//     // height: '100%',
//     backgroundColor:"#ebf1ff", 
//     flex: 1, 
//     position: 'relative',
//     //alignItems:"center",
//     //justifyContent:"center",
//   },
  
  
//   imgBackground: {
//     width: '100%',
//     height: '100%',
//     flex: 1,
//     resizeMode: 'stretch',
//     textAlign: 'center',
    
//   },
  
//   popupContainer:{
//     backgroundColor:"#ffffff",
//     width: "77%",
//     borderWidth:1,
//     borderRadius:18,
//     borderColor:"#1761a0"
//   },
//   headingView:{
//     borderBottomWidth:1,
//     borderColor:"#1761a0"
//   },
//   headingText:{
//     fontSize: responsiveFontSize(2.5),
//     color: "#000000",
//     fontFamily: "FuturaLT-Bold",
//     marginTop: responsiveHeight(2),
//     marginBottom: responsiveHeight(2)
//   },
//   headingTextDesc:{
//     fontSize: responsiveFontSize(1.9),
//     color: "#000000",
//     fontFamily: "FuturaLT",
//     marginBottom: responsiveHeight(3)
//   },
//   messageView:{
//     paddingVertical:10,
//     paddingHorizontal:15,
//     paddingBottom:0,
//     maxHeight:150,
//     color:"#1761a0"
//   },
//   messageText:{
//     fontWeight:"700",
//     fontSize:responsiveFontSize(2.3),
//     marginBottom: 15,
//     color:"#1761a0"
//   },
//   buttonView:{
//     borderTopWidth:1,
//     borderColor:"#1761a0",
//   },
//   buttonText:{
//     textAlign:"center",
//     fontWeight:"700",
//     fontSize:responsiveFontSize(3.3),
//     paddingTop:8,
//     paddingBottom:10,
//     color:"#1761a0"
//   },
//   companyImageContainer:{
//     height:responsiveHeight(7),
//     width:responsiveHeight(7),
//     borderRadius:100,
//     //backgroundColor:"red",
//     alignItems:"center",
//     justifyContent:"center"
//   },
//   companyImage:{
//     height:responsiveHeight(6),
//     width:responsiveHeight(6),
//     resizeMode:"contain"
//   },

//   // MODAL VIEW
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: 'rgba(0,0,0,0.7)',
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
//     fontFamily:"FuturaLT-Book",
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
//     color:"#ffffff",
//     marginTop:10
//   },
//   noDataSubTitle:{
//     fontFamily:"FuturaLT-Book",
//     fontSize:responsiveFontSize(2),
//     color:"#888888",
//     textAlign:"center"
//   },

//   singleContent: {
//     backgroundColor: "#0065cb",
//     width: "100%",
//     marginBottom: responsiveHeight(0),
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: responsiveWidth(4),
//     paddingBottom: responsiveWidth(4),
//     paddingHorizontal: responsiveWidth(4),
//     borderRadius: 8,
//     elevation: 0.5
//   },
//   contentImage: {
//     width: "100%",
//     resizeMode: "contain",
//     height: responsiveHeight(20),
//     // backgroundColor:"red"
//   },

//   whiteFullButton:{
//     backgroundColor:"#ffffff",
//     // borderRadius:7,
//     alignItems:"center",
//     justifyContent:"center",
//     padding:responsiveHeight(1.5),
//   },
//   whiteFullButtonText:{
//     fontSize: responsiveFontSize(2.5),
//     color: "#0065cb",
//     fontFamily: "FuturaLT-Bold",
//     textTransform: 'uppercase',
//     textShadowColor: 'rgba(57, 158, 255, 0.4)',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 8,
//   },

//   blueFullButtonTouchable:{
//     width:"100%",
//   },
//   blueFullButton:{
//     backgroundColor:"#0065cb",
//     alignItems:"center",
//     justifyContent:"center",
//     padding:responsiveHeight(1.5),
//   },
//   blueFullButtonText:{
//     fontSize: responsiveFontSize(2.5),
//     color: "#ffffff",
//     fontFamily: "FuturaLT-Bold",
//     textTransform: 'uppercase',
//     textShadowColor: 'rgba(57, 158, 255, 1)',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 8,
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
//   cancelBtn:{
//     backgroundColor:"#012344",
//     alignItems:"center",
//     justifyContent:"center",
//     padding:responsiveHeight(1.5),
//     marginRight: responsiveWidth(3),
//     paddingHorizontal:responsiveWidth(6)
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
//   applyBtn:{
//     backgroundColor:"#ffffff",
//     // borderRadius:7,
//     alignItems:"center",
//     justifyContent:"center",
//     padding:responsiveHeight(1.5),
//     paddingHorizontal:responsiveWidth(6)
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



  
// });
