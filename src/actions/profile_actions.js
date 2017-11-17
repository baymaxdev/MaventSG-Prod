import { AsyncStorage } from 'react-native';
import request from '../routes/services/getData';
import {
  GET_MY_PROFILE_INFO,
  GET_PROFILE_INFO,
  PROFILE_ERROR,
  SET_LOCATION,
  REGISTER_MAVEN,
  REGISTER_MAVEN_ERROR,
  REQUEST_REGISTER_MAVEN,
  ACTIVATE_MAVEN,
  ACTIVATE_MAVEN_ERROR,
  DEACTIVATE_MAVEN,
  DEACTIVATE_MAVEN_ERROR,
  DELETE_MAVEN,
  DELETE_MAVEN_ERROR,
  REQUEST_ADD_MAVEN_IMAGE,
  ADD_MAVEN_IMAGE,
  ADD_MAVEN_IMAGE_ERROR,
  REQUEST_DELETE_MAVEN_IMAGE,
  DELETE_MAVEN_IMAGE,
  DELETE_MAVEN_IMAGE_ERROR,
  CHECK_ID,
  CHECK_ID_ERROR,
  REQUEST_EDIT_MAVEN_DETAILS,
  EDIT_MAVEN_DETAILS,
  EDIT_MAVEN_DETAILS_ERROR,
  EDIT_ABOUT,
  EDIT_ABOUT_ERROR,
  SAVE_MAVEN,
  SAVE_MAVEN_ERROR,
  REPORT_MAVEN,
  REPORT_MAVEN_ERROR,
  REQUEST_UPDATE_PROFILE_IMAGE,
  UPDATE_PROFILE_IMAGE,
  UPDATE_PROFILE_IMAGE_ERROR,
  GIVE_APP_FEEDBACK,
  GIVE_APP_FEEDBACK_ERROR,
} from './types';

export const getMyProfileInfo = (token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `user/getProfileDetails`;
    request(url, option)
    .then(res => {   
      if (res.status === 200) {
        dispatch({ type: GET_MY_PROFILE_INFO, myInfo: res.result });
      }
      else dispatch({ type: PROFILE_ERROR, error: 'error' });
    })
    .catch(err => {
      dispatch({ type: PROFILE_ERROR, error: err });  
    })  
  }
}

export const getProfileInfo = (token, userId) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `user/getProfileDetails?userID=` + userId;
    request(url, option)
    .then(res => {   
      if (res.status === 200) {
        dispatch({ type: GET_PROFILE_INFO, user: res.result });
      }
      else dispatch({ type: PROFILE_ERROR, error: 'error' });
    })
    .catch(err => {
      dispatch({ type: PROFILE_ERROR, error: err });  
    })  
  }
}

export const setLocation = (location) => {
  return dispatch => {
      dispatch({ type: SET_LOCATION, location: location });  
  }
}

export const registerMaven = (mavenData, token) => {
  let mainCategory = mavenData.mainCategory;
  let category = mavenData.category;
  let title = mavenData.title;
  let description = mavenData.description;
  let postalCode = mavenData.postalCode;
  let dayAvailable = mavenData.dayAvailable;
  let timeAvailable = mavenData.timeAvailable;
  let price = mavenData.price;
  let idPictures = mavenData.idPictures;
  var pictures = mavenData.pictures;
  let formData = new FormData();
  formData.append('mainCategory', mainCategory);
  formData.append('category', category);
  formData.append('title', title);
  formData.append('description', description);
  formData.append('postalCode', postalCode);
  formData.append('dayAvailable', dayAvailable);
  formData.append('timeAvailable', timeAvailable);
  formData.append('price', price);
  if(pictures && pictures.length > 0){
    pictures.map((e, index) => {
      let filename = e.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? match[1] : '';
      let file = { uri: e, name: _generateUUID() + `.${type}`, type: `image/${type}`};
      formData.append(`picture${index + 1}`, file);
    })
    
  }
  if(idPictures && idPictures.length > 0){
    idPictures.map((e, index) => {
      let filename = e.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? match[1] : '';
      let file = { uri: e, name: _generateUUID() + `.${type}`, type: `image/${type}`};
      formData.append(`idPicture${index + 1}`, file);
    })
  }
  let option = { 
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    dispatch({type: REQUEST_REGISTER_MAVEN});
    const url = `maven/registerMaven`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: REGISTER_MAVEN });   
        dispatch(getMyProfileInfo(token));
      }
      else {
        dispatch({ type: REGISTER_MAVEN_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: REGISTER_MAVEN_ERROR, error: err });  
    })  
  }
}

_generateUUID = () => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
};

export const activateMaven = (mavenId, token, next) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `maven/changeActive?mavenID=${mavenId}`;
    request(url, option)
    .then(res => {   
      if (res.status === 200) {
        next();
        dispatch({ type: ACTIVATE_MAVEN});
      }
      else dispatch({ type: ACTIVATE_MAVEN_ERROR, error: 'error' });
    })
    .catch(err => {
      dispatch({ type: ACTIVATE_MAVEN_ERROR, error: err });
    })  
  }
}

export const deactivateMaven = (mavenId, token, next) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return (dispatch) => {
    const url = `maven/deactivate?mavenID=${mavenId}`;
    request(url, option)
    .then(res => {   
      if (res.status === 200) {
        next();
        dispatch({ type: DEACTIVATE_MAVEN});
      }
      else dispatch({ type: DEACTIVATE_MAVEN_ERROR, error: 'error' });
    })
    .catch(err => {
      dispatch({ type: DEACTIVATE_MAVEN_ERROR, error: err });
    })  
  }
}

