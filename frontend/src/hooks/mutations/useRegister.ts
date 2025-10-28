import { register } from '@/services/authService';
import { RegisterCredentials } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => register(credentials),
    onSuccess: (data) => {
      toast.success(`Conta criada com sucesso! Bem-vindo, ${data.user.name}!`);
      router.push('/dashboard');
    },
  });
};