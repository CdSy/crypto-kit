import React, { Component } from 'react';
import AppModal from '../app-modal';
import Select from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import CreateGroupModal from "./create-group-modal";
import ExchangeConfigEditor from "../api-keys-settings/exchange-config-editor";

class ApiKeysSelect extends Component {
  state = {
    apiKeyType: 'apiKey',
    createGroupIsOpen: false,
    createApiKeyIsOpen: false,
    isEdit: false,
  };

  toogleType = (type) => () => {
    this.setState({apiKeyType: type});

    if (this.props.toogleType) {
      this.props.toogleType(type);
    }
  }

  handleSelectChange = (option) => {
    if (option.value === 'add') {
      this.openCreateModal();
    } else {
      this.props.onChange(option.value, this.state.apiKeyType);
    }
  }

  openCreateModal = () => {
    const isApiKey = this.state.apiKeyType === 'apiKey';

    if (isApiKey) {
      this.setState({ createApiKeyIsOpen: true, isEdit: false });
    } else {
      this.setState({ createGroupIsOpen: true, isEdit: false });
    }
  }

  editGroup = () => {
    this.setState({ createGroupIsOpen: true, isEdit: true });
  }

    closeModal = () => {
        this.setState({
            createGroupIsOpen: false,
            createApiKeyIsOpen: false,
            isEdit: false,
        });
    }

    render() {
        const {
            commonStore,
            pageApiKeysStore,
            apiKeyGroupId,
            apiKeyId,
            onChange,
            onSuccess,
            isPending,
            editable
        } = this.props;

        const {
            apiKeyType,
            createGroupIsOpen,
            createApiKeyIsOpen,
            isEdit,
        } = this.state;

        const isApiKey = apiKeyType === 'apiKey';
        const keysOptions = [...commonStore.apiKeysIdOptions, {value: 'add', label: 'Add new', className: 'trigger-option'}];
        const groupOptions = [...commonStore.apiKeyGroupsOptions, {value: 'add', label: 'Add new', className: 'trigger-option'}];
        const options = isApiKey ? keysOptions : groupOptions;
        const value = isApiKey ? apiKeyId : apiKeyGroupId;
        const placeholder = isApiKey ? 'Choose ApiKey' : 'Choose ApiKey group';

        return (
            <div className="form-group">
                <CreateGroupModal
                    commonStore={commonStore}
                    apiKeyGroupId={apiKeyGroupId}
                    onSuccess={onSuccess}
                    closeModal={this.closeModal}
                    isOpen={createGroupIsOpen}
                    editable={isEdit}
                />

                <AppModal
                    open={createApiKeyIsOpen}
                    onClose={this.closeModal}
                    center
                    className={'add-bot-modal'}
                >
                    <ExchangeConfigEditor
                        onSave={onSuccess}
                        pageApiKeysStore={pageApiKeysStore}
                        closeModal={this.closeModal}
                    />
                </AppModal>

                <div
                    className={`key-tab col-form-label-sm ${isApiKey ? 'active' : ''}`}
                    onClick={this.toogleType('apiKey')}
                >
                    ApiKey
                </div>
                <div
                    className={`key-tab col-form-label-sm ${!isApiKey ? 'active' : ''}`}
                    onClick={this.toogleType('apiKeyGroup')}
                >
                    Group Keys
                </div>

                <div className="flex-wrapper align-center">
                    <Select
                        className="wide"
                        name="order-book-exchange"
                        value={value}
                        onChange={this.handleSelectChange}
                        options={options}
                        clearable={false}
                        placeholder={placeholder}
                        disabled={isPending}
                    />

                    {!isApiKey && apiKeyGroupId && editable &&
                        <span
                            className="app-link edit-icon"
                            onClick={this.editGroup}
                        >
                            <FontAwesomeIcon
                                icon={faPencilAlt}
                                className="icon"
                            />
                        </span>
                    }
                </div>
            </div>
        );

    }
};

export default ApiKeysSelect;
