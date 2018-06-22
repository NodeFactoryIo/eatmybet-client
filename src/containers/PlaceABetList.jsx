import React from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import { Redirect } from "react-router-dom";
import Loading from "../components/Loading";
import { getTransactionReceiptMined } from "../util/transactions";


class PlaceABetList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      betPools: [],
      gameId: null,
      outcome: null,
      amount: null,
      bettingGames: {},
      mining: false,
      toMyBets: false,
    };
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
    const newCoef = parseFloat(e.target.value).toFixed(2);
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

    contract.methods.makeBet(gameId, gameBet.bet, parseInt(gameBet.coef * 100, 10))
      .send({value: gameBet.amount, from: web3.eth.defaultAccount })
      .then(tx => {
        this.setState({ mining: true });
        getTransactionReceiptMined(web3, tx.transactionHash)
          .then(() => {
            this.setState({ mining: false });
            this.setState({ toMyBets: true });
          })
          .catch(() => {
            alert("Transaction has failed, please try again.");
            this.setState({ mining: false });
          })
      })
      .catch(() => {
        alert("Invalid transaction, something is wrong here...");
      })
  }

  render() {
    const { games } = this.props;
    const { bettingGames, mining, toMyBets } = this.state;
    const minGameDateTime = moment.utc().add({ hours: 2});

    if (!mining && toMyBets) {
      return <Redirect to="/my-bets" />
    }

    if (games.length === 0 || mining) {
      return (
        <Loading />
      )
    }

    return (
      <div className="place-a-bet-wrap">
        {games.map(function(game, index){

          if (moment.utc(game.dateTime) <= minGameDateTime) {
            return '';
          }

          const playedBet = !!this.getGameById(game.gameId);
          const validateBet = !!this.getGameById(game.gameId) &&
            this.getGameById(game.gameId).coef > 0 && this.getGameById(game.gameId).amount > 0;

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
                    <button
                      className={"action home " +
                        (bettingGames[game.gameId] && bettingGames[game.gameId].bet === 1 ? 'active' : 'inactive')}
                      onClick={() => this.onGameClick(game.gameId, 1)}
                    >
                      <div className="flag"style={{ backgroundImage: 'url(/images/flags/' + game.homeTeamNameShort + '.png'  }} />
                      {game.homeTeamNameShort}
                    </button>
                  </div>

                  <div className="seperator col-2-12">
                    <button
                      className={"action draw " +
                      (bettingGames[game.gameId] && bettingGames[game.gameId].bet === 2 ? 'active' : 'inactive')}
                      onClick={() => this.onGameClick(game.gameId, 2)}
                    >
                      X
                    </button>
                  </div>

                  <div className="away col-4-12">
                    <button
                      className={"action away " +
                      (bettingGames[game.gameId] && bettingGames[game.gameId].bet === 3 ? 'active' : 'inactive')}
                      onClick={() => this.onGameClick(game.gameId, 3)}
                    >
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
                      <input
                        type="text"
                        placeholder="e.g. 1.5"
                        disabled={!playedBet}
                        onChange={(e) => this.onCoefChange(game.gameId, e)}
                      />
                    </div>
                    <div className="col-6-12">
                      <span>Amount &nbsp; Ξ</span>
                      <input
                        type="text"
                        placeholder="e.g. 0.34"
                        disabled={!playedBet}
                        onChange={(e) => this.onAmountChange(game.gameId, e)}
                      />
                    </div>
                  </div>
                
              </div>
              <div className="action col-1-6">
                <button className={"place " + (validateBet ? "active" : "inactive") } onClick={() => this.onSubmit(game.gameId)} disabled={!validateBet}>Place bet</button>
              </div>
            </div>
          </div>
        )}.bind(this))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  contract: state.contract,
  games: state.games,
  web3: state.web3,
});

export default connect(
  mapStateToProps,
  null,
)(PlaceABetList);