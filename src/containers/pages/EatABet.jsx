import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import {bindActionCreators} from "redux";

import { fetchContracts } from "../../redux/actions";

class EatABetPage extends React.Component {
  constructor(props, context) {
    super(props);

    this.drizzle = context.drizzle;
  }

  componentDidMount() {
    console.log(this.drizzle);
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

export default drizzleConnect(EatABetPage,
  null,
  mapDispatchToProps
);