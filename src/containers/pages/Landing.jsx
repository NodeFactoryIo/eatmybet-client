import React from 'react';
import { connect } from "react-redux";
import _ from 'lodash';
import { bindActionCreators } from "redux";

import { networkID } from "../../config";
import { initWeb3 } from "../../redux/actions";

class LandingPage extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isCorrectNetwork: false,
      metaMaskEnabled: false,
    }
  }

  checkMetaMask() {
    if (window.web3) {
      this.setState({ metaMaskEnabled: true });
    }
  }

  checkSelectedNetwork(web3) {
    web3.eth.net.getId((err, netId) => {
      if (netId === parseInt(networkID, 10)) {
        this.setState({ isCorrectNetwork: true });
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { web3 } = this.props;

    if (!_.isEmpty(web3) && web3 !== prevProps) {
      this.checkSelectedNetwork(web3);
    }
  }

  componentWillMount() {
    this.props.initWeb3();
    this.checkMetaMask();
  }

  render() {
    const { isCorrectNetwork, metaMaskEnabled } = this.state;
    const { hasMetaMask } = this.props;

    if (isCorrectNetwork && hasMetaMask && metaMaskEnabled) {
      return this.props.children;
    }

    return (
      <div className="landing-page">
          <img className="logo" src="./images/logo/logo-vert.png" alt="EatMyBet" />
          <h1>
            Welcome!
          </h1>

          <div className="info">
            { hasMetaMask === true && metaMaskEnabled === true ?
              <p><span className="checked"></span> MetaMask browser extension installed</p> : 
              <p><span className="unchecked"></span> Please install <a href="https://metamask.io/" >MetaMask</a> addon.</p>
            }

            { hasMetaMask === false || isCorrectNetwork === true ?
              null :
              <p><span className="unchecked"></span> MetaMask not using correct network, please use MainNet or Ropsten.</p>
            }
          </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    initWeb3: bindActionCreators(initWeb3, dispatch),
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  hasMetaMask: !(state.error && state.error === 'WEB3'),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LandingPage);