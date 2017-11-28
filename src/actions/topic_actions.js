import request from '../routes/services/getData';
import {
  GET_TOPIC_COUNT,
  GET_TOPIC_COUNT_ERROR,
  GET_TOPICS,
  GET_TOPICS_ERROR,
  CREATE_TOPIC,
  CREATE_TOPIC_ERROR,
  SET_LIKE_REQUEST,
  SET_LIKE,
  SET_LIKE_ERROR,
  GET_COMMENTS,
  GET_COMMENTS_ERROR,
  ADD_COMMENT,
  ADD_COMMENT_ERROR,
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

export const createTopic = ( category, imageUrl, text, token, next ) => {
  let formData = new FormData();
  formData.append('category', category);
  formData.append('text', text);
  if (imageUrl) {
    let filename = imageUrl.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? match[1] : '';
    let file = { uri: imageUrl, name: _generateUUID() + `.${type}`, type: `image/${type}`};
    formData.append(`image`, file);
  }
  
  let option = { 
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `topic/createTopic`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: CREATE_TOPIC });
        next();
      }
      else {
        dispatch({ type: CREATE_TOPIC_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: CREATE_TOPIC_ERROR, error: err });
    })  
  }
}

export const setLike = (id, type, token, next) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    dispatch({ type: SET_LIKE_REQUEST });
    const url = `topic/like?type=${type}&id=${id}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: SET_LIKE });
        next();
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

export const getComments = (topicId, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `topic/getComments?topicID=${topicId}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: GET_COMMENTS, comments: res.result });   
      }
      else {
        dispatch({ type: GET_COMMENTS_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: GET_COMMENTS_ERROR, error: err });  
    })  
  }
}

export const addComment = ( topicId, text, token, next ) => {
  let data = {
    topicID: topicId,
    text: text
  };

  var formBody = [];
  for (var property in data) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(data[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  
  let option = { 
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `JWT ${token}`,
    },
    body: formBody,
  };

  return dispatch => {
    const url = `topic/addComment`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: ADD_COMMENT });
        next();
      }
      else {
        dispatch({ type: ADD_COMMENT_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: ADD_COMMENT_ERROR, error: err });
    })  
  }
}