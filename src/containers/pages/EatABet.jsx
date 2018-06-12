import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { fetchContracts } from "../../redux/actions";

class EatABetPage extends React.Component {
  componentDidMount() {
    this.props.fetchContracts();
  }

  render() {
    return (
      <div>
        List of bets
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchContracts: bindActionCreators(fetchContracts, dispatch),
  }
}

export default connect(
  null,
  mapDispatchToProps
)(EatABetPage);