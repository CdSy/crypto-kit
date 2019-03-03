import { getUserName, getUserToken } from "./session-manager";

export const OP_BREAKOUT_PAGE = "breakout";
export const BOT_SELF_TRADE_PAGE = "bot_selftrade";
export const BOT_ORDER_BOOK = "bot_orderbook";

const config = {
    [OP_BREAKOUT_PAGE]: ["alexandroffs@gmail.com"],
    [BOT_SELF_TRADE_PAGE]: ["ipromys@gmail.com"],
    [BOT_ORDER_BOOK]: ["essdgrouptech@gmail.com"],
};

export function isAuth() {
    const user = getUserName();
    const token = getUserToken();

    if (user && user.length && token && token.length) {
        return true;
    } else {
        return false;
    }
}

export function userHasAccess(operation) {
    const user = getUserName();

    if (!user) {
        return false;
    }

    if (user === "root@root") {
        return true;
    }
    if (!config[operation]) {
        return false;
    }
    return config[operation].some(item => item === user);
}