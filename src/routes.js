import React from "react";
import { Switch, Route } from "react-router-dom";

import EatABetPage from "./containers/pages/EatABet";
import ContractLoader from './containers/Contract';

export default () => (
  <Switch>
    <ContractLoader>
      <Route exact path="/" component={EatABetPage} />
    </ContractLoader>
  </Switch>
);