import { SERVER, doRequestWithUserToken } from "./api-utils";

export function getReferrals() {
    return doRequestWithUserToken(`${SERVER}/api/v1/referral/links`);
}

export function createReferralLink(params) {
    return doRequestWithUserToken(`${SERVER}/api/v1/referral/links`, {
        type: "POST",
        data: JSON.stringify(params),
    });
}

export function registerVisitReferralLink(params) {
    return doRequestWithUserToken(`${SERVER}/api/v1/referral/links/visit`, {
        type: "POST",
        data: JSON.stringify(params),
    });
}

export function deleteReferralLink(id) {
    return doRequestWithUserToken(
        `${SERVER}/api/v1/referral/links/${id}`,
        { type: "DELETE", data: JSON.stringify({ id }) }
    );
}

