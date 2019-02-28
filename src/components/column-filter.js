import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Trans } from 'react-i18next';
import { NotificationManager } from "react-notifications";
import AppCheckbox from "./app-form/app-checkbox";
import AppDropdownMenu from './app-dropdown-menu/menu';
import { withNamespaces as withLangs } from 'react-i18next';

const withNamespaces = withLangs();

@withNamespaces
class ColumnFilter extends Component {
    state = {
        columns: {},
    };

    componentDidMount() {
        if (this.props.columns.length) {
            this.initCols();
        }
    }

    componentDidUpdate(prevProps) {
        if (!Object.keys(this.state.columns).length && this.props.columns.length !== prevProps.columns.length) {
            this.initCols();
        }
    }

    initCols = () => {
        const { name } = this.props;
        const columns = {};
        const filteredCols = this.getSettings()[name];

        if (filteredCols) {
            this.props.columns.forEach(col => {
                if (!col.name) {
                    return;
                }

                columns[col.name] = filteredCols.includes(col.name);
            });
        } else {
            this.props.columns.forEach(col => {
                if (!col.name) {
                    return;
                }

                columns[col.name] = !col.hideDefault;
            });
        }

        this.setState({ columns });
    }

    getSettings = () => {
        const storage = localStorage.getItem('settings');
        const currentSettings = storage ? JSON.parse(storage) : {};

        return currentSettings;
    }

    onChange = (checked, name) => {
        const { columns } = this.state;
        const newColumns = {...columns, [name]: checked};

        this.setState({ columns: newColumns });
    }

    onFilter = () => {
        const { columns } = this.state;
        const checkedCols = Object.keys(columns).filter(key => columns[key] === true);

        this.props.onFilter(checkedCols, columns);
    }

    onSaveSettings = () => {
        const { name } = this.props;
        const { columns } = this.state;
        const currentSettings = this.getSettings();
        const checkedCols = Object.keys(columns).filter(key => columns[key] === true);

        localStorage.setItem('settings', JSON.stringify({
            ...currentSettings,
            [name]: checkedCols
        }));
        NotificationManager.success("Settings have been saved");
    }

    onReset = () => {
        const { name } = this.props;
        const {[name]: key, ...currentSettings} = this.getSettings();
        const restoredCols = {...this.state.columns};

        Object.keys(restoredCols).forEach(key => restoredCols[key] = true);

        localStorage.setItem('settings', JSON.stringify({...currentSettings}));
        NotificationManager.success("Settings have been reset");
        // this.initCols();
        this.setState({
            columns: restoredCols
        });
    }

    renderColumns(onClose) {
        const { t } = this.props;
        const { columns } = this.state;

        return (
            <div className="content">
                <span className="app-link" onClick={this.onReset}>{t('columnFilter.restoreDefaults')}</span>
                <div className="columns-form form-group">
                    {Object.keys(columns).map((key, index) => {
                        return (
                            <AppCheckbox
                                checked={columns[key]}
                                name={key}
                                label={key}
                                onChange={this.onChange}
                                key={key + index}
                                className="list-item-label"
                            />
                        );
                    })}
                </div>
                <div className="flex-wrapper align-center right">
                    {/* <button
                        type="button"
                        className="app-button primary inline"
                        onClick={this.onSaveSettings}
                    >
                        Save settings
                    </button> */}
                    <button
                        type="button"
                        className="app-button success small inline"
                        onClick={() => {
                            this.onFilter();
                            onClose();
                        }}
                    >
                        {t('columnFilter.apply')}
                    </button>
                    <div className="app-link" onClick={onClose}>{t('columnFilter.cancel')}</div>
                </div>
            </div>
        );
    }

    render() {
        const button = <div className="app-button select"><Trans>columnFilter</Trans></div>;

        return (
            <AppDropdownMenu content={button} bottom>
                {(onClose) => this.renderColumns(onClose) }
            </AppDropdownMenu>
        );
    }
}

ColumnFilter.propTypes = {
    columns: PropTypes.any,
    onFilter: PropTypes.func,
    name: PropTypes.string,
}

export default ColumnFilter;
