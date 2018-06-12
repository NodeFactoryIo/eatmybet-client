import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from 'prop-types';

import { fetchContracts } from "../../redux/actions";

class EatABetPage extends React.Component {
  componentDidMount() {
    this.props.fetchContracts();
  }

  render() {
    console.log(this.context);
    return (
      <div>
        List of bets
      </div>
    );
  }
}

EatABetPage.contextTypes = {
  web3: PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return {
    fetchContracts: bindActionCreators(fetchContracts, dispatch),
  }
}

export default connect(
  null,
  mapDispatchToProps
)(EatABetPage);