import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import { fetchContracts, fetchGames } from "../redux/actions";


class EatABetList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      betPools: [],
      gameId: null,
      outcome: null,
      amount: null
    }

    this.placeBet = this.placeBet.bind(this);
  }

  placeBet() {

    //console.log(this.state.outcome)
    //let matchId = contract.getMatchId(gameId);

    const { contract } = this.props;
    let matchId;
    let bet; // 0, 1 - x, 2
    let coef;
    contract.makeBet(matchId, bet, coef);
  }

  componentDidMount() {
    const { contract } = this.props;
    this.props.fetchGames();
  }

  render() {
    const { games } = this.props; 
    const bets = [ 
      { gameId : 21, outcome: 1, odd: 1.2, amount: 100 },
      { gameId : 21, outcome: 2, odd: 1.3, amount: 1 },
      { gameId : 21, outcome: 3, odd: 1.4, amount: 10 },
      { gameId : 21, outcome: 2, odd: 1.1, amount: 20 },
      { gameId : 21, outcome: 2, odd: 4.2, amount: 52 },
      { gameId : 21, outcome: 1, odd: 18, amount: 1000 },
      { gameId : 21, outcome: 1, odd: 1.99, amount: 64 }
    ];

    // onChange={(value) => this.setState({ outcome: value })}
    // onChange={(value) => this.setState({ amount: value })}
    
    return (
      <div class="eat-a-bet-wrap">
        {games.map(function(game, index){
          return <div class="game">
            <div class="grid grid-pad-small">
              <div class="col-7-12">
                <div class="grid grid-pad-small info"> 
                  <div class="datetime col-2-12">
                    <span class="date">{ moment.utc(game.dateTime).local().format('DD.MM.YYYY') }</span><br/>  
                    <span class="time">{ moment.utc(game.dateTime).local().format('HH:mm') }</span>
                  </div>
                  <div class="home col-4-12">
                    <button class="action home">
                      <div class="flag" style={{ backgroundImage: 'url(/images/flags/' + game.homeTeamNameShort + '.png'  }}></div>
                      {game.homeTeamNameShort}
                    </button>
                  </div>
                  <div class="seperator col-2-12">
                    <button class="action draw">
                      X
                    </button>
                  </div>
                  <div class="away col-4-12">
                    <button class="action away">
                      <div class="flag" style={{ backgroundImage: 'url(/images/flags/' + game.awayTeamNameShort + '.png'  }}></div>
                      {game.awayTeamNameShort}
                    </button>
                  </div>
                </div>
              </div>
              <div class="action disabled col-1-4">
                &nbsp;
              </div>
              <div class="action col-1-6">
                
              </div>
            </div>
            {bets.map(function(bet, index){
              return <div className={"bet " + ((index == 0) ? 'first' : '')}>
              <div class="grid grid-pad-small">
                  <div class="col-7-12">
                    <div class="grid grid-pad-small info"> 
                        <div class="col-2-12">
                            &nbsp;
                        </div>
                        <div class="home push-1-12 col-2-12">
                        <button className={"home " + (bet.outcome == 1 ? 'active' : 'inactive')}>
                            1
                        </button>
                        </div>
                        <div class="seperator push-1-12 col-2-12">
                        <button className={"draw " + (bet.outcome == 2 ? 'active' : 'inactive')}>
                            X
                        </button>
                        </div>
                        <div class="away push-1-12 col-2-12">
                        <button className={"away " + (bet.outcome == 3 ? 'active' : 'inactive')}>
                            2
                        </button>
                        </div>
                    </div>
                  </div>
                  <div class="action disabled col-1-4">
                    { bet.amount }<br/>
                    { bet.odd }
                  </div>
                  <div class="action col-1-6">
                    <button class="eat">Eat bet</button>
                  </div>
              </div>
          </div>
            })}
          </div>
        })}
      </div>
    );
  }
}

EatABetList.contextTypes = {
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EatABetList);