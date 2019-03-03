import React, { Component } from 'react'
import { BrowserRouter as Router, withRouter, Route, Switch, Redirect } from "react-router-dom";

import { AuthPage } from 'cripto-dev-kit';
import { isAuth } from "./services/access";
import { MainPage } from './main-page';

export default class App extends Component {
  render () {
    return (
      <Router>
        {isAuth() ?
          <Switch>
            <Route
              path="/"
              exact
              component={() => <MainPage />}
              key="main-route"
            />
          </Switch> :
          <Switch>
            <Route
              path="/"
              exact
              component={() => <AuthPage />}
              key="auth-route"
            />
          </Switch>
        }
      </Router>
    )
  }
}
