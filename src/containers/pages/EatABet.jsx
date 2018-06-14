import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import Header from '../Header';
import PlaceABetList from '../PlaceABetList';

class EatABetPage extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      betPools: [],
    }
  }

  componentDidMount() {
    //const { contract } = this.props;
    //contract.getBetPoolSize.then((size) => {
    // })
    // Missing getBEtPoolSize function
    // const betPools = [];
    // for (let i = 0; i < 1; i++) {
    //   betPools.push(contract.betPools(i));
    // }
    // console.log(betPools);
  }

  render() {
    console.log(this.context);
    return (
      <div class="eat-a-bet-page">
        <Header />
        <PlaceABetList />
      </div>
    );
  }
}

EatABetPage.contextTypes = {
  web3: PropTypes.object
};

const mapStateToProps = state => ({
  contract: state.contract,
});

export default connect(
  mapStateToProps,
)(EatABetPage);