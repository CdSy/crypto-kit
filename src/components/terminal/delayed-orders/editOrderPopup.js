import React from "react";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import Select from "react-select";
import { NotificationManager } from "react-notifications";

import { DelayedOrdersStore } from "../../../stores/delayed-orders-store";
import NumberInput from "../../app-form/number-input";
import AppTextarea from "../../app-form/textarea";

@observer
class EditOrderModal extends React.Component {
    onChange = (value, name) => {
        this.props.store.setOrderModel(value, name);
    }

    saveChanges = (event) => {
        event.preventDefault();
        const { orderId } = this.props;

        if (orderId) {
            this.props.store.editOrder(orderId)
                .then(() => {
                    this.closeModal();
                    NotificationManager.success('Order has been updated');
                })
                .catch(() => NotificationManager.error('An error has occurred'));
        } else {
            this.props.store.editOrders()
                .then(() => {
                    this.closeModal();
                    NotificationManager.success('Orders have been updated')
                })
                .catch(() => NotificationManager.error('An error has occurred'));
        }
    }

    closeModal = () => {
        this.props.store.clearOrderModel();
        this.props.closeModal();
    }

    isDisabled(name, order) {
        if (!order) {
            return false;
        }

        if (name === 'amount') {
            return order.amountType !== "Absolute";
        }

        if (name === 'price') {
            return order.orderType !== "Limit";
        }
        
        if (name === 'stopPrice') {
            return order.stopType === null;
        }

        return false;
    }

    render() {
        const { isOpen, closeModal, store, orderId } = this.props;
        const { amount = 0, price = 0, stopPrice = 0, text = '' } = store.orderModel;
        const order = orderId ? store.getOrder(orderId) : null;
        const header = orderId ? 'Edit order' : 'Edit orders';

        return (
            <Modal
                visible={isOpen}
                centered
                onCancel={this.closeModal}
                footer={null}
                width="400px"
            >
                <form className="app-trade-form flex-wrapper direction-column between" onSubmit={this.saveChanges}>
                    <div>
                        <div className="app-trade-form__head flex-wrapper between">
                            <h5 className="main-title modal-title">
                                <span className="first-part">{header}</span>
                            </h5>
                        </div>
                        <div className="form-group">
                            Amount
                            <NumberInput
                                className="form-control form-control-sm"
                                name="amount"
                                value={amount}
                                onChange={this.onChange}
                                disabled={this.isDisabled('amount', order)}
                            />
                        </div>
                        <div className="form-group">
                            Price
                            <NumberInput
                                className="form-control form-control-sm"
                                name="price"
                                value={price}
                                onChange={this.onChange}
                                disabled={this.isDisabled('price', order)}
                            />
                        </div>
                        <div className="form-group">
                            Stop Price
                            <NumberInput
                                className="form-control form-control-sm"
                                name="stopPrice"
                                value={stopPrice}
                                onChange={this.onChange}
                                disabled={this.isDisabled('stopPrice', order)}
                            />
                        </div>
                        <div className="form-group">
                            <AppTextarea
                                className="form-control"
                                name="text"
                                value={text}
                                onChange={this.onChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className="app-button success">
                        Save
                    </button>
                </form>
            </Modal>
        );
    }
}

EditOrderModal.propTypes = {
    store: PropTypes.instanceOf(DelayedOrdersStore),
    orderId: PropTypes.any,
    isOpen: PropTypes.bool,
    closeModal: PropTypes.func,
};

export default EditOrderModal;