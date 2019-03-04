import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { Row, Col, Card } from 'antd';
import NavigationMenu from './navigation-menu';

import {
  ActiveOrdersContainer,
  DelayedOrdersContainer,
  PositionsContainer,
  TransactionsContainer,
  UserNotificationsDropdown,
} from 'cripto-dev-kit';

export class MainPage extends Component {
  render () {
    return (
      <div>
        <Row gutter={16}>
          <Col span={3}>
            <div className="sidebar">
              <NavigationMenu />
            </div>
          </Col>
          <Col span={21}>
            <Card>
              <Switch>
                <Route path="/terminal/active-orders" key="active-orders-route" exact component={ActiveOrdersContainer}></Route>
                <Route path="/terminal/positions" key="positions-route" exact component={PositionsContainer}></Route>
                <Route path="/terminal/delayed-orders" key="delayed-orders-route" exact component={DelayedOrdersContainer}></Route>
                <Route path="/terminal/transactions" key="transactions-route" exact component={TransactionsContainer}></Route>
              </Switch>
              <Route path="/user-notifications" key="user-notifications-route" exact component={UserNotificationsDropdown}></Route>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
