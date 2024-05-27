import AsyncStorage from '@react-native-community/async-storage';
import globals from '../../config/globals';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import { getUniqueId } from 'react-native-device-info';

import * as commonActions from '../actions/common';

export const AUTHENTICATE = 'AUTHENTICATE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const LOGOUT = 'LOGOUT';
export const SET_MCOURSES = 'SET_MCOURSES';
export const SET_UNREAD_NOTIFICATIONS = 'SET_UNREAD_NOTIFICATIONS';
export const SET_SAVED_JOBS = 'SET_SAVED_JOBS';

export const setUnreadNotifications = (count) => {
  return { type: SET_UNREAD_NOTIFICATIONS, count: count };
};

export const authenticate = (accessToken, user) => {
  return (dispatch, getState) => {
    dispatch({ type: AUTHENTICATE, accessToken: accessToken, user: user });
    AsyncStorage.setItem(
      'userData',
      JSON.stringify({
        accessToken: accessToken,
        user: user
      })
    );
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    AsyncStorage.getItem('fcmToken').then(fcmToken => {
      if(user.firebaseTokens.indexOf(fcmToken) === -1) {
        dispatch(registerFCMToken(fcmToken));
      }
    });
    // dispatch(getStatCounts());
  };
};

export const validateToken = (token) => { 
  return async dispatch => {
    try {
      console.log(token);
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/validate-token', null, { headers: {"Authorization" : `Bearer ${token}`} });
      // console.log(response.data.user.firebaseTokens);
      dispatch(authenticate(token, response.data.user));
      return response.data.user;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};


export const setUser = (user) => { 
  return async dispatch => {
    dispatch({ type: UPDATE_PROFILE, user: user });
    AsyncStorage.setItem(
      'userData',
      JSON.stringify({
        accessToken: axios.defaults.headers.common['Authorization'].substr(7),
        user: user
      })
    );
    return user;
  };  
};

export const setCourses = (posts, refresh = true) => {
  return { type: SET_MCOURSES, posts: posts, refresh: refresh };
};

export const setSavedJobs = (posts, refresh = true) => {
  return { type: SET_SAVED_JOBS, posts: posts, refresh: refresh };
};

export const login = (params) => {
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/login', params);
      dispatch(authenticate(response.data.access_token, response.data.user));
      return response.data.user;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const signUp = (params) => {
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/sign-up', params);
      dispatch(authenticate(response.data.access_token, response.data.user));
      return response.data.user;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const signUpWithFirebase = (params) => {
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/sign-up-using-firebase-auth', params);
      dispatch(authenticate(response.data.access_token, response.data.user));
      return response.data.user;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const socialLogin = (params) => {
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/social-login', params);
      dispatch(authenticate(response.data.access_token, response.data.user));
      return response.data.user;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const sendEmailOTP = (params) => {
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/request-otp', params);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const forgotPwdReset = (params) => {
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/change-password-using-otp', params);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getStatCounts = () => {
  return async dispatch => {
    try {
      const response = await axios.get(globals.get('appConfig').apiUrl+'students/auth-count-summary');
      // console.log('ownProfileStat:', response.data);
      if(response.data.my_unread_notification_count) {
        dispatch(setUnreadNotifications(response.data.my_unread_notification_count));
      }
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const uploadProfilePicture = (params) => {
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/set-profile-picture', params, { 
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      dispatch({ type: UPDATE_PROFILE, user: response.data.user });
      AsyncStorage.setItem(
        'userData',
        JSON.stringify({
          accessToken: axios.defaults.headers.common['Authorization'].substr(7),
          user: response.data
        })
      );
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const updateProfile = params => { 
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/update-profile', params);
      dispatch({ type: UPDATE_PROFILE, user: response.data.user });
      AsyncStorage.setItem(
        'userData',
        JSON.stringify({
          accessToken: axios.defaults.headers.common['Authorization'].substr(7),
          user: response.data
        })
      );
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const updatePassword = params => { 
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/change-password', params);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getMyCourses = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/enrolled-courses-with-progress/'+filter.studentID+'?dummy=true';
      let page = 1;
      if(typeof filter == 'object') {
        if(typeof filter.page != typeof undefined) {
          Uri += "&page="+filter.page;
          page = filter.page;
        }
        if(typeof filter.perpage != typeof undefined) {
          Uri += "&perpage="+filter.perpage;
        }
      }
      const response = await axios.get(Uri);
      dispatch(setCourses(response.data, page == 1 ? true : false));
      return response.data;setCourses
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};


export const getCategoryListing = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/categories/?dummy=true';
      let page = 1;
      if(typeof filter == 'object') {
        if(typeof filter.page != typeof undefined) {
          Uri += "&page="+filter.page;
          page = filter.page;
        }
        if(typeof filter.perpage != typeof undefined) {
          Uri += "&perpage="+filter.perpage;
        }
        if(typeof filter.cid != typeof undefined) {
          Uri += '&cid=' + filter.cid;
      }
      }
      const response = await axios.get(Uri);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getMyCertificates = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/certificates?dummy=true';
      if(typeof filter == 'object') {
        if(typeof filter.sid != typeof undefined) {
          Uri += "&sid="+filter.sid;
        }
        if(typeof filter.page != typeof undefined) {
          Uri += "&page="+filter.page;
        }
        if(typeof filter.perpage != typeof undefined) {
          Uri += "&perpage="+filter.perpage;
        }
      }
      const response = await axios.get(Uri);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getMyAppliedJobs = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/my-job-applications?dummy=true';
      if(typeof filter == 'object') {
        if(typeof filter.stud != typeof undefined) {
          Uri += "&stud="+filter.stud;
        }
        if(typeof filter.page != typeof undefined) {
          Uri += "&page="+filter.page;
        }
        if(typeof filter.perpage != typeof undefined) {
          Uri += "&perpage="+filter.perpage;
        }
      }
      const response = await axios.get(Uri);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const applyJob = jobid => { 
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/apply-job', jobid);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getInterestedJobSectors = params => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/interested-job-sectors';
      const response = await axios.post(Uri, params);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};



export const addImageToPost = params => { 
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'listing/add_new_image_set', params);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};



export const getNotifications = (perpage = 10, page = 1) => { 
  return async dispatch => {
    try {
      const response = await axios.get(globals.get('appConfig').apiUrl+'students/notifications?perpage='+perpage+'&page='+page);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const readNotification = (nid) => {
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/read-notification', {nid: nid});
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const removeNotification = (nid) => {
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/remove-notification', {nid: nid});
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const removeAllNotifications = () => {
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/clear-all-notifications', {});
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const responseToTalentSpot = (params) => {
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/response-talentspot', params);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getMyTalentSpots = filter => { 
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/my-talentspots?dummy=true';
      if(typeof filter.page != typeof undefined) {
        Uri += "&page="+filter.page;
        page = filter.page;
      }
      if(typeof filter.perpage != typeof undefined) {
        Uri += "&perpage="+filter.perpage;
      }
      if(filter.id) {
        Uri += '&id=' + filter.id;
      }
      if(filter.tspid) {
        Uri += '&tspid=' + filter.tspid;
      }
      const response = await axios.get(Uri);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const addToWishlist = (eid, type) => {
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/add-to-wishlist', {eid: eid, type: type});
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const removeFromWishlist = (eid) => {
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/remove-from-wishlist', {eid: eid});
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};


export const getMyWishlist = filter => { 
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/my-wishlist?dummy=true';
      let page = 1;
      if(typeof filter.page != typeof undefined) {
        Uri += "&page="+filter.page;
        page = filter.page;
      }
      if(typeof filter.perpage != typeof undefined) {
        Uri += "&perpage="+filter.perpage;
      }
      if(filter.type) {
        Uri += '&type=' + filter.type;
      }
      const response = await axios.get(Uri);

      // console.log('response',response.data);


      // return false;

      let savedJobs = []

      response.data.forEach(singleSavedJob => {
       if(singleSavedJob.job.length){
        savedJobs.push(singleSavedJob);
       }
      });

      

      dispatch(setSavedJobs(savedJobs, page == 1 ? true : false));
      return savedJobs;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const reportIssue = (params) => {
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'users/report', params);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const contactHelp = (params) => {
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'users/report-general-issue', params);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const registerFCMToken = (fcmToken) => {
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/assign-new-firebase-token', {
        firebaseToken: fcmToken,
        physical_id: getUniqueId(),
      });
      dispatch({ type: UPDATE_PROFILE, user: response.data });
      AsyncStorage.setItem(
        'userData',
        JSON.stringify({
          accessToken: axios.defaults.headers.common['Authorization'].substr(7),
          user: response.data
        })
      );
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const deRegisterFCMToken = (fcmToken) => {
  return dispatch => {
    try {
      axios.post(globals.get('appConfig').apiUrl+'students/delete-firebase-token', {
        firebaseToken: fcmToken
      });
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const logout = () => {
  return async (dispatch, getState) => {
    const {user} = getState().auth;
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if(user.firebaseTokens.indexOf(fcmToken) !== -1) {
      dispatch(deRegisterFCMToken(fcmToken));
    }
    AsyncStorage.removeItem('userData');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: LOGOUT });
    commonActions.setCompanies([]);
    commonActions.setJobs([]);
    commonActions.setEvents([]);
    commonActions.setPastEvents([]);
    commonActions.setCourses([]);
    if(auth().currentUser) {
      auth().signOut();
    }
  };
};






