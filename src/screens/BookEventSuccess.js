import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { StackActions } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize, } from "react-native-responsive-dimensions";
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCopy, faMapMarkerAlt,} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import * as commonActions from '../store/actions/common';

export default BookEventSuccess = props => {

  const dispatch = useDispatch();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [marginAnim] = useState(new Animated.Value(responsiveWidth(0)));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  React.useEffect(() => {
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }).start();
      Animated.timing(marginAnim, {
        toValue: -responsiveWidth(11),
        duration: 1500,
        useNativeDriver: false,
      }).start();
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }).start();
      goToHomePage();
    }, 500);
  }, []);

  const goToHomePage = () => {
    // setTimeout(() => {
    //   props.navigation.dispatch(StackActions.replace('AppNav'));
    // }, 2000);
    
  }

  const clickToCopy = () => {
    dispatch(commonActions.setSystemMessage('Ticket Id has been copied successfully'));
  }


  return (
    <LinearGradient colors={['#ebf1ff', '#ebf1ff']} style={styles.parentWrapper} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>

      {/* PAYMENT SUCCESS */}


      <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={styles.scrollview} contentContainerStyle={{ paddingBottom: 0 }}>
      <View style={{ backgroundColor: "transparent", alignItems: "center", justifyContent: "center", marginTop: responsiveHeight(0) }}>
        <View style={{ width: responsiveWidth(70), height: responsiveWidth(70),marginTop:-responsiveHeight(3) }}>
          <LottieView source={require('../../assets/images/ypa/welcome-check.json')} autoPlay loop={false} />
        </View>
        <Animated.View style={{ marginTop: marginAnim, transform: [{ scale: scaleAnim }], width:responsiveWidth(80) }}>
          <Text style={styles.title}>Congratulations!</Text>
          <Text style={{ ...styles.subTitle, marginTop: responsiveHeight(2) }}>2 Tickets have been booked for the following event</Text>
        </Animated.View>

          <View style={{backgroundColor:"#0065cb",padding:responsiveWidth(4),borderRadius:8,marginTop:responsiveHeight(3),width:responsiveWidth(92)}}>
            <Text style={styles.singleContentTitle}>The Job Search Accelerator Masterclass</Text>
            <View style={styles.calWrapper}>
              <LinearGradient colors={['#3281ff', '#0348b6']} style={styles.cal} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                <View style={{alignItems:"center",justifyContent:"center"}}>
                  <Text style={styles.calDate}>29</Text>
                  <Text style={styles.calDay}>Fri</Text>
                </View>
              </LinearGradient>
              <View>
                <Text style={styles.calMonth}>January, 2022</Text>
                <Text style={styles.calTime}>10:00-12:00 PM</Text>
              </View>
            </View>
            <View style={styles.singleJobOption}>
              <View style={{ marginRight: responsiveWidth(1.7),marginTop:responsiveHeight(0.6) }}>
                <FontAwesomeIcon color={'#ffffff'} size={16} icon={faMapMarkerAlt} />
              </View>
              
              <Text style={styles.singleJobOptionTitle}>Keyham, Leicester LE7 9JQ, UK and India together in not far</Text>
             
            </View>
          </View>

          <View style={{ width:responsiveWidth(92),marginTop:responsiveHeight(2)}}>
            <View style={{backgroundColor:"#0065cb",paddingHorizontal:responsiveWidth(4),paddingBottom:responsiveWidth(2),paddingTop:responsiveWidth(3),borderRadius:8,width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
              <View style={{}}>
                <Text style={styles.tBold}>Ticket Id</Text>
                <Text style={styles.tText}>T98UK8978B67YP0</Text>
              </View>
              <TouchableOpacity onPress={() => clickToCopy()}>
                <FontAwesomeIcon color={'#ffffff'} size={24} icon={faCopy} />
              </TouchableOpacity>
            </View>
            <View style={{paddingHorizontal:responsiveWidth(4),marginTop:responsiveHeight(2)}}>
              <Text style={styles.note}>Note: Booking confirmation email has been sent to your email address. If you face any issue kindly contact with us with your Ticket Id</Text>
            </View>
          </View>

          


       
      </View>
      </ScrollView>

      <View style={{...styles.companyButton}}>
        <TouchableOpacity style={styles.companyButtonInner}>
          <Text style={styles.companyButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      {/* PAYMENT SUCCESS ENDS*/}




      {/* PAYMENT FAILED */}

      {/* <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={styles.scrollview} contentContainerStyle={{ paddingBottom: 0 }}>
      <View style={{ backgroundColor: "transparent", alignItems: "center", justifyContent: "center", marginTop: responsiveHeight(0) }}>
        <View style={{ width: responsiveWidth(70), height: responsiveWidth(70),marginTop:-responsiveHeight(3) }}>
          <LottieView source={require('../../assets/images/ypa/payment-cancel.json')} autoPlay loop={false} />
        </View>
        <Animated.View style={{ marginTop: marginAnim, transform: [{ scale: scaleAnim }], width:responsiveWidth(80) }}>
          <Text style={{...styles.title, color:"#cc202e"}}>Oops!</Text>
          <Text style={{ ...styles.subTitle, marginTop: responsiveHeight(2), color:"#cc202e" }}>Payment failed for the following event. Please try again</Text>
        </Animated.View>

          <View style={{backgroundColor:"#ffffff",padding:responsiveWidth(4),borderRadius:8,marginTop:responsiveHeight(3),width:responsiveWidth(92)}}>
            <Text style={styles.singleContentTitle}>The Job Search Accelerator Masterclass</Text>
            <View style={styles.calWrapper}>
              <LinearGradient colors={['#3281ff', '#0348b6']} style={styles.cal} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                <View style={{alignItems:"center",justifyContent:"center"}}>
                  <Text style={styles.calDate}>29</Text>
                  <Text style={styles.calDay}>Fri</Text>
                </View>
              </LinearGradient>
              <View>
                <Text style={styles.calMonth}>January, 2022</Text>
                <Text style={styles.calTime}>10:00-12:00 PM</Text>
              </View>
            </View>
            <View style={styles.singleJobOption}>
              <View style={{ marginRight: responsiveWidth(1.7),marginTop:responsiveHeight(0.6) }}>
                <FontAwesomeIcon color={'#888888'} size={16} icon={faMapMarkerAlt} />
              </View>
              
              <Text style={styles.singleJobOptionTitle}>Keyham, Leicester LE7 9JQ, UK and India together in not far</Text>
             
            </View>
          </View>

          <View style={{ width:responsiveWidth(92),marginTop:responsiveHeight(2)}}>
            <View style={{paddingHorizontal:responsiveWidth(4),marginTop:responsiveHeight(2)}}>
              <Text style={styles.note}>Note: If your money has been deducted from your account, it will be revert back to you within 24 hrs. If you face any issue kindly contact with us.</Text>
            </View>
          </View>

          


       
      </View>
      </ScrollView>

      <View style={{...styles.companyButton}}>
        <TouchableOpacity style={styles.companyButtonInner}>
          <Text style={styles.companyButtonText}>View Events</Text>
        </TouchableOpacity>
      </View> */}

      {/* PAYMENT FAILED ENDS*/}
      
      
      
    </LinearGradient>
  );

}

const styles = StyleSheet.create({
  companyButton: {
    position:"absolute",
    bottom:0,
    left:0,
    right:0,
    backgroundColor: "#007fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal:responsiveHeight(2.5),
    height: responsiveHeight(7),
  },
  companyButtonInner: {
    height: responsiveHeight(7),
    width:responsiveWidth(100),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  companyButtonText: {
    fontSize: responsiveFontSize(2.5),
    color: "#ffffff",
    fontFamily: "FuturaLT-Bold",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  tBold:{
    fontSize: responsiveFontSize(1.8),
    color: "#ffffff",
    fontFamily: "FuturaLT",
  },
  tText:{
    fontSize: responsiveFontSize(2.2),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
  },
  note:{
    fontSize: responsiveFontSize(1.4),
    color: "#666666",
    fontFamily: "FuturaLT",
  },
  singleJobOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingRight:responsiveWidth(4)
  },
  singleJobOptionTitle: {
    fontSize: responsiveFontSize(1.6),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
  },
  singleContentTitle: {
    fontSize: responsiveFontSize(2),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
    marginBottom: responsiveWidth(3.5),
  },
  calWrapper:{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveWidth(3.8),
  },
  cal:{
    marginRight:responsiveWidth(3),
    height:responsiveHeight(7),
    width:responsiveHeight(7),
    borderRadius:6,
    alignItems: "center",
    justifyContent:"center"
  },
  calDate:{
    fontSize: responsiveFontSize(2.3),
    color: "#ffffff",
    fontFamily: "FuturaLT-Bold",
  },
  calDay:{
    fontSize: responsiveFontSize(1.9),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
    lineHeight:responsiveFontSize(2.0),
  },
  calMonth:{
    fontSize: responsiveFontSize(2),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
  },
  calTime:{
    fontSize: responsiveFontSize(1.6),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
  },

  parentWrapper: {
    flex: 1,
    backgroundColor: "#ffffff",
    position:"relative"
  },
  scrollview: {
    height: '100%',
  },
  title: {
    color: "#222222",
    fontFamily: "FuturaLT-Bold",
    fontSize: responsiveFontSize(3),
    textAlign: "center"
  },
  subTitle: {
    color: "#222222",
    fontFamily: "FuturaLT-Book",
    fontSize: responsiveFontSize(1.9),
    textAlign: "center"
  },
  boldTitle: {
    color: "#222222",
    fontFamily: "FuturaLT-Bold",
    fontSize: responsiveFontSize(2.5),
    textAlign: "center"
  }
});
