import { CHANGE_CONNECTION_STATUS, SET_APP_LOADING, SET_REQUIRED_APP_VERSION, SET_SYSTEM_MESSAGE, SET_NOTIFICATION_MESSAGE, SET_SCREEN_HEIGHT, SET_SCREEN_TOP, SET_CATEGORIES, SET_COMPANIES, SET_JOBS, SET_EVENTS, SET_PAST_EVENTS, SET_INSIGHT_CATS, SET_INSIGHTS, SET_TALENT_SPOTS, SET_COURSES, SET_SETTINGS, SET_PAGES, SET_FEATURED_JOBS, SET_FEATURED_COMPANIES, SET_INSIGHTS_UNDER_CAT  } from '../actions/common';

const initialState = {
  isConnected: true,
  appLoading: true,
  appVersionRequired: 0,
  systemMessage: '',
  notificationMessage: '',
  screenHeight: 0,
  screenTop: 0,
  categories: [],
  companies: [],
  featuredCompanies: [],
  jobs: [],
  featuredJobs: [],
  events: [],
  courses: [],
  pastEvents: [],
  insightCats: [],
  insights: [],
  insightsUnderCat: [],
  talentSpots: [],
  settings: {
    customerSupportEmail: '',
    customerSupportContactNumber: '',
    customerSupportWebSite: '',
    customerSupportAddress: '',
  },
  pages: [],
};

export default (state = initialState, action) => { 
  switch (action.type) {
    case CHANGE_CONNECTION_STATUS:
      return  {
        ...state,
        isConnected: action.isConnected
      };
    case SET_APP_LOADING:
      return  {
        ...state,
        appLoading: action.appLoading
      };
    case SET_REQUIRED_APP_VERSION:
      return {
        ...state,
        appVersionRequired: action.appVersionRequired
      };
    case SET_SYSTEM_MESSAGE:
      return {
        ...state,
        systemMessage: action.message
      };
    case SET_NOTIFICATION_MESSAGE:
      return {
        ...state,
        notificationMessage: action.message
      };
    case SET_SCREEN_HEIGHT:
      return {
        ...state,
        screenHeight: action.height > 0 ? action.height : state.screenHeight
      };
    case SET_SCREEN_TOP:
      return {
        ...state,
        screenTop: action.top
      };
    case SET_CATEGORIES:
      if(action.refresh) {
        return {
          ...state,
          categories: [...action.posts]
        };
      } else {
        action.posts.forEach(post => state.categories.push(post));
        return {
          ...state,
          categories: state.categories
        };
      }
    case SET_COMPANIES:
      if(action.refresh) {
        return {
          ...state,
          companies: [...action.posts]
        };
      } else {
        action.posts.forEach(post => state.companies.push(post));
        return {
          ...state,
          companies: state.companies
        };
      }
    case SET_FEATURED_COMPANIES:
      if(action.refresh) {
        return {
          ...state,
          featuredCompanies: [...action.posts]
        };
      } else {
        action.posts.forEach(post => state.featuredCompanies.push(post));
        return {
          ...state,
          featuredCompanies: state.companies
        };
      }
    case SET_JOBS:
      if(action.refresh) {
        return {
          ...state,
          jobs: [...action.posts]
        };
      } else {
        action.posts.forEach(post => state.jobs.push(post));
        return {
          ...state,
          jobs: state.jobs
        };
    } 
    case SET_FEATURED_JOBS:
      if(action.refresh) {
        return {
          ...state,
          featuredJobs: [...action.posts]
        };
      } else {
        action.posts.forEach(post => state.featuredJobs.push(post));
        return {
          ...state,
          featuredJobs: state.featuredJobs
        };
    }
    
    case SET_EVENTS:
      if(action.refresh) {
        return {
          ...state,
          events: [...action.posts]
        };
      } else {
        action.posts.forEach(post => state.events.push(post));
        return {
          ...state,
          events: state.events
        };
      }

    case SET_PAST_EVENTS:
      if(action.refresh) {
        return {
          ...state,
          pastEvents: [...action.posts]
        };
      } else {
        action.posts.forEach(post => state.pastEvents.push(post));
        return {
          ...state,
          pastEvents: state.pastEvents
        };
      }

    case SET_INSIGHT_CATS:
      if(action.refresh) {
        return {
          ...state,
          insightCats: [...action.posts]
        };
      } else {
        action.posts.forEach(post => state.insightCats.push(post));
        return {
          ...state,
          insightCats: state.insightCats
        };
      }

    case SET_INSIGHTS:
      if(action.refresh) {
        return {
          ...state,
          insights: [...action.posts]
        };
      } else {
        action.posts.forEach(post => state.insights.push(post));
        return {
          ...state,
          insights: state.insights
        };
      }

    case SET_INSIGHTS_UNDER_CAT:
      if(action.refresh) {
        return {
          ...state,
          insightsUnderCat: [...action.posts]
        };
      } else {
        action.posts.forEach(post => state.insightsUnderCat.push(post));
        return {
          ...state,
          insightsUnderCat: state.insightsUnderCat
        };
      }

    case SET_TALENT_SPOTS:
      if(action.refresh) {
        return {
          ...state,
          talentSpots: [...action.posts]
        };
      } else {
        action.posts.forEach(post => state.talentSpots.push(post));
        return {
          ...state,
          talentSpots: state.talentSpots
        };
      }

    case SET_COURSES:
      if(action.refresh) {
        return {
          ...state,
          courses: [...action.posts]
        };
      } else {
        action.posts.forEach(post => state.courses.push(post));
        return {
          ...state,
          courses: state.courses
        };
      }

    case SET_SETTINGS:
      return {
        ...state,
        settings: action.settings
      };
    case SET_PAGES:
      return {
        ...state,
        pages: action.pages
      };


    }
    
  return state;
};

