import { jwtDecode } from "jwt-decode";
const JWT = 'store_token_id';

export const setToken = (token: string): void => {
    localStorage.setItem(JWT, token);
};

export const getToken = (): string | null => {
    return localStorage.getItem('JWT');
};

export const isLogin = (): boolean => {
    const jwToken = getToken();
    return !!jwToken && !isTokenExpired(jwToken);
};

const isTokenExpired = (token: string): boolean => {
    try {
        const _info = jwtDecode<{ exp: number }>(token);
        return _info.exp < Date.now() / 1000;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const getUser = (): Record<string, any> | null => {
    const jwToken = getToken();
    if (jwToken && isLogin()) {
        return jwtDecode<Record<string, any>>(jwToken);
    }
    return null;
};

export const logout = (): void => {
    localStorage.removeItem(JWT);
};

export const auth = {
    setToken,
    getUser,
    logout,
    isLogin,
    getToken,
};
