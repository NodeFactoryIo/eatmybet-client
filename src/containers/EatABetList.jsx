import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from 'prop-types';
import _ from 'lodash';

import { fetchContracts, fetchGames } from "../redux/actions";


class EatABetList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      betPools: [],
      gameId: null,
      outcome: null,
      amount: null
    }

    this.placeBet = this.placeBet.bind(this);
  }

  placeBet() {

    //console.log(this.state.outcome)
    //let matchId = contract.getMatchId(gameId);

    const { contract } = this.props;
    let matchId;
    let bet; // 0, 1 - x, 2
    let coef;
    contract.makeBet(matchId, bet, coef);
  }

  componentDidMount() {
    const { contract } = this.props;
    this.props.fetchGames();
  }

  render() {
    const { games } = this.props; 

    // onChange={(value) => this.setState({ outcome: value })}
    // onChange={(value) => this.setState({ amount: value })}
    
    return (
      <div class="place-a-bet-wrap">
        {games.map(function(game, index){
          return <div class="place-a-bet game grid bounceIn">
            <div class="datetime col-2-12">{ moment.utc(game.dateTime).local().format('DD MM YYYY HH:mm') }</div>
            <div class="home col-2-12">{game.homeTeamName}</div>
            <div class="home-goals col-1-12">{game.homeTeamGoals}</div>
            <div class="seperator col-1-12">:</div>
            <div class="away-goals col-1-12">{game.awayTeamGoals}</div>
            <div class="away col-2-12">{game.awayTeamName}</div>

            <div class="bet col-1-4">
              <form class="grid">
                <div class="outcome col-1-3"><input type="text" /></div>
                <div class="amount col-1-3"><input type="number"  /></div>
                <div class="amount col-1-3"><input type="submit" class="button place" value="Place it" /></div>
              </form>
            </div>
          </div>;
        })}
      </div>
    );
  }
}

EatABetList.contextTypes = {
  web3: PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return {
    fetchGames: bindActionCreators(fetchGames, dispatch),
  }
}

const mapStateToProps = state => ({
  contract: state.contract,
  games: state.games,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EatABetList);