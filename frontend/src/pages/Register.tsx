import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { XIcon, Lock, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { api } from '../services/api';
import { useAuthStore, type User } from '../stores/authStore';

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

export const Register = () => {
  const navigate = useNavigate(); 
  const setAuth = useAuthStore((state) => state.setAuth); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'screeK | Cadastrar';
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });


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
      navigate('/'); 
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao realizar login. Tente novamente.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-background text-foreground rounded-none border-4 border-secondary">
        
        <div className="flex items-center border-b-4 bg-secondary/10 border-secondary p-4 sm:p-5 px-5 sm:px-8">
          <div>
            <h1 className="text-lg sm:text-xl text-secondary font-display font-extrabold uppercase tracking-wide">CADASTRAR</h1>
          </div>
          <button onClick={() => navigate('/')} className="border-4 hover:bg-foreground/30 border-secondary h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center ml-auto cursor-pointer">
            <XIcon size={20} className="text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5 sm:p-8 sm:px-8">
          <div>
            <label className="block text-sm sm:text-base text-foreground/40 font-bold font-display mb-1">Nome de Usuario</label>
            <div className="relative">
              <MagnifyingGlassIcon size={22} className="absolute left-4 sm:left-5 top-3.5 sm:top-4 text-foreground/40" />
              <input
                type="text"
                {...register('email')}
                placeholder="Seu Usuario"
                className="w-full h-12 sm:h-14 bg-background border-4 font-display border-foreground/40 pl-11 sm:pl-12 pr-3 py-2 text-sm sm:text-base placeholder:text-foreground/40 focus:outline-none focus:border-[#FF5C80]"
              />
            </div>
            {errors.email && (
              <span className="text-xs text-destructive mt-1 block">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm sm:text-base text-foreground/40 font-bold font-display mb-1">Endereço de e-mail</label>
            <div className="relative">
              <MagnifyingGlassIcon size={22} className="absolute left-4 sm:left-5 top-3.5 sm:top-4 text-foreground/40" />
              <input
                type="text"
                {...register('email')}
                placeholder="Seu E-mail"
                className="w-full h-12 sm:h-14 bg-background border-4 font-display border-foreground/40 pl-11 sm:pl-12 pr-3 py-2 text-sm sm:text-base placeholder:text-foreground/40 focus:outline-none focus:border-[#FF5C80]"
              />
            </div>
            {errors.email && (
              <span className="text-xs text-destructive mt-1 block">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm sm:text-base text-foreground/40 font-bold font-display mb-1">Senha</label>
            <div className="relative">
              <Lock size={22} className="absolute left-4 sm:left-5 top-3.5 sm:top-4 text-foreground/40" />
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full h-12 sm:h-14 bg-background border-4 font-display border-foreground/40 pl-11 sm:pl-12 pr-3 py-2 text-sm sm:text-base placeholder:text-foreground/40 focus:outline-none focus:border-[#FF5C80]"
              />
            </div>
            {errors.password && (
              <span className="text-xs text-destructive mt-1 block">{errors.password.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm sm:text-base text-foreground/40 font-bold font-display mb-1">Confirmação de Senha</label>
            <div className="relative">
              <Lock size={22} className="absolute left-4 sm:left-5 top-3.5 sm:top-4 text-foreground/40" />
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full h-12 sm:h-14 bg-background border-4 font-display border-foreground/40 pl-11 sm:pl-12 pr-3 py-2 text-sm sm:text-base placeholder:text-foreground/40 focus:outline-none focus:border-[#FF5C80]"
              />
            </div>
            {errors.password && (
              <span className="text-xs text-destructive mt-1 block">{errors.password.message}</span>
            )}
          </div>
          <div className="justify-between mt-4">
            <p className="font-black text-xs sm:text-sm text-foreground/40 mb-4">
              Ao continuar, você concorda com os <Link to="/register" className="hover:text-secondary-hover text-secondary font-black text-xs sm:text-sm text-decoration-line: underline">Termos de Uso</Link> e a <Link to="/register" className="hover:text-secondary-hover text-secondary font-black text-xs sm:text-sm text-decoration-line: underline">Política de Privacidade</Link>.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-secondary-hover text-background font-bold py-2.5 sm:py-3 text-sm sm:text-base uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Entrando...' : 'CADASTRE-SE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

