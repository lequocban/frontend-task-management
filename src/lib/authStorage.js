const TOKEN_KEY = "task_manager_token";
const TOKEN_COOKIE_NAME = "token";
const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;

function canUseBrowserStorage() {
  return typeof window !== "undefined";
}

export function getStoredToken() {
  if (!canUseBrowserStorage()) {
    return "";
  }

  return localStorage.getItem(TOKEN_KEY) || "";
}

export function storeToken(token) {
  if (!canUseBrowserStorage()) {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_COOKIE_NAME}=${token}; path=/; max-age=${ONE_WEEK_IN_SECONDS}; SameSite=Lax`;
}

export function clearStoredToken() {
  if (!canUseBrowserStorage()) {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
