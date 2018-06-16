import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from 'lodash';

import { fetchContracts } from "../redux/actions";

class ContractLoader extends React.Component {
  componentDidMount() {
    this.props.fetchContracts();
  }

  render() {
    const { contract, web3 } = this.props;
    return _.isEmpty(contract) || _.isEmpty(web3) ? 'Loading...' : this.props.children;
  }
}

const mapStateToProps = state => ({
  contract: state.contract,
  web3: state.web3,
});

function mapDispatchToProps(dispatch) {
  return {
    fetchContracts: bindActionCreators(fetchContracts, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractLoader);