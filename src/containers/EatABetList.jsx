import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Loading from "../components/Loading";
import { getTransactionReceiptMined } from "../util/transactions";


class EatABetList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      betPools: {},
      betsLoaded: false,
      createdBet: {},
      toMyBets: false,
      mining: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  getBetPools(contract) {
    contract.methods.getBetPoolCount().call().then((count) => {
      const promises = [];
      for (let i = 0; i < count; i++) {
        promises.push(contract.methods.betPools(i).call());
      }

      Promise.all(promises).then(betPools => {
        betPools.forEach(async (betPool, index) => {
          const remainingAmount = await contract.methods.getRemainingBetPoolAmount(betPool);
          if (betPool.owner === this.props.web3.eth.defaultAccount || remainingAmount <= 0) {
            return true;
          }
          const bets = this.state.betPools;
          const bet = { ...betPool, id: index };
          const newArray = bets[bet.gameId] ? _.concat(bets[bet.gameId], bet) : [bet];
          this.setState({ betPools: { ...bets, [bet.gameId]: newArray } });
        });
        this.setState({ betsLoaded: true });
      });
    });
  }

  componentDidMount() {
    const { contract } = this.props;

    this.getBetPools(contract);
  }

  onBetChoose(bet, type) {
    const newBet = {
      id: bet.id,
      gameId: bet.gameId,
      bet: type,
      amount: `${Math.floor(bet.poolSize / (bet.coef / 100))}`
    };

    this.setState({ createdBet: newBet });
  }

  onAmountChange(gameId, e) {
    if (e.target.value === '') {
      return;
    }

    // TODO: warn if max. amount overflow or not a number

    const { web3 } = this.props;
    const amount = web3.utils.toWei(e.target.value, 'ether');
    this.setState({ createdBet: { ...this.state.bet, amount } });
  }

  onSubmit(bet) {
    const { contract, web3 } = this.props;
    const { createdBet } = this.state;

    const amount = createdBet.amount || Math.floor(bet.poolSize / (bet.coef / 100));

    contract.methods.takeBets([bet.id], [amount])
      .send({ value: createdBet.amount, from: web3.eth.defaultAccount })
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
  const { betPools, betsLoaded, mining, toMyBets } = this.state;
  const { games, web3 } = this.props;

  if (!mining && toMyBets) {
    return <Redirect to="/my-bets" />
  }

  if (games.length === 0 || mining) {
    return <Loading/>;
  }

  let noBetsForExistingGames = true;
  if (!_.isEmpty(betPools)) {
    for (let i = 0; i < games.length; i++) {
      if (betPools[games[i].gameId]) {
        noBetsForExistingGames = false;
        break;
      }
    }
  }

  if ((_.isEmpty(betPools) || noBetsForExistingGames) && betsLoaded) {
    return (
      <div className="eat-a-bet-wrap">
        <h2>No active bets, but you <a href="/">create a new one</a></h2>
      </div>
    )
  }

  return (
    <div className="eat-a-bet-wrap">
      {games.map(function (game, index) {
        return !betPools[game.gameId] ? '' : (
          <div className="game" key={index}>
            <div className="grid grid-pad-small">
              <div className="col-7-12">
                <div className="grid grid-pad-small info">
                  <div className="datetime col-2-12">
                    <span className="date">{moment.utc(game.dateTime).local().format('DD.MM.YYYY')}</span><br />
                    <span className="time">{moment.utc(game.dateTime).local().format('HH:mm')}</span>
                  </div>
                  <div className="home col-4-12">
                    <button className="action home" disabled>
                      <div className="flag" style={{ backgroundImage: 'url(/images/flags/' + game.homeTeamNameShort + '.png' }} />
                      {game.homeTeamNameShort}
                    </button>
                  </div>

                  <div className="seperator col-2-12">
                    <button className="action draw" disabled>
                      X
                    </button>
                  </div>

                  <div className="away col-4-12">
                    <button className="action away" disabled>
                      <div className="flag" style={{ backgroundImage: 'url(/images/flags/' + game.awayTeamNameShort + '.png' }} />
                      {game.awayTeamNameShort}
                    </button>
                  </div>
                </div>
              </div>
              <div className="action disabled col-1-4">
                &nbsp;
              </div>
              <div className="action col-1-6">

              </div>
            </div>
            {betPools[game.gameId] && betPools[game.gameId].map(function (bet, index) {
              const defaultAmount = Number.parseFloat(
                web3.utils.fromWei(Math.floor(bet.poolSize / (bet.coef / 100)).toString(), 'ether')).toFixed(3);

              return (
                <div key={index} className={"bet " + ((index === 0) ? 'first' : '')}>
                  <div className="grid grid-pad-small">
                    <div className="col-7-12">
                      <div className="grid grid-pad-small info">
                        <div className="col-2-12">
                          &nbsp;
                          </div>
                        <div className="home push-1-12 col-2-12">
                          <button
                            disabled
                            className={"home " + (bet.bet === "1" ? 'active' : 'inactive')}
                          >
                            1
                          </button>
                        </div>
                        <div className="seperator push-1-12 col-2-12">
                          <button
                            disabled
                            className={"draw " + (bet.bet === "2" ? 'active' : 'inactive')}
                          >
                            X
                          </button>
                        </div>
                        <div className="away push-1-12 col-2-12">
                          <button
                            disabled
                            className={"away " + (bet.bet === "3" ? 'active' : 'inactive')}
                          >
                            2
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="action disabled col-1-4">
                      <div className="grid grid-pad-small info">
                        <div className="col-6-12">
                          <span className="label">Odd</span>
                          <span className="value">{bet.coef / 100}</span>
                        </div>
                        <div className="col-6-12">
                          <span>Amount &nbsp; Ξ</span>
                          <input
                            type="text"
                            defaultValue={defaultAmount}
                            onChange={(e) => this.onAmountChange(bet.gameId, e)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="action col-1-6">
                      <button className="eat" onClick={() => this.onSubmit(bet)}>Eat bet</button>
                    </div>
                  </div>
                </div>
              )
            }.bind(this))}
          </div>
        )
      }.bind(this))}
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
)(EatABetList);