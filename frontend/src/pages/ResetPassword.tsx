import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { X as XIcon, Eye, EyeSlash } from '@phosphor-icons/react';
import { api } from '../services/api';

import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    document.title = 'screeK | Redefinir Senha';
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });


  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);
      await api.post('/auth/reset-password', data);
      toast.success('Senha redefinida com sucesso!');
      navigate('/');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao redefinir a senha.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-background text-foreground rounded-none border-4 border-tertiary shadow-[10px_10px_0px_0px_var(--border)]">

      <div className="flex items-center justify-between border-b-4 bg-tertiary/10 border-tertiary p-4 px-5 sm:p-5 sm:px-8">
        <h1 className="text-lg sm:text-xl text-tertiary font-display font-extrabold uppercase tracking-wide">
          REDEFINIR A SENHA
        </h1>
        <button 
          onClick={() => navigate('/')}
          className="border-2 sm:border-4 hover:bg-foreground/30 border-tertiary h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center transition-all cursor-pointer"
          title="Fechar"
        >
          <XIcon size={18} className="text-tertiary" weight="bold" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-8 space-y-4">
        <div>
          <label className="block text-xs sm:text-base text-foreground/60 font-bold font-display mb-1.5">
            Nova Senha
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 sm:top-3.5 text-foreground/50 hover:text-tertiary cursor-pointer z-10"
            >
              {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-destructive mt-1 block font-bold">{errors.password.message}</span>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-base text-foreground/60 font-bold font-display mb-1.5">
            Confirmar Senha
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 sm:top-3.5 text-foreground/50 hover:text-tertiary cursor-pointer z-10"
            >
              {showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-xs text-destructive mt-1 block font-bold">{errors.confirmPassword.message}</span>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            variant="tertiary"
            className="w-full"
          >
            {loading ? 'REDEFININDO...' : 'REDEFINIR'}
          </Button>
        </div>
      </form>
    </div>
  );
};
