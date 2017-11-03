import {
  GET_TOPIC_COUNT,
  GET_TOPIC_COUNT_ERROR,
  GET_TOPICS,
  GET_TOPICS_ERROR,
  SET_LIKE,
  SET_LIKE_ERROR,
} from '../actions/types';

const INITIAL_STATE = {
  topics: [],
  topicCount: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_TOPIC_COUNT:
      return { ...state, topicCount: action.topicCount};
    case GET_TOPIC_COUNT_ERROR:
      return { ...state, error: action.error};
    case GET_TOPICS:
      return { ...state, topics: action.topics };
    case GET_TOPICS_ERROR:
      return { ...state, error: action.error };
    case SET_LIKE:
      return { ...state, };
    case SET_LIKE_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
}
