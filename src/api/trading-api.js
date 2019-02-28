import { doRequestWithUserToken, SERVER } from "./api-utils";

export function getMarkets(exchange) {
    const url = `${SERVER}/api/v1/trading/public/${exchange}/markets`;

    return doRequestWithUserToken(url);
}

const supportedExchanges = {
    BINANCE:  { endpoint: "common", marketSupported: true, },
    OKEX:     { endpoint: "common", marketSupported: true, },
    POLONIEX: { endpoint: "common", marketSupported: false, },
    BITTREX:  { endpoint: "common", marketSupported: false, },
    KUCOIN:   { endpoint: "common", marketSupported: false, },
    DSX:      { endpoint: "common", marketSupported: true, },
};

export function isExchangeSupported(exchange, orderType) {
    return supportedExchanges[exchange] !== undefined && (supportedExchanges[exchange].marketSupported || orderType !== "Market");
}

export function cancelOrder(apiKeyId, orderId) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/${apiKeyId}/orders/cancel/${orderId}`, { type: "DELETE" });
}

export const doTradeGroup = (apiKeyGroupId) => (options) => {
    const url = `${SERVER}/api/v1/trading/delayed/group/${apiKeyGroupId}`;
    
    return doRequestWithUserToken(url, {
        type: "POST",
        data: JSON.stringify(options),
    });
}

export function doTrade(options) {
    const url = `${SERVER}/api/v1/trading/delayed/bulk`;

    return doRequestWithUserToken(url, {
        type: "POST",
        data: JSON.stringify(options),
    });
}

export function getCommonOperations(options, success, error) {
    const { exchange, market, timeFrame, count } = options;

    return doRequestWithUserToken(`${SERVER}/api/v1/history/${exchange}/ohlc`, {
        type: "GET",
        data: {market, timeFrame, count}
    }, success, error);
}

export function getBotDelayedOrders({ botId, page, pageSize }, success, error) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/delayed/bot/${botId}?reversed=true&page=${page}&pageSize=${pageSize}`, {type: "GET"}, success, error);
}

export function getAllDelayedOrders(options, success, error) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/delayed`, {
        type: 'GET',
        data: options
    }, success, error);
}

export function getDelayedOrdersByApiKey(options, success, error) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/delayed/apiKey/${options.apiKeyId}`, {
        type: 'GET',
        data: options
    }, success, error);
}

export function getDelayedOrdersByApiKeysGroup(options, success, error) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/delayed/group/${options.groupId}`, {
        type: 'GET',
        data: options
    }, success, error);
}

export function getBotPositions({botId}, success, error) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/positions/bot/${botId}`,
    {type: "GET"}, success, error);
}

export function getAllPositions(options, success, error) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/positions`, {
        type: 'GET',
        data: options
    }, success, error);
}

export function getPositionsByApiKey(options, success, error) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/positions/apiKey/${options.apiKeyId}`, {
        type: 'GET',
        data: options
    }, success, error);
}

export function getPositionsByApiKeysGroup(options, success, error) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/positions/group/${options.groupId}`, {
        type: 'GET',
        data: options
    }, success, error);
}

export function deletePosition({apiKeyId}) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/positions/apiKeys/${apiKeyId}`, {
        type: 'DELETE'
    });
}

export function deletePositions(positions) {
    // console.log({positions})
    // return new Promise(resolve => {
    //     setTimeout(resolve, 1000);
    // })
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/positions/apiKeys/`, {
        type: 'DELETE',
        data: JSON.stringify(positions)
    });
}

export function getBotActiveOrders({botId}, success, error) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/orders/active/bot/${botId}`,
    {type: "GET"}, success, error);
}

export function getAllActiveOrders(options, success, error) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/orders/active`, {
        type: 'GET',
        data: options
    }, success, error);
}

export function getActiveOrdersByApiKey(options, success, error) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/orders/active/apiKey/${options.apiKeyId}`, {
        type: 'GET',
        data: options
    }, success, error);
}

export function getActiveOrdersByApiKeysGroup(options, success, error) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/orders/active/group/${options.groupId}`, {
        type: 'GET',
        data: options
    }, success, error);
}

export function getTransactionHistory(options, success, error) {
    const url = `${SERVER}/api/v1/trading/${options.apiKeyId}/bitmex/wallet/history`;
    
    return doRequestWithUserToken(url, {
        type: "GET",
        data: options,
    }, success, error);
}

export function deleteDelayedOrder({orderId}) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/delayed/${orderId}`, {
        type: 'DELETE',
    });
}

export function deleteDelayedOrders(ids) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/delayed/bulk`, {
        type: 'DELETE',
        data: JSON.stringify(ids)
    });
}

export function deleteActiveOrder({apiKeyId, orderId}) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/${apiKeyId}/orders/${orderId}`, {
        type: 'DELETE',
    });
}

export function deleteActiveOrders(options) {
    // console.log({options});
    // return new Promise(resolve => {
    //     setTimeout(resolve, 1000);
    // })

    return doRequestWithUserToken(`${SERVER}/api/v1/trading/orders/active`, {
        type: 'DELETE',
        data: JSON.stringify(options)
    });
}

export function editDelayedOrders(options) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/delayed/bulk`, {
        type: "PUT",
        data: JSON.stringify([options]),
    });
}

export function editDelayedOrder(id, options) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/delayed/${id}`, {
        type: "PUT",
        data: JSON.stringify(options),
    });
}

export const setLeverageByApiKey = (apiKeyId) => (options) => {
    const url = `${SERVER}/api/v1/trading/positions/${apiKeyId}/leverage`;

    return doRequestWithUserToken(url, {
        type: "POST",
        data: JSON.stringify(options),
    });
};

export const setLeverageByApiKeyGroup = (groupId) => (options) => {
    const url = `${SERVER}/api/v1/trading/positions/group/${groupId}/leverage`;

    return doRequestWithUserToken(url, {
        type: "POST",
        data: JSON.stringify(options),
    });
};

export const getLeverageByApiKey = (apiKeyId) => (options) => {
    const url = `${SERVER}/api/v1/trading/positions/apiKey/${apiKeyId}`;

    return doRequestWithUserToken(url, {
        type: "GET",
        data: options,
    });
};

export const getLeverageByApiKeyGroup = (groupId) => (options) => {
    const url = `${SERVER}/api/v1/trading/positions/group/${groupId}`;

    return doRequestWithUserToken(url, {
        type: "GET",
        data: options,
    });
};

export function getDelayedOrdersTrades(orderId) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/delayed/${orderId}/trades`);
}