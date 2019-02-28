import { observable, action, computed } from "mobx";
import { TableStore } from './base-table-store';
import {
    getAllPositions,
    getPositionsByApiKey,
    getPositionsByApiKeysGroup,
    deletePosition,
    deletePositions,
    getBotPositions
} from "../api/trading-api";

export const POSITIONS = 'Position';

export class PositionsStore extends TableStore {
    apiMap = {
        ['common']: {
            apiKeyId: getPositionsByApiKey,
            groupId: getPositionsByApiKeysGroup,
            deleteOne: deletePosition,
            deleteMany: deletePositions,
            all: getAllPositions
        },
        ['bot']: {
            deleteMany: deletePositions,
            all: getBotPositions
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
        return this.sourceData.filter(item => item.currentQty !== 0);
    }

    deletePosition(options) {
        return this.apiMap[this.currentApi].deleteOne(options)
            .then(() => this.getRequest())
            .catch((err) => {
                throw new Error(err);
            });
    }

    deletePositions() {
        const request = this.apiMap[this.currentApi].deleteMany;
        const items = this.selectedRows
            .map(item => ({apiKeyId: item.apiKey.id, market: item.market}));

        return request(items)
            .then(() => this.getRequest())
            .catch((err) => {
                throw new Error(err);
            });
    }
}