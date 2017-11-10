import request from '../routes/services/getData';
import {
  GET_ACTIVITIES_MY_SKILLS,
  GET_ACTIVITIES_REQUESTED_SKILLS,
  GET_ACTIVITIES_ARCHIVED_SKILLS,
  GET_ACTIVITIES_ERROR,
  CREATE_OFFER,
  CREATE_OFFER_ERROR,
  INIT_CHAT,
  INIT_CHAT_ERROR,
} from './types';

export const getActivities = (mode, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `activity/getActivities?mode=${mode}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        if (mode === 0) {
          dispatch({ type: GET_ACTIVITIES_MY_SKILLS, activities: res.result });
        } else if (mode === 1) {
          dispatch({ type: GET_ACTIVITIES_REQUESTED_SKILLS, activities: res.result });
        } else {
          dispatch({ type: GET_ACTIVITIES_ARCHIVED_SKILLS, activities: res.result });
        }
      }
      else {
        dispatch({ type: GET_ACTIVITIES_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: GET_ACTIVITIES_ERROR, error: err });
    })  
  }
}

export const createOffer = (mavenId, price, serviceDate, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `activity/createOffer?mavenID=${mavenId}&price=${price}&serviceDate=${serviceDate}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: CREATE_OFFER, status: res.status });   
      }
      else {
        dispatch({ type: CREATE_OFFER_ERROR, error: res.msg, status: res.status });
      }
    })
    .catch(err => {
      dispatch({ type: CREATE_OFFER_ERROR, error: err });  
    })  
  }
}

export const initChat = (mavenId, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `activity/init-chat?mavenID=${mavenId}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: INIT_CHAT });
      }
      else {
        dispatch({ type: INIT_CHAT_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: INIT_CHAT_ERROR, error: err });  
    })  
  }
}