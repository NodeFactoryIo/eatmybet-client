import React from 'react';

import Header from '../Header';
import EatABetList from '../EatABetList';


export default class EatABetPage extends React.Component {
  render() {
    return (
      <div className="eat-a-bet-page">
        <Header />
        <EatABetList />
      </div>
    );
  }
}