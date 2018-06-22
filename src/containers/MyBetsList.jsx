import React from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import _ from 'lodash';
import Loading from "../components/Loading";

const availableBets = ["1", "2", "3"];

availableBets.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};

class MyBetsList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      bets: []
    };
  }

  componentDidMount() {
    const { contract, web3 } = this.props;

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
      betPool.poolSize = parseFloat(web3.utils.fromWei(betPool.poolSize, "ether")).toFixed(3);
      if(betPool.owner !== web3.eth.defaultAccount) {
        betPool.bettingOn = availableBets.diff(betPool.bet);
        betPool.amount = await contract.methods.getBetPoolTakenBets(betPoolId, web3.eth.defaultAccount).call();
        betPool.amount = parseFloat(web3.utils.fromWei(betPool.amount, "ether")).toFixed(3);
        betPool.taken = true;
      } else {
        betPool.bettingOn = [betPool.bet];
        betPool.amount = betPool.poolSize;
        betPool.taken = (await contract.methods.getBetPoolTakenAmount(betPoolId) > 0);
      }
      return {...betPool};
    });
    Promise.all(betsWithProperties).then(result => {
      this.setState({ bets: [...this.state.bets, ...result]});
    });
  }

  getResults(betPoolId) {
    const { contract } = this.props;

    contract.methods.betPools(betPoolId).call()
      .then(response => {
        const result = response.result;
        console.log('Result is: ', result);

        if (result === 0) {
          alert("No results yet!");
        }
      })
  }

  render() {

    const { games } = this.props;
    const { bets } = this.state;

    //const dateTimeNowWithGameEndOffset = moment.utc().add({ hours: 2});

    if (!bets || games.length === 0) {
      return (
        <Loading />
      )
    }
    if (bets.length === 0) {
      return (
        <div className="my-bets-wrap"><h2>You have no bets, but you <a href="/">create a new one</a> or <a href="/eat-a-bet">eat an existing one</a></h2></div>
      )
    }

    return (
      <div className="my-bets-wrap">
        {Object.values(bets).map(function(bet, index){
          const game = _.filter(games, { gameId: bet.gameId})[0];

          let actionInfo = 'cancel';
          let result = "1";
          let isBetTaken = bet.taken;
          let waitingForGameOutcome = true; // moment.utc(game.dateTime) < dateTimeNowWithGameEndOffset
          let betHasResult = !result;
          let isUserWinner = bet.bettingOn.indexOf(result) !== -1;

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
          <div className="game" key={index}>
            <div className="grid grid-pad-small">
              <div className="col-7-12">
                <div className="grid grid-pad-small info"> 
                  <div className="datetime col-2-12">
                    <span className="date">{ moment.utc(game.dateTime).local().format('DD.MM.YYYY') }</span><br/>  
                    <span className="time">{ moment.utc(game.dateTime).local().format('HH:mm') }</span>
                  </div>
                  <div className="home action col-4-12">
                    <button disabled className={"home place " + (bet.bettingOn.indexOf("1") !== -1 ? 'active' : 'inactive')}>
                      <div className="flag" style={{ backgroundImage: 'url(/images/flags/' + game.homeTeamNameShort + '.png'  }} />
                      {game.homeTeamNameShort}
                    </button>
                  </div>

                  <div className="seperator action col-2-12">
                  <button disabled className={"draw place " + (bet.bettingOn.indexOf("2") !== -1 ? 'active' : 'inactive')}>
                      X
                    </button>
                  </div>

                  <div className="away action col-4-12">
                  <button disabled className={"away place " + (bet.bettingOn.indexOf("3") !== -1 ? 'active' : 'inactive')}>
                      <div className="flag" style={{ backgroundImage: 'url(/images/flags/' + game.awayTeamNameShort + '.png'  }} />
                      {game.awayTeamNameShort}
                    </button>
                  </div>
                </div>
              </div>

              <div className="action col-1-4">
                <div className={`grid grid-pad-small info active`}>
                    <div className="col-6-12">
                      <span className="label">Odd</span>
                      <span className="value">{bet.coef / 100}</span>
                    </div>
                    <div className="col-6-12">
                      <span className="label">Amount</span>
                      <span className="value">{bet.amount}</span>
                    </div>
                  </div>
              </div>

              <div className="action col-1-6">
                {{
                  'cancel': (
                    <button className="cancel" onClick={() => this.getResults(bet.betPoolId)}>Cancel</button>
                  ),
                  'waiting': (
                    <span className="button waiting">Waiting...</span>
                  ),
                  'collect': (
                    <button className="collect" onClick={() => this.getResults(bet.betPoolId)}>Collect</button>
                  ),
                  default: (
                    <span></span>
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