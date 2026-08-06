import { Outlet, Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlass, User, Bell, FilmStrip, SignOut, Heart, Ticket } from '@phosphor-icons/react';
import { useAuthStore } from '../stores/authStore';
import { useAuthModalStore } from '../stores/authModalStore';
import { AuthModal } from '../components/AuthModal';

export const MainLayout = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const openModal = useAuthModalStore((state) => state.openModal);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      
      {/* AuthModal montado globalmente */}
      <AuthModal />

      {/* HEADER / NAVBAR BRUTALISTA */}
      <header className="sticky top-0 z-40 bg-background border-b-4 border-border px-4 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <FilmStrip size={32} className="text-secondary group-hover:scale-110 transition-transform" weight="fill" />
          <span className="font-display font-black text-2xl tracking-wider text-foreground uppercase">
            scree<span className="text-secondary">K</span>
          </span>
        </Link>

        {/* Links de Navegação Principal */}
        <nav className="hidden md:flex items-center gap-6 font-bold text-xs uppercase tracking-wider">
          <Link to="/" className="hover:text-secondary transition-colors">
            Em Cartaz
          </Link>
          <Link to="/movies" className="hover:text-secondary transition-colors">
            Explorar Catálogo
          </Link>
          <Link to="/feed" className="hover:text-secondary transition-colors">
            Feed Social
          </Link>
        </nav>

        {/* Ações da Direita (Busca, Notificações, User/Login) */}
        <div className="flex items-center gap-3">
          
          {/* Botão de Busca Rápida */}
          <button
            onClick={() => navigate('/search')}
            className="p-2 border-2 border-border bg-card hover:bg-secondary hover:text-foreground transition-all cursor-pointer"
            title="Buscar Filmes"
          >
            <MagnifyingGlass size={20} weight="bold" />
          </button>

          {/* Botão de Notificações (Sininho) */}
          <button
            onClick={() => user ? navigate('/notifications') : openModal('login')}
            className="p-2 border-2 border-border bg-card hover:bg-secondary hover:text-foreground transition-all cursor-pointer relative"
            title="Notificações"
          >
            <Bell size={20} weight="bold" />
          </button>

          {/* Usuário Logado vs Botão Entrar */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 border-2 border-primary bg-primary/10 hover:bg-primary hover:text-white transition-all font-bold text-xs uppercase"
              >
                <User size={18} weight="bold" className="text-secondary" />
                <span>{user.username}</span>
              </Link>
              <button
                onClick={logout}
                className="p-2 border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer"
                title="Sair"
              >
                <SignOut size={18} weight="bold" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openModal('login')}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs uppercase tracking-wider border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
            >
              Entrar
            </button>
          )}

        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL DA PÁGINA */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* FOOTER BRUTALISTA */}
      <footer className="border-t-4 border-border bg-card py-6 px-4 text-center text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display font-extrabold uppercase text-foreground">
            screeK © 2026 — Plataforma CinePass
          </div>
          <div className="flex gap-4 font-bold uppercase">
            <Link to="/" className="hover:underline">Sobre</Link>
            <Link to="/" className="hover:underline">Termos</Link>
            <Link to="/" className="hover:underline">Privacidade</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};