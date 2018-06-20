import React from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import _ from 'lodash';

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
      console.log("created bets", bets)
      this.loadBetPools(contract, web3, bets);
    });

    contract.getPastEvents('BetTaken', {
      filter: { eater: web3.eth.defaultAccount }
    }).then(bets => {
      console.log("taken bets", bets)
      this.loadBetPools(contract, web3, bets);
    });
  }

  loadBetPools(contract, web3, betPools) {
    const betsWithProperties = betPools.map(async function(bet) {
      const betPool = await contract.methods.betPools(bet.returnValues.betPoolId).call();
      betPool.poolSize = parseFloat(web3.utils.fromWei(betPool.poolSize, "ether")).toFixed(3);
      return {...betPool, taken: true, against: true };
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

    const { games, web3 } = this.props;
    const { bets } = this.state;

    const dateTimeNowWithGameEndOffset = moment.utc().add({ hours: 2});

    console.log(bets);

    if (!bets || games.length === 0) {
      return (
        <div className="my-bets-wrap"><h4 className="loading">Loading...</h4></div>
      )
    }
    console.log("state", this.state);
    if (bets.length === 0) {
      return (
        <div className="my-bets-wrap"><h2>You have no bets, but you <a href="/">create a new one</a> or <a href="/eat-a-bet">eat an existing one</a></h2></div>
      )
    }

    return (
      <div className="my-bets-wrap">
        {Object.values(bets).map(function(bet, index){
          const game = _.filter(games, { gameId: bet.gameId})[0];

          console.log(bet);

          let actionInfo = 'cancel';
          
          let isBetTaken = bet.taken;
          let waitingForGameOutcome = true; // moment.utc(game.dateTime) < dateTimeNowWithGameEndOffset
          let betHasResult = false;
          let isUserWinner = false;

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

          console.log('bet', bet);

          return (
          <div className="game" key={index}>
            <div className="grid grid-pad-small">
              <div className="col-7-12">
                <div className="grid grid-pad-small info"> 
                  <div className="datetime col-2-12">
                    <span className="date">{ moment.utc(game.dateTime).local().format('DD.MM.YYYY') }</span><br/>  
                    <span className="time">{ moment.utc(game.dateTime).local().format('HH:mm') }</span>
                  </div>
                  <div className="home col-4-12">
                    <button disabled className={"home " + (bet.bet === "1" ? 'placed' : 'inactive')}>
                      <div className="flag" style={{ backgroundImage: 'url(/images/flags/' + game.homeTeamNameShort + '.png'  }} />
                      {game.homeTeamNameShort}
                    </button>
                  </div>

                  <div className="seperator col-2-12">
                  <button disabled className={"draw " + (bet.bet === "2" ? 'placed' : 'inactive')}>
                      X
                    </button>
                  </div>

                  <div className="away col-4-12">
                  <button disabled className={"away " + (bet.bet === "3" ? 'placed' : 'inactive') + (bet.bet === "3" ? 'placed' : 'inactive')}>
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
                      <span className="value">{bet.poolSize}</span>
                    </div>
                  </div>
              </div>

              <div className="action col-1-6">
                {{
                  'cancel': (
                    <button className="cancel" onClick={() => this.getResults(bet.betPoolId)}>Cancel</button>
                  ),
                  'waiting': (
                    <span className="button waiting">...</span>
                  ),
                  'collect': (
                    <button className="collect" onClick={() => this.getResults(bet.betPoolId)}>Cancel</button>
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