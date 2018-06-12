import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { DrizzleProvider } from 'drizzle-react'
import { LoadingContainer } from 'drizzle-react-components';

import './App.css';
import drizzleOptions from "./drizzleOptions";
import Routes from './routes';
import configureStore from './store';

const store = configureStore();

class App extends React.Component {
  render() {
    return (
      <DrizzleProvider store={store} options={drizzleOptions}>
        <LoadingContainer>
          <Router>
            <Routes />
          </Router>
        </LoadingContainer>
      </DrizzleProvider>
    );
  }
}

export default App;
