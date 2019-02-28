import { SERVER, doRequestWithUserToken } from "./api-utils";

export function getReferralLink() {
    return doRequestWithUserToken(`${SERVER}/api/v1/referral/link`).then(data => data.referralLink);
}

export function sendInvite(strategyId, email) {
    const data = {
        comment: "",
        emails: [email],
        strategyId,
    };

    return doRequestWithUserToken(`${SERVER}/api/v1/invites`, { type: "POST", data: JSON.stringify(data) });
}