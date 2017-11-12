import {
  GET_ACTIVITIES_MY_SKILLS,
  GET_ACTIVITIES_REQUESTED_SKILLS,
  GET_ACTIVITIES_ARCHIVED_SKILLS,
  GET_ACTIVITIES_ERROR,
  INIT_CHAT,
  INIT_CHAT_ERROR,
  CREATE_OFFER_REQUEST,
  CREATE_OFFER,
  CREATE_OFFER_ERROR,
  ACCEPT_OFFER_REQUEST,
  ACCEPT_OFFER,
  ACCEPT_OFFER_ERROR,
  REJECT_OFFER_REQUEST,
  REJECT_OFFER,
  REJECT_OFFER_ERROR,
} from '../actions/types';
  
  const INITIAL_STATE = {
    
  };
  
export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_ACTIVITIES_MY_SKILLS:
      return { ...state, mySkills: action.activities };
    case GET_ACTIVITIES_REQUESTED_SKILLS:
      return { ...state, requestedSkills: action.activities };
    case GET_ACTIVITIES_ARCHIVED_SKILLS:
      return { ...state, archivedSkills: action.activities };
    case GET_ACTIVITIES_ERROR:
      return { ...state, error: action.error };
    case INIT_CHAT:
      return { ...state, initChat: true };
    case INIT_CHAT_ERROR:
      return { ...state, error: action.error, initChat: false };
    case CREATE_OFFER_REQUEST:
      return { ...state, offerLoading: true };
    case CREATE_OFFER:
      return { ...state, offerLoading: false, offerSuccess: true };
    case CREATE_OFFER_ERROR:
      return { ...state, error: action.error, offerLoading: false, offerSuccess: false };
    case ACCEPT_OFFER_REQUEST:
      return { ...state, offerLoading: true };
    case ACCEPT_OFFER:
      return { ...state, offerLoading: false, offerSuccess: true };
    case ACCEPT_OFFER_ERROR:
      return { ...state, error: action.error, offerLoading: false, offerSuccess: false };
    case REJECT_OFFER_REQUEST:
      return { ...state, offerLoading: true };
    case REJECT_OFFER:
      return { ...state, offerLoading: false, offerSuccess: true };
    case REJECT_OFFER_ERROR:
      return { ...state, error: action.error, offerLoading: false, offerSuccess: false };
    default:
      return state;
  }
}
  