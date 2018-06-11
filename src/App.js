import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { DrizzleProvider } from 'drizzle-react'

import './App.css';
import Routes from './routes';
import store from './store';

class App extends React.Component {
  render() {
    const options = {
      contracts: [

      ]
    };

    return (
      <DrizzleProvider store={store} options={options}>
        <Router>
          <Routes />
        </Router>
      </DrizzleProvider>
    );
  }
}

export default App;
