import React from 'react';
import { connect } from "react-redux";


class InfoAmountComponent extends React.Component {
  render() {

    /*
    const { web3 } = this.props;
    console.log(this.props.amount);
    let amount = web3.utils.fromWei(this.props.amount, 'ether');
    */
    let amount = this.props.amount;
    let eating = this.props.eating ? this.props.eating : false;

    let coef = this.props.coef / 100;
    let bet = parseInt(this.props.bet, 10);

    let winning  = '+ ' + (Math.round((coef * amount - amount) * 100) / 100);
    let lossing = '- ' + (Math.round(amount * 100) / 100);

    
    if(eating){
      winning = '+ ' +  Math.round(((amount * (100/coef) / Math.abs(1 - 100/coef)) * 100) / 100) ;
    }
    

    return (
      <div className={`grid grid-pad-small info-amount-wrap`}  > 
        <div className="col-2-12">&nbsp;
        </div>
        <div className="home col-4-12">
          <span className="info-amount">{ (bet === 1 && !eating) || (bet !== 1 && eating) ? winning : lossing } Ξ</span>
        </div>

        <div className="seperator col-2-12">
          <span className="info-amount">{ (bet === 2 && !eating) || (bet !== 2 && eating) ? winning : lossing } Ξ</span>
        </div>

        <div className="away col-4-12">
          <span className="info-amount">{ (bet === 3 && !eating) || (bet !== 3 && eating) ? winning : lossing } Ξ</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
});

export default connect(
  mapStateToProps,
  null,
)(InfoAmountComponent);