import {
  GET_NEARBY_LIST,
  GET_NEARBY_LIST_ERROR,
  GET_CAT_LIST,
  GET_CAT_LIST_ERROR,
  GET_MAVEN_DETAILS,
  GET_MAVEN_DETAILS_ERROR,
  GET_TOPIC_COUNT,
  GET_TOPIC_COUNT_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  nearbyList: [],
  catList: [],
  maven: {},
  topicCount: [],
  error: null,
  loading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_NEARBY_LIST:
      return { ...state, nearbyList: action.list, loading: true };
    case GET_NEARBY_LIST_ERROR:
      return { ...state, error: action.error };
    case GET_CAT_LIST:
      return { ...state, catList: action.list};
    case GET_CAT_LIST_ERROR:
      return { ...state, error: action.error};
    case GET_MAVEN_DETAILS:
      return { ...state, maven: action.maven};
    case GET_MAVEN_DETAILS_ERROR:
      return { ...state, error: action.error};
    case GET_TOPIC_COUNT:
      return { ...state, topicCount: action.topicCount};
    case GET_TOPIC_COUNT_ERROR:
      return { ...state, error: action.error};
    default:
      return state;

  }
}
