import { doRequestWithUserToken, SERVER } from "./api-utils";

export function getOrderBook(exchangeName, marketName) {
    const url = `${SERVER}/api/v1/trading/public/${exchangeName}/${marketName}/orderbook`;

    return doRequestWithUserToken(url);
}