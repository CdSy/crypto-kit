import { doRequestWithUserToken, SERVER } from "./api-utils";

export const getTFAState = () => {
    return doRequestWithUserToken(`${SERVER}/api/v1/tfa/google/enabled`);
}

export const getTFALink = () => {
    return doRequestWithUserToken(`${SERVER}/api/v1/tfa/google/link`);
}

export const enableTFA = ({secretKey, token}) => {
    return doRequestWithUserToken(
        `${SERVER}/api/v1/tfa/google`,
        { type: "POST", data: JSON.stringify({ secretKey, token }) }
    );
}

export const disableTFA = ({token}) => {
    return doRequestWithUserToken(
        `${SERVER}/api/v1/tfa/google`,
        { type: "DELETE", data: JSON.stringify({ token }) }
    );
}