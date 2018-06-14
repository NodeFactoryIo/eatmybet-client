import React from 'react';
import { connect } from "react-redux";

class Header extends React.Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="header">
        <div className="content">
          <a className="logo" href="/"><img src="./images/logo/logo-short.png" alt="EatMyBet" /></a>

          <a className="place" href="/place-a-bet">Place a bet</a>
          <a className="eat" href="/eat-a-bet">Eat a bet</a>
          <a className="my-bets" href="/my-bets">My bets</a>
        </div>
      </div>
    );
  }
}

export default connect(
)(Header);