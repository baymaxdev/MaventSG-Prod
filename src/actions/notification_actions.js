import request from '../routes/services/getData';
import {
  SAVE_PUSH_TOKEN,
  SAVE_PUSH_TOKEN_ERROR,
  SEND_PUSH_NOTIFICATION,
  SEND_PUSH_NOTIFICATION_ERROR
} from './types';

export const savePushToken = (pushToken, token) => {
  let data = {
    token: pushToken
  };

  var formBody = [];
  for (var property in data) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(data[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  
  let option = { 
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `JWT ${token}`,
    },
    body: formBody,
  };

  return dispatch => {
    const url = `user/savePushToken`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: SAVE_PUSH_TOKEN });
      }
      else dispatch({ type: SAVE_PUSH_TOKEN_ERROR, error: res.msg });
    })
    .catch(err => {
      dispatch({ type: SAVE_PUSH_TOKEN_ERROR, error: err });
    })  
  }
}

export const sendPushNotification = ( ids, message, data, token ) => {
  let temp = {
    to: ids,
    message: message,
    data: data
  };

  var formBody = [];
  for (var property in temp) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(temp[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  
  let option = { 
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `JWT ${token}`,
    },
    body: formBody,
  };

  return dispatch => {
    const url = `user/sendPushNotification`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: SEND_PUSH_NOTIFICATION });
      }
      else {
        dispatch({ type: SEND_PUSH_NOTIFICATION_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: SEND_PUSH_NOTIFICATION_ERROR, error: err });
    })  
  }
}