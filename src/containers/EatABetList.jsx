import React from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { bindActionCreators } from "redux";
import moment from 'moment';
import _ from 'lodash';

import { fetchGames } from '../redux/actions';

class EatABetList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      betPools: {},
      betsLoaded: false,
      createdBet: {},
    };
  }

  componentWillMount() {
    this.props.fetchGames();
  }

  componentDidMount() {
    const { contract } = this.props;

    contract.methods.getBetPoolCount().call().then((count) => {
      const promises = [];
      for (let i = 0; i < count; i++) {
        promises.push(contract.methods.betPools(i).call());
      }

      Promise.all(promises).then(betPools => {
        betPools.forEach(bet => {
          const bets = this.state.betPools;
          const newArray = bets[bet.gameId] ? _.concat(bets[bet.gameId], bet) : [bet];
          this.setState({ betPools: {...bets, [bet.gameId]: newArray } });
        });
        this.setState({ betsLoaded: true });
      });
    });
  }

  onBetChoose(bet, type) {
    const newBet = {
      gameId: bet.gameId,
      bet: type,
      amount: `${bet.poolSize / bet.coef}`
    };
    this.setState({ bet: newBet });
  }

  onAmountChange(gameId, e) {
    if (e.target.value === '') {
      return;
    }

    const { web3 } = this.props;
    const amount = web3.utils.toWei(e.target.value, 'ether');
    this.setState({ bet: {...this.state.bet, amount} });
  }

  render() {
    const { betPools, betsLoaded, createdBet } = this.state;
    const { games, web3 } = this.props;

    if (games.length === 0) {
      return 'Loading';
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
      alert("No active bets but you can create a new one!");
      return <Redirect push to="/place-a-bet" />
    }

    return (
      <div className="eat-a-bet-wrap">
        {games.map(function(game, index){
          return !betPools[game.gameId] ? '' : (
          <div className="game" key={index}>
            <div className="grid grid-pad-small">
              <div className="col-7-12">
                <div className="grid grid-pad-small info"> 
                  <div className="datetime col-2-12">
                    <span className="date">{ moment.utc(game.dateTime).local().format('DD.MM.YYYY') }</span><br/>  
                    <span className="time">{ moment.utc(game.dateTime).local().format('HH:mm') }</span>
                  </div>
                  <div className="home col-4-12">
                    <button className="action home" disabled>
                      <div className="flag" style={{ backgroundImage: 'url(/images/flags/' + game.homeTeamNameShort + '.png'  }} />
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
                      <div className="flag" style={{ backgroundImage: 'url(/images/flags/' + game.awayTeamNameShort + '.png'  }} />
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
            {betPools[game.gameId] && betPools[game.gameId].map(function(bet, index){
              const amount = createdBet.gameId === bet.gameId ?
                `${createdBet[bet.gameId].amount}` :  `${bet.poolSize / bet.coef}`;

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
                            onClick={() => this.onBetChoose(bet, 1)}
                            className={"home " + (bet.result === 1 ? 'active' : 'inactive')}
                          >
                              1
                          </button>
                          </div>
                          <div className="seperator push-1-12 col-2-12">
                          <button
                            onClick={() => this.onBetChoose(bet, 2)}
                            className={"draw " + (bet.result === 2 ? 'active' : 'inactive')}
                          >
                              X
                          </button>
                          </div>
                          <div className="away push-1-12 col-2-12">
                          <button
                            onClick={() => this.onBetChoose(bet, 3)}
                            className={"away " + (bet.result === 3 ? 'active' : 'inactive')}
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
                          <span className="value">{bet.coef}</span>
                        </div>
                        <div className="col-6-12">
                          <span className="label">Amount</span>
                          <input
                            type="text"
                            onChange={(e) => this.onAmountChange(bet.gameId, e)}
                            value={web3.utils.fromWei(amount)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="action col-1-6">
                      <button className="eat">Eat bet</button>
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
)(EatABetList);