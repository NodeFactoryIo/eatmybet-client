import React from "react";
import { Switch, Route } from "react-router-dom";

import LandingPage from "./containers/pages/Landing";
import EatABetPage from "./containers/pages/EatABet";
import PlaceABetPage from "./containers/pages/PlaceABet";
import MyBetsPage from "./containers/pages/MyBets";
import ContractLoader from './containers/Contract';

export default () => (
  <Switch>
    <LandingPage>
      <ContractLoader>
        <Route exact path="/" component={PlaceABetPage} />
        <Route exact path="/eat-a-bet" component={EatABetPage} />
        <Route exact path="/my-bets" component={MyBetsPage} />
      </ContractLoader>
    </LandingPage>
  </Switch>
);