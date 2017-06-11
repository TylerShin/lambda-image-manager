import * as React from "react";
import { Route, IndexRoute } from "react-router";
// Import containers
import App from "./containers/app";
import Home from "./containers/home";

const routeMap = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
  </Route>
);

export default routeMap;
