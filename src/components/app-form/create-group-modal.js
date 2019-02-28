import React from "react";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import AppCheckbox from "./app-checkbox";
import Select from "react-select";
import { NotificationManager } from "react-notifications";
import CommonStore from "../../stores/common-store";
import { createApiKeyGroup, editApiKeyGroup } from "../../api/exchanges-config-api";
import { withNamespaces as withLangs } from 'react-i18next';

const withNamespaces = withLangs();

@withNamespaces
@observer
class CreateGroupModal extends React.Component {
  state = {
    name: '',
    exchange: '',
    apiKeys: []
  };

  componentDidUpdate(prevProps) {
    const isOpened = !prevProps.isOpen && this.props.isOpen;
    const isClosed = prevProps.isOpen && !this.props.isOpen;

    if (this.props.editable && isOpened && this.props.apiKeyGroupId) {
      this.props.commonStore.getApiKeyGroupDetails(this.props.apiKeyGroupId)
        .then((details) => {
          this.setState({
            name: details.name,
            exchange: details.exchange,
            apiKeys: [...details.apiKeys.map(key => key.id)]
          });
        });
    }

    if (isClosed) {
      this.setState({
        name: '',
        exchange: '',
        apiKeys: []
      });
    }
  }

  onChange = event => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      ...this.state,
      [name]: value
    });
  }

  handleSelectChange = (name) => (option) => {
    this.setState({
      ...this.state,
      [name]: option.value,
      apiKeys: []
    });
  }

  toggleCollectionItem = (checked, name) => {
    const isChecked = checked;
    let newCollection = [...this.state.apiKeys];

    if (isChecked) {
      newCollection.push(name);
    } else {
      newCollection = newCollection.filter(item => item !== name);
    }

    this.setState({
      ...this.state,
      apiKeys: newCollection
    });
  }

  isValid() {
    const { name, exchange, apiKeys } = this.state;
    return name.length && exchange.length && apiKeys.length;
  }

  createApiKeyGroup = (event) => {
    event.preventDefault();
    const { apiKeyGroupId, t } = this.props;
    const  { name, exchange, apiKeys } = this.state;
    const message = this.props.editable ?
      t('newGroup.successMessageUpdate') :
      t('newGroup.successMessageCreate');

    (this.props.editable ? editApiKeyGroup({groupId: apiKeyGroupId, apiKeyIds: apiKeys, name, exchange}) : createApiKeyGroup({apiKeyIds: apiKeys, name, exchange}))
      .then((response) => {
        NotificationManager.success(message);
        this.props.closeModal();
        this.props.commonStore.update()
          .then(() => {
            this.props.onSuccess && this.props.onSuccess(response.id);
          });
      })
      .catch(() => NotificationManager.error(t('newGroup.errorMessage')));
  }

  render() {
    const { isOpen, closeModal, commonStore, editable, t } = this.props;
    const { name, exchange, apiKeys: choosedApiKeys } = this.state;
    const { apiKeys, exchangesOptions } = commonStore;
    const apiKeysByExchange = apiKeys ?
      apiKeys.filter(key => key.exchange === exchange) :
      [];
    const disabled = !this.isValid();
    const header = editable ? t('newGroup.editTitle') : t('newGroup.createTitle');

    return (
      <Modal
        visible={isOpen}
        centered
        className={'add-bot-modal'}
        onCancel={closeModal}
        footer={null}
        width="320px"
        title={header}
      >
        <form className="app-trade-form flex-wrapper direction-column between" onSubmit={this.createApiKeyGroup}>
          <div>
            <div className="form-group">
              <div className="form-label">{t('newGroup.groupName')}</div>
              <input
                className="form-control form-control-sm"
                type="text"
                name="name"
                value={name}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <div className="form-label">{t('newGroup.exchange')}</div>
              <Select
                value={exchange}
                onChange={this.handleSelectChange('exchange')}
                options={exchangesOptions}
                clearable={false}
                placeholder={t('newGroup.exchangePlaceholder')}
              />
            </div>
            <div className="columns-form form-group">
              {apiKeysByExchange.map((item, index) => {
                const isChecked = choosedApiKeys.includes(item.id);
                return (
                  <AppCheckbox
                    checked={isChecked}
                    name={item.id}
                    label={item.keyName}
                    onChange={this.toggleCollectionItem}
                    key={index}
                    light={true}
                    className="list-item-label"
                  />
                );
              })}
            </div>
          </div>
          <button type="submit" className="app-button success" disabled={disabled}>
            {t('newGroup.save')}
          </button>
        </form>
      </Modal>
    );
  }
}

CreateGroupModal.propTypes = {
  commonStore: PropTypes.instanceOf(CommonStore).isRequired,
  closeModal: PropTypes.func,
  onSuccess: PropTypes.func,
  apiKeyGroupId: PropTypes.any,
  isOpen: PropTypes.bool,
  editable: PropTypes.bool
}

export default CreateGroupModal;
