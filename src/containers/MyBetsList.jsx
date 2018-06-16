import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from 'prop-types';
import moment from 'moment';

import { fetchGames } from "../redux/actions";


class PlaceABetList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      betPools: [],
      gameId: null,
      outcome: null,
      amount: null,
      bettingGames: {},
    };
  }

  componentDidMount() {
    this.props.fetchGames();
  }

  onGameClick(gameId, bet) {
    const { bettingGames } = this.state;
    const newBet = {
      [gameId]: {
        bet,
      },
    };
    this.setState({ bettingGames: {...bettingGames, ...newBet} });
  }

  onCoefChange(gameId, e) {
    if (e.target.value === '') {
      return;
    }
    const newCoef = parseInt(e.target.value, 10);
    const gameBet = this.getGameById(gameId);
    gameBet.coef = newCoef;
    this.setState({ bettingGames: {...this.state.bettingGames, [gameId]: gameBet } });
  }

  onAmountChange(gameId, e) {
    if (e.target.value === '') {
      return;
    }

    const { web3 } = this.props;
    const newAmount = e.target.value;
    const gameBet = this.getGameById(gameId);
    // Depending on the amount input convert to wei
    gameBet.amount = web3.utils.toWei(newAmount, 'ether');
    this.setState({ bettingGames: {...this.state.bettingGames, [gameId]: gameBet } });
  }

  getGameById(gameId) {
    return this.state.bettingGames[gameId];
  }

  onSubmit(gameId) {
    const { contract, web3 } = this.props;
    const gameBet = this.getGameById(gameId);

    contract.methods.makeBet(gameId, gameBet.bet, gameBet.coef)
      .send({value: gameBet.amount, from: web3.eth.defaultAccount });
  }

  render() {
    const { games } = this.props;
    
    return (
      <div className="place-a-bet-wrap">
        {games.map(function(game, index){
          const playedBet = !!this.getGameById(game.gameId);

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
                      <input type="text" disabled={!playedBet} onChange={(e) => this.onCoefChange(game.gameId, e)} />
                    </div>
                    <div className="col-6-12">
                      <span>Amount</span>
                      <input type="text" disabled={!playedBet} onChange={(e) => this.onAmountChange(game.gameId, e)}  />
                    </div>
                  </div>
                
              </div>
              <div className="action col-1-6">
                <button className="place" onClick={() => this.onSubmit(game.gameId)}>Place bet</button>
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
  web3: state.web3,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlaceABetList);