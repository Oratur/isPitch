export const PRIVATE_ROUTE_REDIRECT = '/dashboard';
export const PUBLIC_ROUTE_REDIRECT = '/';


const AUTH_ROUTES = [
    '/login',
    '/register'
];

const PRIVATE_ROUTES = [
    '/dashboard',
    '/history',
    '/settings'
];


export function isAuthRoute(pathname: string): boolean {
    return AUTH_ROUTES.includes(pathname);
}

export function isPrivateRoute(pathname: string): boolean {
    return PRIVATE_ROUTES.includes(pathname);
}
