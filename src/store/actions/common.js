import globals from '../../config/globals';
import axios from 'axios';
import { Platform } from 'react-native';

export const CHANGE_CONNECTION_STATUS = 'CHANGE_CONNECTION_STATUS';
export const SET_APP_LOADING = 'SET_APP_LOADING';
export const SET_REQUIRED_APP_VERSION = 'SET_REQUIRED_APP_VERSION';
export const SET_SYSTEM_MESSAGE = 'SET_SYSTEM_MESSAGE';
export const SET_NOTIFICATION_MESSAGE = 'SET_NOTIFICATION_MESSAGE';
export const SET_SCREEN_HEIGHT = 'SET_SCREEN_HEIGHT';
export const SET_SCREEN_TOP = 'SET_SCREEN_TOP';
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const SET_COMPANIES = 'SET_COMPANIES';
export const SET_FEATURED_COMPANIES = 'SET_FEATURED_COMPANIES';
export const SET_JOBS = 'SET_JOBS';
export const SET_FEATURED_JOBS = 'SET_FEATURED_JOBS';
export const SET_EVENTS = 'SET_EVENTS';
export const SET_PAST_EVENTS = 'SET_PAST_EVENTS';
export const SET_INSIGHT_CATS = 'SET_INSIGHT_CATS';
export const SET_INSIGHTS = 'SET_INSIGHTS';
export const SET_INSIGHTS_UNDER_CAT = 'SET_INSIGHTS_UNDER_CAT';
export const SET_TALENT_SPOTS = 'SET_TALENT_SPOTS';
export const SET_COURSES = 'SET_COURSES';
export const SET_SETTINGS = 'SET_SETTINGS';
export const SET_PAGES = 'SET_PAGES';

export const connectionState = status => {
  return { type: CHANGE_CONNECTION_STATUS, isConnected: status };
};

export const setAppLoading = status => {
  return { type: SET_APP_LOADING, appLoading: status };
};

export const setRequiredAppVersion = appVersionRequired => {
  return { type: SET_REQUIRED_APP_VERSION, appVersionRequired: appVersionRequired };
};

export const setSystemMessage = message => {
  return { type: SET_SYSTEM_MESSAGE, message: message };
};

export const setNotificationMessage = message => {
  return { type: SET_NOTIFICATION_MESSAGE, message: message };
};

export const setScreenHeight = height => { 
  return { type: SET_SCREEN_HEIGHT, height: height };
};

export const setScreenTop = top => { 
  return { type: SET_SCREEN_TOP, top: top };
};

export const setCategories = (posts, refresh = true) => {
  return { type: SET_CATEGORIES, posts: posts, refresh: refresh };
};

export const setCompanies = (posts, refresh = true) => {
  return { type: SET_COMPANIES, posts: posts, refresh: refresh };
};

export const setFeaturedCompanies = (posts, refresh = true) => {
  return { type: SET_FEATURED_COMPANIES, posts: posts, refresh: refresh };
};

export const setJobs = (posts, refresh = true) => {
  return { type: SET_JOBS, posts: posts, refresh: refresh };
};

export const setFeaturedJobs = (posts, refresh = true) => {
  return { type: SET_FEATURED_JOBS, posts: posts, refresh: refresh };
};

export const setEvents = (posts, refresh = true) => {
  return { type: SET_EVENTS, posts: posts, refresh: refresh };
};

export const setPastEvents = (posts, refresh = true) => {
  return { type: SET_PAST_EVENTS, posts: posts, refresh: refresh };
};

export const setInsightCats = (posts, refresh = true) => {
  return { type: SET_INSIGHT_CATS, posts: posts, refresh: refresh };
};

export const setInsights = (posts, refresh = true) => {
  return { type: SET_INSIGHTS, posts: posts, refresh: refresh };
};

export const setInsightsUnderCat = (posts, refresh = true) => {
  return { type: SET_INSIGHTS_UNDER_CAT, posts: posts, refresh: refresh };
};

export const setTalentSpots = (posts, refresh = true) => {
  return { type: SET_TALENT_SPOTS, posts: posts, refresh: refresh };
};



export const setCourses = (posts, refresh = true) => {
  return { type: SET_COURSES, posts: posts, refresh: refresh };
};

export const setSettings = settings => {
  return { type: SET_SETTINGS, settings: settings };
};

export const setPages = pages => {
  return { type: SET_PAGES, pages: pages };
};

