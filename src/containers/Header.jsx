import React from 'react';
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <div className="content">
          <a className="logo" href="/"><img src="./images/logo/logo-short.png" alt="EatMyBet" /></a>

          <NavLink activeClassName="active" className="place" to="/place-a-bet">Place a bet</NavLink>
          <NavLink activeClassName="active" className="eat" to="/eat-a-bet">Eat a bet</NavLink>
          <NavLink activeClassName="active" className="my-bets" to="/my-bets">My bets</NavLink>
        </div>
      </div>
    );
  }
}

export default connect(
)(Header);