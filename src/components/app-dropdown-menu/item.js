import React, { Component } from 'react';

class AppMenuItem extends Component {
  onClick = () => {
    const { onClose, onClick, value } = this.props;
    onClick(value);
    onClose();
  }

  render() {
    const { children } = this.props;

    return (
      <div className="app-menu-item" onClick={this.onClick}>
        {children}
      </div>
    );
  }
}

export default AppMenuItem;
