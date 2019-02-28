import { observable, action, computed } from "mobx";
import { TableStore } from './base-table-store';
import { getTransactionHistory } from "../api/trading-api";

export const TRANSACTION = 'TransactionHistory';

export class TransactionsStore extends TableStore {
    apiMap = {
        ['common']: {
            apiKeyId: getTransactionHistory,
            all: getTransactionHistory
        }
    };
    currentApi = 'common';

    constructor(root) {
        super();
        this.root = root;
    }

    getFilteredDataItems() {
        return this.sourceData.filter(item => item);
    }
}