import React from 'react';

import Header from '../Header';
import PlaceABetList from '../PlaceABetList';

export default class PlaceABetPage extends React.Component {
  render() {
    return (
      <div className="place-a-bet-page">
        <Header />
        <PlaceABetList />
      </div>
    );
  }
}
