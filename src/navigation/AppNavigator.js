import React from 'react';

import { View, Text, Button, LogoTitle, Image, StyleSheet, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { responsiveHeight, responsiveWidth, responsiveFontSize, responsiveScreenWidth, responsiveScreenFontSize } from "react-native-responsive-dimensions";
import { navigationRef } from './NavigationService';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faSearch, faSortAmountDown, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Shadow } from 'react-native-shadow-2';
// import LOGOSVG from '../../assets/images/LOGOSVG.svg';

import { useSelector, useDispatch } from 'react-redux';
import * as commonActions from '../store/actions/common';

import StartupScreen from '../screens/StartupScreen';
import AfterSplash from '../screens/AfterSplash';
import FirstScreen from '../screens/FirstScreen';
import SignUp from '../screens/SignUp';
import SignUpAdditional from '../screens/SignUpAdditional';
import Welcome from '../screens/Welcome';
// import SignUpFinished from '../screens/SignUpFinished';
import Login from '../screens/Login';
import ForgetPassword from '../screens/ForgetPassword';
import Input from '../ui/Input';


import HomeScreen from '../screens/HomeScreen';
import EmployersScreen from '../screens/EmployersScreen';
import EmployerDetails from '../screens/EmployerDetails';
import EventTypesScreen from '../screens/EventTypes';
import EventsScreen from '../screens/Events';
import EventDetails from '../screens/EventDetails';
import EventInPersonDetails from '../screens/EventInPersonDetails';
import Opportunities from '../screens/Jobs';
import OpportunityDetails from '../screens/JobDetails';
import WorkshopsScreen from '../screens/Workshops';
import WorkshopDetails from '../screens/WorkshopDetails';
import WorkshopStarts from '../screens/WorkshopStarts';
import WebPage from '../screens/WebPage';
import SectorDetails from '../screens/SectorDetails';

import BookEvents from '../screens/BookEvents';
import BookEventDetails from '../screens/BookEventDetails';
import BookEventSuccess from '../screens/BookEventSuccess';
import ProfileScreen from '../screens/Profile';
import SearchResult from '../screens/SearchResult';
import MyWorkshops from '../screens/MyWorkshops';
import MyCertificates from '../screens/MyCertificates';
import AppliedJobs from '../screens/AppliedJobs';
import ChangePassword from '../screens/ChangePassword';
import EditProfile from '../screens/EditProfile';
import SubjectAdd from '../screens/SubjectAdd';

import EventMediaList from '../screens/EventMediaList';
import EventMediaDetail from '../screens/EventMediaDetail';
import Insights from '../screens/Insights';
import InsightsCategories from '../screens/InsightsCategories';
import InsightDetails from '../screens/InsightDetails';
import Notifications from '../screens/Notifications';
import NotificationDetail from '../screens/NotificationDetail';
import SubscriptionTaken from '../screens/SubscriptionTaken';
import SubscriptionNotTaken from '../screens/SubscriptionNotTaken';
import SubscriptionSuccess from '../screens/SubscriptionSuccess';


// import FAQ from '../screens/FAQ';
import ContactUs from '../screens/ContactUs';
import ContactUsForm from '../screens/ContactUsForm';
import DynamicPage from '../screens/DynamicPage';



// import ChangePassword from '../screens/ChangePassword';
// import Notifications from '../screens/Notifications';
// import NotificationDetail from '../screens/NotificationDetail';
import NoInternetScreen from '../screens/NoInternet';

import { DrawerComponent } from '../components/DrawerComponent';
import { BottomTabComponent } from '../components/BottomTabComponent';


