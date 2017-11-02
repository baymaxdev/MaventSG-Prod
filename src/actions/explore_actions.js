import request from '../routes/services/getData';
import {
  GET_NEARBY_LIST,
  GET_NEARBY_LIST_ERROR,
  GET_CAT_LIST,
  GET_CAT_LIST_ERROR,
  GET_MAVEN_DETAILS,
  GET_MAVEN_DETAILS_ERROR,
} from './types';

export const getNearbyList = (location, myLocation,token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `maven/getNearbyList?latitude=${location.latitude}&longitude=${location.longitude}&user_latitude=${myLocation.latitude}&user_longitude=${myLocation.longitude}`;
    request(url, option)
    .then(res => {   
      if (res.status === 200) {
        dispatch({ type: GET_NEARBY_LIST, list: res.result });   
      }
      else dispatch({ type: GET_NEARBY_LIST_ERROR, error: res.msg });
    })
    .catch(err => {
      dispatch({ type: GET_NEARBY_LIST_ERROR, error: err });  
    })  
  }
}

export const getCatList = (category, location, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `maven/getCatListing?category=${category}&latitude=${location.latitude}&longitude=${location.longitude}&filter=0&rating=&availableToday=`;
    request(url, option)
    .then(res => {   
      if (res.status === 200) {
        dispatch({ type: GET_CAT_LIST, list: res.result });   
      }
      else dispatch({ type: GET_CAT_LIST_ERROR, error: res.msg });
    })
    .catch(err => {
      dispatch({ type: GET_CAT_LIST_ERROR, error: err });  
    })  
  }
}

export const getMavenDetails = (mavenId, location, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `maven/getMavenDetails?mavenID=${mavenId}&latitude=${location.latitude}&longitude=${location.longitude}`;
    request(url, option)
    .then(res => {   
      if (res.status === 200) {
        dispatch({ type: GET_MAVEN_DETAILS, maven: res.result });   
      }
      else dispatch({ type: GET_MAVEN_DETAILS_ERROR, error: res.msg });
    })
    .catch(err => {
      dispatch({ type: GET_MAVEN_DETAILS_ERROR, error: err });  
    })  
  }
}
