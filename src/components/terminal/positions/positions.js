import React, { Component, Fragment } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import Select from "react-select";
import tableOperations from '../table-hoc';
import { CancelAllButton } from "../../buttons/cancel-all-button";
import { CancelButton } from "../../buttons/cancel-button";
import ColumnFilter from '../../column-filter';
// import TablePagination from '../../pagination';

@tableOperations
@observer
class PositionsComponent extends Component {
    columns = [
        {
            key: 0,
            title: 'Api Key',
            dataIndex: 'apiKey',
            filter: true,
            render: (text, row, index) => ((row.apiKey === null) ? '' : row.apiKey.exchange + ' / ' + row.apiKey.keyName),
            sorter: (a, b) => a.apiKey.exchange.localeCompare(b.apiKey.exchange)
        },
        {
            key: 1,
            title: 'Market',
            dataIndex: 'market',
            filter: true,
            sorter: (a, b) => a.apiKey.exchange.localeCompare(b.apiKey.exchange)
        },
        {
            key: 2,
            title: 'Entry Price',
            dataIndex: 'avgEntryPrice',
            filter: true,
            sorter: (a, b) => Number(a.avgEntryPrice) - Number(b.avgEntryPrice)
        },
        {
            key: 3,
            title: 'Cross Margin',
            dataIndex: 'crossMargin',
            filter: true,
            sorter: (a, b) => Number(a.crossMargin) - Number(b.crossMargin)
        },
        {
            key: 4,
            title: 'Current Qty',
            dataIndex: 'currentQty',
            filter: true,
            sorter: (a, b) => Number(a.currentQty) - Number(b.currentQty)
        },
        {
            key: 5,
            title: 'Current Cost',
            dataIndex: 'currentCost',
            filter: true,
            sorter: (a, b) => Number(a.currentCost) - Number(b.currentCost)
        },
        {
            key: 6,
            title: 'Leverage',
            dataIndex: 'leverage',
            filter: true,
            sorter: (a, b) => Number(a.leverage) - Number(b.leverage)
        },
        {
            key: 7,
            title: 'Unrealised Pnl',
            dataIndex: 'unrealisedPnl',
            filter: true,
            sorter: (a, b) => Number(a.unrealisedPnl) - Number(b.unrealisedPnl)
        },
        {
            key: 8,
            title: 'Home Notional',
            dataIndex: 'homeNotional',
            filter: true,
            sorter: (a, b) => Number(a.homeNotional) - Number(b.homeNotional)
        },
        {
            key: 9,
            title: 'Foreign Notional',
            dataIndex: 'foreignNotional',
            filter: true,
            sorter: (a, b) => Number(a.foreignNotional) - Number(b.foreignNotional)
        },
        {
            key: 10,
            title: 'Cancel',
            filter: false,
            render: (text, row, index) => {
                if (row.currentQty === 0 || this.props.withoutControls) {
                    return '';
                }

                return (
                    <CancelButton onClick={this.onCancelOne({apiKeyId: row.apiKey.id})}/>
                );
            }
        },
    ];

    state = {
        tableColumns: {
            'Api Key': true,
            'Market': true,
            'Entry Price': true,
            'Cross Margin': true,
            'Current Qty': true,
            'Current Cost': true,
            'Leverage': true,
            'Unrealised Pnl': true,
            'Home Notional': true,
            'Foreign Notional': true,
            'Cancel': true
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

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.props.onSelectRow(selectedRows);
        },

        getCheckboxProps: record => {
            return ({
                disabled: record.currentQty === 0,
                name: record.apiKey.id,
            });
        },
    }

    handleSelectChange = (field) => ({ value }) => {
        this.props.store.setFilter(field, value);
    }

    onCancelOne = (options) => () => {
        this.props.store.deletePosition(options)
            .then(() => NotificationManager.success('Order has been deleted'))
            .catch(() => NotificationManager.error('An error has occurred'));
    }

    onCancelMany = () => {
        this.props.store.deletePositions()
            .then(() => NotificationManager.success('Positions have been deleted'))
            .catch(() => NotificationManager.error('An error has occurred'));
    }

    render() {
        const {
            sourceData,
            page,
            totalPages,
            pageSize,
            apiKeyId,
            selected,
            groupId,
            isLoading,
            apiKeysOptions,
            apiKeyGroupsOptions,
            withoutControls
        } = this.props.store;

        const columns = this.columns.filter(c => this.state.tableColumns[c.title]).map(col => {
            if (col.filter) {
                return {...col, ...this.props.getColumnFilterComponent(col.dataIndex)}
            } else {
                return col;
            }
        });

        return (
            <Fragment>
                {selected.map((el, i) => (null))}
                <div className="app-filters-panel flex-wrapper align-center between">
                    <div className="flex-wrapper">
                        {withoutControls &&
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
                        <ColumnFilter columns={this.getTableColumns()} onFilter={this.onColFilter} name="positions"/>
                    </div>
                </div>
                {/* <AppTable
                    data={sourceData}
                    customClassName="small-table filtered"
                    filterCols="positions"
                    schema={schema}
                    selectedRows={selected}
                    onFilter={this.props.onFilter}
                    onSelectRow={this.props.onSelectRow}
                    onSelectAll={this.props.onSelectAll}
                    onCancelMany={this.onCancelMany}
                    allChecked={allChecked}
                > */}
                <Table
                    dataSource={sourceData}
                    columns={columns}
                    rowSelection={this.rowSelection}
                    rowKey="id"
                    loading={isLoading}
                    pagination={false}
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

export default PositionsComponent;