const rootScreenOption = ({ navigation }) => {

  const dispatch = useDispatch();
  const unreadNotifications = useSelector(state => state.auth.unreadNotifications);
  const authUser = useSelector(state => state.auth.user);

  return {
    headerStyle: {
      backgroundColor: "#007fff",
      height: responsiveHeight(9),
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowColor: 'black',
      shadowOpacity: 0.2,
      shadowRadius: 3.84,
      elevation: 15,
    },
    headerTintColor: "white",
    headerBackTitle: "Back",
    title: null,
    headerLeft: () => (
      <Image style={styles.logo} source={require('../../assets/images/ypa/white-ypa-logo.png')} />
    ),
    //To hide back button in stack navigator
    headerTitle: null,
    headerRight: () => (
      // <Shadow distance={25} startColor={'#00000010'} endColor={'transparent'} offset={[0, 0]}>
        <View style={{ flexDirection: "row", alignItems: "center", }}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => { authUser ? navigation.navigate('SearchResult', {from: 'OpportunitiesPage'}) : dispatch(commonActions.setSignupPopup(1)) }}>
            {/* <FontAwesomeIcon color={'#ffffff'} size={26} icon={faSearch} /> */}
            <Image style={styles.searchIcon} source={require('../../assets/images/ypa/magnify.png')} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.toggleDrawer()}>
            <FontAwesomeIcon color={'#ffffff'} size={30} icon={faBars} />
          </TouchableOpacity> */}
        </View>
      // </Shadow>
    ),
  };
};

const secondaryScreenOption = ({ navigation }) => {
  return {
    headerStyle: styles.secondaryHeaderStyle,
    headerTintColor: "white",
    headerBackTitle: "Back",
    headerLeft: null,
    headerTitle: ({ children }) => (
      <View style={{ flexDirection: "row", width: responsiveWidth(100), alignItems: "center", }}>
        <Text style={styles.secondaryPageHeading}>{children}</Text>
      </View>
    ),
    headerRight: () => (
      <View style={{ flexDirection: "row", alignItems: "center", }}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => { authUser ? navigation.navigate('SearchResult', {from: 'HomePage'}) : dispatch(commonActions.setSignupPopup(1)) }}>
          <FontAwesomeIcon color={'#ffffff'} size={26} icon={faSearch} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.toggleDrawer()}>
          <FontAwesomeIcon color={'#ffffff'} size={30} icon={faSortAmountDown} />
        </TouchableOpacity>
      </View>
    ),
  };
};
 
const backScreenOption = ({ navigation }) => {
  return {
    headerStyle: styles.backHeaderStyle,
    headerTintColor: "white",
    headerBackTitle: "Back",
    headerLeft: ({ children }) => (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={styles.backHeaderStyleInner}>

          {/* <FontAwesomeIcon color={'#ffffff'} size={20} icon={faChevronLeft} /> */}
          <Image style={[styles.headerBackIcon,]} source={require('../../assets/images/ypa/new-images/left-arrow-black.png')} />

          {/* <Text style={styles.pageHeading}>{children}</Text> */}
          <Text style={styles.pageHeading}>Back</Text>
        </View>
      </TouchableOpacity>
    ),
    title:null,
    headerTitle: null,
    headerRight: null,
  };
};

