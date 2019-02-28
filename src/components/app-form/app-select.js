import React, { Component } from 'react';
import Select from "react-select";

class AppSelect extends Component {
  onChange = (option) => {
    const { name, onChange } = this.props;
    onChange(option && option.value, name);
  }

  render() {
    const { value, options, name, onChange, ...other } = this.props;

    return (
      <Select {...other} value={value} options={options} onChange={this.onChange} />
    );
  }
};

export default AppSelect;
