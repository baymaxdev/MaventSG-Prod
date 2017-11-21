import request from '../routes/services/getData';
import {
  GET_ACTIVITIES_MY_SKILLS,
  GET_ACTIVITIES_REQUESTED_SKILLS,
  GET_ACTIVITIES_ARCHIVED_SKILLS,
  GET_ACTIVITIES_ERROR,
  INIT_CHAT,
  INIT_CHAT_ERROR,
  CREATE_OFFER_REQUEST,
  CREATE_OFFER,
  CREATE_OFFER_ERROR,
  ACCEPT_OFFER_REQUEST,
  ACCEPT_OFFER,
  ACCEPT_OFFER_ERROR,
  REJECT_OFFER_REQUEST,
  REJECT_OFFER,
  REJECT_OFFER_ERROR,
  CANCEL_OFFER_REQUEST,
  CANCEL_OFFER,
  CANCEL_OFFER_ERROR,
  EDIT_OFFER_REQUEST,
  EDIT_OFFER,
  EDIT_OFFER_ERROR,
  END_JOB_REQUEST,
  END_JOB,
  END_JOB_ERROR,
  ARCHIVE_ACTIVITY_REQUEST,
  ARCHIVE_ACTIVITY,
  ARCHIVE_ACTIVITY_ERROR,
  REVIEW_ACTIVITY_REQUEST,
  REVIEW_ACTIVITY,
  REVIEW_ACTIVITY_ERROR,
  GET_MAVEN_ACTIVITIES,
  GET_MAVEN_ACTIVITIES_ERROR,
} from './types';

export const getActivities = (mode, token, next) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `activity/getActivities?mode=${mode}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        next(res.result);
        if (mode === 0) {
          dispatch({ type: GET_ACTIVITIES_MY_SKILLS, activities: res.result });
        } else if (mode === 1) {
          dispatch({ type: GET_ACTIVITIES_REQUESTED_SKILLS, activities: res.result });
        } else {
          dispatch({ type: GET_ACTIVITIES_ARCHIVED_SKILLS, activities: res.result });
        }
      }
      else {
        dispatch({ type: GET_ACTIVITIES_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: GET_ACTIVITIES_ERROR, error: err });
    })  
  }
}

export const initChat = (mavenId, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `activity/init-chat?mavenID=${mavenId}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: INIT_CHAT });
      }
      else {
        dispatch({ type: INIT_CHAT_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: INIT_CHAT_ERROR, error: err });  
    })  
  }
}

export const createOffer = (mavenId, price, serviceDate, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `activity/createOffer?mavenID=${mavenId}&price=${price}&serviceDate=${serviceDate}`;
    dispatch({ type: CREATE_OFFER_REQUEST });
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: CREATE_OFFER, status: res.status });   
      }
      else {
        dispatch({ type: CREATE_OFFER_ERROR, error: res.msg, status: res.status });
      }
    })
    .catch(err => {
      dispatch({ type: CREATE_OFFER_ERROR, error: err });  
    })  
  }
}

export const acceptOffer = (actId, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    dispatch({ type: ACCEPT_OFFER_REQUEST });
    const url = `activity/acceptOffer?actID=${actId}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: ACCEPT_OFFER });
      }
      else {
        dispatch({ type: ACCEPT_OFFER_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: ACCEPT_OFFER_ERROR, error: err });  
    })  
  }
}

export const rejectOffer = (actId, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    dispatch({ type: REJECT_OFFER_REQUEST });
    const url = `activity/rejectOffer?actID=${actId}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: REJECT_OFFER });
      }
      else {
        dispatch({ type: REJECT_OFFER_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: REJECT_OFFER_ERROR, error: err });  
    })  
  }
}

export const cancelOffer = (actId, type, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    dispatch({ type: CANCEL_OFFER_REQUEST });
    const url = `activity/cancelOffer?type=${type}&actID=${actId}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: CANCEL_OFFER });
      }
      else {
        dispatch({ type: CANCEL_OFFER_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: CANCEL_OFFER_ERROR, error: err });  
    })  
  }
}

export const editOffer = (actId, price, serviceDate, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `activity/editOffer?actID=${actId}&price=${price}&serviceDate=${serviceDate}`;
    dispatch({ type: EDIT_OFFER_REQUEST });
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: EDIT_OFFER, status: res.status });
      }
      else {
        dispatch({ type: EDIT_OFFER_ERROR, error: res.msg, status: res.status });
      }
    })
    .catch(err => {
      dispatch({ type: EDIT_OFFER_ERROR, error: err });  
    })  
  }
}

export const endJob = (actId, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    dispatch({ type: END_JOB_REQUEST });
    const url = `activity/end?actID=${actId}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: END_JOB });
      }
      else {
        dispatch({ type: END_JOB_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: END_JOB_ERROR, error: err });  
    })  
  }
}

export const archiveActivity = (actId, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    dispatch({ type: ARCHIVE_ACTIVITY_REQUEST });
    const url = `activity/archive?actID=${actId}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: ARCHIVE_ACTIVITY });
      }
      else {
        dispatch({ type: ARCHIVE_ACTIVITY_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: ARCHIVE_ACTIVITY_ERROR, error: err });
    })  
  }
}

export const reviewActivity = (actId, type, rating, description, token, next) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    dispatch({ type: REVIEW_ACTIVITY_REQUEST });
    const url = `activity/review?type=${type}&actID=${actId}&rating=${rating}&description=${description}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: REVIEW_ACTIVITY });
        next();
      }
      else {
        dispatch({ type: REVIEW_ACTIVITY_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: REVIEW_ACTIVITY_ERROR, error: err });
    })  
  }
}

export const getMavenActivities = (mavenId, token) => {
  let option = { 
    method: 'GET',
    headers: {
      'Authorization': `JWT ${token}`,
    },
  };
  return dispatch => {
    const url = `activity/get-maven-activities?mavenID=${mavenId}`;
    request(url, option)
    .then(res => {
      if (res.status === 200) {
        dispatch({ type: GET_MAVEN_ACTIVITIES, activities: res.result });
      }
      else {
        dispatch({ type: GET_MAVEN_ACTIVITIES_ERROR, error: res.msg });
      }
    })
    .catch(err => {
      dispatch({ type: GET_MAVEN_ACTIVITIES_ERROR, error: err });
    })
  }
}