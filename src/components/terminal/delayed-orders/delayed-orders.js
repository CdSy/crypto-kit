import React, { Component, Fragment } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { format, compareAsc } from 'date-fns';
import { NotificationManager } from "react-notifications";
import { CancelAllButton } from "../../cancel-all-button";
import { EditAllButton } from "../../edit-all-button";
import { CancelButton } from "../../cancel-button";
import { ClearFiltersButton } from "../../clear-filter-button";
import ColumnFilter from '../../column-filter';
import TablePagination from '../../pagination';
import tableOperations from '../table-hoc';
import DelayedOrdersFilters from "./filters";
import EditOrderModal from './editOrderPopup';

@tableOperations
@observer
class DelayedOrdersComponent extends Component {
    columns = [
        {
            title: 'Api Key',
            dataIndex: 'apiKey',
            filter: true,
            render: (text, row, index) => ((row.apiKey === null) ? '' : row.apiKey.exchange + ' / ' + row.apiKey.keyName),
            sorter: (a, b) => a.apiKey.exchange.localeCompare(b.apiKey.exchange)
        },
        {
            title: 'Market',
            dataIndex: 'market',
            filter: true,
            sorter: (a, b) => (a.market && b.market) && a.market.localeCompare(b.market)
        },
        {
            title: 'Trade Type',
            dataIndex: 'tradeType',
            filter: true,
            sorter: (a, b) => (a.tradeType && b.tradeType) && a.tradeType.localeCompare(b.tradeType)
        },
        {
            title: 'Order Type',
            dataIndex: 'orderType',
            filter: true,
            sorter: (a, b) => (a.orderType && b.orderType) && a.orderType.localeCompare(b.orderType)
        },
        {
            title: 'Price',
            dataIndex: 'price',
            filter: true,
            sorter: (a, b) => Number(a.price) - Number(b.price)
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            filter: true,
            render: (text, row, index) => row.amount + (row.amountInPercent === true ? ' %' : ''),
            sorter: (a, b) => Number(a.amount) - Number(b.amount)
        },
        {
            title: 'Amount Type',
            dataIndex: 'amountType',
            filter: true,
            sorter: (a, b) => (a.amountType && b.amountType) && a.amountType.localeCompare(b.amountType)
        },
        {
            title: 'Stop Type',
            dataIndex: 'stopType',
            filter: true,
            sorter: (a, b) => (a.stopType && b.stopType) && a.stopType.localeCompare(b.stopType)
        },
        {
            title: 'Stop Price',
            dataIndex: 'stopPrice',
            filter: true,
            sorter: (a, b) => Number(a.stopPrice) - Number(b.stopPrice)
        },
        {
            title: 'Ttl',
            dataIndex: 'ttl',
            filter: true,
            sorter: (a, b) => Number(a.ttl) - Number(b.ttl)
        },
        {
            title: 'On Expire',
            dataIndex: 'onExpire',
            filter: true,
            sorter: (a, b) => (a.onExpire && b.onExpire) && ('' + a.onExpire).localeCompare(b.onExpire)
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filter: true,
            sorter: (a, b) => (a.status && b.status) &&  a.status.localeCompare(b.status)
        },
        {
            title: 'Create Ts',
            dataIndex: 'createTs',
            filter: true,
            render: (text, row, index) => (format(new Date(row.createTs), "yyyy-MM-dd HH:mm:ss")),
            sorter: (a, b) => (a.createTs && b.createTs) && compareAsc(new Date(a.createTs), new Date(b.createTs))
        },
        {
            title: 'Edit',
            filter: false,
            render: (text, row, index) => {
                if (row.status !== 'New' && row.status !== 'InProcess') {
                    return '';
                }

                return (
                    <div
                        onClick={this.onEditOne(row.id)}
                    >
                        <FontAwesomeIcon
                            icon={faEllipsisV}
                            className="menu-icon"
                        />
                    </div>
                );
            }
        },
        {
            title: 'Cancel',
            filter: false,
            render: (text, row, index) => {
                if (row.status !== 'New' && row.status !== 'InProcess' || this.props.withoutControls) {
                    return '';
                }

                return (
                    <CancelButton
                        onClick={this.onCancelOne({orderId: row.id})}
                    />
                );
            }
        }
    ];

    state = {
        showModal: false,
        expandedKeys: [],
        tableColumns: {
            'Api Key': true,
            'Market': true,
            'Trade Type': true,
            'Order Type': true,
            'Price': true,
            'Amount': true,
            'Amount Type': true,
            'Stop Type': true,
            'Stop Price': true,
            'Ttl': true,
            'On Expire': true,
            'Status': true,
            'Create Ts': true,
            'Edit': true,
            'Cancel': true,
        }
    };

