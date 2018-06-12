import PropTypes from "prop-types";
import React from 'react';
import { connect } from "react-redux";

class PlaceABetPage extends React.Component {
  placeBet() {
    const { contract } = this.props;
    let matchId;
    let bet; // 0, 1 - x, 2
    let coef;
    contract.makeBet(matchId, bet, coef);
  }

  render() {
    return (
      <div>
        <button onClick={() => this.placeBet()} />
      </div>
    );
  }
}

PlaceABetPage.contextTypes = {
  web3: PropTypes.object
};

const mapStateToProps = state => ({
  contract: state.contract,
});

export default connect(
  mapStateToProps,
)(PlaceABetPage);