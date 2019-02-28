import React, { Component, Fragment } from 'react';
import { observer } from "mobx-react";
import debounce from 'lodash/debounce';
import { NotificationManager } from "react-notifications";
import { JsonSchema } from '../schema-parser';

const tableOperations = (WrappedComponent) => {
    class TableHOC extends Component {
        componentMap = {};
        state = {
            orderId: null,
            formData: {}
        };

        componentDidUpdate(prevProps, prevState) {
            if (!Object.keys(this.componentMap).length && this.props.store.schema) {
                this.initFilters();
            }
        }

        getColumnFilterComponent = (columnName) => {
            const value = columnName && this.state.formData[columnName];

            if (value === undefined) {
                return {};
            }

            return ({
                filterDropdown: ({
                  setSelectedKeys, selectedKeys, confirm, clearFilters,
                }) => {
                    const component = columnName &&
                        this.componentMap[columnName] &&
                        this.componentMap[columnName].component || null;

                    const children = component && React.cloneElement(component, {
                        value,
                        name: columnName,
                        onChange: (value, name) => {
                            setSelectedKeys([value]);
                            this.onFilter(value, name);
                        }
                    });

                    return (
                        <div style={{ padding: 8 }}>
                            {children}
                        </div>
                    );
                }
            })
        };

        initFilters() {
            const componentMap = JsonSchema.parse(this.props.store.schema);
            const formData = componentMap && Object.keys(componentMap).reduce((form, key) => {
                form[key] = componentMap[key].type === 'boolean' ? false : '';
                return form;
            }, {});

            this.componentMap = componentMap;
            this.setState({formData});
        }

        clearFilters = () => {
            const clearedData = {};
            Object.keys(this.state.formData).forEach(key => clearedData[key]= '');

            this.setState({formData: clearedData},
            () => this.onChangeFilter({...this.state.formData}));
        }

        onFilter = (value, name) => {
            this.setState({
                formData: {
                    ...this.state.formData,
                    [name]: value
                }
            }, () => this.onChangeFilter({...this.state.formData}));
        }

        onChangePage = (event) => {
            this.props.store.setParams(event);
        }

        onSelectRow = (ids) => {
            this.props.store.onSelectRow(ids);
        }

        onSelectAll = () => {
            this.props.store.onSelectAll();
        }

        onChangeFilter = debounce((formData) => {
            this.props.store.onChangeFilter(formData);
        }, 800);

        render() {
            const { schema } = this.props.store;

            return (
                <Fragment>
                    <WrappedComponent
                        { ...this.props }
                        clearFilters={this.clearFilters}
                        getColumnFilterComponent={this.getColumnFilterComponent}
                        onSelectRow={this.onSelectRow}
                        onChangePage={this.onChangePage}
                        expandedKeys={this.state.expandedKeys}
                    />
                </Fragment>
            );
        }
    }

    return observer(TableHOC);
};

export default tableOperations;
