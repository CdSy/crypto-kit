import React, { Component } from 'react';
import cx from 'classnames';

class AppInput extends Component {
  static defaultProps = {
    type: 'text'
  };

  onChange = (event) => {
    const { name, onChange } = this.props;

    if (!event.target.value.length) {
      this.setState({dirty: false});
    }

    onChange && onChange(event.target.value, name);
  }

  render() {
    const { value, label, name, placeholder, floatLabel, type, className, onKeyPress } = this.props;
    const isActive = value && value.length;

    return (
      <div className={cx('app-form-input', className, {'float': floatLabel})}>
        {label &&
          <label
            className={cx('app-form-label', {'active': isActive})}
          >
            {label}
          </label>
        }
        <input
          value={value}
          type={type}
          name={name}
          className="form-control"
          onChange={this.onChange}
          onKeyPress={onKeyPress || null}
          placeholder={placeholder || ''}
        />
      </div>
    );
  }
};

export default AppInput;
