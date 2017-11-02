import {
    CREATE_OFFER,
    CREATE_OFFER_ERROR
  } from '../actions/types';
  
  const INITIAL_STATE = {
    
  };
  
  export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
      case CREATE_OFFER:
        return { ...state };
      case CREATE_OFFER_ERROR:
        return { ...state, error: action.error };
      default:
        return state;
    }
  }
  