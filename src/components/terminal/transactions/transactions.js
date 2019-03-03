import React, { Component, Fragment } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { format, compareAsc } from 'date-fns';
import Select from "react-select";
import ColumnFilter from '../../column-filter';
// import TablePagination from '../../pagination';

@observer
class TransactionsComponent extends Component {
  columns = [
    {
      key: 0,
      title: 'Account',
      dataIndex: 'account',
      sorter: (a, b) => (a.account && b.account) &&  a.account.localeCompare(b.account)
    },
    {
      key: 1,
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => (a.address && b.address) && a.address.localeCompare(b.address)
    },
    {
      key: 2,
      title: 'Amount',
      dataIndex: 'amount',
      sorter: (a, b) => Number(a.amount) - Number(b.amount)
    },
    {
      key: 3,
      title: 'Currency',
      dataIndex: 'currency',
      sorter: (a, b) => (a.currency && b.currency) && a.currency.localeCompare(b.currency)
    },
    {
      key: 4,
      title: 'Fee',
      dataIndex: 'fee',
      sorter: (a, b) => (a.fee && b.fee) && a.fee.localeCompare(b.fee)
    },
    {
      key: 5,
      title: 'Transact Id',
      dataIndex: 'transactId',
      sorter: (a, b) => (a.transactId && b.transactId) && a.transactId.localeCompare(b.transactId)
    },
    {
      key: 6,
      title: 'Transact Status',
      dataIndex: 'transactStatus',
      sorter: (a, b) => (a.transactStatus && b.transactStatus) && a.transactStatus.localeCompare(b.transactStatus)
    },
    {
      key: 7,
      title: 'Transact Text',
      dataIndex: 'transactText',
      sorter: (a, b) => (a.transactText && b.transactText) && a.transactText.localeCompare(b.transactText)
    },
    {
      key: 8,
      title: 'Transact Time',
      dataIndex: 'transactTime',
      render: (text, row, index) => (format(new Date(row.transactTime), "yyyy-MM-dd HH:mm:ss")),
      sorter: (a, b) => (a.transactTime && b.transactTime) && compareAsc(a.transactTime, b.transactTime)
    },
    {
      key: 9,
      title: 'Transact Timestamp',
      dataIndex: 'transactTime',
      render: (text, row, index) => (format(new Date(row.transactTimestamp), "yyyy-MM-dd HH:mm:ss")),
      sorter: (a, b) => (a.transactTimestamp && b.transactTimestamp) && compareAsc(new Date(a.transactTimestamp), new Date(b.transactTimestamp))
    },
    {
      key: 10,
      title: 'Transact Type',
      dataIndex: 'transactType',
      sorter: (a, b) => (a.transactType && b.transactType) && a.transactType.localeCompare(b.transactType)
    },
    {
      key: 11,
      title: 'Tx',
      dataIndex: 'tx',
      sorter: (a, b) => (a.tx && b.tx) && a.tx.localeCompare(b.tx)
    },
    {
      key: 12,
      title: 'Write Ts',
      dataIndex: 'writeTs',
      render: (text, row, index) => (format(new Date(row.writeTs), "yyyy-MM-dd HH:mm:ss")),
      sorter: (a, b) => (a.writeTs && b.writeTs) && compareAsc(new Date(a.writeTs), new Date(b.writeTs))
    }
  ];

  state = {
    tableColumns: {
      'Account': true,
      'Address': true,
      'Amount': true,
      'Currency': true,
      'Fee': true,
      'Transact Id': true,
      'Transact Status': true,
      'Transact Text': true,
      'Transact Time': true,
      'Transact Timestamp': true,
      'Transact Type': true,
      'Tx': true,
      'Write Ts': true
    }
  };

  getTableColumns() {
    const cols = this.state.tableColumns;
    return Object.keys(cols).map(key => ({name: key, hideDefault: !cols[key]}));
  }

  onColFilter = (visibleColumns) => {
    const cols = this.state.tableColumns;
    const filteredCols = Object.keys(cols).forEach(key => cols[key] = visibleColumns.includes(key));
    this.setState({tableColumns: {...cols}});
  }

  handleSelectChange = (field) => ({ value }) => {
    this.props.store.setFilter(field, value);
  }

  onChangePage = (event) => {
    this.props.store.setParams(event);
  }

  render() {
    const { sourceData, page, totalPages, pageSize, apiKeyId, groupId, isLoading, apiKeysOptions } = this.props.store;
    const columns = this.columns.filter(c => this.state.tableColumns[c.title]);

    return (
      <Fragment>
        <div className="app-filters-panel flex-wrapper align-center between">
          <div className="select-field">
            <Select
              value={apiKeyId}
              onChange={this.handleSelectChange('apiKeyId')}
              options={apiKeysOptions}
              clearable={false}
            />
          </div>
          <div className="flex-wrapper">
            <ColumnFilter columns={this.getTableColumns()} onFilter={this.onColFilter} name="positions"/>
          </div>
        </div>
        <Table
          dataSource={sourceData}
          columns={columns}
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
    );
  }
}

export default TransactionsComponent;
