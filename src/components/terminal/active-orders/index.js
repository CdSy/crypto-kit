import React, { Component, Fragment } from 'react';
import ActiveOrdersComponent from "./active-orders";
import { ActiveOrdersStore } from '../../../stores/active-orders-store';
import { ACTIVE_ORDERS as ACTIVE_ORDERS_TYPE } from '../../../stores/active-orders-store';

class ActiveOrdersContainer extends Component {
    id = ACTIVE_ORDERS_TYPE;
    constructor(props) {
      super(props);
      this.store = new ActiveOrdersStore();
    }

    componentDidMount() {
      this.store.getApiKeysData();
      this.store.getSchema(this.id);
      this.store.loadData().then(() => this.store.startAutoUpdate());
    }

    componentWillUnmount() {
      this.store.stopAutoUpdate();
    }

    render() {
      return (
        <Fragment>
          <ActiveOrdersComponent store={this.store} />
        </Fragment>
      )
    }
}

export default ActiveOrdersContainer
