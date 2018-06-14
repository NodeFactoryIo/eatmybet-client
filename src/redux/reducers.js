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

function web3(state = {}, action) {
  switch (action.type) {
    case actions.INIT_WEB3_SUCCESS:
      return action.data;
    default:
      return state;
  }
}

function games(state = [], action) {
  switch (action.type) {
    case actions.FETCH_GAMES_SUCCESS:
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
  web3,
  games,
  error,
});