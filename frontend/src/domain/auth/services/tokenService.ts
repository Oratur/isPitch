import { NextRequest } from 'next/server';
import Cookies from 'js-cookie';

const AUTH_COOKIE_NAME = 'session_token';

export function getTokenFromRequest(request: NextRequest): string | undefined {
    return request.cookies.get(AUTH_COOKIE_NAME)?.value;
}

export function setClientSideToken(token: string): void {
    Cookies.set(AUTH_COOKIE_NAME, token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    });
}

export function removeClientSideToken(): void {
    Cookies.remove(AUTH_COOKIE_NAME, { path: '/' });
}