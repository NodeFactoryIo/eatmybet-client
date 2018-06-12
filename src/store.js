import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { generateContractsInitialState } from 'drizzle';
import logger from 'redux-logger'

import drizzleOptions from "./drizzleOptions";
import reducers from './redux/reducers';
import sagas from './redux/sagas';


export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  let middleware = applyMiddleware(sagaMiddleware, logger);

  if (process.env.NODE_ENV !== 'production') {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    middleware = composeEnhancers(middleware);
  }

  const initialState = {
    contracts: generateContractsInitialState(drizzleOptions)
  };

  const store = createStore(reducers, initialState, middleware);
  sagaMiddleware.run(sagas);

  return store;
}