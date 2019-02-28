import { doRequestWithUserToken, SERVER } from "./api-utils";

export function login(username, password, tfa) {
    return $.ajax({
        url: `${SERVER}/api/v1/login`,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({ username, password, tfa }),
    }).promise();
}

export function register(username, password, refData) {
    let params = { username, password };

    if (refData) {
        params = {...params, ...refData};
    } else {
        params.domain = SERVER;
    }

    return $.ajax({
        url: `${SERVER}/api/v1/register`,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify(params),
    }).promise();
}

export function forgotPassword(email) {
    return $.ajax({
        url: `${SERVER}/api/v1/forgot`,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({ email }),
    }).promise();
}

export function forgotPasswordVerify({ password, hash, userId }) {
    return $.ajax({
        url: `${SERVER}/api/v1/forgot/verify`,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({ password, hash, userId }),
    }).promise();
}

export function verify(userId, hash) {
    return $.ajax({
        url: `${SERVER}/api/v1/register/verify`,
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({ userId, hash }),
    }).promise();
}

export function changePassword(password) {
    return doRequestWithUserToken(
        `${SERVER}/api/v1/change/password`,
        { type: "POST", data: JSON.stringify({ name: password }) },
    );
}

export function getUserSettings(success) {
    return doRequestWithUserToken(`${SERVER}/api/v1/settings/user`, null, success);
}

export function setUserSettings(settings) {
    return doRequestWithUserToken(
        `${SERVER}/api/v1/settings/user`,
        { type: "POST", data: JSON.stringify(settings) },
    );
}

export function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

export function logout() {
    return doRequestWithUserToken(`${SERVER}/api/v1/logout`, { type: "POST" });
}