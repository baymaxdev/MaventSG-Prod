import request from '../routes/services/getData';
import {
  CREATE_OFFER,
  CREATE_OFFER_ERROR,
} from './types';

export const createOffer = (mavenId, price, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `activity/createOffer?mavenID=${mavenId}&price=${price}`;
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



