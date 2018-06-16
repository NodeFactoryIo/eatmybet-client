import React from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import _ from 'lodash';

class MyBetsList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      bets: {},
      betsLoaded: false,
    };
  }

  componentDidMount() {
    const { contract, web3 } = this.props;

    contract.getPastEvents('BetTaken', {
      filter: { eater: web3.eth.defaultAccount }
    }).then(bets => {
      this.setState({ betsLoaded: true });
      this.setState({ bets })
    });
  }

  getResults(betPoolId) {
    const { contract, web3 } = this.props;

    contract.methods.betPools(betPoolId).call()
      .then(response => {
        const result = response.result;
        console.log('Result is: ', result);

        if (result == 0) {
          alert("No results yet!");
        }
      })
  }

  render() {
    const { games, web3 } = this.props;
    const { bets, betsLoaded } = this.state;

    if (!bets || games.length === 0) {
      return 'Loading...';
    }

    if (_.isEmpty(bets) && betsLoaded) {
      return 'You have no bets.';
    }

    return (
      <div className="place-a-bet-wrap">
        {Array.from(bets).map(function(betObject, index){
          const bet = betObject.returnValues;
          const game = _.filter(games, { gameId: bet.gameId})[0];

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
                <div className={`grid grid-pad-small info active}`}>
                    <div className="col-6-12">
                      <span>Odd</span>
                      <span className="value">{bet.coef / 100}</span>
                    </div>
                    <div className="col-6-12">
                      <span>Amount</span>
                      <span className="value">{parseFloat(web3.utils.fromWei(bet.amount)).toFixed(3)}</span>
                    </div>
                  </div>
              </div>

              <div className="action col-1-6">
                <button className="place" onClick={() => this.getResults(bet.betPoolId)}>View results</button>
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