import React, { Component, Fragment } from 'react';
import { observer } from "mobx-react";
import Select from "react-select";

@observer
class DelayedOrdersFilters extends Component {
    handleSelectChange = (field) => ({ value }) => {
      this.props.store.setFilter(field, value);
    }

    render() {
      const { apiKeyId, groupId, apiKeysOptions, apiKeyGroupsOptions } = this.props.store;

      return (
        <Fragment>
          <div className="select-field">
            <Select
              value={apiKeyId}
              onChange={this.handleSelectChange('apiKeyId')}
              options={apiKeysOptions}
              clearable={false}
            />
          </div>
          <div className="select-field" style={{width: '250px'}}>
            <Select
              value={groupId}
              onChange={this.handleSelectChange('groupId')}
              options={apiKeyGroupsOptions}
              clearable={false}
            />
          </div>
        </Fragment>
      )
    }
}

export default DelayedOrdersFilters;
