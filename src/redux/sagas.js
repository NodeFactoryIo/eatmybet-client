import { all, takeLatest, call, put, fork, getContext } from 'redux-saga/effects';
import web3 from 'web3';

import actions from './actions';
import { fetchContracts } from "./api";

function* contract() {
  yield takeLatest(actions.FETCHING_CONTRACTS, function* (action) {
    try {
      const data = yield call(fetchContracts);

      console.log(data);


      const contractConfig = {
        contractName: data.EatMyBetContract.contractName,
        web3Contract: new web3.eth.Contract(data.EatMyBetContract.abi),
      };

    } catch (e) {
      yield put({type: actions.ERROR, message: e.message});
    }
  });
}

export default function* sagas() {
  yield all([
    fork(contract),
  ]);
}