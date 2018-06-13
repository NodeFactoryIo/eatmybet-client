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

    if(window.web3) {
      return (
        <Provider store={store}>
          <Router>
            <Routes />
          </Router>
        </Provider>
      );
    } else {
      return <div style={ { margin: '30px',  'text-align': 'center'}}>you have to have metamask installed <br/> <a href="https://metamask.io/">METAMASK - do it</a></div>
    }
    
  }
}

export default App;
