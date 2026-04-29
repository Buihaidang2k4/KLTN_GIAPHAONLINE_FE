import type { AccountDetailsRes } from "@/types/account/account.types";

const CURRENT_USER_KEY = "current_user";

export const saveCurrentUser = (user: AccountDetailsRes) => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): AccountDetailsRes | null => {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as AccountDetailsRes;
    } catch {
        return null;
    }
};

export const clearCurrentUser = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

export const isAuthenticated = (): boolean => {
    return !!getCurrentUser();
};

export const isActiveAccount = (): boolean => {
    const user = getCurrentUser();
    return user?.accountStatus === "ACTIVE";
};