const RootStack = createStackNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const AuthNavStack = () => { 
  return (
    <Stack.Navigator>
      <Stack.Screen name="FirstScreen" component={FirstScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="SignUpAdditional" component={SignUpAdditional} options={{ headerShown: false }} />
      <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
      {/* <Stack.Screen name="SignUpFinished" component={SignUpFinished} options={{ headerShown: false }} /> */}
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const AppNavStack = (routeName) => {
  return (
    <Stack.Navigator screenOptions={backScreenOption} initialRouteName={routeName}>
      {/* <Stack.Screen name="HomePage" component={HomeScreen} options={rootScreenOption} /> */}
      <Stack.Screen name="HomePage" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OpportunitiesPage" component={Opportunities} options={{ headerShown: false }} />
      <Stack.Screen name="EmployersPage" component={EmployersScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EventsPage" component={EventsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProfilePage" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WorkshopsPage" component={WorkshopsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WorkshopDetails" component={WorkshopDetails} options={{ headerShown: false }} />
      <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }}/>
      <RootStack.Screen name="Insights" component={Insights} options={{ headerShown: false }} />
      <RootStack.Screen name="AppliedJobs" component={AppliedJobs} options={{ headerShown: false }}/>
      <RootStack.Screen name="EventsScreen" component={EventsScreen} options={{ headerShown: false }}/>
      <RootStack.Screen name="EventMediaList" component={EventMediaList} options={{ headerShown: false }} />
      {/* <Stack.Screen name="FAQ" component={FAQ}/> */}
    </Stack.Navigator>
  );
};

const HomeTab = () => {

  return (
    <Tab.Navigator tabBar={props => <BottomTabComponent {...props} />}>
      <>

        <Tab.Screen name="Home" options={{ image: require('../../assets/images/ypa/footer-home-inactive-2.png'), imageActive: require('../../assets/images/ypa/footer-home.png'), headerShown: false }} >
          {() => AppNavStack("HomePage")}
        </Tab.Screen>

        <Tab.Screen name="Events" options={{ image: require('../../assets/images/ypa/footer-events.png'), imageActive: require('../../assets/images/ypa/footer-events-active.png'), headerShown: false }}>
          {() => AppNavStack("EventsPage")}
        </Tab.Screen>
        <Tab.Screen name="Employers" options={{ image: require('../../assets/images/ypa/footer-employers-inactive-2.png'), imageActive: require('../../assets/images/ypa/footer-employers.png'), headerShown: false }}>
          {() => AppNavStack("EmployersPage")}
        </Tab.Screen>
        

        <Tab.Screen name="Opportunities" options={{ image: require('../../assets/images/ypa/footer-opportunities-inactive-2.png'), imageActive: require('../../assets/images/ypa/footer-opportunities.png'), headerShown: false }}>
          {() => AppNavStack("OpportunitiesPage")}
        </Tab.Screen>

        <Tab.Screen name="Talent Spot" options={{ image: require('../../assets/images/ypa/footer-talent-spots-inactive-2.png'), imageActive: require('../../assets/images/ypa/footer-talent-spots.png'), headerShown: false }}>
          {() => AppNavStack("Notifications")}
        </Tab.Screen>

                

        <Tab.Screen name="WorkshopsPage" options={{ image: require('../../assets/images/ypa/footer-workshops.png'), imageActive: require('../../assets/images/ypa/footer-workshops-active.png'), headerShown: false }}>
          {() => AppNavStack("WorkshopsPage")}
        </Tab.Screen>
       
        
        <Tab.Screen name="Profile" options={{ image: require('../../assets/images/ypa/footer-profile-inactive-2.png'), imageActive: require('../../assets/images/ypa/footer-profile.png'), headerShown: false }}>
          {() => AppNavStack("ProfilePage")}
        </Tab.Screen>
      </>
    </Tab.Navigator>
  );
};

const AppNavNested = () => {
  return (
    <Drawer.Navigator useLegacyImplementation={true} initialRouteName="HomeDrawer" screenOptions={{ drawerPosition: 'right', drawerType: 'front',  }} drawerContent={props => <DrawerComponent {...props} />}>
      <Drawer.Screen name="HomeDrawer" component={HomeTab} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
};

export default class AppNavigator extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (<NavigationContainer ref={navigationRef}>
      <RootStack.Navigator screenOptions={backScreenOption} initialRouteName='Startup'>
        <RootStack.Screen name="Startup" component={StartupScreen} options={{ headerShown: false }}/>
        <RootStack.Screen name="After" component={AfterSplash} options={{ headerShown: false }} />
        <RootStack.Screen name="AuthNav" component={AuthNavStack} options={{ headerShown: false }} />
        <RootStack.Screen name="AppNav" component={AppNavNested} options={{ headerShown: false }}  />
        {/* <RootStack.Screen name="AppNav" component={AppNavStack} options={{ headerShown: false }}  /> */}
        <RootStack.Screen name="EmployerDetails" component={EmployerDetails} options={{ headerShown: false }}/>
        <RootStack.Screen name="SectorDetails" component={SectorDetails} options={{ headerShown: false }}/>
        
        <RootStack.Screen name="EventDetails" component={EventDetails}  options={{ headerShown: false }}/>
        <RootStack.Screen name="EventInPersonDetails" component={EventInPersonDetails}  options={{ headerShown: false }}/>
        <RootStack.Screen name="OpportunityDetails" component={OpportunityDetails} options={{ headerShown: false }}/>
        <RootStack.Screen name="WorkshopDetails" component={WorkshopDetails} options={{ headerShown: false }}/>
        <RootStack.Screen name="WorkshopStarts" component={WorkshopStarts} options={{ headerShown: false }} />
        <RootStack.Screen name="MyWorkshops" component={MyWorkshops} options={{ headerShown: false }}/>

        <RootStack.Screen name="ChangePassword" component={ChangePassword}/>
        <RootStack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }}/>
        <RootStack.Screen name="SubjectAdd" component={SubjectAdd}/>
        <RootStack.Screen name="ContactUs" component={ContactUs} />
        <RootStack.Screen name="ContactUsForm" component={ContactUsForm} />
        <RootStack.Screen name="DynamicPage" component={DynamicPage} />
        
        
        
        <RootStack.Screen name="EventMediaDetail" component={EventMediaDetail}  options={{ headerShown: false }}/>
        
        <RootStack.Screen name="InsightDetails" component={InsightDetails} options={{ headerShown: false }}/>
        <RootStack.Screen name="InsightsCategories" component={InsightsCategories} options={{ headerShown: false }}/>
        <RootStack.Screen name="NotificationDetail" component={NotificationDetail} options={{title:'Notification', headerShown: false }} />
        <RootStack.Screen name="SubscriptionTaken" component={SubscriptionTaken} options={{ headerShown: false }} />
        <RootStack.Screen name="SubscriptionNotTaken" component={SubscriptionNotTaken} options={{ headerShown: false }} />
        <RootStack.Screen name="SubscriptionSuccess" component={SubscriptionSuccess} options={{ headerShown: false }} />
        
        <RootStack.Screen name="WebPage" component={WebPage} options={{ headerShown: false }}/>
        {/* <RootStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} /> */}
        <RootStack.Screen name="BookEvents" component={BookEvents}  options={{ headerShown: false }}/>
        <RootStack.Screen name="BookEventDetails" component={BookEventDetails} options={{ headerShown: false }}/>
        <RootStack.Screen name="BookEventSuccess" component={BookEventSuccess} options={{ headerShown: false }}/>
        <RootStack.Screen name="NoInternet" component={NoInternetScreen} options={{ headerShown: false }}/>
        <RootStack.Screen name="SearchResult" component={SearchResult} options={{ headerShown: false }}/>
        
        <RootStack.Screen name="MyCertificates" component={MyCertificates} options={{ headerShown: false }}/>

        <Stack.Screen name="Opportunities2" component={Opportunities} options={{ headerShown: false }} />
        <Stack.Screen name="Events2" component={EventsScreen} options={{ headerShown: false }} />
        {/* <Stack.Screen name="OrderPlaced" component={OrderPlaced} options={{ headerShown: false }}/> */}
        {/* <Stack.Screen name="OrderPlacedDetails" component={OrderPlacedDetails} options={{ headerShown: false }}/> */}
        {/* <Stack.Screen name="Notifications" component={Notifications} options={{ }}/>
        <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ title: 'Change Password' }}/>
        <Stack.Screen name="NotificationDetail" component={NotificationDetail} options={{title:'Notification'}} /> */}
      </RootStack.Navigator>


    </NavigationContainer>);
  }

};