    closeEditModal = () => {
        this.setState({showModal: false, orderId: null});
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.props.onSelectRow(selectedRows);
        },

        getCheckboxProps: record => {
            return ({
                disabled: record.status !== 'New' || record.status !== 'InProcess',
                name: record.status,
            });
        },
    }

    getTableColumns() {
        const cols = this.state.tableColumns;

        return Object.keys(cols).map(key => ({name: key, hideDefault: !cols[key]}));
    }

    onColFilter = (visibleColumns, filteredCols) => {
        this.setState({tableColumns: {...filteredCols}});
    }

    onCancelOne = (options) => () => {
        this.props.store.deleteOrder(options)
            .then(() => NotificationManager.success('Order has been deleted'))
            .catch(() => NotificationManager.error('An error has occurred'));
    }

    onCancelMany = () => {
        this.props.store.deleteDelayedOrders()
            .then(() => NotificationManager.success('Orders have been deleted'))
            .catch(() => NotificationManager.error('An error has occurred'));
    }

    renderExpandRow = record => {
        const nestedData = this.props.store.extendedData[record.id] || [];
        const columns = [
            {
                title: 'Date',
                dataIndex: 'ts',
                render: (text, row, index) => (format(new Date(row.ts), "yyyy-MM-dd HH:mm:ss"))
            },
            {
                title: 'Status',
                dataIndex: 'status',
            },
            {
                title: 'Comment',
                dataIndex: 'comment',
            },
        ];

        return (
            <Table
                dataSource={nestedData}
                columns={columns}
                rowKey="id"
                pagination={false}
                scroll={{ x: true, y: false }}
            />
        );
    }

    onEditMany = () => {
        this.props.store.createOrderModel(true);
        this.setState({showModal: true, orderId: null});
    }

    onEditOne = (orderId) => () => {
        this.props.store.createOrderModel(false, orderId);
        this.setState({showModal: true, orderId});
    }

    onExpand = (expanded, row) => {
        const rowId = row.id;
        const keys = this.state.expandedKeys;

        if (expanded) {
            this.props.store.onRowClick(rowId)
                .then(() => {
                    this.setState({expandedKeys: keys.concat(rowId)});
                });
        } else {
            this.setState({expandedKeys: keys.filter(k => k !== rowId)});
        }
    }

    render() {
        const { sourceData, page, schema, totalPages, pageSize, selected, isLoading } = this.props.store;
        const { withoutControls } = this.props;

        const columns = this.columns.filter(c => this.state.tableColumns[c.title]).map(col => {
            if (col.filter) {
                return {...col, ...this.props.getColumnFilterComponent(col.dataIndex)}
            } else {
                return col;
            }
        });

        return (
            <Fragment>
                {!withoutControls &&
                    <EditOrderModal
                        store={this.props.store}
                        orderId={this.state.orderId}
                        isOpen={this.state.showModal}
                        closeModal={this.closeEditModal}
                    />
                }
                <div className="app-filters-panel flex-wrapper between">
                    <div className="flex-wrapper">
                        {!withoutControls &&
                            <DelayedOrdersFilters
                                store={this.props.store}
                            />
                        }
                    </div>
                    <div className="flex-wrapper">
                        {!withoutControls &&
                            <EditAllButton
                                onClick={this.onEditMany}
                                disabled={!selected.length}
                                style={{marginRight: '10px'}}
                            />
                        }
                        <CancelAllButton
                            onClick={this.onCancelMany}
                            disabled={!selected.length}
                            style={{marginRight: '10px'}}
                        />
                        <ClearFiltersButton onClick={this.props.clearFilters} style={{marginRight: '10px'}}/>
                        <ColumnFilter columns={this.getTableColumns()} onFilter={this.onColFilter} name="positions"/>
                    </div>
                </div>

                <Table
                    dataSource={sourceData}
                    columns={columns}
                    rowSelection={this.rowSelection}
                    onExpand={this.onExpand}
                    expandedRowKeys={this.state.expandedKeys}
                    expandedRowRender={this.renderExpandRow}
                    rowKey="id"
                    loading={isLoading}
                    pagination={false}
                    scroll={{ x: true, y: false }}
                />
                <TablePagination
                    onChange={this.props.onChangePage}
                    activePage={page}
                    totalPages={totalPages}
                    pageSize={pageSize}
                />
            </Fragment>
        )
    }
}

export default DelayedOrdersComponent;
