import { SERVER, doRequestWithUserToken, doPagingRequestWithUserToken } from "./api-utils";

export function getBotNotifications(botId, page, pageSize = 25) {
    return doPagingRequestWithUserToken(`${SERVER}/api/v1/notifications/bot/${botId}`, {
        data: { page, pageSize }
    })
}

export function getUserLastNotifications(count = 20) {
    // return doRequestWithUserToken(`${SERVER}/api/v1/notifications/bot/154`, {
    //     data: { page: 0, pageSize: count }
    // });
    return doRequestWithUserToken(`${SERVER}/api/v1/notifications?count=${count}`);
}