import { doRequestWithUserToken, SERVER } from "./api-utils";

export function getApiKeys(exchange = null) {
    let url = `${SERVER}/api/v1/users/apikeys`;
    if (exchange) {
        url += `?exchange=${exchange}`;
    }
    return doRequestWithUserToken(url);
}

export function getExchangesSettings() {
    return doRequestWithUserToken(`${SERVER}/api/v1/settings/exchanges`);
}

export function saveApiKey(exchange, apiKey, apiSecret, keyName) {
    return doRequestWithUserToken(`${SERVER}/api/v1/users/apikeys`, {
        type: "POST",
        data: JSON.stringify({ exchange, apiKey, apiSecret, keyName }),
    });
}

export function deleteApiKey(id) {
    return doRequestWithUserToken(`${SERVER}/api/v1/users/apikeys/${id}`, {
        type: "DELETE",
    });
}

export function getApikeyActionsLog(apiKeyId) {
    return doRequestWithUserToken(`${SERVER}/api/v1/users/apikeys/${apiKeyId}/actions`);
}

export function getApiKeyGroups(exchange = null) {
    let url = `${SERVER}/api/v1/users/apikeys/groups`;
    if (exchange) {
        url += `?exchange=${exchange}`;
    }
    return doRequestWithUserToken(url);
}

export function getApiKeyGroupDetails(groupId) {
    return doRequestWithUserToken(`${SERVER}/api/v1/users/apikeys/groups/${groupId}`);
}

export function createApiKeyGroup({ apiKeyIds, exchange, name }) {
    return doRequestWithUserToken(`${SERVER}/api/v1/users/apikeys/groups`, {
        type: "POST",
        data: JSON.stringify({ apiKeyIds, exchange, name }),
    });
}

export function editApiKeyGroup({ groupId, apiKeyIds, exchange, name }) {
    return doRequestWithUserToken(`${SERVER}/api/v1/users/apikeys/groups/${groupId}`, {
        type: "PUT",
        data: JSON.stringify({ apiKeyIds, exchange, name }),
    });
}

export function enableApiKey(id) {
    return doRequestWithUserToken(`${SERVER}/api/v1/users/apikeys/${id}/enable`, { type: "PUT" });
}

export function disableApiKey(id)  {
    return doRequestWithUserToken(`${SERVER}/api/v1/users/apikeys/${id}/disable`, { type: "PUT" });
}

export function addApiKeyToGroup(apiKeyId, groupId) {
    return doRequestWithUserToken(`${SERVER}/api/v1/users/apikeys/groups/${groupId}/apiKey/${apiKeyId}`, { type: "PUT" });
}

export function deleteApiKeyFromGroup(apiKeyId, groupId) {
    return doRequestWithUserToken(`${SERVER}/api/v1/users/apikeys/groups/${groupId}/apiKey/${apiKeyId}`, { type: "DELETE" });
}

export function deleteGroup(groupId) {
    return doRequestWithUserToken(`${SERVER}/api/v1/users/apikeys/groups/${groupId}`, { type: "DELETE" });
}