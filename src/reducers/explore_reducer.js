import {
  GET_NEARBY_LIST,
  GET_NEARBY_LIST_ERROR,
  GET_CAT_LIST_REQUEST,
  GET_CAT_LIST,
  GET_CAT_LIST_ERROR,
  GET_MAVEN_DETAILS,
  GET_MAVEN_DETAILS_ERROR,
} from '../actions/types';

const INITIAL_STATE = {
  nearbyList: [],
  catList: [],
  maven: {},
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
      return { ...state, catList: action.list, scrollId: action.scrollId, totalList: action.total};
    case GET_CAT_LIST_ERROR:
      return { ...state, error: action.error};
    case GET_MAVEN_DETAILS:
      return { ...state, maven: action.maven};
    case GET_MAVEN_DETAILS_ERROR:
      return { ...state, error: action.error};
    default:
      return state;

  }
}
