import { observable, action, computed } from "mobx";
import { getSchema } from "../api/schema-api";
import { getApiKeys, getApiKeyGroups } from '../api/exchanges-config-api';

export class TableStore {
    @observable isLoading = false;
    @observable.ref sourceData = [];
    @observable page = 1;
    @observable pageSize = 25;
    @observable totalPages = 1;
    
    @observable.ref apiKeyGroupsOptions = [];
    @observable.ref apiKeysOptions = [];
    @observable apiKeyId = '';
    @observable groupId = '';
    @observable selectedRows = [];
    @observable schema = null;
    
    filters = {};
    request = null;
    canDoRequest = true;
    currentApiKey = '';
    currentMarket = '';
    lastCheckedFilter = null;

    constructor() {}

    startAutoUpdate() {
        this.intervalId = setInterval(this.loadData, 2000);
    }

    stopAutoUpdate() {
        this.clear();

        if (this.intervalId !== undefined &&
            this.intervalId !== null)
        {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        return this;
    }

    @computed
    get selected() {
        return this.selectedRows;
    }

    @computed
    get allChecked() {
        const filteredItems = this.getFilteredDataItems();

        if (this.sourceData.length === 0 || filteredItems.length === 0) {
            return false;
        }

        return filteredItems.length === this.selectedRows.length;
    }

    @action
    setFilter(field, value) {
        this[field] = value;
        this.lastCheckedFilter = field;
        this.resetPagination();
        this.getRequest();

        return this;
    }

    @action
    setParams(event) {
        const { activePage, pageSize } = event;

        this.page = activePage;
        this.pageSize = pageSize;
        this.selectedRows.replace([]);
        this.getRequest();
    }

    @action
    onSelectRow(selectedRows) {
        this.selectedRows.replace(selectedRows);
    }

    @action
    resetPagination() {
        this.page = 1;
        this.pageSize = 25;
        this.totalPages = 1;
    }

    @action
    clear() {
        this.abortRequest();
        this.resetPagination();
        this.sourceData = [];
        this.extendedData = {};
        this.selectedRows.replace([]);
        this.apiKeyId = '';
        this.groupId = '';
        this.lastCheckedFilter = null;
        this.canDoRequest = true;
        this.schema = null;
        this.filters = {};
    }

    abortRequest() {
        if (this.request) {
            this.request.abort();
        }
    }

    getSchema(name) {
        return getSchema(name)
            .then(action((data) => this.schema = data))
            .catch(err => console.log('there is not schema for this table'));
    }

    loadData = () => {
        if (this.canDoRequest) {
            this.canDoRequest = false;
            this.request = this.getRequest();

            return this.request;
        }

        return Promise.resolve();
    }

    getApiKeysData(options) {
        Promise.all([
            getApiKeys(),
            getApiKeyGroups(),
        ])
        .then(action(([apiKeys, apiKeyGroups]) => {
            this.apiKeyGroupsOptions = apiKeyGroups.map(item => {
                const label = `${item.exchange} / ${item.name}`;
    
                return {value: item.id, label: label};
            });
    
            this.apiKeysOptions = apiKeys
                .filter(key => key.status !== 'Blocked')
                .map(item => {
                    const label = `${item.exchange} / ${item.keyName}`;
                    return { value: item.id, label: label };
                });

            if (options && options.setDefaultKey) {
                this.setFilter('apiKeyId', this.apiKeysOptions[0].value);
            }
        }));
    }

    setData = action((data, status, jqXHR) => {
        const totalPages = jqXHR.getResponseHeader('Paging-Total-Pages');
        const isWithoutIds = data[0] && data[0].id === undefined;

        if (isWithoutIds) {
            this.sourceData = data.map((d, index) => ({id: index, ...d}));
        } else {
            this.sourceData = data;
        }

        this.totalPages = totalPages ? parseInt(totalPages) : 1;
        this.isLoading = false;
        this.canDoRequest = true;
    });

    handleError = action((error) => {
        this.isLoading = false;
    });

    getRequest = () => {
        const request = this.apiMap[this.currentApi][this.lastCheckedFilter || 'all'];

        return request(
            this.getParams(),
            this.setData,
            this.handleError
        );
    }

    getParams() {
        const { pageSize, page, lastCheckedFilter, filters } = this;
        const params = {page: page - 1, pageSize: pageSize, reversed: true, ...filters};

        if (this.lastCheckedFilter) {
            params[lastCheckedFilter] = this[lastCheckedFilter];
        }

        return params;
    }

    onChangeFilter = action((formData) => {
        // const flatData = this.toFlat(formData);
        const filters = Object.keys(formData).reduce((filters, key) => {
            if (formData[key] === true || formData[key] && formData[key].length > 0) {
                const name = `f_${key}`;

                filters[name] = formData[key];
            }

            return filters;
        }, {});

        this.filters = filters;
        this.isLoading = true;
        this.getRequest();
    });
}