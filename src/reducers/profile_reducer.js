// import { REHYDRATE } from 'redux-persist/constants';
import {
  GET_MY_PROFILE_INFO,
  GET_PROFILE_INFO,
  PROFILE_ERROR,
  SET_LOCATION,
  REGISTER_MAVEN,
  REGISTER_MAVEN_ERROR,
  REQUEST_REGISTER_MAVEN,
  ACTIVATE_MAVEN,
  ACTIVATE_MAVEN_ERROR,
  DEACTIVATE_MAVEN,
  DEACTIVATE_MAVEN_ERROR,
  DELETE_MAVEN,
  DELETE_MAVEN_ERROR,
  REQUEST_ADD_MAVEN_IMAGE,
  ADD_MAVEN_IMAGE,
  ADD_MAVEN_IMAGE_ERROR,
  REQUEST_DELETE_MAVEN_IMAGE,
  DELETE_MAVEN_IMAGE,
  DELETE_MAVEN_IMAGE_ERROR,
  CHECK_ID,
  CHECK_ID_ERROR,
  REQUEST_EDIT_MAVEN_DETAILS,
  EDIT_MAVEN_DETAILS,
  EDIT_MAVEN_DETAILS_ERROR,
  EDIT_ABOUT,
  EDIT_ABOUT_ERROR,
  SAVE_MAVEN,
  SAVE_MAVEN_ERROR,
  REPORT_MAVEN,
  REPORT_MAVEN_ERROR,
  REQUEST_UPDATE_PROFILE_IMAGE,
  UPDATE_PROFILE_IMAGE,
  UPDATE_PROFILE_IMAGE_ERROR,
  GIVE_APP_FEEDBACK,
  GIVE_APP_FEEDBACK_ERROR,
  GET_SAVED_MAVENS,
  GET_SAVED_MAVENS_ERROR,
} from '../actions/types';

const INITIAL_STATE = {
  myInfo: {},
  user: {},
  error: null,
  loading: false,
  mavenLoading: false,
  mavenImageLoading: false,
  mavenRegSuccess: false,
  mavenImageSuccess: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_MY_PROFILE_INFO:
      return { ...state, myInfo: action.myInfo, loading: true };
    case GET_PROFILE_INFO:
      return { ...state, user: action.user, loading: true };
    case PROFILE_ERROR:      
        return { ...state, error: action.error, loading: false };
    case SET_LOCATION:
      return { ...state, location: action.location };
    case REQUEST_REGISTER_MAVEN:
      return { ...state, mavenLoading: true };
    case REGISTER_MAVEN:
      return { ...state, mavenLoading: false, mavenRegSuccess: true };
    case REGISTER_MAVEN_ERROR:
      return { ...state, mavenLoading: false, error: action.error, mavenRegSuccess: false };
    case ACTIVATE_MAVEN:
      return { ...state};
    case ACTIVATE_MAVEN_ERROR:
      return { ...state, error: action.error};
    case DEACTIVATE_MAVEN:
      return { ...state};
    case DEACTIVATE_MAVEN_ERROR:
      return { ...state, error: action.error};
    case DELETE_MAVEN:
      return { ...state};
    case DELETE_MAVEN_ERROR:
      return { ...state, error: action.error};
    case REQUEST_ADD_MAVEN_IMAGE:
      return { ...state, mavenImageLoading: true };
    case ADD_MAVEN_IMAGE:
      return { ...state, mavenImageLoading: false, mavenImageSuccess: true };
    case ADD_MAVEN_IMAGE_ERROR:
      return { ...state, mavenImageLoading: false, error: action.error, mavenImageSuccess: false };
    case REQUEST_DELETE_MAVEN_IMAGE:
      return { ...state, mavenImageLoading: true };
    case DELETE_MAVEN_IMAGE:
      return { ...state, mavenImageLoading: false, mavenImageSuccess: true };
    case DELETE_MAVEN_IMAGE_ERROR:
      return { ...state, mavenImageLoading: false, error: action.error, mavenImageSuccess: false };
    case CHECK_ID:
      return { ...state, postalCode: action.data.postalCode, idVerified: action.data.idVerified};
    case CHECK_ID_ERROR :
      return { ...state, error: action.error};
    case REQUEST_EDIT_MAVEN_DETAILS:
      return { ...state, mavenLoading: true };
    case EDIT_MAVEN_DETAILS:
      return { ...state, mavenLoading: false, mavenRegSuccess: true };
    case EDIT_MAVEN_DETAILS_ERROR:
      return { ...state, mavenLoading: false, error: action.error, mavenRegSuccess: false };
    case EDIT_ABOUT:
      return { ...state };
    case EDIT_ABOUT_ERROR:
      return { ...state, error: action.error };
    case SAVE_MAVEN:
      return { ...state };
    case SAVE_MAVEN_ERROR:
      return { ...state, error: action.error };
    case REPORT_MAVEN:
      return { ...state };
    case REPORT_MAVEN_ERROR:
      return { ...state, error: action.error };
    case REQUEST_UPDATE_PROFILE_IMAGE:
      return { ...state };
    case UPDATE_PROFILE_IMAGE:
      return { ...state };
    case UPDATE_PROFILE_IMAGE_ERROR:
      return { ...state, error: action.error };
    case GIVE_APP_FEEDBACK:
      return { ...state };
    case GIVE_APP_FEEDBACK_ERROR:
      return { ...state, error: action.error };
    case GET_SAVED_MAVENS:
      return { ...state, savedMavens: action.savedMavens };
    case GET_SAVED_MAVENS_ERROR:
      return { ...state, error: action.error };

    default:
      return state;
  }
}
