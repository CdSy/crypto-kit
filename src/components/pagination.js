import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Pagination } from 'antd';
import { withNamespaces as withLangs } from 'react-i18next';

const withNamespaces = withLangs();

@withNamespaces
class TablePagination extends Component {
    state = {
        activePage: this.props.activePage || 1,
        pageSize: this.props.pageSize,
        showSizeChanger: true,
        showTotal: true,
        totalPages: 50,
        pageSizeOptions: ['10', '25', '50', '100']
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

    handlePaginationChange = (page, pageSize) => {
        this.setState({ activePage: page }, () => {
            this.onChange();
        });
    }

    handleSizeChange = (current, size) => {
        this.setState({ pageSize: size }, () => {
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
            totalPages,
            pageSize,
            pageSizeOptions,
            showSizeChanger,
            showTotal
        } = this.state;

        return (
            <div className="app-pagination flex-wrapper align-center right">
                <Pagination
                    onChange={this.handlePaginationChange}
                    current={activePage}
                    total={totalPages}
                    pageSize={pageSize}
                    pageSizeOptions={pageSizeOptions}
                    onShowSizeChange={this.handleSizeChange}
                    showSizeChanger={showSizeChanger}
                    showTotal={(total, range) => this.props.t('showTotal', {range1: range[0], range2: range[1], total: total})}
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
