import { register } from '@/domain/auth/services/authService';
import { RegisterCredentials } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => register(credentials),
    onSuccess: (data) => {
      router.push('/login');
    },
  });
};