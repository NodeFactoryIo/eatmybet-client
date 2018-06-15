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
          this.setState({ betPools: {...this.state.betPools, [bet.gameId]: bet} });
        });
        this.setState({ betsLoaded: true });
      });
    });
  }

  render() {
    const { betPools, betsLoaded } = this.state;
    const { games } = this.props;

    if (games.length === 0) {
      return 'Loading';
    }

    if (_.isEmpty(betPools) && betsLoaded) {
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
                    <button className="action home">
                      <div className="flag" style={{ backgroundImage: 'url(/images/flags/' + game.homeTeamNameShort + '.png'  }} />
                      {game.homeTeamNameShort}
                    </button>
                  </div>
                  <div className="seperator col-2-12">
                    <button className="action draw">
                      X
                    </button>
                  </div>
                  <div className="away col-4-12">
                    <button className="action away">
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
            {betPools.map(function(bet, index){
              return (
                <div key={index} className={"bet " + ((index === 0) ? 'first' : '')}>
                  <div className="grid grid-pad-small">
                    <div className="col-7-12">
                      <div className="grid grid-pad-small info"> 
                          <div className="col-2-12">
                              &nbsp;
                          </div>
                          <div className="home push-1-12 col-2-12">
                          <button className={"home " + (bet.result === 1 ? 'active' : 'inactive')}>
                              1
                          </button>
                          </div>
                          <div className="seperator push-1-12 col-2-12">
                          <button className={"draw " + (bet.result === 2 ? 'active' : 'inactive')}>
                              X
                          </button>
                          </div>
                          <div className="away push-1-12 col-2-12">
                          <button className={"away " + (bet.result === 3 ? 'active' : 'inactive')}>
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
                          <span className="value">{bet.poolSize / bet.coef}</span>
                        </div>
                      </div>
                    </div>

                    <div className="action col-1-6">
                      <button className="eat">Eat bet</button>
                    </div>
                </div>
              </div>
              )
            })}
          </div>
          )
        })}
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EatABetList);