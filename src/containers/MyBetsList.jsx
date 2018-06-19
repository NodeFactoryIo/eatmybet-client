import React from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import _ from 'lodash';

class MyBetsList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      bets: {},
      poolsLoaded: false,
      betsLoaded: false,
    };
  }

  componentDidMount() {
    const { contract, web3 } = this.props;

    contract.getPastEvents('PoolCreated', {
      filter: { creator: web3.eth.defaultAccount }
    }).then(bets => {
      this.setState({ poolsLoaded: true });
      this.setState({ bets: {...this.state.bets, ...bets} })
    });

    contract.getPastEvents('BetTaken', {
      filter: { eater: web3.eth.defaultAccount }
    }).then(bets => {
      this.setState({ betsLoaded: true });
      this.setState({ bets: {...this.state.bets, ...bets} })
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
    const { bets, betsLoaded, poolsLoaded } = this.state;

    const dateTimeNowWithGameEndOffset = moment.utc().add({ hours: 2});

    console.log(bets);

    if (!bets || games.length === 0) {
      return (
        <div className="my-bets-wrap">'Loading...'</div>
      )
    }

    if (_.isEmpty(bets) && betsLoaded && poolsLoaded) {
      return (
        <div className="my-bets-wrap"><h2>You have no bets, but you <a href="/">create a new one</a> or <a href="/eat-a-bet">eat an exiting one</a></h2></div>
      )
    }

    return (
      <div className="my-bets-wrap">
        {Object.values(bets).map(function(betObject, index){
          const bet = betObject.returnValues;
          const game = _.filter(games, { gameId: bet.gameId})[0];

          let actionInfo = 'cancel';
          
          let isBetTaken = true;
          let waitingForGameOutcome = true; // moment.utc(game.dateTime) < dateTimeNowWithGameEndOffset
          let betHasResult = false;
          let isUserWinner = false;

          if (isBetTaken) { 
            actionInfo = 'none';
          }

          if (isBetTaken && waitingForGameOutcome) { 
            actionInfo = 'waiting';
          }

          if (betHasResult && !isUserWinner) {
            actionInfo = 'none';
          }

          if (betHasResult && isUserWinner) {
            actionInfo = 'collect';
          } 

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
                    <button disabled className={"home " + (bet.bet === "1" ? 'active' : 'inactive')}>
                      <div className="flag" style={{ backgroundImage: 'url(/images/flags/' + game.homeTeamNameShort + '.png'  }} />
                      {game.homeTeamNameShort}
                    </button>
                  </div>

                  <div className="seperator col-2-12">
                  <button disabled className={"draw " + (bet.bet === "2" ? 'active' : 'inactive')}>
                      X
                    </button>
                  </div>

                  <div className="away col-4-12">
                  <button disabled className={"away " + (bet.bet === "3" ? 'active' : 'inactive')}>
                      <div className="flag" style={{ backgroundImage: 'url(/images/flags/' + game.awayTeamNameShort + '.png'  }} />
                      {game.awayTeamNameShort}
                    </button>
                  </div>
                </div>
              </div>

              <div className="action col-1-4">
                <div className={`grid grid-pad-small info active}`}>
                    <div className="col-6-12">
                      <span className="label">Odd</span>
                      <span className="value">{bet.coef / 100}</span>
                    </div>
                    <div className="col-6-12">
                      <span className="label">Amount</span>
                      <span className="value">{parseFloat(web3.utils.fromWei(bet.amount)).toFixed(3)}</span>
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