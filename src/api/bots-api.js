import { SERVER, doRequestWithUserToken } from "./api-utils";

export function getUserBots() {
    return doRequestWithUserToken(`${SERVER}/api/v1/bots`);
}

export function getSharedBots() {
    return doRequestWithUserToken(`${SERVER}/api/v1/bots/shared`);
}

export function getBotInfo(botId, success) {
    return doRequestWithUserToken(`${SERVER}/api/v1/bots/${botId}`, {}, success);
}

export function startBot(botId, params) {
    return doRequestWithUserToken(`${SERVER}/api/v1/bots/${botId}/start`, {
        type: "POST",
        data: JSON.stringify(params),
    });
}

export function pauseBot(botId) {
    return doRequestWithUserToken(`${SERVER}/api/v1/bots/${botId}/pause`, { type: "POST" });
}

export function stopBot(botId) {
    return doRequestWithUserToken(`${SERVER}/api/v1/bots/${botId}/stop`, { type: "POST" });
}

export function createBot(params) {
    return doRequestWithUserToken(`${SERVER}/api/v1/bots/`, {
        type: "POST",
        data: JSON.stringify(params),
    });
}

export function deleteBot(botId) {
    return doRequestWithUserToken(`${SERVER}/api/v1/bots/${botId}`, { type: "DELETE" });
}

export function getBotBalanceHistory({botId, from, to, name}) {
    return doRequestWithUserToken(`${SERVER}/api/v1/balance/history/bot/${botId}`,
    {
        type: "GET",
        data: {from, to, name}
    });
}

export function getBotDebugSettings(botId) {
    return doRequestWithUserToken(`${SERVER}/api/v1/bots/${botId}/debug`);
}

export function getBotDebugRecords({botId}, success, error) {
    return doRequestWithUserToken(`${SERVER}/api/v1/bots/${botId}/debug/records`,
    {type: "GET"}, success, error);
}

export function startBotDebug({botId, maxRecordsNumber, recordPeriodMinutes, ttlDays}) {
    return doRequestWithUserToken(`${SERVER}/api/v1/bots/${botId}/debug/start`, {
        type: "POST",
        data: JSON.stringify({maxRecordsNumber, recordPeriodMinutes, ttlDays}),
    });
}

export function stopBotDebug(botId) {
    return doRequestWithUserToken(`${SERVER}/api/v1/bots/${botId}/debug/stop`, {type: "POST"});
}

export function getActionsLog({botId}, success, error) {
    return doRequestWithUserToken(`${SERVER}/api/v1/bots/${botId}/actions`,
    {type: "GET"}, success, error);
}

export function getTradeHistory({apiKeyId, market, page, pageSize}) {
    return doRequestWithUserToken(`${SERVER}/api/v1/trading/${apiKeyId}/history`, {
        type: "GET",
        data: { market, page, pageSize }
    });
}