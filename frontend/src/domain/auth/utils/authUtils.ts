
import { jwtDecode } from 'jwt-decode';
import { getClientSideToken } from '@/domain/auth/services/tokenService';

interface JWTPayload {
    sub: string;
    name: string;
    exp: number;
}

export interface CurrentUser {
    id: string;
    name: string;
    initials: string;
}

// Atualmente busca informações do usuário a partir do token JWT armazenado no client-side.
// Futuramente, pode ser estendido para buscar do backend.
export const getUserFromToken = (): CurrentUser | null => {
    const token = getClientSideToken();

    if (!token) return null;

    const decoded = jwtDecode<JWTPayload>(token);

    return {
        id: decoded.sub,
        name: decoded.name,
        initials: getInitials(decoded.name)
    };
};

const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};