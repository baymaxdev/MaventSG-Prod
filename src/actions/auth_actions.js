import { Facebook } from 'expo';
import request from '../routes/services/getData';
var RNUploader = require('NativeModules').RNUploader;
import {
  FACEBOOK_LOGIN_SUCCESS,
  FACEBOOK_LOGIN_FAIL,
  FACEBOOK_FETCH_DETAILS,
  REQUEST_LOGIN,
  REQUEST_LOGIN_WITH_TOKEN,
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
} from './types';

export const requestSignup = (userData, token) => {
  let email = userData.email;
  let password = userData.password;
  let firstName = userData.firstName;
  let lastName = userData.lastName;
  let dob = userData.dob;
  let gender = userData.gender;
  let phoneNumber = userData.phoneNumber;
  let photo = userData.photo;
  let formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);
  formData.append('dob', dob);
  formData.append('gender', gender);
  formData.append('phoneNumber', "65" + phoneNumber);
  if(photo){
    let filename = photo.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? match[1] : '';
    formData.append('photo', { uri: photo, name: `photo.${type}`, type: `image/${type}`});
  }

  let option = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };
  return dispatch => {
    dispatch({ type: REQUEST_USER_REG });
    const url = `user/register`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: REG_USER_SUCCESS, phoneNumber });
      }
      else dispatch({ type: REG_USER_FAIL, error: res.msg });
    })
    .catch(err => {
      dispatch({ type: REG_USER_FAIL, error: err });
    })
  }
}

export const generateOTP = (phoneNumber) => {
  let option = {
    method: 'GET',
  };
  let realPhoneNumber = '65' + phoneNumber;
  return dispatch => {
    const url = `user/generateOtp?phoneNumber=${realPhoneNumber}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: GENERATE_OTP_SUCCESS });
      }
      else dispatch({ type: GENERATE_OTP_FAIL, error: res.msg });
    })
    .catch(err => {
      dispatch({ type: GENERATE_OTP_FAIL, error: err });
    })
  }

}

export const verifyOtp = (phoneNumber, otp) => {
  let option = {
    method: 'GET',
  };
  let realPhoneNumber = '65' + phoneNumber;
  return dispatch => {
    dispatch({ type: REQUEST_VERIFY_OTP });
    const url = `user/verifyOtp?phoneNumber=${realPhoneNumber}&otp=${otp}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: VERIFY_OTP_SUCCESS, token: res.token });
      }
      else dispatch({ type: VERIFY_OTP_FAIL, error: res.msg });
    })
    .catch(err => {
      dispatch({ type: VERIFY_OTP_FAIL, error: err });
    })
  }

}

export const requestLogin = (email, password) => {

  let data = {email: email, password: password};
  let option = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  };
  return dispatch => {
    dispatch({ type: REQUEST_LOGIN });
    const url = `user/login`;
    request(url, option)
    .then(res => {
      if (res.status === 200) dispatch({ type: REQUESTED_LOGIN_SUCCEEDED, token: res.token });
      else dispatch({ type: REQUESTED_LOGIN_ERROR, status: res.status, userId: res.userID, error: res.msg });
    })
    .catch(err => {
      dispatch({ type: REQUESTED_LOGIN_ERROR, error: err });
    })
  }
} 

export const forgotPassword = (email) => {

  let option = {
    method: 'GET',
  };
  return dispatch => {
    dispatch({ type: FORGOTPASSWORD_SUBMIT });
    const url = `user/forgotPassword?email=${email}`;
    
    request(url, option)
    .then(res => {
      
      if (res.status === 200) dispatch({ type: FORGOTPASSWORD_SUBMIT_SUCCEEDED, status: res.status});
      else dispatch({ type: FORGOTPASSWORD_SUBMIT_ERROR, status: res.status });
    })
    .catch(err => {
      dispatch({ type: FORGOTPASSWORD_SUBMIT_ERROR });
    })
  }
}

export const resetPasswordfunc = (email, password,otp) => {
  //let data = {email: email, password: password};
  let option = {
    method: 'POST',
  };
  return dispatch => {
    dispatch({ type: RESET_PASSWORD });
    const url = `user/resetPassword?email=${email}&newPassword=${password}&otp=${otp}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) dispatch({ type: RESET_PASSWORD_SUCCEEDED, status: res.status, token: res.token });
      else dispatch({ type: RESET_PASSWORD_ERROR, status: res.status });
    })
    .catch(err => {
      dispatch({ type: RESET_PASSWORD_ERROR });
    })
  }
}


export const facebookLogin = () => async dispatch => {
    doFacebookLogin(dispatch);
};

export const doFacebookLogin = async dispatch => {
  let { type, token } = await Facebook.logInWithReadPermissionsAsync('265644483900185', {
    permissions: ['public_profile', 'email']
  });

  if (type === 'cancel') {
    return dispatch({ type: FACEBOOK_LOGIN_FAIL });
  }
  return dispatch(loginWithToken(token));
};

const loginWithToken = (token) => {
  let option = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },

  };
  return dispatch => {
    dispatch({ type: REQUEST_LOGIN });
    const url = `user/login/Facebook`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: REQUESTED_LOGIN_SUCCEEDED, token:res.token });
      } else if (res.status === 404) {
        dispatch({ type: FACEBOOK_FETCH_DETAILS, object: res });
      }
      else dispatch({ type: REQUESTED_LOGIN_ERROR, error: res.msg, status: res.status, userId: res.userID });
    })
    .catch(err => {
      dispatch({ type: REQUESTED_LOGIN_ERROR, error: err });
    })
  }
  // dispatch({ type: FACEBOOK_LOGIN_SUCCESS, token: token });

}

export const changePhoneNumber = (userId, phoneNumber) => {
  let option = { 
    method: 'GET',
    headers: {
    },
  };
  return dispatch => {
    const url = `user/changePhoneNumber?userID=${userId}&phoneNumber=${phoneNumber}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: CHANGE_PHONE_NUMBER, phoneNumber: phoneNumber });   
      }
      else {
        dispatch({ type: CHANGE_PHONE_NUMBER_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: CHANGE_PHONE_NUMBER_ERROR, error: err });  
    })  
  }
}

export const requestLoginWithToken = (token) => {
  return dispatch => {
    dispatch({ type: REQUEST_LOGIN });
    dispatch({ type: REQUEST_LOGIN_WITH_TOKEN, token: token });
  }
}