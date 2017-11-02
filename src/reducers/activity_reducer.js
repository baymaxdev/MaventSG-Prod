import {
    CREATE_OFFER,
    CREATE_OFFER_ERROR
  } from '../actions/types';
  
  const INITIAL_STATE = {
    
  };
  
  export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
      case CREATE_OFFER:
        return { ...state, status: action.status };
      case CREATE_OFFER_ERROR:
        return { ...state, error: action.error, status: action.status };
      default:
        return state;
    }
  }
  