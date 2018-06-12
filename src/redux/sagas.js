import { all, takeLatest, call, put, fork, getContext } from 'redux-saga/effects';

import actions from './actions';
import { fetchContracts } from "./api";

function* contract() {
  yield takeLatest(actions.FETCHING_CONTRACTS, function* (action) {
    try {
      const data = yield call(fetchContracts);

      console.log(data);
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