import { combineReducers } from 'redux';
import units from './units';
import location from './location';
import config from './config';

export default combineReducers({
  units,
  location,
  config
});
