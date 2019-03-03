export function startSessionAndRedirect({ token, username }) {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
}

export function stopSessionAndRedirect() {
    localStorage.setItem("token", "");
    localStorage.setItem("username", "");
}

export function getUserName() {
    return localStorage.getItem("username");
}

export function getUserToken() {
    return localStorage.getItem("token");
}
