import React from 'react';
import { connect } from "react-redux";

class Header extends React.Component {

  componentDidMount() {
  }

  render() {
    return (
      <div class="header">
        <div class="content">
          <a class="logo" href="/"><img src="./images/logo/logo-short.png" alt="EatMyBet" /></a>

          <a class="place" href="/place-a-bet">Place a bet</a>
          <a class="eat" href="/eat-a-bet">Eat a bet</a>
          <a class="my-bets" href="/my-bets">My bets</a>
        </div>
      </div>
    );
  }
}

export default connect(
)(Header);