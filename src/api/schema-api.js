import { doRequestWithUserToken, SERVER } from "./api-utils";

export function getSchema(schemaClass) {
    const url = `${SERVER}/api/v1/schema/${schemaClass}`;

    return doRequestWithUserToken(url);
}