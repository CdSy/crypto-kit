import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

export default class NumberInput extends Component {
  componentDidUpdate(prevProps, prevState) {
    const { onChange, maxValue, value, data, name } = this.props;

    if (prevProps.maxValue === undefined && maxValue !== undefined) {
      onChange(Math.min(maxValue, parseFloat(value)), name, data);
    }
  }

  handleValueChange = e => {
    if (this.props.disableManualInput) {
      return;
    }

    const { onChange, minValue, maxValue, data, name, onlyInteger } = this.props;
    const value = e.target.value.trim();
    const valueWithPoint = value.replace(",", ".");
    const valueWithMinus = value.replace(/^-+/g,"-");
    const isNegative = /^\-$/.test(valueWithMinus);

    if (!isNegative && isNaN(valueWithPoint)) {
      return;
    }

    const valueNumber = Number(valueWithPoint);

    if (minValue !== undefined && valueNumber < minValue) {
      return;
    }

    if (maxValue !== undefined && valueNumber > maxValue) {
      return;
    }

    if (onlyInteger && value.includes(".")) {
      return;
    }

    onChange(valueWithMinus, name, data);
  }

  increase = () => {
    const { onChange, data, name, value, maxValue, disabled } = this.props;
    if (disabled || (!value && value !== 0) || value === maxValue) {
      return;
    }
    const increasedValue = (Number(value) + this.getStep()).toFixed(2) / 1;
    onChange(increasedValue, name, data);
  }

  decrease = () => {
    const { onChange, data, name, value, minValue, disabled } = this.props;
    if (disabled || (!value && value !== 0) || value === minValue || value.length === 0) {
      return;
    }
    const decreasedValue = (Number(value) - this.getStep()).toFixed(2) / 1;
    onChange(decreasedValue, name, data);
  }

  getStep() {
    return this.props.step ? this.props.step : 1;
  }

  render() {
    const { className, value, id, disabled, placeholder, controls } = this.props;
    const additionalClass = controls ? 'with-controls' : '';

    return (
      <div className={`app-number-input ${disabled ? 'disabled' : ''}`}>
        {controls &&
          <Fragment>
            <div className="control decrease" onClick={this.decrease}>-</div>
            <div className="control increase" onClick={this.increase}>+</div>
          </Fragment>
        }
        <input
          type="text"
          className={`number-input ${className} ${additionalClass}`}
          value={value}
          onChange={this.handleValueChange}
          id={id}
          disabled={disabled}
          placeholder={placeholder}
        />
      </div>
    );
  }
}

NumberInput.propTypes = {
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,

  minValue: PropTypes.number,
  maxValue: PropTypes.number,

  onlyInteger: PropTypes.bool,
  name: PropTypes.string,
  data: PropTypes.any,

  controls: PropTypes.bool,
  step: PropTypes.number,
  disableManualInput: PropTypes.bool
}

NumberInput.defaultProps = {
  className: "",
  disabled: false,
  minValue: -Infinity
}
