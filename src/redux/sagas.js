import { all, takeLatest, call, put, fork } from 'redux-saga/effects';
import Web3 from 'web3';

import { networkID } from "../config";
import actions from './actions';
import { fetchContracts, fetchGames } from "./api";

function* contract() {
  yield takeLatest(actions.FETCHING_CONTRACTS, function* () {
    try {
      const data = yield call(fetchContracts);

      const web3 = new Web3(Web3.givenProvider);
      web3.eth.getAccounts((error, accounts) => {
        web3.eth.defaultAccount = accounts[0];
      });
      const contract = data.EatMyBetContract;

      if (!contract.networks[networkID]) {
        yield put({type: actions.WEB3_ERROR, message: "Please choose the right network (MainNet, Ropsten) on MetaMask "});
      }

      const eatMyBetContract = new web3.eth.Contract(contract.abi, contract.networks[networkID].address);

      yield put({type: actions.FETCH_CONTRACTS_SUCCESS, data: eatMyBetContract });
      yield put({type: actions.INIT_WEB3_SUCCESS, data: web3 });
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