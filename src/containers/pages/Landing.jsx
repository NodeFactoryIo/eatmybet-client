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
      if (netId !== parseInt(networkID)) {
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
      return (
        <div class="loading">'Loading...'</div>
      );
    }
    /*
    if (isCorrectNetwork && hasMetamask) {
      return this.props.children;
    }
    */

    return (
      <div className="landing-page">
          <img className="logo" src="./images/logo/logo-vert.png" alt="EatMyBet" />
          <h1>
            Welcome!
          </h1>

          <div className="info">
            { hasMetamask === true ? 
              <p><span className="checked"></span> MetaMask browser extension installed</p> : 
              <p><span className="unchecked"></span> Please install <a href="https://metamask.io/" >MetaMask</a> addon.</p>
            }

            { isCorrectNetwork === true ? 
              <p><span className="checked"></span> MetaMask using correct network</p> : 
              <p><span className="unchecked"></span> MetaMask not using correct network, please use MainNet or Ropsten.</p>
            }
          </div>
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