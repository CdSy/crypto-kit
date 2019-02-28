import { stopSessionAndRedirect } from "../services/session-manager";

export const SERVER = process.env.API_URL || "https://app.bitmextrades.com";

export function doRequestWithToken(token, url, params = {}) {
    return $.ajax(Object.assign({}, params, {
        url,
        headers: {
            'Authorization':`Bearer ${token}`,
            "Content-Type": "application/json",
        },
    }))
    .promise()
    .catch(e => {
        const errMessage = e.responseJSON ? e.responseJSON.message : "";

        if (e.status === 401) {
            stopSessionAndRedirect();
            window.location.href = '/';
            return;
        }

        throw new Error(errMessage);
    });
}

export function doXHRRequestWithToken(token, url, params = {}, success, error) {
    return $.ajax(Object.assign({}, params, {
        url,
        success,
        error: (e) => {
            if (error) {
                error();
            }

            if (e.status === 401) {
                stopSessionAndRedirect();
                window.location.href = '/';
                return;
            }
        },
        headers: {
            'Authorization':`Bearer ${token}`,
            "Content-Type": "application/json",
        },
    }));
}

export function doRequestWithUserToken(url, params = {}, success, error) {
    const token = localStorage.getItem("token");

    if (success) {
        return doXHRRequestWithToken(token, url, params, success, error);
    }

    return doRequestWithToken(token, url, params);
}

export function doPagingRequestWithUserToken(url, params) {
    return doRequestWithUserToken(url, params).then((data, status, jqXHR) => {
        console.log(jqXHR);
        const totalPages = getTotalPages(jqXHR);
        return { data, totalPages };
    })
}

export function getTotalPages(jqXHR) {
    const totalPages = jqXHR.getResponseHeader('Paging-Total-Pages');
    return totalPages ? parseInt(totalPages) : 1;
}