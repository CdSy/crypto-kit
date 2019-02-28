import { doRequestWithUserToken, SERVER } from "./api-utils";

export function getBalance() {
    return doRequestWithUserToken(`${SERVER}/api/v1/balance`);
}