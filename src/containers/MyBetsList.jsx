import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from 'prop-types';
import moment from 'moment';

import { fetchGames } from "../redux/actions";


class MyBetsList extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      bets: {}
    };
  }

  componentDidMount() {
    const { contract, web3 } = this.props;

    contract.getPastEvents('BetTaken', {
      filter: { eater: web3.eth.defaultAccount }
    }).then(bets => this.setState({ bets }));
  }

  render() {
    const { games } = this.props;
    
    return (
      <div className="place-a-bet-wrap">
        {games.map(function(game, index){
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
                <div className={`grid grid-pad-small info ${!playedBet ? 'inactive' : '' }`}>
                    <div className="col-6-12">
                      <span>Odd</span>
                      <input type="text" disabled={!playedBet} onChange={(e) => this.onCoefChange(game.gameId, e)} />
                    </div>
                    <div className="col-6-12">
                      <span>Amount</span>
                      <input type="text" disabled={!playedBet} onChange={(e) => this.onAmountChange(game.gameId, e)}  />
                    </div>
                  </div>
                
              </div>
              <div className="action col-1-6">
                <button className="place" onClick={() => this.onSubmit(game.gameId)}>Place bet</button>
              </div>
            </div>
          </div>
        )}.bind(this))}
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
)(MyBetsList);