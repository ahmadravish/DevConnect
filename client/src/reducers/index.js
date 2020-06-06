//this file is use to combine all reducers
//and send to root
import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';

export default combineReducers({
  alert,
  auth,
});
