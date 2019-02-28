import React, { Component } from 'react';
import PropTypes from "prop-types";
import Select from "react-select";
import { Pagination } from 'semantic-ui-react';
import { withNamespaces as withLangs } from 'react-i18next';

const withNamespaces = withLangs();

@withNamespaces
class TablePagination extends Component {
    state = {
        activePage: this.props.activePage || 1,
        pageSize: this.props.pageSize,
        boundaryRange: 1,
        siblingRange: 1,
        showEllipsis: true,
        showFirstAndLastNav: true,
        showPreviousAndNextNav: true,
        totalPages: 50,
        pageSizeOptions: [
            {value: 10, label: 10},
            {value: 25, label: 25},
            {value: 50, label: 50},
            {value: 100, label: 100},
        ],
    };

    static getDerivedStateFromProps(props, state) {
        if (props.totalPages !== state.totalPages) {
            return { totalPages: props.totalPages }
        }
        return null;
    }
    
    componentDidUpdate() {
        if (this.props.totalPages !== this.state.totalPages) {
            this.setState({ totalPages: this.props.totalPages});
        }

        if (this.props.activePage !== undefined && this.props.activePage !== this.state.activePage) {
            this.setState({ activePage: this.props.activePage});
        }
    }

    handlePaginationChange = (e, { activePage }) => {
        this.setState({ activePage }, () => {
            this.onChange();
        });
    }

    handleSizeChange = (option) => {
        this.setState({ pageSize: option.value }, () => {
            this.onChange();
        });
    }

    onChange = () => {
        const event = {
            pageSize: this.state.pageSize,
            activePage: this.state.activePage,
        };

        this.props.onChange(event);
    }

    render() {
        const {
            activePage,
            boundaryRange,
            siblingRange,
            showEllipsis,
            showFirstAndLastNav,
            showPreviousAndNextNav,
            totalPages,
            pageSize,
            pageSizeOptions,
        } = this.state;

        return (
            <div className="app-pagination flex-wrapper align-center right">
                {this.props.t('showPerPage')}
                <Select
                    value={pageSize}
                    options={pageSizeOptions}
                    clearable={false}
                    onChange={this.handleSizeChange}
                    className="select-up"
                />
                <Pagination
                    activePage={activePage}
                    boundaryRange={boundaryRange}
                    onPageChange={this.handlePaginationChange}
                    size='mini'
                    siblingRange={siblingRange}
                    totalPages={totalPages}
                    // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
                    ellipsisItem={showEllipsis ? undefined : null}
                    firstItem={showFirstAndLastNav ? undefined : null}
                    lastItem={showFirstAndLastNav ? undefined : null}
                    prevItem={showPreviousAndNextNav ? undefined : null}
                    nextItem={showPreviousAndNextNav ? undefined : null}
                />
            </div>
        );
    }
}

TablePagination.propTypes = {
    pageSize: PropTypes.number,
    totalPages: PropTypes.number,
    onChange: PropTypes.func,
}

export default TablePagination;