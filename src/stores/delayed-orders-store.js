import { observable, action, computed } from "mobx";
import {
    getBotDelayedOrders,
    getAllDelayedOrders,
    getDelayedOrdersByApiKey,
    getDelayedOrdersByApiKeysGroup,
    getDelayedOrdersTrades,
    deleteDelayedOrder,
    deleteDelayedOrders,
    editDelayedOrders,
    editDelayedOrder
} from "../api/trading-api";

import { TableStore } from './base-table-store';

export const DEFFERED_ORDERS = 'DelayedOrder';

export class DelayedOrder {
    @observable amount = 0;
    @observable price = 0;
    @observable stopPrice = 0;
    @observable text = '';

    constructor(origin = {}) {
        this.amount = origin.amount || 0;
        this.price = origin.price || 0;
        this.stopPrice = origin.stopPrice || 0;
    }
}

export class DelayedOrdersStore extends TableStore {
    @observable.ref extendedData = {};
    @observable orderModel = {};
    apiMap = {
        ['common']: {
            editOne: editDelayedOrder,
            editMany: editDelayedOrders,
            deleteOne: deleteDelayedOrder,
            deleteMany: deleteDelayedOrders,
            apiKeyId: getDelayedOrdersByApiKey,
            groupId: getDelayedOrdersByApiKeysGroup,
            getExtendedData: getDelayedOrdersTrades,
            all: getAllDelayedOrders
        },
        ['bot']: {
            getExtendedData: getDelayedOrdersTrades,
            all: getBotDelayedOrders,
        }
    };
    currentApi = 'common';

    constructor(botId) {
        super();
        this.botId = botId;
        
        if (botId !== undefined) {
            this.currentApi = 'bot';
        }
    }

    getParams() {
        let params = super.getParams();

        if (this.currentApi === 'bot') {
            params['botId'] = this.botId;
        }

        return params;
    }

    onRowClick(id) {
        return this.apiMap[this.currentApi].getExtendedData(id)
            .then(action(data => {
                this.extendedData = {...this.extendedData, [id]: data};
            }))
            .catch((err) => console.error(err.message));
    }

    getFilteredDataItems() {
        return this.sourceData.filter(item => item.status == 'New' || item.status == 'InProcess');
    }

    @action
    createOrderModel(id) {
        const origin = id ? this.sourceData.find(r => r.id === id) : null;
        this.orderModel = observable(new DelayedOrder(origin));
    }

    @action
    setOrderModel(value, name) {
        this.orderModel[name] = value;
    }

    @action
    clearOrderModel() {
        this.orderModel = {}; 
    }

    getOrder(id) {
        return this.sourceData.find(item => item.id === id);
    }

    editOrder(id) {
        return this.apiMap[this.currentApi].editOne(id, this.orderModel);
    }

    editOrders() {
        const request = this.apiMap[this.currentApi].editMany;
        const selectedRows = this.getSelectedItems();
        const requests = Object.keys(selectedRows).map(key => {
            const options = {...this.orderModel, orderIds: selectedRows[key]};

            return request(options);
        });

        return Promise.all(requests);
    }

    deleteOrder(options) {
        return this.apiMap[this.currentApi].deleteOne(options)
            .then(() => this.getRequest())
            .catch((err) => {
                throw new Error(err);
            });
    }

    deleteDelayedOrders() {
        const request = this.apiMap[this.currentApi].deleteMany;
        const groupMap = {};
        this.selectedRows
            .forEach((item) => {
                const hash = item.apiKey.exchange + item.market;

                if (groupMap[hash] === undefined) {
                    groupMap[hash] = [item.id];
                } else {
                    groupMap[hash].push(item.id);
                }
            });

        const requests = Object.keys(groupMap).map(key => request(groupMap[key]));

        return Promise.all(requests)
            .then(() => this.getRequest())
            .catch((err) => {
                throw new Error(err);
            });
    }
}