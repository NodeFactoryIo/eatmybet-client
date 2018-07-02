import React from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import _ from 'lodash';
import Loading from "../components/Loading";
import InfoAmountComponent from "./InfoAmountComponent";
import { getTransactionReceiptMined } from '../util/transactions'
import { fetchGameResult } from '../redux/api'

const availableBets = ["1", "2", "3"];

availableBets.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};

class MyBetsList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      bets: [],
      mining: false
    };
  }

  componentDidMount() {
    const { contract, web3 } = this.props;
    this.load(contract, web3);
  }

  load(contract, web3) {
    contract.getPastEvents('PoolCreated', {
      filter: { creator: web3.eth.defaultAccount },
      fromBlock: 0
    }).then(bets => {
      this.loadBetPools(contract, web3, bets);
    });

    contract.getPastEvents('BetTaken', {
      filter: { eater: web3.eth.defaultAccount }
    }).then(bets => {
      this.loadBetPools(contract, web3, bets);
    });
  }

  loadBetPools(contract, web3, betPools) {
    const betsWithProperties = betPools.map(async function(bet) {
      const betPoolId = bet.returnValues.betPoolId;
      const betPool = await contract.methods.betPools(betPoolId).call();
      if(betPool.bet === "0") return {};
      betPool.betPoolId = betPoolId;
      betPool.poolSize = parseFloat(web3.utils.fromWei(betPool.poolSize, "ether")).toFixed(3);
      if(betPool.owner !== web3.eth.defaultAccount) {
        betPool.bettingOn = availableBets.diff(betPool.bet);
        betPool.amount = await contract.methods.getBetPoolTakenBets(betPoolId, web3.eth.defaultAccount).call();
        betPool.amount = parseFloat(web3.utils.fromWei(betPool.amount, "ether")).toFixed(3);
        betPool.taken = true;
      } else {
        betPool.bettingOn = [betPool.bet];
        betPool.amount = betPool.poolSize;
        betPool.taken = await contract.methods.getBetPoolTakenAmount(betPoolId).call() > 0;
      }
      if(betPool.taken) {
        let gameResult = await fetchGameResult(betPool.gameId);
        betPool.gameResult = gameResult.r;
      }
      return {...betPool};
    });
    Promise.all(betsWithProperties).then(result => {
      //remove deleted bets
      result = result.filter(function(bet) {
        return !_.isEmpty(bet);
      })
      this.setState({ bets: [...this.state.bets, ...result]});
    });
  }

  withdraw(betPoolId) {
    const { contract, web3 } = this.props;
    contract.methods.claimBetRewards([betPoolId]).send({from: web3.eth.defaultAccount})
      .then(tx => {
        this.setState({mining: true})
        getTransactionReceiptMined(web3, tx.transactionHash)
          .then(() => {
            this.load(contract, web3);
            this.setState({ mining: false });
          })
          .catch(() => {
            alert("Transaction has failed, please try again.");
            this.setState({ mining: false });
          })
      })
      .catch((error) => {
        console.log(error);
        alert("Invalid transaction, something is wrong here...");
        this.setState({ mining: false });
      })
  }

  cancelBet(betPoolId) {
    const { contract, web3 } = this.props;
    contract.methods.cancelBet(betPoolId).send({from: web3.eth.defaultAccount})
      .then(tx => {
        this.setState({mining: true})
        getTransactionReceiptMined(web3, tx.transactionHash)
          .then(() => {
            let {bets} = this.state;
            const index = bets.map(function(bet) {return bet.betPoolId}).indexOf(betPoolId);
            bets.splice(index, 1);
            this.setState({ bets, mining: false });
          })
          .catch(() => {
            alert("Transaction has failed, please try again.");
            this.setState({ mining: false });
          })
      })
      .catch((error) => {
        console.log(error);
        alert("Invalid transaction, something is wrong here...");
        this.setState({ mining: false });
      })
  }

  render() {

    const { games } = this.props;
    const { bets, mining } = this.state;

    //const dateTimeNowWithGameEndOffset = moment.utc().add({ hours: 2});

    if (mining) {
      return (
        <Loading />
      )
    }
    if (bets.length === 0) {
      return (
        <div className="my-bets-wrap"><h2 className="empty">You have no bets, but you can <a className="place" href="/">place a bet</a> or <a className="eat" href="/eat-a-bet">eat a bet</a></h2></div>
      )
    }

    return (
      <div className="my-bets-wrap">
        {Object.values(bets).map(function(bet, index){
          const game = _.filter(games, { gameId: bet.gameId})[0];

          let actionInfo = 'cancel';
          let isBetTaken = bet.taken;
          let waitingForGameOutcome = bet.gameResult === -1; // moment.utc(game.dateTime) < dateTimeNowWithGameEndOffset
          let betHasResult = bet.gameResult > 0;
          let isUserWinner = bet.gameResult ? bet.bettingOn.indexOf(bet.gameResult.toString()) !== -1 : false;
          let eatenABet = bet.bettingOn.length > 1;

          if (isBetTaken) { 
            actionInfo = 'none';
          }

          if (isBetTaken && waitingForGameOutcome) { 
            actionInfo = 'waiting';
          }

          if (isBetTaken && betHasResult && !isUserWinner) {
            actionInfo = 'none';
          }

          if (isBetTaken && betHasResult && isUserWinner) {
            actionInfo = 'collect';
          }
          
          return (
          <div className={"game " + (eatenABet ? "eat":"place")} key={index}>
            <div className="grid grid-pad-small">
              <div className="col-7-12">
                <div className="grid grid-pad-small info"> 
                  <div className="datetime col-2-12">
                    <span className="date">{ moment.utc(game.dateTime).local().format('DD.MM.YYYY') }</span><br/>  
                    <span className="time">{ moment.utc(game.dateTime).local().format('HH:mm') }</span>
                  </div>
                  <div className="home info col-4-12">
                    <button disabled className={"home place " + (bet.bettingOn.indexOf("1") !== -1 ? 'active' : 'inactive')}>
                      <div className="flag" style={{ backgroundImage: 'url(/images/flags/' + game.homeTeamNameShort + '.png'  }} />
                      {game.homeTeamNameShort}
                    </button>
                  </div>

                  <div className="seperator info col-2-12">
                  <button disabled className={"draw place " + (bet.bettingOn.indexOf("2") !== -1 ? 'active' : 'inactive')}>
                      X
                    </button>
                  </div>

                  <div className="away info col-4-12">
                  <button disabled className={"away place " + (bet.bettingOn.indexOf("3") !== -1 ? 'active' : 'inactive')}>
                      <div className="flag" style={{ backgroundImage: 'url(/images/flags/' + game.awayTeamNameShort + '.png'  }} />
                      {game.awayTeamNameShort}
                    </button>
                  </div>
                </div>

                <InfoAmountComponent bet={bet.bet} coef={bet.coef} amount={bet.amount} eating={eatenABet} />
              </div>

              <div className="action col-1-4">
                <div className={`grid grid-pad-small info active`}>
                    <div className="col-6-12">
                      <span className="label">Odd</span>
                      <span className="value">{bet.coef / 100}</span>
                    </div>
                    <div className="col-6-12">
                      <span className="label">Amount &nbsp; Ξ</span>
                      <span className="value">{bet.amount}</span>
                    </div>
                  </div>
              </div>

              <div className="action col-1-6">
                {{
                  'cancel': (
                    <button className="cancel" onClick={() => this.cancelBet(bet.betPoolId)}>Cancel</button>
                  ),
                  'waiting': (
                    <span className="button waiting">Waiting...</span>                    
                  ),
                  'collect': (
                    <button className="collect" onClick={() => this.withdraw(bet.betPoolId)}>Collect</button>
                  ),
                  default: (
                    <span className="button done">Done</span>                    
                  )
                }[actionInfo]}
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
)(MyBetsList);