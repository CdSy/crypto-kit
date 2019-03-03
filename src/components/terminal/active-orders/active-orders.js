import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import { Table, Button } from 'antd';
import Select from 'react-select';
import { format, compareAsc } from 'date-fns';
import { NotificationManager } from 'react-notifications';
import { CancelAllButton } from '../../buttons/cancel-all-button';
import { CancelButton } from '../../buttons/cancel-button';
import humanizeString from 'humanize-string';
import TablePagination from '../../pagination'
import ColumnFilter from '../../column-filter'
import tableOperations from '../table-hoc'

@tableOperations
@observer
class ActiveOrdersComponent extends Component {
  state = {
    tableColumns: {}
  };

  componentDidMount() {
    autorun(() => {
      if (Object.keys(this.state.tableColumns).length) {
        return;
      }

      const { sourceData } = this.props.store;
      const keys = sourceData.length ? Object.keys(sourceData[0]) : [];
      if (keys.length) {
        const tableColumns = keys.reduce((obj, key) => {
          if (key === 'id') {
            return obj;
          }
          obj[key] = true;
          return obj;
        }, {});
        this.setState({tableColumns});
      }
    });
  }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.props.onSelectRow(selectedRows);
    },

    getCheckboxProps: record => {
      return ({
        disabled: false,
        name: String(record.id),
      });
    },
  }

  getTableColumns() {
    const cols = this.state.tableColumns;
    return Object.keys(cols).map(key => ({name: key, hideDefault: !cols[key]}));
  }

  handleSelectChange = (field) => ({ value }) => {
    this.props.store.setFilter(field, value);
  }

  onCancelOne = (options) => () => {
    this.props.store.deleteOrder(options)
      .then(() => NotificationManager.success('Order has been deleted'))
      .catch(() => NotificationManager.error('An error has occurred'));
  }

  onCancelMany = () => {
    this.props.store.deleteActiveOrders()
      .then(() => NotificationManager.success('Order has been deleted'))
      .catch(() => NotificationManager.error('An error has occurred'));
  }

  render() {
    const {
      sourceData,
      page,
      totalPages,
      pageSize,
      apiKeyId,
      groupId,
      selected,
      isLoading,
      apiKeysOptions,
      apiKeyGroupsOptions
    } = this.props.store;
    const { withoutControls } = this.props;
    const cols = [];
    const keys = sourceData.length ? Object.keys(sourceData[0]) : [];

    if (!sourceData.length) {
      cols.push({key: 0, title: '', dataIndex: 'id'});
    } else {
      keys.forEach((key, index) => {
        switch(key) {
          case 'id':
            return;
          case 'apiKey':
            cols.push(
              {
                key: index,
                title: humanizeString(key),
                dataIndex: 'apiKey',
                filter: true,
                render: (text, row, index) => ((row.apiKey === null) ? '' : row.apiKey.exchange + ' / ' + row.apiKey.keyName),
                sorter: (a, b) => a.apiKey.exchange.localeCompare(b.apiKey.exchange),
                ...this.props.getColumnFilterComponent('apiKey')
              }
            );
            break;
          case 'dateTime':
            cols.push(
              {
                key: index,
                title: humanizeString(key),
                dataIndex: 'dateTime',
                filter: true,
                render: (text, row, index) => (format(new Date(row.dateTime), "yyyy-MM-dd HH:mm:ss")),
                sorter: (a, b) => (a.dateTime && b.dateTime) && compareAsc(new Date(a.dateTime), new Date(b.dateTime)),
                ...this.props.getColumnFilterComponent('dateTime')
              }
            );
            break;
          default:
            cols.push(
              {
                key: index,
                title: humanizeString(key),
                dataIndex: key,
                filter: true,
                sorter: (a, b) => (a[key] && b[key]) &&  a[key].localeCompare(b[key]),
                ...this.props.getColumnFilterComponent(key)
              }
            );
        }
      });

      if (!withoutControls) {
        cols.push(
          {
            key: cols.length + 1,
            title: 'Cancel',
            filter: false,
            render: (text, row, index) => {
              if (row.orderState !== 'New' && row.orderState !== 'InProcess') {
                return '';
              }

              return (
                <CancelButton
                  onClick={this.onCancelOne({apiKeyId: row.apiKey.id, orderId: row.id})}
                />
              );
            }
          }
        );
      }
    }

    return (
      <Fragment>
        <div className="app-filters-panel flex-wrapper align-center between">
          <div className="flex-wrapper">
            {!withoutControls &&
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
            }
          </div>
          <div className="flex-wrapper">
            <CancelAllButton
              onClick={this.onCancelMany}
              disabled={!selected.length}
              style={{marginRight: '10px'}}
            />
            <Button onClick={this.props.clearFilters} style={{marginRight: '10px'}}>Clear filters</Button>
            <ColumnFilter columns={this.getTableColumns()} onFilter={this.onColFilter} name="positions"/>
          </div>
        </div>
        <Table
          dataSource={sourceData}
          columns={cols}
          rowSelection={this.rowSelection}
          rowKey="id"
          loading={isLoading}
          pagination={true}
          scroll={{ x: true, y: false }}
        />
        {/* Pagination is not implemented on backend yet */}
        {/*<TablePagination*/}
          {/*onChange={this.onChangePage}*/}
          {/*activePage={page}*/}
          {/*totalPages={totalPages}*/}
          {/*pageSize={pageSize}*/}
        {/*/>*/}
      </Fragment>
    )
  }
}

export default ActiveOrdersComponent;
