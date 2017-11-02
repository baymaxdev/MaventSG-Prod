import { combineReducers } from 'redux';
import authReducer from './auth_reducer';
import profileReducer from './profile_reducer';
import exploreReducer from './explore_reducer';
import routerReducer from './router_reducer';
import activityReducer from './activity_reducer';

export default combineReducers({
  auth: authReducer,
  profile: profileReducer,
  explore: exploreReducer,
  router: routerReducer,
  activity: activityReducer
});
