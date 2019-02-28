import React, { Component } from 'react';
import CheckboxIcon from './checkbox-icon';

class AppCheckbox extends Component {
  static defaultProps = {
    disabled: false,
    className: '',
    color: '#000'
  };

  onChange = (event) => {
    event.stopPropagation();
    const { name, onChange } = this.props;
    onChange(event.target.checked, name);
  }

  render() {
    const { checked, label, className, disabled, color } = this.props;

    return (
      <label className={`app-checkbox ${className} ${disabled ? 'disabled' : ''}`}>
        <input
          className="input"
          type="checkbox"
          checked={checked}
          onChange={this.onChange}
          disabled={disabled}
        />
        <CheckboxIcon color={color} />
        <div className="label">
          {label}
        </div>
      </label>
    );
  }
};

export default AppCheckbox;
