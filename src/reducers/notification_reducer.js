import {
  SAVE_PUSH_TOKEN,
  SAVE_PUSH_TOKEN_ERROR,
  SEND_PUSH_NOTIFICATION,
  SEND_PUSH_NOTIFICATION_ERROR,
} from '../actions/types';

const INITIAL_STATE = {

};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SAVE_PUSH_TOKEN:
      return { ...state };
    case SAVE_PUSH_TOKEN_ERROR:
      return { ...state, error: action.error};
    case SEND_PUSH_NOTIFICATION:
      return { ...state };
    case SEND_PUSH_NOTIFICATION_ERROR:
      return { ...state, error: action.error};
    default:
      return state;
  }
}