const styles = StyleSheet.create({
  rootHeaderStyle: {
    backgroundColor: "#ffffff",
    height: responsiveHeight(9),
    elevation:1
  },
  logo: {
    height: responsiveHeight(10),
    width: responsiveWidth(26),
    resizeMode: 'contain',
    marginLeft: responsiveWidth(3.5)
  },
  headerIcon: {
    marginHorizontal: responsiveWidth(3.5),
  },
  searchIcon:{
    width: responsiveHeight(3.4),
    width: responsiveHeight(3.4),
    resizeMode: 'contain',
  },
  backIcon: {
    width: responsiveHeight(6),
    width: responsiveHeight(6),
    resizeMode: 'contain',
  },
  backButton: {
    height: responsiveWidth(5),
    width: responsiveWidth(7),
    transform: [{ rotate: '180deg' }],
    marginRight: responsiveWidth(5)
  },
  // pageHeading:{
  //   fontFamily:"FuturaLT-Book",
  //   fontSize:responsiveFontSize(3),
  //   color:"#333333",
  //   margin:0,
  //   lineHeight:responsiveFontSize(4),
  // },
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

  todayDealsHeadingImage: {
    height: responsiveWidth(8),
    width: responsiveWidth(8),
    resizeMode: "contain",
    marginLeft: responsiveWidth(2)
  },



  backHeaderStyle: {
    backgroundColor: "#ffffff",
    elevation: 0,
    shadowOpacity: 0,
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
  backTranparentHeaderStyle: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },




  secondaryHeaderStyle: {
    backgroundColor: "#2e80fe",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    height: responsiveHeight(9),
  },
  secondaryPageHeading: {
    fontFamily: "FuturaLT-Book",
    fontSize: responsiveFontSize(3),
    color: "#ffffff"
  },
 

});