export const deleteMaven = (mavenId, token, next) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `maven/deleteMaven?mavenID=${mavenId}`;
    request(url, option)
    .then(res => {   
      if (res.status === 200) {
        dispatch({ type: DELETE_MAVEN});
        next();
      }
      else dispatch({ type: DELETE_MAVEN_ERROR, error: 'error' });
    })
    .catch(err => {
      dispatch({ type: DELETE_MAVEN_ERROR, error: err });
    })  
  }
}

export const addMavenImage = ( mavenId, imageUrl, token ) => {
  let formData = new FormData();
  formData.append('mavenID', mavenId);
  let filename = imageUrl.split('/').pop();
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? match[1] : '';
  let file = { uri: imageUrl, name: _generateUUID() + `.${type}`, type: `image/${type}`};
  formData.append(`image`, file);
  let option = { 
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    dispatch({ type: REQUEST_ADD_MAVEN_IMAGE });
    const url = `maven/addMavenImage`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: ADD_MAVEN_IMAGE });
      }
      else {
        dispatch({ type: ADD_MAVEN_IMAGE_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: ADD_MAVEN_IMAGE_ERROR, error: err });
    })  
  }
}

export const deleteMavenImage = (mavenId, index, token, next) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    dispatch({ type: REQUEST_DELETE_MAVEN_IMAGE });
    const url = `maven/deleteMavenImage?mavenID=${mavenId}&index=${index}`;
    request(url, option)
    .then(res => {   
      if (res.status === 200) {
        dispatch({ type: DELETE_MAVEN_IMAGE });
        next();
      }
      else dispatch({ type: DELETE_MAVEN_IMAGE_ERROR, error: res.msg });
    })
    .catch(err => {
      dispatch({ type: DELETE_MAVEN_IMAGE_ERROR, error: err });
    })  
  }
}

export const checkId = (token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `user/checkID`;
    request(url, option)
    .then(res => {   
      if (res.status === 200) {
        dispatch({ type: CHECK_ID, data: res.result });
      }
      else dispatch({ type: CHECK_ID_ERROR, error: 'error' });
    })
    .catch(err => {
      dispatch({ type: CHECK_ID_ERROR, error: err });
    })  
  }
}

export const editMavenDetails = ( mavenData, token ) => {
  let data = {
    mavenID: mavenData.mavenId,
    title: mavenData.title,
    description: mavenData.description,
    price: mavenData.price,
    dayAvailable: mavenData.dayAvailable,
    timeAvailable: mavenData.timeAvailable
  }
  
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
    dispatch({ type: REQUEST_EDIT_MAVEN_DETAILS });
    const url = `maven/editMavenDetails`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: EDIT_MAVEN_DETAILS });
      }
      else {
        dispatch({ type: EDIT_MAVEN_DETAILS_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: EDIT_MAVEN_DETAILS_ERROR, error: err });
    })
  }
}

export const editAbout = (about, token, next) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `user/editAbout?about=${about}`;
    request(url, option)
    .then(res => {   
      if (res.status === 200) {
        dispatch({ type: EDIT_ABOUT});
        next();
      }
      else dispatch({ type: EDIT_ABOUT_ERROR, error: res.msg });
    })
    .catch(err => {
      dispatch({ type: EDIT_ABOUT_ERROR, error: err });
    })  
  }
}

export const saveMaven = (mavenId, token, next) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `user/saveMaven?mavenID=${mavenId}`;
    request(url, option)
    .then(res => {   
      if (res.status === 200) {
        dispatch({ type: SAVE_MAVEN });
        next();
      }
      else dispatch({ type: SAVE_MAVEN_ERROR, error: res.msg });
    })
    .catch(err => {
      dispatch({ type: SAVE_MAVEN_ERROR, error: err });
    })  
  }
}

export const reportMaven = ( mavenId, description, token, next ) => {
  let data = {
    mavenID: mavenId,
    description: description
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
    const url = `maven/report`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: REPORT_MAVEN });
        next();
      }
      else {
        dispatch({ type: REPORT_MAVEN_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: REPORT_MAVEN_ERROR, error: err });
    })  
  }
}

export const updateProfileImage = ( imageUrl, token ) => {
  let formData = new FormData();
  let filename = imageUrl.split('/').pop();
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? match[1] : '';
  let file = { uri: imageUrl, name: _generateUUID() + `.${type}`, type: `image/${type}`};
  formData.append(`photo`, file);
  let option = { 
    method: 'PUT',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `user/uploadProfileImage`;
    dispatch({ type: REQUEST_UPDATE_PROFILE_IMAGE });
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: UPDATE_PROFILE_IMAGE });
        // dispatch(getMyProfileInfo(token)); 
      }
      else {
        dispatch({ type: UPDATE_PROFILE_IMAGE_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: UPDATE_PROFILE_IMAGE_ERROR, error: err });
    })  
  }
}

export const feedback = ( rating, message, token, next ) => {
  let data = {
    rating: rating,
    message: message
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
    const url = `user/feedback`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: GIVE_APP_FEEDBACK });
        next();
      }
      else {
        dispatch({ type: GIVE_APP_FEEDBACK_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: GIVE_APP_FEEDBACK_ERROR, error: err });
    })  
  }
}