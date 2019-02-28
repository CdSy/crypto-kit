import { SERVER, doRequestWithUserToken } from "./api-utils";

export function getUserStrategies() {
    return doRequestWithUserToken(`${SERVER}/api/v1/strategies`);
}

export function getStrategyApiKeys(strategyId) {
    return doRequestWithUserToken(`${SERVER}/api/v1/strategies/${strategyId}/apikeys`);
}

export function getStrategyApiKeyGroups(strategyId) {
    return doRequestWithUserToken(`${SERVER}/api/v1/strategies/${strategyId}/groups`);
}