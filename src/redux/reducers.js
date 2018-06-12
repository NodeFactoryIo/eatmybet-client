import { combineReducers } from 'redux';
import { drizzleReducers } from 'drizzle'

import actions from './actions';

export default combineReducers({
  ...drizzleReducers,
});