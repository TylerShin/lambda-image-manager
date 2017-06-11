import * as Immutable from "immutable";
import * as React from "react";
import * as ReactDom from "react-dom";
import { applyMiddleware, createStore, Middleware } from "redux";
import { Router, browserHistory, hashHistory } from "react-router";
import { Provider } from "react-redux";
// redux middleware
import * as ReactRouterRedux from "react-router-redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
// helpers
import EnvChecker from "./helpers/envChecker";
import CssInjector from "./helpers/cssInjector";
// root reducer
import { rootReducer, initialState } from "./rootReducer";
// routes
import routes from "./routes";

let history: any;
if (EnvChecker.isDev()) {
  history = hashHistory;
} else {
  history = browserHistory;
}

const routerMid: Middleware = ReactRouterRedux.routerMiddleware(history);

// Create store
const AppInitialState = initialState;

let store: any;
if (!EnvChecker.isDev()) {
  store = createStore(
    rootReducer,
    AppInitialState,
    // TODO: Add InitialState and Define State types to change 'any' type
    applyMiddleware(routerMid, thunkMiddleware),
  );
} else {
  // Set logger middleware to convert from ImmutableJS to plainJS
  const logger = createLogger({
    stateTransformer: (state: any) => {
      const newState: any = {}; // HACK: Should assign proper type later
      for (const i of Object.keys(state)) {
        if (Immutable.Iterable.isIterable(state[i])) {
          newState[i] = state[i].toJS();
        } else {
          newState[i] = state[i];
        }
      }
      return newState;
    },
  });

  store = createStore(
    rootReducer,
    AppInitialState,
    applyMiddleware(routerMid, thunkMiddleware, logger),
  );
}

// Create history with store
const appHistory = ReactRouterRedux.syncHistoryWithStore(
  history,
  store,
);

export const appStore = store;

ReactDom.render(
  <CssInjector>
    <Provider store={store}>
      <Router history={(appHistory as any)} children={routes} />
    </Provider>
  </CssInjector>,
  document.getElementById("dashboard-app"),
);
