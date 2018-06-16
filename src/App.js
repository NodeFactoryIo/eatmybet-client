import React from 'react';
import { Provider } from "react-redux";
import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';
import './App.css';
import Routes from './routes';
import configureStore from './store';

const store = configureStore();

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Routes />
        </Router>
      </Provider>
    );
    
  }
}

export default App;
