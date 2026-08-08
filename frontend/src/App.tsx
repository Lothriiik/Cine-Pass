import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'sonner';


import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { AuthLayout } from './layouts/AuthLayout';
import { MainLayout } from './layouts/MainLayout';
import { PrivateRoute } from './components/PrivateRoute';

import { CheckCircle, XCircle, WarningCircle, Info } from '@phosphor-icons/react';

import { ComponentsShowcaseScreen } from './screens/ComponentsShowcaseScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="bottom-right" 
        expand={true}
        gap={10}
        closeButton
        icons={{
          success: <CheckCircle size={26} weight="fill" className="text-[#16A34A] shrink-0" />,
          error: <XCircle size={26} weight="fill" className="text-[#DC2626] shrink-0" />,
          warning: <WarningCircle size={26} weight="fill" className="text-[#DBA212] shrink-0" />,
          info: <Info size={26} weight="fill" className="text-[#3B82F6] shrink-0" />,
        }}
      />

      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<MainLayout />}>
          <Route path="/components" element={<ComponentsShowcaseScreen />} />
          <Route 
            path="/" 
            element={

              <div className="p-8 max-w-4xl mx-auto text-center space-y-6">
                <h1 className="text-3xl font-display font-black uppercase text-primary">
                  Bem-vindo ao screeK
                </h1>
                <p className="text-foreground/70 font-bold text-sm">
                  Plataforma CinePass em construção. Clique nos botões "FAZER LOGIN" ou "CRIAR CONTA" no topo para testar os modais!
                </p>

                <div className="pt-2">
                  <a
                    href="/components"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-background font-display font-extrabold px-6 py-3 text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_var(--border)] transition-all cursor-pointer"
                  >
                    <span>🎨 ABRIR VITRINE DE COMPONENTES UI (`/components`)</span>
                  </a>
                </div>

                <div className="border-4 border-foreground/30 bg-background/50 p-6 space-y-4 mt-8">
                  <h2 className="text-lg font-display font-extrabold uppercase text-foreground/80">
                    🧪 Painel de Teste de Toasts (Com Barra de Progresso, Ações e Botão X)
                  </h2>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() =>
                        toast.success('Sucesso!', {
                          description: 'This is a success toast component',
                          duration: 4000,
                          className: 'toast-progress',
                          style: { '--toast-duration': '4000ms' } as React.CSSProperties,
                          action: {
                            label: 'Ver Ingresso ->',
                            onClick: () => console.log('Ver Ingresso clicado'),
                          },
                        })
                      }
                      className="bg-[#16A34A] hover:opacity-90 text-white font-display font-extrabold px-4 py-2 text-sm border-2 border-foreground cursor-pointer"
                    >
                      🟢 Temporário c/ Barra (4s) + Link
                    </button>

                    <button
                      onClick={() =>
                        toast.warning('Cuidado!', {
                          description: 'This is a warning toast component',
                          duration: Infinity,
                        })
                      }
                      className="bg-[#DBA212] hover:opacity-90 text-black font-display font-extrabold px-4 py-2 text-sm border-2 border-foreground cursor-pointer"
                    >
                      🟡 Fixo c/ Botão [X] (Sem auto-dismiss)
                    </button>

                    <button
                      onClick={() =>
                        toast.error('Erro no pagamento', {
                          description: 'Não foi possível processar o cartão.',
                          duration: Infinity,
                          action: {
                            label: 'Tentar novamente ->',
                            onClick: () => console.log('Tentar novamente clicado'),
                          },
                        })
                      }
                      className="bg-[#DC2626] hover:opacity-90 text-white font-display font-extrabold px-4 py-2 text-sm border-2 border-foregroundcursor-pointer"
                    >
                      🔴 Erro c/ Ação "Tentar Novamente"
                    </button>

                    <button
                      onClick={() =>
                        toast.info('Informação', {
                          description: 'This is an info toast component',
                          duration: 4000,
                          className: 'toast-progress',
                          style: { '--toast-duration': '4000ms' } as React.CSSProperties,
                        })
                      }
                      className="bg-[#3B82F6] hover:opacity-90 text-white font-display font-extrabold px-4 py-2 text-sm border-2 border-foreground cursor-pointer"
                    >
                      🔵 Info Temporário c/ Barra (4s)
                    </button>
                  </div>
                </div>

              </div>
            } 
          />
        </Route>

        <Route element={<PrivateRoute />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}