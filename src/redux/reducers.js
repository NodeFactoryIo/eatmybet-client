import { combineReducers } from 'redux';

import actions from './actions';

function contract(state = {}, action) {
  switch (action.type) {
    case actions.FETCH_CONTRACTS_SUCCESS:
      return action.data;
    default:
      return state;
  }
}

function error(state = {}, action) {
  switch (action.type){
    case actions.ERROR:
      return action.message;
    default:
      return state;
  }
}

export default combineReducers({
  contract,
  error,
});