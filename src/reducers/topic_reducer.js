import {
  GET_TOPIC_COUNT,
  GET_TOPIC_COUNT_ERROR,
  GET_TOPICS,
  GET_TOPICS_ERROR,
  CREATE_TOPIC,
  CREATE_TOPIC_ERROR,
  SET_LIKE,
  SET_LIKE_ERROR,
  GET_COMMENTS,
  GET_COMMENTS_ERROR,
  ADD_COMMENT,
  ADD_COMMENT_ERROR,
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
    case CREATE_TOPIC:
      return { ...state };
    case CREATE_TOPIC_ERROR:
      return { ...state, error: action.error };      
    case SET_LIKE:
      return { ...state, };
    case SET_LIKE_ERROR:
      return { ...state, error: action.error };
    case GET_COMMENTS:
      return { ...state, comments: action.comments };
    case GET_COMMENTS_ERROR:
      return { ...state, error: action.error };
    case ADD_COMMENT:
      return { ...state };
    case ADD_COMMENT_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
}
