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
  CANCEL_OFFER_REQUEST,
  CANCEL_OFFER,
  CANCEL_OFFER_ERROR,
  EDIT_OFFER_REQUEST,
  EDIT_OFFER,
  EDIT_OFFER_ERROR,
  END_JOB_REQUEST,
  END_JOB,
  END_JOB_ERROR,
  ARCHIVE_ACTIVITY_REQUEST,
  ARCHIVE_ACTIVITY,
  ARCHIVE_ACTIVITY_ERROR,
  REVIEW_ACTIVITY_REQUEST,
  REVIEW_ACTIVITY,
  REVIEW_ACTIVITY_ERROR,
  GET_MAVEN_ACTIVITIES,
  GET_MAVEN_ACTIVITIES_ERROR,
  REFRESH_ACTIVITIES,
  REFRESH_ACTIVITIES_REQUEST,
  REMOVE_NOTIFICATION_ACTIVITY_ID,
  UPLOAD_CHAT_IMAGE,
  UPLOAD_CHAT_IMAGE_ERROR,
  UPLOAD_CHAT_IMAGE_REQUEST,
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
      return { ...state, activityLoading: true };
    case CREATE_OFFER:
      return { ...state, activityLoading: false, activitySuccess: true, showSuccessModal: true };
    case CREATE_OFFER_ERROR:
      return { ...state, error: action.error, activityLoading: false, activitySuccess: false };
    case ACCEPT_OFFER_REQUEST:
      return { ...state, activityLoading: true };
    case ACCEPT_OFFER:
      return { ...state, activityLoading: false, activitySuccess: true, showSuccessModal: true };
    case ACCEPT_OFFER_ERROR:
      return { ...state, error: action.error, activityLoading: false, activitySuccess: false };
    case REJECT_OFFER_REQUEST:
      return { ...state, activityLoading: true };
    case REJECT_OFFER:
      return { ...state, activityLoading: false, activitySuccess: true, showSuccessModal: true };
    case REJECT_OFFER_ERROR:
      return { ...state, error: action.error, activityLoading: false, activitySuccess: false };
    case CANCEL_OFFER_REQUEST:
      return { ...state, activityLoading: true };
    case CANCEL_OFFER:
      return { ...state, activityLoading: false, activitySuccess: true, showSuccessModal: true };
    case CANCEL_OFFER_ERROR:
      return { ...state, error: action.error, activityLoading: false, activitySuccess: false };
    case EDIT_OFFER_REQUEST:
      return { ...state, activityLoading: true };
    case EDIT_OFFER:
      return { ...state, activityLoading: false, activitySuccess: true, showSuccessModal: true };
    case EDIT_OFFER_ERROR:
      return { ...state, error: action.error, activityLoading: false, activitySuccess: false };
    case END_JOB_REQUEST:
      return { ...state, activityLoading: true };
    case END_JOB:
      return { ...state, activityLoading: false, activitySuccess: true, showSuccessModal: true };
    case END_JOB_ERROR:
      return { ...state, error: action.error, activityLoading: false, activitySuccess: false };
    case ARCHIVE_ACTIVITY_REQUEST:
      return { ...state, activityLoading: true };
    case ARCHIVE_ACTIVITY:
      return { ...state, activityLoading: false, activitySuccess: true, showSuccessModal: true };
    case ARCHIVE_ACTIVITY_ERROR:
      return { ...state, error: action.error, activityLoading: false, activitySuccess: false };
    case REVIEW_ACTIVITY_REQUEST:
      return { ...state, activityLoading: true };
    case REVIEW_ACTIVITY:
      return { ...state, activityLoading: false, activitySuccess: true, showSuccessModal: true };
    case REVIEW_ACTIVITY_ERROR:
      return { ...state, error: action.error, activityLoading: false, activitySuccess: false };
    case GET_MAVEN_ACTIVITIES:
      return { ...state, mavenActivities: action.activities };
    case GET_MAVEN_ACTIVITIES_ERROR:
      return { ...state, error: action.error };
    case REFRESH_ACTIVITIES_REQUEST:
      return { ...state, activityLoading: true };
    case REFRESH_ACTIVITIES:
      return { ...state, activityLoading: false, activitySuccess: true, showSuccessModal: false, notificationActId: action.notificationActId };
    case REMOVE_NOTIFICATION_ACTIVITY_ID:
      return { ...state, notificationActId: undefined };
    case UPLOAD_CHAT_IMAGE_REQUEST:
      return { ...state, uploadedUrl: undefined };
    case UPLOAD_CHAT_IMAGE:
      return { ...state, uploadedUrl: action.uploadedUrl };
    case UPLOAD_CHAT_IMAGE_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
}
  