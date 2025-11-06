import { login } from '@/domain/auth/services/authService';
import { LoginCredentials } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (data) => {
      toast.success(`Bem-vindo, ${data.user.name}!`);
      router.push('/dashboard');
    },

    onError: () => {
      toast.error('Falha ao fazer login. Verifique os dados enviados e tente novamente.');
    },

  });
};