import { StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding:responsiveWidth(3),
  },
  mainContainer:{
    backgroundColor:"#ffffff",
    flex:1
  },
  contentPadding:{
    padding:responsiveWidth(3),
  },
  topBar:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    // backgroundColor:"red",
   
  },
  menuButton:{
    height:responsiveHeight(5.5),
    width:responsiveHeight(5.5),
    borderRadius:9,
    paddingHorizontal:responsiveWidth(1.8),
    paddingVertical:responsiveWidth(3.2),
    flexDirection:"column",
    justifyContent:"space-between",
    alignItems:"flex-end"
  },
  menuLongLine:{
    height:1,
    width:"100%",
    backgroundColor:"#ffffff"
  },
  menuMediumLine:{
    height:1,
    width:"80%",
    backgroundColor:"#ffffff"
  },
  menuSmallLine:{
    height:1,
    width:"60%",
    backgroundColor:"#ffffff"
  },
  sideBySide:{
    flexDirection:"row",
    alignItems:"center"
  },
  wave: {
    height: responsiveHeight(4),
    width: responsiveWidth(7),
    resizeMode: 'contain',
    marginLeft: responsiveWidth(1),
    marginTop:-responsiveHeight(1)
  },
  mainText:{
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(3.1),
    color: "#333",
    marginBottom: 10
  },
  smallText:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(1.8),
    color: "#888",
    marginTop:-responsiveHeight(1)
  },
  searchInput:{
    backgroundColor:"#ffffff",
    height:responsiveHeight(7),
    width:responsiveWidth(94),
    flexDirection:"row",
    alignItems:"center",
    borderRadius:7,
    paddingHorizontal:responsiveWidth(4),
    borderWidth:1,
    borderColor:"#f1f1f1",
    // borderRadius:7,
  },
  searchIcon:{
    height: responsiveHeight(4),
    width: responsiveWidth(5),
    resizeMode: 'contain',
    marginRight:responsiveWidth(3)
  },
  searchOpportunity:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(1.8),
    color: "#888",
  },
  insightWrapper:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    marginTop:responsiveHeight(4)
  },
  homeInsightWrapper:{
    position:"relative",
    width: responsiveWidth(45),
  },
  homeInsightImage:{
    height: responsiveHeight(20),
    width: responsiveWidth(50),
    resizeMode: 'cover',
    borderRadius:15,
    right:-responsiveWidth(4),
    top:responsiveWidth(0),
  },
  homeInsightImageShadow:{
    height: responsiveHeight(20),
    width: responsiveWidth(45),
    resizeMode: 'cover',
    borderRadius:15,
    position:"absolute",
    right:-responsiveWidth(4),
    top:responsiveWidth(4),
    opacity:0.2
  },
  homeInsightGrayText:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(2.2),
    color: "#999",
    letterSpacing:3,
    marginBottom:responsiveHeight(1)
  },
  homeInsightHeadingText:{
    fontFamily: "Poppins-ExtraBold",
    fontSize: responsiveFontSize(2.6),
    color: "#111",
    marginBottom:responsiveHeight(2)
  },
  homeInsightLink:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(1.8),
    color: "#065eb8",
  },

  top:{
    position:"absolute",
    top:0,
    left:0,
    right:0,
    backgroundColor:"blue",
  },
  bottom:{
    // paddingTop:responsiveHeight(20),
    // height:responsiveHeight(100),
    backgroundColor:"red",
    position:"relative"
  },
  bannerContainer: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  banner: scrollA => ({
    height: responsiveHeight(38),
    // backgroundColor:"red",
    width: responsiveWidth(100),
    transform: [
      {
        translateY: scrollA.interpolate({
          inputRange: [-responsiveHeight(45), 0, responsiveHeight(45), responsiveHeight(45) + 1],
          outputRange: [-responsiveHeight(45) / 2, 0, responsiveHeight(45) * 0.75, responsiveHeight(45) * 0.75],
        }),
      },
      // {
      //   scale: scrollA.interpolate({
      //     inputRange: [-350, 0, 350, 350 + 1],
      //     outputRange: [2, 1, 0.5, 0.5],
      //   }),
      // },
    ],
    opacity: scrollA.interpolate({
      inputRange: [0, 250],
      outputRange: [1, 0.4],
    }),
  }),
  homeEmployerSection:{
    height:responsiveHeight(40),
    width:responsiveWidth(100),
    marginTop:responsiveHeight(2),
    flexDirection:"column",
    justifyContent:"flex-start",
  },
  homeEmployerHeaderBarArea:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    padding:responsiveWidth(3),
    marginVertical:responsiveHeight(1.5)
  },
  homeEmployerHeaderBarTitle:{
    fontFamily: "Poppins-ExtraBold",
    fontSize: responsiveFontSize(2.6),
    color: "#ffffff",
  },
  viewAll:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(1.8),
    color: "#ffffff",
  },
  rightArrow:{
    height:responsiveHeight(1.5),
    width:responsiveWidth(5),
    resizeMode:"contain",
  },
  homeSingleEmployer:{
    // backgroundColor:"red",
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginRight:responsiveWidth(2),
    borderRadius:responsiveHeight(1),
    overflow:"hidden",
    paddingHorizontal:responsiveWidth(4),
    paddingVertical:responsiveHeight(1),
  },
  homeSingleEmployerImage:{
    height:responsiveHeight(10),
    width:responsiveWidth(38),
    resizeMode:"contain",
    // backgroundColor:"red",
    borderRadius:responsiveHeight(1),
  },


  homeSingleJob:{
    backgroundColor:"#ffffff",
    // height:responsiveHeight(26),
    width:responsiveWidth(55),
    // flexDirection:"column",
    // alignItems:"flex-start",
    // justifyContent:"flex-start",
    borderWidth:1,
    borderColor:"#f1f1f1",
    borderRadius:7,
    overflow:"hidden",
    paddingTop:responsiveHeight(3),
    marginRight:responsiveWidth(2)
  },
  homeSingleJobImage:{
    height:responsiveHeight(5),
    width:responsiveWidth(30),
    resizeMode:"contain",
    borderRadius:responsiveHeight(1),
    marginBottom:responsiveHeight(1.5)
  },
  hsjjobBelow:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(1.7),
    color: "#666666",
    marginBottom:responsiveHeight(0.5),
    // backgroundColor:"green"
  },
  hsjTitle:{
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2),
    color: "#222",
    minHeight:responsiveHeight(7),
    // backgroundColor:"red",
    marginBottom:responsiveHeight(0.8),
  },
  hsjjobMarker:{
    height:responsiveHeight(2),
    width:responsiveWidth(4),
    top:responsiveHeight(0.2),
    // backgroundColor:"red",
    resizeMode:"contain",
    marginRight:responsiveWidth(1.5)
  },
  homePastEvents:{
    width:responsiveWidth(94),
    height:responsiveHeight(18),
    padding:responsiveWidth(4),
    borderRadius:10,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    position:"relative",
    zIndex:2
  },
  peShadow:{
    position:"absolute",
    zIndex:1,
    left:responsiveWidth(6),
    bottom:-responsiveHeight(1.5),
    opacity:0.2,
    width:responsiveWidth(88),
    height:responsiveHeight(18),
    padding:responsiveWidth(4),
    borderRadius:7,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  peTitle:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(2),
    color: "#ffffff",
    letterSpacing:3,
    marginBottom:responsiveHeight(1)
  },
  peSubTitle:{
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2.2),
    color: "#ffffff",
  },
  rightCircle:{
    height:responsiveHeight(5),
    width:responsiveHeight(5),
    resizeMode:"contain",
  },
  psTitleWrapper:{
    borderBottomColor:"#f1f1f1",
    borderBottomWidth:responsiveHeight(0.1),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    marginHorizontal:responsiveWidth(3),
    marginBottom:responsiveHeight(4)
  },
  psTitle:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(2.2),
    // backgroundColor:"#ffffff",
    paddingHorizontal:responsiveWidth(3),
    color: "#999",
    letterSpacing:3,
  },
  singleHomeSector:{
    marginRight:responsiveWidth(3),
    height:"50%"
  },
  singleHomeSectorImage:{
    height:responsiveHeight(12),
    width:responsiveHeight(16),
    resizeMode:"cover",
    borderRadius:10,
    marginBottom:responsiveHeight(1.5)
  },
  singleHomeSectorText:{
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(1.8),
    color: "#222222",
    textAlign:"center",
    width:responsiveHeight(15),
  },
  featureStar:{
    height:responsiveHeight(2.2),
    width:responsiveHeight(2.2),
    resizeMode:"contain",
    marginHorizontal:responsiveWidth(2)
  },
  featureTitle:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    marginBottom:responsiveHeight(3)
  },
  swiperFullWrapper:{
    // backgroundColor:"green",
    // paddingHorizontal:responsiveWidth(3),
    height:responsiveHeight(30),
  },
  swipperWrapper:{
    height:responsiveHeight(30),
    // backgroundColor:"red",
    position:"relative",
    flexDirection:"row",
    justifyContent:"center"
  },
  singleFeaturedWrapper:{
    paddingHorizontal:responsiveWidth(4),
  },
  singleFeaturedInner:{
    flexDirection:"row",
    alignItems:"center",
    padding:responsiveWidth(4),
    borderRadius:10,
    overflow:"hidden"
  },
  singleFeaturedTitle:{
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2.4),
    color: "#ffffff",
    marginBottom:responsiveHeight(1)
  },
  singleFeaturedSubTitle:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(2),
    color: "#ffffff",
    marginBottom:responsiveHeight(1)
  },
  singleFeaturedmap:{
    height:responsiveHeight(2),
    width:responsiveWidth(4),
    top:-responsiveHeight(0.2),
    resizeMode:"contain",
    marginRight:responsiveWidth(1.5)
  },
  singleFeaturedLocation:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(2),
    color: "#ffffff",
  },
  singleFeaturedTag:{
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginRight:responsiveWidth(2),
    borderRadius:responsiveHeight(3),
    paddingHorizontal:responsiveWidth(5),
    height:responsiveHeight(4.5),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    alignSelf: 'flex-start'
  },
  singleFeaturedTagText:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(2),
    color: "#ffffff",
    top:responsiveHeight(0.2)
  },
  singleFeaturedEmployerImage:{
    height:responsiveHeight(20),
    width:responsiveWidth(35),
    resizeMode:"contain",
  },
  fShadow:{
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius:responsiveHeight(15),
    height:responsiveHeight(30),
    width:responsiveWidth(50),
    position:"absolute",
    right:-responsiveWidth(15),
    top:-10
  },
  homeSingleWorkshops:{
    // backgroundColor:"red",
    backgroundColor: 'rgba(255, 255, 255, 1)',
    marginRight:responsiveWidth(3),
    borderRadius:responsiveHeight(1),
    overflow:"hidden",
    padding:responsiveWidth(2.5),
    width:responsiveWidth(55),
    alignItems:"center",
    justifyContent:"center"
  },
  // homeSingleWorkshopImageWrapper:{
  //   backgroundColor:"#f1f1f1",
  //   padding:responsiveWidth(2),
  //   borderRadius:responsiveHeight(1),
  //   width:"100%",
  //   alignItems:"center",
  //   justifyContent:"center"
  // },
  homeSingleWorkshopImage:{
    height:responsiveHeight(10),
    width:responsiveWidth(45),
    resizeMode:"contain",
  },
  minutes:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(1.8),
    color: "#666666",
    textAlign:"left"
  },
  workText:{
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2),
    color: "#222",
    marginTop:responsiveHeight(1.5),
    marginBottom:responsiveHeight(1.5),
    paddingHorizontal:responsiveWidth(2)
  },
  worksshopVideoIcon:{
    opacity:0.1,
    position:"absolute",
    right:-responsiveWidth(3),
    bottom:-responsiveWidth(3)
  },
  homeVirtualWrapper:{
    flexDirection:"column",
    paddingHorizontal:responsiveWidth(3),
    paddingBottom:responsiveHeight(1),
    paddingTop:responsiveHeight(2)
  },
  singleVirtualEvent:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    backgroundColor:"#ffffff",
    padding:responsiveWidth(2.4),
    borderRadius:10,
    marginBottom:responsiveHeight(2)
  },
  homevirtualEventImage:{
    width:responsiveWidth(30),
    height:responsiveHeight(14),
    resizeMode:"cover",
    borderRadius:10,
    marginRight:responsiveWidth(2.5)
  },
  sImage:{
    width:responsiveWidth(25),
    height:responsiveHeight(11),
    resizeMode:"contain",
    borderRadius:10,
    marginRight:responsiveWidth(2.5)
  },
  hveDate:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(1.7),
    color: "#666",
    marginBottom:responsiveHeight(0.5)
  },
  hveTitle:{
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2),
    color: "#222",
    width:responsiveWidth(40)
  },
  rightCircleBlue:{
    height:responsiveHeight(4),
    width:responsiveHeight(4),
    resizeMode:"contain",
  },
  belowTextWrapper:{
    flexDirection:"column",
    marginTop:responsiveHeight(7),
    marginBottom:responsiveHeight(4),
    paddingHorizontal:responsiveWidth(3.5)
  },
  belowText:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(5),
    color: "#808080",
    lineHeight:responsiveHeight(7)
  },
  belowTextBold:{
    fontFamily: "Poppins-ExtraBold",
    fontSize: responsiveFontSize(5),
    lineHeight:responsiveHeight(7),
    color: "#808080",
  },
  belowTextCopy:{
    marginTop:responsiveHeight(3),
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(2),
    color: "#808080",
  },
  headerBackIconWrapper:{
    height: '100%',
    width:responsiveHeight(2.3),
  },
  headerBackIcon:{
    resizeMode:"contain",
    height: '100%'
  },
  headerSearchIcon: {
    height:responsiveHeight(5),
    width:responsiveWidth(7),
    resizeMode:"contain",
    // backgroundColor:"red"
  },
  pageName:{
    fontFamily: "Poppins-Bold",
    fontSize: responsiveFontSize(3),
    color: "#333",
  },
  pageSubName:{
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2.4),
    color: "#333",
  },
  mainHeader:{
    borderBottomWidth:1,
    borderBottomColor:"#f1f1f1",
    paddingHorizontal:responsiveWidth(3),
    backgroundColor:"#ffffff",
    height:responsiveHeight(9),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    width:"100%",
    zIndex:3,
    position:"relative"
  },
  jobFeaturedSingle: {
    width:responsiveWidth(90),
    marginRight:responsiveWidth(3)
  },
  bottomFeatured:{
    backgroundColor:"#ffffff",
    paddingHorizontal:responsiveWidth(3),
    width:responsiveWidth(100),
    borderBottomWidth:1,
    borderBottomColor:"transparent"
  },
  bottomFeaturedBorder:{
    backgroundColor:"#ffffff",
    paddingHorizontal:responsiveWidth(3),
    width:responsiveWidth(100),
    borderBottomWidth:1,
    borderBottomColor:"#f1f1f1"
  },

  bottomFeaturedRadius:{
    backgroundColor:"#ffffff",
    paddingHorizontal:responsiveWidth(3),
    width:responsiveWidth(100),
    borderBottomWidth:1,
    borderBottomColor:"transparent",
    borderTopLeftRadius:20,
    borderTopRightRadius:20
  },
  bottomFeaturedBorderRadius:{
    backgroundColor:"#ffffff",
    paddingHorizontal:responsiveWidth(3),
    width:responsiveWidth(100),
    borderBottomWidth:1,
    borderBottomColor:"#f1f1f1",
    borderTopLeftRadius:20,
    borderTopRightRadius:20
  },

  filterHeader:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    marginVertical:responsiveHeight(3)
  },
  fButton:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    paddingHorizontal:responsiveWidth(3),
    backgroundColor:"#eaf4fe",
    borderRadius:8,
    width:responsiveWidth(23),
    height:responsiveHeight(4.5)
  },
  fButtonTitle:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(2),
    lineHeight:responsiveHeight(3),
    color: "#0059b6",
    // backgroundColor:"red"
  },
  fButtonImage:{
    height:responsiveHeight(1.5),
    width:responsiveWidth(4),
    resizeMode:"contain"
  },

 
  singleJob:{
    borderWidth:1,
    borderColor:"#f1f1f1",
    backgroundColor:"#ffffff",
    borderRadius:8,  
    overflow:"hidden",
    marginBottom:responsiveHeight(2)
  },
  singleJobTop:{
    paddingTop:responsiveWidth(4),
    paddingHorizontal:responsiveWidth(3.7)
  },
  singleJobTitleWrapper:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
  },
  singleJobTitle:{
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2),
    color: "#333",
  },
  singleJobImageWrapper:{
    borderWidth:1,
    borderColor:"#f3f3f3",
    borderRadius:8, 
    padding:4,
  },
  singleJobImage:{
    height:responsiveHeight(7),
    width:responsiveHeight(7),
    resizeMode:"contain"
  },
  singleJobSubTitle:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(1.8),
    color: "#888888",
    marginBottom:responsiveHeight(1),
    top:responsiveHeight(0.4)
  },
  singleJobFooter:{
    backgroundColor:"#ebebeb",
    marginTop:responsiveHeight(1),
    paddingVertical:responsiveWidth(4),
    paddingHorizontal:responsiveWidth(4),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  singleJobFooterText:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(1.8),
    color: "#777777",
    marginHorizontal:responsiveWidth(4),
    top:responsiveHeight(0.2)
  },
  singleJobOptionImage:{
    height:responsiveHeight(2),
    width:responsiveWidth(4),
    top:-responsiveHeight(0.2),
    resizeMode:"contain",
    marginRight:responsiveWidth(4)
  },
  allCenter:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center"
  },
  rbHandle:{
    height:responsiveHeight(1),
    width:responsiveWidth(12),
    backgroundColor:"#ffffff",
    borderRadius:20,
    position:"absolute",
    top:-responsiveHeight(3)
  },
  rbsheetClose:{
    height:responsiveHeight(3.5),
    width:responsiveHeight(3.5),
    resizeMode:"contain"
  },
  sheetTitleContainer: {
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    paddingHorizontal: responsiveHeight(2), 
    paddingBottom: responsiveHeight(1.5),
    marginBottom: responsiveHeight(0)
  },
  sheetTitle: {
    fontSize: responsiveFontSize(2.6),
    fontFamily: "Poppins-SemiBold",
    color: "#222222",
    textAlign: "center",
    // backgroundColor:"red",
    top:responsiveHeight(0.4)
  },
  leftFilter:{
    width:responsiveWidth(30),
    borderRightColor:"#f1f1f1",
    borderRightWidth:1,
    height:"100%",
  },
  rightFilter:{
    width:responsiveWidth(70),
    padding:responsiveWidth(4),
    paddingBottom:0,
    height:"100%",
  },
  leftSingleFilter:{
    height:responsiveHeight(8),
    flexDirection:"row",
    alignItems:"center",
    // borderRightColor:"#f1f1f1",
    // borderRightWidth:1,
    borderBottomColor:"#f1f1f1",
    borderBottomWidth:1,
    borderLeftWidth:5,
    borderLeftColor:"transparent",
    paddingLeft:responsiveWidth(3),
    
  },
  leftSingleFilterText:{
    fontFamily: "Poppins-Light",
    color: "#222222",
    fontSize: responsiveFontSize(1.9),
  },
  leftSingleFilterActive:{
    height:responsiveHeight(8),
    flexDirection:"row",
    alignItems:"center",
    borderRightColor:"transparent",
    borderRightWidth:1,
    borderLeftWidth:5,
    borderLeftColor:"#1c7bda",
    paddingLeft:responsiveWidth(3),
    borderBottomColor:"#f1f1f1",
    borderBottomWidth:1,
    position:"relative"
  },
  leftSingleFilterTextActive:{
    fontFamily: "Poppins-SemiBold",
    color: "#222222",
    fontSize: responsiveFontSize(1.9),
  },
  leftSingleFilterViewActive:{
    height:responsiveHeight(8),
    width:2,
    right:-2,
    backgroundColor:"#ffffff",
    position:"absolute"
  },
  filterFooter:{
    borderTopWidth:1,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    borderTopColor:"#f1f1f1",
    // backgroundColor:"red",
    height:responsiveHeight(12),
    width:responsiveWidth(100)
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
  radioButtonPosition: {
    // position:"absolute", 
    // top: responsiveWidth(5), 
    // right:responsiveWidth(5),
    // zIndex:1
    marginRight: responsiveWidth(3)
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
    fontSize: responsiveFontSize(1.8),
    fontFamily: "Poppins-Light",
    color: "#333333",
    textAlign: "center",
  },




  
  row: {
    height: 40,
    margin: 16,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // backgroundColor: '#000000',
    overflow: 'hidden',
  },


  bgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: responsiveHeight(48),
    backgroundColor: '#000000',
    zIndex:99
  },


  bar: {
    marginTop: 0,
    height:responsiveHeight(9),
    
    flexDirection:"row",
    alignItems: 'center',
    justifyContent:"space-between",
    zIndex:102,
    paddingRight:responsiveWidth(3),
    paddingLeft:responsiveWidth(4)
  },
  headerBorder:{
    height:1,
    width:responsiveWidth(100),
    backgroundColor: "#f1f1f1",
    position:"absolute",
    bottom:0
  },
  title: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    position:"relative",
    fontSize:responsiveFontSize(2.3),
    zIndex:100,
    top:responsiveHeight(0.2),
    paddingLeft:responsiveWidth(6)
  },
  shareText:{
    color: '#ffffff',
    fontFamily: "Poppins-SemiBold",
    fontSize:responsiveFontSize(2.3),
    zIndex:100,
    position:"relative",
    textAlign:"right",
    paddingRight:responsiveWidth(5)
  },
  scrollViewContent: {
    marginTop: responsiveHeight(48),
    paddingHorizontal:responsiveWidth(4),
    paddingTop:responsiveHeight(3),
    backgroundColor:"#ffffff",
    paddingBottom:responsiveHeight(14)
  },
  scrollViewContent2: {
    marginTop: responsiveHeight(45),
    paddingHorizontal:responsiveWidth(4),
    // paddingTop:responsiveHeight(3),
    backgroundColor:"#ffffff",
    paddingBottom:responsiveHeight(14),
    zIndex:102
  },

  googlemap:{
    height:responsiveHeight(4),borderRadius:4,flexDirection:"row",alignItems:"center",justifyContent:"center",paddingHorizontal:responsiveWidth(2),alignSelf:"flex-start"
  },
  googlemapText:{
    color: '#ffffff',
    fontFamily: "Poppins-Light",
    fontSize:responsiveFontSize(1.7),
  },

  backgroundImage: {
    position: 'absolute',
    top: 0,
    width: responsiveWidth(100),
    height: responsiveWidth(100) / 3,
    resizeMode: 'contain',
    zIndex:2
  },
  headerBackIcon:{
    position:"absolute",
    zIndex:100,
    left:responsiveWidth(0),
    top:responsiveHeight(0.8),
    height:responsiveHeight(2.3),
    width:responsiveHeight(2.3),
    resizeMode:"contain"
  },
  jdContentWrapper:{
    position:"absolute",
    left:responsiveWidth(4),
    right:responsiveWidth(5),
    bottom:responsiveWidth(6),
    zIndex:101
  },
  jobDetailsCompanyLogoWrapper:{
    backgroundColor:"#ffffff",
    height:responsiveHeight(11),
    width:responsiveHeight(11),
    borderRadius:10,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    marginBottom:responsiveHeight(2)
  },
  jobDetailsCompanyLogo:{
    height:"100%",
    width:responsiveHeight(9),
    resizeMode:"contain",
  },
  jdCompanyTitle:{
    fontFamily: "Poppins-Light",
    color:"#ffffff",
    fontSize:responsiveFontSize(1.8),
    marginBottom:responsiveHeight(2)
  },
  jdTitle:{
    fontFamily: "Poppins-SemiBold",
    color:"#ffffff",
    fontSize:responsiveFontSize(2.5),
    marginBottom:responsiveHeight(2),
    width:responsiveWidth(80)
  },
  salaryIcon:{
    height:responsiveHeight(2.5),
    width:responsiveHeight(2.5),
    resizeMode:"contain",
    marginRight:responsiveWidth(3)
  },
  jdSalary:{
    fontFamily: "Poppins-Light",
    color:"#ffffff",
    fontSize:responsiveFontSize(1.8),
    top:responsiveHeight(0.2)
  },
  jdLocation:{
    fontFamily: "Poppins-Light",
    color:"#222222",
    fontSize:responsiveFontSize(1.9),
    top:responsiveHeight(0.2)
  },

  jdOptionWrapper:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    flexWrap:"wrap",
    marginTop:responsiveHeight(3)
  },
  jdSingleOption:{
    width: responsiveWidth(44),
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center",
    borderRadius:8,
    padding:responsiveWidth(4),
    paddingBottom:responsiveWidth(3)
  },
  jdSingleOptionIcon:{
    height:responsiveHeight(3),
    width:responsiveHeight(3),
    resizeMode:"contain",
  },
  jdSingleOptionTitle:{
    fontFamily: "Poppins-Light",
    color:"#888888",
    fontSize:responsiveFontSize(1.6),
    marginTop:responsiveHeight(2)
  },
  jdSingleOptionSubTitle:{
    fontFamily: "Poppins-SemiBold",
    color:"#222222",
    fontSize:responsiveFontSize(1.8),
  },
  jdMainContentTitle:{
    fontFamily: "Poppins-SemiBold",
    color:"#222222",
    fontSize:responsiveFontSize(2.2),
  },
  jdMainContent:{
    fontFamily: "Poppins-Light",
    color:"#222222",
    fontSize:responsiveFontSize(1.9),
  },
  jdMainContentMore:{
    lineHeight: 21, 
    marginTop: 10,
    fontFamily: "Poppins-SemiBold",
    color:"#0076fd",
    fontSize:responsiveFontSize(1.8),
  },
  jdFooter: {
    position:"absolute",
    bottom:0,
    zIndex:104,
    backgroundColor:"#ffffff"
  },
  jdFooterInner:{
    width:responsiveWidth(100),
    paddingHorizontal:responsiveWidth(4),
    height:responsiveHeight(9),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    // backgroundColor:"red"
  },
  jdFooterText:{
    fontFamily: "Poppins-SemiBold",
    color:"#222222",
    fontSize:responsiveFontSize(2),
  },
  jobSaveButton:{
    borderColor:"#0076fd",
    borderWidth:1,
    backgroundColor:"#ffffff",
    height:responsiveHeight(6),
    width:responsiveHeight(6),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    borderRadius:8,
    marginRight:responsiveWidth(2.5)
  },
  jobSaveButtonImage:{
    height:responsiveHeight(3),
    width:responsiveHeight(3),
    resizeMode:"contain"
  },
  jobSaveButtonActive:{
    backgroundColor:"#0076fd",
    borderColor:"#0076fd",
    borderWidth:1,
    height:responsiveHeight(6),
    width:responsiveHeight(6),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    borderRadius:8,
    marginRight:responsiveWidth(2.5)
  },
  tagWrapper:{
    flexDirection:"row",
    alignItems:"center",
    flexWrap:"wrap",
    marginTop:responsiveHeight(4)
  },
  singleTag:{
    backgroundColor:"#ababab",
    paddingVertical:responsiveWidth(2),
    paddingHorizontal:responsiveWidth(5),
    marginRight:responsiveWidth(3),
    marginBottom:responsiveWidth(3),
    borderRadius:20,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center"
  },
  singleTagText:{
    fontFamily: "Poppins-Light",
    color:"#ffffff",
    fontSize:responsiveFontSize(1.8),
  },

  eventCompanyImage:{
    width:responsiveWidth(25),
    height:responsiveHeight(11),
    resizeMode:"contain",
    borderRadius:10,
    marginRight:responsiveWidth(3),
  },

  jdCompanyWrapper:{
    flexDirection:"row",
    alignItems:"center",
    // justifyContent:"center"
    marginTop:responsiveHeight(4)
  },
  eipImage:{
    width:responsiveWidth(91),
    height:responsiveWidth(91),
    resizeMode:"contain",
    borderRadius:10,
    marginTop:responsiveHeight(4)
  },
  jobCompanyName:{
    fontFamily: "Poppins-SemiBold",
    color:"#222222",
    fontSize:responsiveFontSize(2),
  },
  jobKnowMore:{
    fontFamily: "Poppins-Light",
    color:"#222222",
    fontSize:responsiveFontSize(1.8),
    letterSpacing:1
  },
  companyName:{
    fontFamily: "Poppins-SemiBold",
    color:"#222222",
    fontSize:responsiveFontSize(1.8),
    marginBottom:responsiveHeight(1.2)
  },
  companyDesc:{
    fontFamily: "Poppins-Light",
    color:"#888",
    fontSize:responsiveFontSize(1.6),
  },
  


  // EMPLOYERS
  featuredBG:{
    backgroundColor:"#2081e2",
    position:"absolute",
    height:responsiveHeight(18),
    width:responsiveWidth(100),
    borderBottomLeftRadius:50,
    borderBottomRightRadius:50,
    overflow:"hidden"
  },
  // No DATA CSS
  noDataImage: {
    width: 80,
    resizeMode: "contain"
  },
  noDataTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2.2),
    color: "#141517",
    marginTop: 0
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
  secondaryHeaderStyle: {
    backgroundColor: "#007fff",
    flexDirection: "row",
    alignItems: "center", 
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(3),
    height: responsiveHeight(9),
    borderBottomWidth:1,
    borderColor:"#007fff",
    elevation:5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowRadius: 5,
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
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#ececec"
  },
  singleFilterText: {
    fontSize: responsiveFontSize(1.8),
    color: "#333",
    fontFamily: "FuturaLT-Book",
  },
  filterActivated :{
    // position:"absolute",
    height:responsiveHeight(2),
    width:responsiveHeight(2),
    alignItems:"center",justifyContent:"center",
    borderRadius:50,
    backgroundColor:"#2e80fe",
    marginLeft:responsiveWidth(1.5),
    
  },
  filterActivatedText:{
    fontSize: responsiveFontSize(1.2),
    color: "#ffffff",
    fontFamily: "FuturaLT-Book",
    position:"relative",
    top:responsiveHeight(0.05)
  },
  filterActivatedHeader :{
    position:"absolute",
    borderWidth:1,
    top:-8,
    right:-1.5,
    borderColor:"#ffffff",
    height:9,
    width:9,
    borderRadius:50,
    backgroundColor:"#26beaf",
    marginLeft:responsiveWidth(1.5)
  },

  contentWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  singleContent: {
    backgroundColor: "#ffffff",
    width: responsiveWidth(45.5),
    marginBottom: responsiveWidth(2.7),
    alignItems: "center",
    justifyContent: "center",
    paddingTop: responsiveWidth(2.5),
    paddingBottom: responsiveWidth(2.7),
    paddingHorizontal: responsiveWidth(2.5),
    borderRadius: 8
  },
  whiteBorderLeft:{
    width: responsiveWidth(41.5),
    top:responsiveHeight(1.6),
    left:responsiveWidth(3.2),
    height: responsiveHeight(9),
    backgroundColor:"#ffffff",
    position:"absolute",
    zIndex:1,
  },
  whiteBorderRight:{
    width: responsiveWidth(41.5),
    top:responsiveHeight(1.6),
    left:responsiveWidth(3.2),
    height: responsiveHeight(9),
    backgroundColor:"#ffffff",
    position:"absolute",
    zIndex:1,
  },
  leftContent:{
    marginRight: responsiveWidth(4),
    marginLeft:responsiveWidth(4)
  },
  singleContentLeft: {
    backgroundColor: "#ffffff",
    width: responsiveWidth(43.5),
    paddingVertical: responsiveWidth(3),
    borderRadius:8,
    paddingHorizontal: responsiveWidth(3),
    borderColor:"#f1f1f1",
    borderWidth:1
    // marginBottom: responsiveWidth(5),
    // marginRight: responsiveWidth(5),
    // zIndex:2,
    // position:"relative",
    // elevation:5,
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowColor: 'black',
    // shadowOpacity: 0.4,
    // shadowRadius: 5,
    // alignItems: "center",
    // justifyContent: "center",
    // paddingTop: responsiveWidth(2.5),
    // paddingBottom: responsiveWidth(2.7),
    // paddingHorizontal: responsiveWidth(2.5),
    // borderRadius: 8
  },
  rightContent:{
    marginTop: responsiveWidth(5),
    // marginBottom: responsiveWidth(5),
  },
  singleContentRight: {
    backgroundColor: "#ffffff",
    width: responsiveWidth(43.5),
    paddingVertical: responsiveWidth(3),
    borderRadius:8,
    paddingHorizontal: responsiveWidth(3),
    borderColor:"#f1f1f1",
    borderWidth:1
  },
  empContentWrapper:{
    borderTopWidth:1,
    borderTopColor:"#eaeaea",
    width: responsiveWidth(45.5),
    alignItems: "center",
    justifyContent: "center",
    marginTop: responsiveWidth(2.7),
    paddingBottom: responsiveWidth(2.7),
    paddingHorizontal: responsiveWidth(2.5),
  },
  contentImageWrapper:{
    
  },
  contentImage: {
    width: "100%",
    resizeMode: "contain",
    height: responsiveHeight(9),
    marginBottom:responsiveHeight(1.4)
    // backgroundColor:"red"
  },
  contentTitle: {
    fontSize: responsiveFontSize(1.9),
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
    textAlign: "left",
    // backgroundColor:"red",
    width: "100%",
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(0.5),
  },
  contentDesc: {
    fontSize: responsiveFontSize(1.9),
    color: "#999999",
    fontFamily: "Poppins-Light",
    textAlign: "left",
    width: "100%"
  },
  headerShareIcon:{
    height:responsiveHeight(2.3),
    width:responsiveHeight(2.3),
    resizeMode:"contain",

    position:"absolute",
    zIndex:100,
    right:responsiveWidth(4),
    top:responsiveHeight(3),
  },
  edHeaderWrapper:{
    flexDirection:"row",
    alignItems:"center",
    position:"absolute",
    zIndex:102,
    bottom:-30,
    backgroundColor:"red"
  },


  generalHeader:{
    borderBottomWidth:1,
    borderBottomColor:"#f1f1f1",
    paddingLeft:responsiveWidth(3),
    paddingRight:responsiveWidth(4),
    backgroundColor:"#ffffff",
    height:responsiveHeight(9),
    width:responsiveWidth(100),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    width:"100%",
    position:"absolute",
    top:0,
    left:0,
    right:0,
    zIndex:4
  },
  generalHeaderTitle:{
    backgroundColor: 'transparent',
    color: '#222',
    fontFamily: "Poppins-SemiBold",
    fontSize:responsiveFontSize(2.3),
    marginLeft:responsiveWidth(2),
    top:1
  },


  employerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: responsiveWidth(100)/3,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex:1
  },
  employerBackgroundImage: {
    width:responsiveWidth(100),
    height: responsiveWidth(100)/3,
    resizeMode: 'cover',
  },
  employerTopBar:{
    flexDirection:"row",
    alignItems:"center",
    paddingHorizontal:responsiveWidth(3),
    top:-responsiveHeight(3),
    zIndex:3,
    position:"relative"
  },
  employerImageBG:{
    backgroundColor:"#ffffff",
    height:responsiveHeight(14),
    width:responsiveHeight(14),
    alignItems:"center",
    justifyContent:"center",
    borderWidth:1,
    borderColor:"#f1f1f1",
    borderRadius:10
  },
  employerImg:{
    height:responsiveHeight(11),
    width:responsiveHeight(11),
    resizeMode:"contain"
  },
  empName:{
    fontFamily: "Poppins-SemiBold",
    color:"#222222",
    fontSize:responsiveFontSize(2.4),
  },
  featuredEmpWrapper:{
    marginTop:responsiveHeight(0.8),
    backgroundColor:"#fff8e6",
    height:responsiveHeight(3),
    width:responsiveWidth(36),
    alignItems:"center",
    justifyContent:"center",
    borderRadius:8
  },
  featuredEmpText:{
    fontFamily: "Poppins-Light",
    color:"#f06000",
    fontSize:responsiveFontSize(1.6),
  },
  iconColor:{
    color:"#ffffff"
  },
  employerShareIconWrapper:{
    position:"absolute",
    height:responsiveWidth(6),
    width:responsiveWidth(6),
    right:responsiveWidth(4)
  },
  employerShareIcon:{
    height:responsiveWidth(5),
    width:responsiveWidth(5),
    right:0,
    resizeMode:"contain",
    position:"absolute",
    zIndex:5,
  },
  bottomAreaTextGreen:{
    fontFamily: "Poppins-Light",
    color:"green",
    fontSize:responsiveFontSize(1.8),
  },
  bottomAreaTextRed:{
    fontFamily: "Poppins-Light",
    color:"red",
    fontSize:responsiveFontSize(1.8),
  },
  pageSubHeading:{
    fontFamily: "Poppins-Light",
    color:"#ffffff",
    fontSize:responsiveFontSize(1.8),
  },
  singleTalentSpot: {
    borderWidth:1,
    borderColor:"#f1f1f1",
    backgroundColor:"#ffffff",
    borderRadius:8,  
    overflow:"hidden",
    marginBottom:responsiveHeight(2)
  },


  
  // MODAL VIEW
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: responsiveHeight(4),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 10,
    paddingTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(0.5),
    paddingHorizontal: responsiveWidth(4),
    marginHorizontal:responsiveWidth(2)
  },
  textStyleCancel:{
    fontFamily:"FuturaLT",
    fontSize:responsiveFontSize(1.8),
    color:"#888888",
    textAlign: "center"
  },
  textStyle: {
    fontFamily:"FuturaLT",
    fontSize:responsiveFontSize(1.8),
    color:"#222222",
    textAlign: "center"
  },
  modalTextMain: {
    fontFamily:"Poppins-SemiBold",
    fontSize:responsiveFontSize(1.9),
    color:"#333"
  },
  modalTextSub: {
    fontFamily:"FuturaLT",
    fontSize:responsiveFontSize(1.7),
    color:"#666666",
    marginBottom: responsiveHeight(1.8),
    textAlign: "center"
  },
  // MODAL VIEW
  
  // POPUP
  applyPopup:{
    position:"absolute",
    top:0,
    bottom:0,
    right:0,
    left:0,
    zIndex:99999,
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems:"center",
    justifyContent:"center",
    padding:responsiveWidth(9)
  },


  mainAreaPopup:{
    backgroundColor:"#007fff",
    alignItems:"center",
    justifyContent:"center",
    position:"relative",
    alignSelf:"center",
    padding:responsiveWidth(4),
    borderRadius:10,
    paddingTop:responsiveHeight(4),
    width:responsiveWidth(90)
  },
  popupImageWrapper:{
    backgroundColor:"#007fff",
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
    flexWrap:"wrap",
    alignItems:"center",
    justifyContent:"center"
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
  applyBtn:{
    backgroundColor:"#ffffff",
    // borderRadius:7,
    alignItems:"center",
    justifyContent:"center",
    padding:responsiveHeight(1.5),
  },
  applyBtnText:{
    fontSize: responsiveFontSize(2),
    color: "#011c38",
    fontFamily: "FuturaLT-Bold",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  cancelBtn:{
    backgroundColor:"#0065cb",
    alignItems:"center",
    justifyContent:"center",
    padding:responsiveHeight(1.5),
    marginRight: responsiveWidth(3),
  },
  cancelBtnText:{
    fontSize: responsiveFontSize(2),
    color: "#ffffff",
    fontFamily: "FuturaLT-Bold",
    textTransform: 'uppercase',
    textShadowColor: 'rgba(57, 158, 255, 1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  notificationDetailImage:{
    width: "100%",
    resizeMode: "contain",
    height: responsiveHeight(10),
  },
  notificationDetailImageWrapper: {
    backgroundColor: "#ffffff",
    width: "100%",
    marginBottom: responsiveHeight(4),
    marginTop: responsiveHeight(0),
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: responsiveWidth(4),
    // paddingBottom: responsiveWidth(4),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 12,
    // elevation: 5,
    height:responsiveHeight(30)
  },
  notificationDetailBottomArea:{
    padding: responsiveWidth(3.2),
    paddingTop:responsiveHeight(2),
    paddingBottom:responsiveHeight(2.5),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    // borderTopWidth:1,
    // borderColor:"#afd7ff",
    // marginHorizontal:-responsiveWidth(3.2)
  },
  notificationDetailBottomAreaText:{
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2.5),
    color: "#333",
    top:responsiveHeight(0.3)
  },
  outlineButtonWhite:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    borderColor:"#eaf4fe",
    borderWidth:1,
    borderRadius:8,
    paddingHorizontal:responsiveWidth(4),
    height:responsiveHeight(5)
  },
  outlineButtonWhiteText:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(1.8),
    color: "#ffffff",
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

  profileBottom:{
    backgroundColor:"#ffffff",
    padding:responsiveWidth(3),
    paddingTop:responsiveHeight(3),
    width:responsiveWidth(100),
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    minHeight:responsiveHeight(80)
  },
  profileSectionHeading:{
    fontFamily: "Poppins-SemiBold",
    fontSize: responsiveFontSize(2.1),
    color: "#222",
    marginBottom:responsiveHeight(2)
  },
  profileBio:{
    fontFamily: "Poppins-Light",
    fontSize: responsiveFontSize(1.9),
    color: "#222",
  },







  // Event
  singleEvent:{

  },

  searchButtonEmptyContainer:{
    position:"absolute",
    top: 0, 
    left: 0, 
    right: responsiveWidth(3), 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'flex-end'
  },
  searchEmptyButton:{
    height:responsiveWidth(5.5),
    width:responsiveWidth(5.5),
    resizeMode:"contain",
  },



  
});