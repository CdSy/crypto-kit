import React, { Component } from "react";
import PropTypes from "prop-types";

class AppTextarea extends Component {
  static defaultProps = {
    className: '',
    placeholder: ''
  }

  onChange = event => {
    const value = event.target.value;

    if (this.props.maxLength) {
      if (value.length <= this.props.maxLength) {
        this.props.onChange(value, this.props.name);
      }
    } else {
      this.props.onChange(value, this.props.name);
    }
  }

  renderLimitCounter() {
    const { value, maxLength } = this.props;
    const currentLength = value ? value.length : 0;
    return (<div className="textarea-counter">{currentLength} / {maxLength}</div>);
  }

  render() {
    const { className, value, id, disabled, placeholder, name, maxLength, label, ...otherProps } = this.props;
    const fullClassName = `app-textarea ${className}`;

    return (
      <div>
        {label &&
          <label className="app-form-label">
            {label}
          </label>
        }
        <textarea
          {...otherProps}
          type="text"
          name={name}
          className={fullClassName}
          value={value}
          onChange={this.onChange}
          id={id}
          disabled={disabled}
          placeholder={placeholder}
        />
        {maxLength &&
            this.renderLimitCounter()
        }
      </div>
    );
  }
}

AppTextarea.propTypes = {
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  maxLength: PropTypes.number
}

export default AppTextarea;
