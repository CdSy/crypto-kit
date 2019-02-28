import React, { Component } from 'react';
import PropTypes from "prop-types";

class SelectRow extends Component {
    onSelectRow = (event) => {
        this.props.onChange(event.target.checked, this.props.name);
    }

    render() {
        const { name } = this.props;

        return (
            <input
                type="checkbox"
                name={name}
                checked={this.props.value}
                onChange={this.onSelectRow}
            />
        );
    }
}

SelectRow.propTypes = {
    name: PropTypes.any,
    value: PropTypes.bool,
    onChange: PropTypes.func,
}

export default SelectRow;
