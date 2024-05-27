import { AUTHENTICATE, UPDATE_PROFILE, SET_MCOURSES, SET_SAVED_JOBS, LOGOUT } from '../actions/auth';

const initialState = {
  isLoggedIn: false,
  accessToken: null,
  user: null,
  courses: [],
  savedJobs: [],
};

export default (state = initialState, action) => {
  let user = null;
  switch (action.type) {
    case AUTHENTICATE:
      user = action.user;
      return {
        ...state,
        isLoggedIn: true,
        accessToken: action.accessToken,
        user: user
      };
    case UPDATE_PROFILE:
      user = action.user;
      return {
        ...state,
        user: user
      };
    case SET_MCOURSES:
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
    case SET_SAVED_JOBS:
      if(action.refresh) {
        return {
          ...state,
          savedJobs: [...action.posts]
        };
      } else {
        action.posts.forEach(post => {
          console.log(post)
          let index = state.savedJobs.findIndex(savedJob => savedJob._id == post._id);
          if( index === -1) {
            state.savedJobs.push(post);
          } else {
            state.savedJobs.splice(index, 1);
          }
        });
        console.log(state.savedJobs);
        return {
          ...state,
          savedJobs: [...state.savedJobs]
        };
      }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
