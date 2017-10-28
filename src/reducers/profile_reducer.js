// import { REHYDRATE } from 'redux-persist/constants';
import {
  GET_MY_PROFILE_INFO,
  GET_PROFILE_INFO,
  PROFILE_ERROR,
  SET_LOCATION,
  REGISTER_MAVEN,
  REGISTER_MAVEN_FAILED,
  REQUEST_REGISTER_MAVEN,
  ACTIVATE_MAVEN,
  ACTIVATE_MAVEN_ERROR,
  DEACTIVATE_MAVEN,
  DEACTIVATE_MAVEN_ERROR,
  DELETE_MAVEN,
  DELETE_MAVEN_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  myInfo: {},
  user: {},
  error: null,
  loading: false,
  mavenLoading: true,
  mavenRegSuccess: false
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
      return { ...state, mavenLoading: false, msg: action.msg, mavenRegSuccess: true };
    case REGISTER_MAVEN_FAILED:
      return { ...state, mavenLoading: false, msg: action.msg, mavenRegSuccess: false };
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

    default:
      return state;
  }
}
