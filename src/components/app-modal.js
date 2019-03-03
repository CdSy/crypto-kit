import React, { Component } from "react";
import Modal from 'react-responsive-modal';

class AppModal extends Component {
  static defaultProps = {
    className: 'app-main-modal',
    overlayClassName: ''
  };

  render() {
    const { className, children, overlayClassName, ...otherProps } = this.props;
    return (
      <Modal
        {...otherProps}
        classNames={{
          modal: `app-modal ${className}`,
          overlay: `app-modal-overlay dark ${overlayClassName}`,
          closeIcon: 'modal-close-icon'
        }}
      >
        {children}
      </Modal>
    );
  }
}

export default AppModal;
