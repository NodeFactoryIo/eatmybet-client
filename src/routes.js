import React from "react";
import { Switch, Route } from "react-router-dom";

import EatABetPage from "./containers/pages/EatABet";

export default () => (
  <Switch>
    <Route exact path="/" component={EatABetPage} />
  </Switch>
);