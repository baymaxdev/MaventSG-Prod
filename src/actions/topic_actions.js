import request from '../routes/services/getData';
import {
  GET_TOPIC_COUNT,
  GET_TOPIC_COUNT_ERROR,
  GET_TOPICS,
  GET_TOPICS_ERROR,
  SET_LIKE,
  SET_LIKE_ERROR,
} from './types';

export const getTopicCount = (mainCategory, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `topic/getCategoryTopicCount?mainCategory=${mainCategory}`;
    request(url, option)
    .then(res => {   
      if (res.status === 200) {
        dispatch({ type: GET_TOPIC_COUNT, topicCount: res.result });   
      }
      else dispatch({ type: GET_TOPIC_COUNT_ERROR, error: res.msg });
    })
    .catch(err => {
      dispatch({ type: GET_TOPIC_COUNT_ERROR, error: err });  
    })  
  }
}

export const getTopics = (category, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `topic/getTopics?category=${category}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: GET_TOPICS, topics: res.result });   
      }
      else {
        dispatch({ type: GET_TOPICS_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: GET_TOPICS_ERROR, error: err });  
    })  
  }
}

export const setLike = (id, type, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `topic/like?type=${type}&id=${id}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: SET_LIKE });   
      }
      else {
        dispatch({ type: SET_LIKE_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: SET_LIKE_ERROR, error: err });  
    })  
  }
}