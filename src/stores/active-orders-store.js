import { observable, action, computed } from "mobx";
import { NotificationManager } from "react-notifications";
import { TableStore } from './base-table-store';
import {
  getAllActiveOrders,
  getActiveOrdersByApiKey,
  getActiveOrdersByApiKeysGroup,
  getBotActiveOrders,
  deleteActiveOrder,
  deleteActiveOrders
} from "../api/trading-api";

export const ACTIVE_ORDERS = 'ExchangeOrder';

export class ActiveOrdersStore extends TableStore {
    apiMap = {
        ['common']: {
            deleteOne: deleteActiveOrder,
            deleteMany: deleteActiveOrders,
            apiKeyId: getActiveOrdersByApiKey,
            groupId: getActiveOrdersByApiKeysGroup,
            all: getAllActiveOrders
        },
        ['bot']: {
            deleteMany: deleteActiveOrders,
            all: getBotActiveOrders
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

    getFilteredDataItems() {
        return this.sourceData.filter(item => item);
    }

    deleteOrder(options) {
        return this.apiMap[this.currentApi].deleteOne(options)
            .then(() => this.getRequest())
            .catch((err) => {
                throw new Error(err);
            });
    }

    deleteActiveOrders() {
        const request = this.apiMap[this.currentApi].deleteMany;
        const apiKeyIdsMap = {};
        this.selectedRows
            .forEach((item) => {
                const hash = item.apiKey.id;

                if (apiKeyIdsMap[hash] === undefined) {
                    apiKeyIdsMap[hash] = [item.id];
                } else {
                    apiKeyIdsMap[hash].push(item.id);
                }
            });


        return request({apiKeysAndOrderIds: apiKeyIdsMap})
            .then(() => this.getRequest())
            .catch((err) => {
                throw new Error(err);
            });
    }
}
