import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';


class LandingPage extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      betPools: [],
    }
  }

  componentDidMount() {
    //const { contract } = this.props;
    //this.props.fetchGames();
  }

  render() {
    //const { games } = this.props; 
    
    return (
      <div class="landing-page">
          <img class="logo" src="./images/logo/logo-vert.png" alt="EatMyBet" />
          <h1>
            World Cup 2018. crypto betting <br/>
            <small>Code is our only law!</small>
          </h1>
          
          <h2>I want to:</h2> 
          <div class="actions">
            <a href="/place-a-bet" class="button place">Place a bet</a> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <a href="/eat-a-bet" class="button eat">Eat a bet</a>
          </div>
      </div>
    );
  }
}

LandingPage.contextTypes = {
  web3: PropTypes.object
};

/*
function mapDispatchToProps(dispatch) {
  return {
    fetchGames: bindActionCreators(fetchGames, dispatch),
  }
}
*/

const mapStateToProps = state => ({
  contract: state.contract,
  //games: state.games,
});

export default connect(
  mapStateToProps,
  //mapDispatchToProps,
)(LandingPage);