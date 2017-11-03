// import { REHYDRATE } from 'redux-persist/constants';
import {
  FACEBOOK_LOGIN_SUCCESS,
  FACEBOOK_LOGIN_FAIL,
  FACEBOOK_FETCH_DETAILS,
  EMAIL_LOGIN_CHANGED,
  PASSWORD_LOGIN_CHANGED,
  REQUEST_LOGIN,
  REQUESTED_LOGIN_SUCCEEDED,
  REQUESTED_LOGIN_ERROR,

  FORGOTPASSWORD_SUBMIT,
  FORGOTPASSWORD_SUBMIT_SUCCEEDED,
  FORGOTPASSWORD_SUBMIT_ERROR,

  RESET_PASSWORD,
  RESET_PASSWORD_SUCCEEDED,
  RESET_PASSWORD_ERROR,

  REQUEST_USER_REG,
  REG_USER_SUCCESS,
  REG_USER_FAIL,
  GENERATE_OTP_SUCCESS,
  GENERATE_OTP_FAIL,
  REQUEST_VERIFY_OTP,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAIL,
  CHANGE_PHONE_NUMBER,
  CHANGE_PHONE_NUMBER_ERROR,
} from '../actions/types';

const INITIAL_STATE = {
  loginLoading: false,
  signupLoading: false,
  loggedIn: false,
  signedUp: false,
  verifyOtp: false,
  verifyLoading: false,
  ValidEmail:false,
  EmailVerify:true,

  resetPassword:false,
  resetPasswordSuccess:false
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    // case REHYDRATE:
    //   return action.payload;

    case FACEBOOK_LOGIN_SUCCESS:
      return { token: action.token };
    case FACEBOOK_LOGIN_FAIL:
      return { token: null };

    case FACEBOOK_FETCH_DETAILS:
        return {                
            ...state,
            fbInfo: action.object,
            status: action.object.status,
            loginLoading: false,
        }
    case REQUEST_LOGIN:      
      return {                
          ...state,
          loginLoading: true,
          loggedIn: false,
      } 

    
    case REQUESTED_LOGIN_SUCCEEDED:      
        return {                
            ...state,
            loginLoading: false,
            loggedIn: true,
            token:action.token
        } 

    case REQUESTED_LOGIN_ERROR:      
        return {                
            ...state,
            loginLoading: false,
            loggedIn: false,
            status: action.status,
            userId: action.userId,
            error: action.error
        } 
    
  /*  case FORGOTPASSWORD_SUBMIT:
        return {
            ...state,
            EmailVerify:true,
            ValidEmail:false
        }*/

    case FORGOTPASSWORD_SUBMIT_SUCCEEDED:
        return {
            ...state,
            EmailVerify:false,
            status: action.status,
            ValidEmail:true,
           
        }
    
    case FORGOTPASSWORD_SUBMIT_ERROR:
        return {
            ...state,
            EmailVerify:false,
            status: action.status,
            ValidEmail:false
        }
    /*case RESET_PASSWORD:
       return  {
            ...state,
            resetPassword : true,
        }*/
    case RESET_PASSWORD_SUCCEEDED:
        return {
            ...state,
             status: action.status,
             token: action.token,
             resetPasswordSuccess : true
        }
    case RESET_PASSWORD_ERROR:
        return {
            ...state,
             status: action.status,
             resetPasswordSuccess : false
        }
    case REQUEST_USER_REG:      
      return {                
          ...state,
          signupLoading: true,
          signedUp: false,
      } 

    case REG_USER_SUCCESS:      
        return {                
            ...state,
            signupLoading: false,
            signedUp: true,
            phoneNumber: action.phoneNumber
        } 

    case REG_USER_FAIL:      
        return {                
            ...state,
            signupLoading: false,
            signedUp: false,
            error: action.error
        }
    case GENERATE_OTP_SUCCESS:      
        return {                
            ...state,
        }
    case GENERATE_OTP_FAIL:      
        return {                
            ...state,
            error: action.error
        } 
    case REQUEST_VERIFY_OTP:      
      return {                
          ...state,
          verifyLoading: true
      } 
    case VERIFY_OTP_SUCCESS:      
        return {                
            ...state,
            verifyOtp: true,
            verifyLoading: false,
            token:action.token
        }
    case VERIFY_OTP_FAIL:      
        return {                
            ...state,
            verifyOtp: false,
            verifyLoading: false,
            error: action.error,
            loginLoading: false,
            status: action.status,
            userId: action.userId
        }
    case CHANGE_PHONE_NUMBER:
        return {
            ...state,
            phoneNumber: action.phoneNumber
        }
    case CHANGE_PHONE_NUMBER_ERROR:
        return {
            ...state,
            error: action.error
        }
    default:
      return state;
  }
}
