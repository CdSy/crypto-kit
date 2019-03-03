import React, { Component, Fragment } from 'react'

import { TransactionsContainer } from 'cripto-dev-kit';

export class MainPage extends Component {
  render () {
    return (
      <Fragment>
        <TransactionsContainer />
      </Fragment>
    )
  }
}
