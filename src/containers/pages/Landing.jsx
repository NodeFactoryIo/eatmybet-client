import React from 'react';
import { connect } from "react-redux";
import _ from 'lodash';

import { networkID } from "../../config";

class LandingPage extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isCorrectNetwork: true,
      hasMetamask: true,
    }
  }

  checkMetaMask() {
    if (!window.web3) {
      this.setState({ hasMetamask: false });
    }
  }

  checkSelectedNetwork(web3) {
    return web3.eth.net.getId((err, netId) => {
      console.log(netId);
      if (netId !== networkID) {
        this.setState({ isCorrectNetwork: false });
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { web3 } = this.props;

    if (!_.isEmpty(web3) && web3 !== prevProps.web3) {
      this.checkMetaMask();
      this.checkSelectedNetwork(web3);
    }
  }

  render() {
    const { isCorrectNetwork, hasMetamask } = this.state;

    if (!this.props.web3) {
      return 'Loading...';
    }

    if (isCorrectNetwork && hasMetamask) {
      return this.props.children;
    }

    return (
      <div className="landing-page">
          <img className="logo" src="./images/logo/logo-vert.png" alt="EatMyBet" />
          <h1>
            World Cup 2018. crypto betting <br/>
            <small>Code is our only law!</small>
          </h1>

        { isCorrectNetwork ? '' : 'MetaMask not using correct network, please use MainNet or Ropsten.' }
        { hasMetamask ? '' : <p>Please install <a href="https://metamask.io/" >MetaMask</a> addon.</p> }
      </div>
    );
  }
}


const mapStateToProps = state => ({
  web3: state.web3,
});

export default connect(
  mapStateToProps,
  null,
)(LandingPage);