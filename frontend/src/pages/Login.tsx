import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { SignIn, Lock, EnvelopeSimple } from '@phosphor-icons/react';
import { api } from '../services/api';
import { useAuthStore, User } from '../stores/authStore';

// 1. Criamos o Schema Zod (Validação de Dados)
// O Zod valida o formato dos dados ANTES de enviar requisição para a API Go.
const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

// 2. `z.infer<typeof loginSchema>` extrai automaticamente o tipo TypeScript da struct Zod!
type LoginFormData = z.infer<typeof loginSchema>;

// 3. Resposta esperada da API Go `POST /auth/login`
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export const Login = () => {
  const navigate = useNavigate(); 
  const setAuth = useAuthStore((state) => state.setAuth); 
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-[#E9D8C8] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#190207] text-[#E9D8C8] p-8 rounded-none border-4 border-[#7E2553] shadow-[8px_8px_0px_0px_#7E2553]">
        
        <div className="flex items-center gap-3 mb-6 border-b-4 border-[#7E2553] pb-4">
          <SignIn size={36} color="#FF5C80" weight="bold" />
          <div>
            <h1 className="text-2xl font-extrabold uppercase tracking-wide">Entrar no screeK</h1>
            <p className="text-xs text-[#85A3B2]">Acesse sua conta para ver suas sessões</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">E-mail</label>
            <div className="relative">
              <EnvelopeSimple size={20} className="absolute left-3 top-3 text-[#85A3B2]" />
              <input
                type="email"
                {...register('email')}
                placeholder="seu@email.com"
                className="w-full bg-[#190207] border-2 border-[#7E2553] pl-10 pr-3 py-2 text-sm text-[#E9D8C8] focus:outline-none focus:border-[#FF5C80]"
              />
            </div>
            {errors.email && (
              <span className="text-xs text-[#FF5C80] mt-1 block">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Senha</label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-3 text-[#85A3B2]" />
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full bg-[#190207] border-2 border-[#7E2553] pl-10 pr-3 py-2 text-sm text-[#E9D8C8] focus:outline-none focus:border-[#FF5C80]"
              />
            </div>
            {errors.password && (
              <span className="text-xs text-[#FF5C80] mt-1 block">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7E2553] hover:bg-[#FF5C80] text-white font-bold py-3 uppercase tracking-wider border-2 border-[#190207] transition-all disabled:opacity-50 mt-4 cursor-pointer"
          >
            {loading ? 'Entrando...' : 'Entrar na Conta'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs border-t-2 border-[#7E2553] pt-4">
          <span className="text-[#85A3B2]">Ainda não tem conta? </span>
          <Link to="/register" className="text-[#FF5C80] font-bold hover:underline">
            Criar conta gratuita
          </Link>
        </div>

      </div>
    </div>
  );
};