export const checkEmailExists = params => { 
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/check-email-exists', params);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const checkMobileExists = params => { 
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/check-mobile-exists', params);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getCategories = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/categories?dummy=true';
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
      dispatch(setCategories(response.data, page == 1 ? true : false));
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getCompanies = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/companies?dummy=true';
      let page = 1;
      if(typeof filter == 'object') {
        if(typeof filter.page != typeof undefined) {
          Uri += "&page="+filter.page;
          page = filter.page;
        }
        if(typeof filter.perpage != typeof undefined) {
          Uri += "&perpage="+filter.perpage;
        }
        if(filter.cmpid) {
          Uri += '&cmpid=' + filter.cmpid;
      }
        if(filter.q) {
            Uri += '&q=' + filter.q;
        }
        if(filter.sort) {
          Uri += '&sort=' + filter.sort;
        }
        if(filter.cid) {
            Uri += '&cid=' + filter.cid;
        }
        if(filter.featured) {
          Uri += '&featured=' + filter.featured;
        } 
      }
      const response = await axios.get(Uri);
      
      if(!filter.featured) {
        dispatch(setCompanies(response.data, page == 1 ? true : false));
      } else {
        dispatch(setFeaturedCompanies(response.data, page == 1 ? true : false));
      }
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getCompanySuggestions = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/suggestions-companies?dummy=true';
      if(typeof filter == 'object') {
        if(typeof filter.page != typeof undefined) {
          Uri += "&page="+filter.page;
          page = filter.page;
        }
        if(typeof filter.perpage != typeof undefined) {
          Uri += "&perpage="+filter.perpage;
        }
        if(filter.q) {
            Uri += '&q=' + filter.q;
        }
      }
      const response = await axios.get(Uri);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getJobLocations = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/job-locations?dummy=true';
      if(typeof filter == 'object') {
        if(typeof filter.page != typeof undefined) {
          Uri += "&page="+filter.page;
          page = filter.page;
        }
        if(typeof filter.perpage != typeof undefined) {
          Uri += "&perpage="+filter.perpage;
        }
        if(filter.q) {
            Uri += '&q=' + filter.q;
        }
      }
      const response = await axios.get(Uri);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};
 
export const getJobs = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/jobs?dummy=true';
      let page = 1;
      if(typeof filter == 'object') {
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
        if(filter.q) {
            Uri += '&q=' + filter.q;
        }
        if(filter.cids) {
            Uri += '&cids=' + filter.cids;
        }
        if(filter.cmpids) {
            Uri += '&cmpids=' + filter.cmpids;
        }
        if(filter.cid) {
            Uri += '&cid=' + filter.cid;
        }
        if(filter.cmpid) {
            Uri += '&cmpid=' + filter.cmpid;
        }
        if(filter.location) {
          Uri += '&location=' + filter.location;
        }
        if(filter.type) {
          Uri += '&type=' + filter.type;
        }
        if(filter.sort) {
            Uri += '&sort=' + filter.sort;
        }
        if(filter.course) {
          Uri += '&course=' + filter.course;
        } 
        if(filter.featured) {
          Uri += '&featured=' + filter.featured;
        } 
      }
      const response = await axios.get(Uri);
      if(!filter.featured) {
        dispatch(setJobs(response.data, page == 1 ? true : false));
      } else {
        dispatch(setFeaturedJobs(response.data, page == 1 ? true : false));
      }
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getJobSuggestions = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/suggestions-jobs?dummy=true';
      if(typeof filter == 'object') {
        if(typeof filter.page != typeof undefined) {
          Uri += "&page="+filter.page;
          page = filter.page;
        }
        if(typeof filter.perpage != typeof undefined) {
          Uri += "&perpage="+filter.perpage;
        }
        if(filter.q) {
            Uri += '&q=' + filter.q;
        }
      }
      const response = await axios.get(Uri);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getEvents = filter => {
  filter.eventType = !filter.eventType ? 'Virtual' : filter.eventType;
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+''+(filter.eventType == 'Virtual' ? 'students/events' : 'listing/in-person-events')+'?dummy=true';
      let page = 1;
      if(typeof filter == 'object') {
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
        if(filter.q) {
            Uri += '&q=' + filter.q;
        }
        if(filter.cids) {
            Uri += '&cids=' + filter.cids;
        }
        if(filter.cid) {
          Uri += '&cid=' + filter.cid;
        }
        if(filter.cmpids) {
            Uri += '&cmpids=' + filter.cmpids;
        }
        if(filter.cmpid) {
          Uri += '&cmpid=' + filter.cmpid;
      }
        if(filter.sort) {
            Uri += '&sort=' + filter.sort;
        }
      } 
      const response = await axios.get(Uri);
      dispatch(setEvents(response.data, page == 1 ? true : false));
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getEventSuggestions = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/suggestions-events?dummy=true';
      if(typeof filter == 'object') {
        if(typeof filter.page != typeof undefined) {
          Uri += "&page="+filter.page;
          page = filter.page;
        }
        if(typeof filter.perpage != typeof undefined) {
          Uri += "&perpage="+filter.perpage;
        }
        if(filter.q) {
            Uri += '&q=' + filter.q;
        }
      }
      const response = await axios.get(Uri);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getCourses = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/courses?dummy=true';
      let page = 1;
      if(typeof filter == 'object') {
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
        if(filter.q) {
            Uri += '&q=' + filter.q;
        }
        if(filter.cids) {
            Uri += '&cids=' + filter.cids;
        }
        if(filter.cid) {
          Uri += '&cid=' + filter.cid;
        }
        if(filter.cmpids) {
            Uri += '&cmpids=' + filter.cmpids;
        }
        if(filter.cmpid) {
          Uri += '&cmpid=' + filter.cmpid;
      }
        if(filter.sort) {
            Uri += '&sort=' + filter.sort;
        }
      }
      const response = await axios.get(Uri);
      dispatch(setCourses(response.data, page == 1 ? true : false));
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getPastEvents = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/event-archives?dummy=true';
      let page = 1;
      if(typeof filter == 'object') {
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
        if(filter.q) {
            Uri += '&q=' + filter.q;
        }
        if(filter.cids) {
            Uri += '&cids=' + filter.cids;
        }
        if(filter.cid) {
          Uri += '&cid=' + filter.cid;
        }
        if(filter.cmpids) {
            Uri += '&cmpids=' + filter.cmpids;
        }
        if(filter.cmpid) {
          Uri += '&cmpid=' + filter.cmpid;
      }
        if(filter.sort) {
            Uri += '&sort=' + filter.sort;
        }
      }
      const response = await axios.get(Uri);
      dispatch(setPastEvents(response.data, page == 1 ? true : false));
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};
export const registerEventArchiveLog = eid => { 
  return async dispatch => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'students/event-archive-log-view', {id:eid});
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};


