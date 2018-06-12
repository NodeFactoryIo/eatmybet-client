import { all, takeLatest, call, put, fork } from 'redux-saga/effects';
import truffleContract from 'truffle-contract';
import actions from './actions';
import { fetchContracts, fetchGames } from "./api";

function* contract() {
  yield takeLatest(actions.FETCHING_CONTRACTS, function* () {
    try {
      const data = yield call(fetchContracts);

      const contract = truffleContract(data.EatMyBetContract);
      contract.setProvider(window.web3.currentProvider);
      const eatMyBetContract = yield call(contract.deployed);

      yield put({type: actions.FETCH_CONTRACTS_SUCCESS, data: eatMyBetContract });
    } catch (e) {
      yield put({type: actions.ERROR, message: e.message});
    }
  });
}

function* games() {
  yield takeLatest(actions.FETCHING_GAMES, function* () {
    try {
      const data = yield call(fetchGames);

      yield put({type: actions.FETCH_GAMES_SUCCESS, data: data });
    } catch (e) {
      yield put({type: actions.ERROR, message: e.message});
    }
  });
}

export default function* sagas() {
  yield all([
    fork(contract),
    fork(games),
  ]);
}