import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { X as XIcon, Lock, MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react';
import { api } from '../services/api';
import { useAuthStore, type User } from '../stores/authStore';

import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface LoginProps {
  onClose?: () => void;
}

export const Login = ({ onClose }: LoginProps = {}) => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'screeK | Login';
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const response = await api.post<LoginResponse>('/auth/login', data);
      setAuth(
        response.data.user,
        response.data.access_token,
        response.data.refresh_token
      );
      toast.success('Login realizado com sucesso! Bem-vindo(a).');
      handleClose();
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao realizar login. Tente novamente.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const cardContent = (
    <div className="w-full max-w-[450px] bg-background text-foreground rounded-none border-4 border-primary shadow-[10px_10px_0px_0px_var(--border)]">
      <div className="flex items-center border-b-4 bg-primary/10 border-primary p-3.5 sm:p-4 px-5 sm:px-6">
        <div>
          <h1 className="text-lg sm:text-xl text-primary font-display font-extrabold uppercase tracking-wide">Login</h1>
        </div>
        <button onClick={handleClose} className="border-4 hover:bg-foreground/30 border-primary h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center ml-auto cursor-pointer" title="Fechar">
          <XIcon size={18} className="text-primary" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 p-5 sm:p-6">
        <div>
          <label className="block text-xs sm:text-sm text-foreground/40 font-bold font-display mb-1">Nome de Usuario</label>
          <Input
            type="text"
            icon={<MagnifyingGlassIcon size={20} className="text-foreground/40" />}
            {...register('email')}
            placeholder="Seu Usuario"
          />
          {errors.email && (
            <span className="text-xs text-destructive mt-1 block font-bold">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm text-foreground/40 font-bold font-display mb-1">Senha</label>
          <Input
            type="password"
            icon={<Lock size={20} className="text-foreground/40" />}
            {...register('password')}
            placeholder="••••••••"
          />
          {errors.password && (
            <span className="text-xs text-destructive mt-1 block font-bold">{errors.password.message}</span>
          )}
        </div>

        <div className="justify-between mt-3">
          <Link 
            to="/forgot-password" 
            onClick={onClose} 
            className="transition-colors text-primary font-black text-xs sm:text-sm text-decoration-line: underline hover:text-primary-hover transition-all"
          >
            Esqueceu sua senha ?
          </Link>
          <Button
            type="submit"
            disabled={loading}
            variant="default"
            className="w-full mt-3"
          >
            {loading ? 'Entrando...' : 'FAZER LOGIN'}
          </Button>
        </div>
      </form>
    </div>
  );


  if (onClose) {
    return cardContent;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4">
      {cardContent}
    </div>
  );
};