export const getPastEventSuggestions = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/suggestions-event-archives?dummy=true';
      if(typeof filter == 'object') {
        if(typeof filter.page != typeof undefined) {
          Uri += "&page="+filter.page;
          page = filter.page;
        }
        if(typeof filter.perpage != typeof undefined) {
          Uri += "&perpage="+filter.perpage;
        }
        if(filter.q) {
            Uri += '&q=' + filter.q;
        }
      }
      const response = await axios.get(Uri);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getInsightCats = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'listing/insight-categories?dummy=true';
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
      dispatch(setInsightCats(response.data, page == 1 ? true : false));
      return response.data;
    } catch(error) { 
      throw new Error(globals.getError(error));
    }
  };
};

export const getInsights = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'listing/insights?dummy=true';
      let page = 1;
      if(typeof filter == 'object') {
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
        if(filter.q) {
          Uri += '&q=' + filter.q;
        }
        if(filter.cids) {
          Uri += '&cids=' + filter.cids;
        }
        if(filter.sort) {
          Uri += '&sort=' + filter.sort;
        }
      }
      const response = await axios.get(Uri);
      dispatch(setInsights(response.data.list, page == 1 ? true : false));
      return response.data;
    } catch(error) { 
      throw new Error(globals.getError(error));
    }
  };
};



export const getInsightsUnderCat = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'listing/insights?dummy=true';
      let page = 1;
      if(typeof filter == 'object') {
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
        if(filter.q) {
            Uri += '&q=' + filter.q;
        }
        if(filter.cids) {
            Uri += '&cids=' + filter.cids;
        }
        if(filter.sort) {
            Uri += '&sort=' + filter.sort;
        }
      }
      const response = await axios.get(Uri);
      dispatch(setInsightsUnderCat(response.data.list, page == 1 ? true : false));
      return response.data;
    } catch(error) { 
      throw new Error(globals.getError(error));
    }
  };
};

export const getTalentSpots = filter => {
  return async dispatch => {
    try {
      let Uri = globals.get('appConfig').apiUrl+'students/talentspots?dummy=true';
      let page = 1;
      if(typeof filter == 'object') {
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
        if(filter.q) {
            Uri += '&q=' + filter.q;
        }
        if(filter.cids) {
            Uri += '&cids=' + filter.cids;
        }
        if(filter.cid) {
          Uri += '&cid=' + filter.cid;
        }
        if(filter.cmpids) {
            Uri += '&cmpids=' + filter.cmpids;
        }
        if(filter.cmpid) {
          Uri += '&cmpid=' + filter.cmpid;
      }
        if(filter.sort) {
            Uri += '&sort=' + filter.sort;
        }
      }
      const response = await axios.get(Uri);
      dispatch(setTalentSpots(response.data, page == 1 ? true : false));
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const contactHelp = (params) => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.post(globals.get('appConfig').apiUrl+'reach-us', params);
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getSettings = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(globals.get('appConfig').apiUrl+'public-settings');
      dispatch(setSettings({
        customerSupportEmail: response.data.customerSupportEmail01,
        customerSupportContactNumber: response.data.customerSupportContactNo01,
        customerSupportWebSite: response.data.customerSupportWebSite,
        customerSupportAddress: response.data.customerSupportAddress,
      }));
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};

export const getPages = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(globals.get('appConfig').apiUrl+'active-static-pages/?dummy=true');
      dispatch(setPages(response.data));
      return response.data;
    } catch(error) {
      throw new Error(globals.getError(error));
    }
  };
};
