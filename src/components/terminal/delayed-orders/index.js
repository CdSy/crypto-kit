import React, { Component, Fragment } from 'react';
import DelayedOrdersComponent from "./delayed-orders";
import { DelayedOrdersStore, DEFFERED_ORDERS as DEFFERED_ORDERS_TYPE } from '../../../stores/delayed-orders-store';

class DelayedOrdersContainer extends Component {
    id = DEFFERED_ORDERS_TYPE;
    constructor(props) {
      super(props);
      this.store = new DelayedOrdersStore();
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
          <DelayedOrdersComponent store={this.store} />
        </Fragment>
      )
    }
}

export default DelayedOrdersContainer;
