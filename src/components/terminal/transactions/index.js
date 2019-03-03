import React, { Component, Fragment } from 'react';
import TransactionsComponent from "./transactions";
import { TransactionsStore, TRANSACTION as TRANSACTION_TYPE } from '../../../stores/transactions-store';

class TransactionsContainer extends Component {
  id = TRANSACTION_TYPE;
  constructor(props) {
    super(props);
    this.store = new TransactionsStore();
  }
  componentDidMount() {
    this.store.getApiKeysData({setDefaultKey: true});
    this.store.getSchema(this.id);
    this.store.loadData().then(() => this.store.startAutoUpdate());
  }

  componentWillUnmount() {
    this.store.stopAutoUpdate();
  }

  render() {
    return (
      <Fragment>
        <TransactionsComponent store={this.store} />
      </Fragment>
    )
  }
}

export default TransactionsContainer;
