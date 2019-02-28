import React, { Component } from 'react';
import DatePicker from 'antd/lib/date-picker';

class AppDatePicker extends Component {
  onChange = (date, dateString) => {
    const { name, onChange } = this.props;
    onChange(dateString, name);
  }

  render() {
    return (
      <DatePicker
        onChange={this.onChange}
        format="YYYY-MM-DD HH:mm"
        placeholder="Choose date"
      />
    )
  }
};

export default AppDatePicker;
