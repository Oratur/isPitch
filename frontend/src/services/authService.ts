import { apiRequest } from '@/lib/apiClient';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { setClientSideToken } from './tokenService';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiRequest<AuthResponse>({
    url: '/v2/auth/login',
    options: {
      method: 'POST',
      body: JSON.stringify(credentials),
    }
  });

  setClientSideToken(response.token);
  return response;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await apiRequest<AuthResponse>({
    url: '/v2/auth/register',
    options: {
      method: 'POST',
      body: JSON.stringify(credentials),
    }
  });

  setClientSideToken(response.token);
  return response;
};