import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import { fetchGames } from "../redux/actions";


class PlaceABetList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      betPools: [],
      gameId: null,
      outcome: null,
      amount: null,
      bettingGames: [],
    };
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
    //const { contract } = this.props;
    this.props.fetchGames();
  }

  onGameClick(gameId, bet) {
    const { bettingGames } = this.state;
    bettingGames.push({ gameId, bet });
    this.setState({ bettingGames });
  }

  render() {
    const { games } = this.props; 

    // onChange={(value) => this.setState({ outcome: value })}
    // onChange={(value) => this.setState({ amount: value })}
    
    return (
      <div className="place-a-bet-wrap">
        {games.map(function(game, index){
          const playedBet = !!_.find(this.state.bettingGames, {gameId: game.gameId});

          return (
          <div className="place-a-bet game" key={index}>
            <div className="grid grid-pad-small">
              <div className="col-7-12">
                <div className="grid grid-pad-small info"> 
                  <div className="datetime col-2-12">
                    <span className="date">{ moment.utc(game.dateTime).local().format('DD.MM.YYYY') }</span><br/>  
                    <span className="time">{ moment.utc(game.dateTime).local().format('HH:mm') }</span>
                  </div>
                  <div className="home col-4-12">
                    <button className="action home" onClick={() => this.onGameClick(game.gameId, 1)}>
                      <div className="flag" style={{ backgroundImage: 'url(/images/flags/' + game.homeTeamNameShort + '.png'  }} />
                      {game.homeTeamNameShort}
                    </button>
                  </div>

                  <div className="seperator col-2-12">
                    <button className="action draw" onClick={() => this.onGameClick(game.gameId, 2)}>
                      X
                    </button>
                  </div>

                  <div className="away col-4-12">
                    <button className="action away" onClick={() => this.onGameClick(game.gameId, 3)}>
                      <div className="flag" style={{ backgroundImage: 'url(/images/flags/' + game.awayTeamNameShort + '.png'  }} />
                      {game.awayTeamNameShort}
                    </button>
                  </div>
                </div>
              </div>

              <div className="action col-1-4">
                <div className={`grid grid-pad-small info ${!playedBet ? 'inactive' : '' }`}>
                    <div className="col-6-12">
                      <span>Odd</span>
                      <input type="text" />
                    </div>
                    <div className="col-6-12">
                      <span>Amount</span>
                      <input type="text" />
                    </div>
                  </div>
                
              </div>
              <div className="action col-1-6">
                <button className="place">Place bet</button>
              </div>
            </div>
          </div>
        )}.bind(this))}
      </div>
    );
  }
}

PlaceABetList.contextTypes = {
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
)(PlaceABetList);