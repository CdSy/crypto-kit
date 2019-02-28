import React, { Component } from 'react';

class AppDropDownMenu extends Component {
  state = {
    isOpen: false
  };

  componentDidMount() {
    document.addEventListener('click', this.onClick, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClick, true);
  }

  toggleMenu = (event) => {
    event.stopPropagation();
    this.setState({isOpen: !this.state.isOpen});
  }

  onClick = (event) => {
    if (this.state.isOpen && !this.wrapperRef.contains(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({isOpen: false});
    }
  }

  closeMenu = () => {
    this.setState({isOpen: false});
  }

  stop = (event) => {
    event.stopPropagation();
  }

  getWrapperRef = (node) => {
    this.wrapperRef = node;
  }

  onChange = (value) => {
    this.props.onChange(value);
  }

  render() {
    const { children, content, bottom, position } = this.props;
    const { isOpen } = this.state;

    return (
      <div
        className={`app-dropdown-menu ${isOpen ? 'active' : ''} ${bottom ? 'bottom' : ''} ${position || ''}`}
        onClick={this.toggleMenu}
        ref={this.getWrapperRef}
      >
        { content }
        <div className="menu-body" onClick={this.stop}>
          {children(this.closeMenu)}
        </div>
      </div>
    );
  }
}

export default AppDropDownMenu;
