import React from 'react';

import Header from '../Header';
import MyBetsList from '../MyBetsList';

export default class MyBetsPage extends React.Component {
  render() {
    return (
      <div className="my-bets-page">
        <Header />
        <MyBetsList />
      </div>
    );
  }
}