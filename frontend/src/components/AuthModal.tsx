import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { X as XIcon, Eye, EyeSlash } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore, type User } from '../stores/authStore';
import { useAuthModalStore } from '../stores/authModalStore';
import logoFull from '../assets/logos/logo-full.svg';

// Schemas Zod
const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'O nome de usuário deve ter no mínimo 3 caracteres')
      .regex(/^[a-zA-Z0-9_]+$/, 'Use apenas letras, números e underline (_)'),
    email: z.string().email('Digite um e-mail válido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export const AuthModal = () => {
  const { isOpen, activeTab, closeModal, setTab } = useAuthModalStore();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forms
  const loginForm = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  // Submeter Login
  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const res = await api.post<{ access_token: string; refresh_token: string; user: User }>('/auth/login', data);
      setAuth(res.data.user, res.data.access_token, res.data.refresh_token);
      toast.success(`Bem-vindo(a) de volta, ${res.data.user.username}!`);
      closeModal();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  // Submeter Cadastro
  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await api.post('/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      toast.success('Conta criada com sucesso! Faça login para entrar.');
      setTab('login');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  const isLogin = activeTab === 'login';
  const borderColor = isLogin ? 'border-primary' : 'border-secondary';
  const headerBgColor = isLogin ? 'bg-primary/10' : 'bg-secondary/10';
  const textColor = isLogin ? 'text-primary' : 'text-secondary';
  const buttonBgColor = isLogin ? 'bg-primary hover:bg-primary-hover text-primary-foreground border-primary' : 'bg-secondary hover:bg-secondary-hover text-secondary-foreground border-secondary';

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <Dialog.Portal>
        {/* Backdrop escuro */}
        <Dialog.Overlay className="fixed inset-0 bg-foreground/80 backdrop-blur-sm z-50 animate-fade-in" />
        
        {/* Conteúdo do Modal */}
        <Dialog.Content className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background text-foreground rounded-none border-4 ${borderColor} shadow-[12px_12px_0px_0px_var(--border)] z-50 focus:outline-none max-h-[90vh] overflow-y-auto`}>
          
          {/* Logo no Topo do Modal */}
          <div className="pt-6 pb-2 text-center">
            <img src={logoFull} alt="screeK Logo" className="h-10 w-auto mx-auto" />
          </div>

          {/* Cabeçalho do Card com Abas */}
          <div className={`flex items-center justify-between border-y-4 ${headerBgColor} ${borderColor} p-4 px-6`}>
            <div className="flex gap-4">
              <button
                onClick={() => setTab('login')}
                className={`text-lg font-display font-extrabold uppercase tracking-wide cursor-pointer transition-colors ${
                  isLogin ? 'text-primary underline' : 'text-foreground/40 hover:text-foreground'
                }`}
              >
                LOGIN
              </button>
              <span className="text-foreground/40 text-lg font-bold">|</span>
              <button
                onClick={() => setTab('register')}
                className={`text-lg font-display font-extrabold uppercase tracking-wide cursor-pointer transition-colors ${
                  !isLogin ? 'text-secondary underline' : 'text-foreground/40 hover:text-foreground'
                }`}
              >
                CADASTRAR
              </button>
            </div>
            
            <button 
              onClick={closeModal}
              className={`border-4 hover:border-foreground border-foreground/40 h-9 w-9 flex items-center justify-center transition-all cursor-pointer ${textColor}`}
              title="Fechar"
            >
              <XIcon size={18} weight="bold" />
            </button>
          </div>

          {/* Form de LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-foreground/60 font-bold font-display mb-1.5">
                  Endereço de e-mail
                </label>
                <input
                  type="email"
                  {...loginForm.register('email')}
                  placeholder=""
                  className="w-full h-12 bg-background border-4 font-display border-foreground/40 px-3 py-2 text-base placeholder:text-foreground/40 text-foreground/80 focus:outline-none focus:border-primary"
                />
                {loginForm.formState.errors.email && (
                  <span className="text-xs text-destructive mt-1 block font-bold">{loginForm.formState.errors.email.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm text-foreground/60 font-bold font-display mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...loginForm.register('password')}
                    placeholder="••••••••••••"
                    className="w-full h-12 bg-background border-4 font-display border-foreground/40 px-3 pr-10 py-2 text-base placeholder:text-foreground/40 text-foreground/80 focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-foreground/50 hover:text-primary cursor-pointer"
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <span className="text-xs text-destructive mt-1 block font-bold">{loginForm.formState.errors.password.message}</span>
                )}
              </div>

              <div className="pt-1">
                <Link 
                  to="/forgot-password"
                  onClick={closeModal}
                  className="text-sm font-bold font-display text-primary underline hover:text-primary-hover transition-colors"
                >
                  Esqueceu sua senha?
                </Link>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${buttonBgColor} font-display font-extrabold py-3 uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer border-2`}
                >
                  {loading ? 'ENTRANDO...' : 'FAZER LOGIN'}
                </button>
              </div>
            </form>
          )}

          {/* Form de CADASTRO */}
          {activeTab === 'register' && (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-foreground/60 font-bold font-display mb-1.5">
                  Nome de usuário
                </label>
                <input
                  type="text"
                  {...registerForm.register('username')}
                  placeholder=""
                  className="w-full h-12 bg-background border-4 font-display border-foreground/40 px-3 py-2 text-base placeholder:text-foreground/40 text-foreground/80 focus:outline-none focus:border-secondary"
                />
                {registerForm.formState.errors.username && (
                  <span className="text-xs text-destructive mt-1 block font-bold">{registerForm.formState.errors.username.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm text-foreground/60 font-bold font-display mb-1.5">
                  Endereço de e-mail
                </label>
                <input
                  type="email"
                  {...registerForm.register('email')}
                  placeholder=""
                  className="w-full h-12 bg-background border-4 font-display border-foreground/40 px-3 py-2 text-base placeholder:text-foreground/40 text-foreground/80 focus:outline-none focus:border-secondary"
                />
                {registerForm.formState.errors.email && (
                  <span className="text-xs text-destructive mt-1 block font-bold">{registerForm.formState.errors.email.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm text-foreground/60 font-bold font-display mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...registerForm.register('password')}
                    placeholder="••••••••••••"
                    className="w-full h-12 bg-background border-4 font-display border-foreground/40 px-3 pr-10 py-2 text-base placeholder:text-foreground/40 text-foreground/80 focus:outline-none focus:border-secondary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-foreground/50 hover:text-secondary cursor-pointer"
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <span className="text-xs text-destructive mt-1 block font-bold">{registerForm.formState.errors.password.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm text-foreground/60 font-bold font-display mb-1.5">
                  Confirmação de senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...registerForm.register('confirmPassword')}
                    placeholder="••••••••••••"
                    className="w-full h-12 bg-background border-4 font-display border-foreground/40 px-3 pr-10 py-2 text-base placeholder:text-foreground/40 text-foreground/80 focus:outline-none focus:border-secondary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-foreground/50 hover:text-secondary cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <span className="text-xs text-destructive mt-1 block font-bold">{registerForm.formState.errors.confirmPassword.message}</span>
                )}
              </div>

              <p className="text-xs font-bold font-display text-foreground/60 pt-1 leading-relaxed">
                Ao continuar, você concorda com os{' '}
                <Link to="#" onClick={closeModal} className="text-secondary underline hover:text-secondary-hover">
                  Termos de Uso
                </Link>{' '}
                e a{' '}
                <Link to="#" onClick={closeModal} className="text-secondary underline hover:text-secondary-hover">
                  Política de Privacidade
                </Link>.
              </p>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${buttonBgColor} font-display font-extrabold py-3 uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer border-2`}
                >
                  {loading ? 'CADASTRANDO...' : 'CADASTRE-SE'}
                </button>
              </div>
            </form>
          )}

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};