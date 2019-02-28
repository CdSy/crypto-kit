import { SERVER, doRequestWithUserToken, doPagingRequestWithUserToken } from "./api-utils";

export function getBillingBalance() {
    return doRequestWithUserToken(`${SERVER}/api/v1/billing/balance`);
}

export function getBillingAddress(currency) {
    return doRequestWithUserToken(`${SERVER}/api/v1/billing/receiveAddress/${currency}`);
}

export function getTransactions(currency, page, pageSize) {
    return doPagingRequestWithUserToken(`${SERVER}/api/v1/billing/transactions?currency=${currency}&page=${page}&pageSize=${pageSize}`);
}
