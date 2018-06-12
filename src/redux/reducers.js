import { combineReducers } from 'redux';

import actions from './actions';

function contracts(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}
export default combineReducers({
  contracts,
});