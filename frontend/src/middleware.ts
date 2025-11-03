import { NextRequest, NextResponse } from 'next/server';

import { getTokenFromRequest } from './domain/auth/services/tokenService';
import { isAuthRoute, isPrivateRoute, PRIVATE_ROUTE_REDIRECT, PUBLIC_ROUTE_REDIRECT } from './lib/config/routes';

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = getTokenFromRequest(request);

    if (isAuthRoute(pathname) && token) {
        return NextResponse.redirect(new URL(PRIVATE_ROUTE_REDIRECT, request.url));
    }

    if (isPrivateRoute(pathname) && !token) {
        return NextResponse.redirect(new URL(PUBLIC_ROUTE_REDIRECT, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};