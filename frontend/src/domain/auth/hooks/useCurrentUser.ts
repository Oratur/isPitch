import { useState, useEffect } from 'react';
import { getUserFromToken, CurrentUser } from '../utils/authUtils';

export const useCurrentUser = () => {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Atualmente obtem do token. Futuramente pode ser extendido para buscar do backend.
    useEffect(() => {
        const currentUser = getUserFromToken();
        setUser(currentUser);
        setIsLoading(false);
    }, []);

    return { 
        data: user, 
        isLoading, 
        isAuthenticated: !!user 
    };
};