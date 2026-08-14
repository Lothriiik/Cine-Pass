import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  MagnifyingGlass, 
  User, 
  SignOut, 
  MapPin,
  YoutubeLogo,
  TwitterLogo,
  InstagramLogo,
  FacebookLogo,
  Sun,
  Moon,
  Ticket,
  FilmReel,
  Heart,
  Bell,
  List as MenuIcon,
  X as XIcon
} from '@phosphor-icons/react';
import { useAuthStore } from '../stores/authStore';
import { useAuthModalStore } from '../stores/authModalStore';
import { useThemeStore } from '../stores/themeStore';
import { AuthModal } from '../components/AuthModal';
import logoFull from '../assets/logos/logo-full.svg';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Button } from '../components/ui/button';

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const openModal = useAuthModalStore((state) => state.openModal);
  const { theme, toggleTheme } = useThemeStore();

  const [openDropdown, setOpenDropdown] = useState<'cinema' | 'social' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Arapiraca');
  const [activeFooterTab, setActiveFooterTab] = useState<'cinema' | 'social' | 'politicas' | 'redes' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const path = location.pathname;
  const isCinemaActive = path === '/' || path.startsWith('/movies') || path.startsWith('/cinemas');
  const isSocialActive = path.startsWith('/feed') || path.startsWith('/lists') || path.startsWith('/reviews') || path.startsWith('/users');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (menu: 'cinema' | 'social') => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const toggleFooterTab = (tab: 'cinema' | 'social' | 'politicas' | 'redes') => {
    setActiveFooterTab((prev) => (prev === tab ? null : tab));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pb-16 md:pb-0 overflow-x-hidden">
      
      <AuthModal />

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-background border-b-2 border-foreground/30 px-4 sm:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between w-full h-16 sm:h-20">
          
          {/* Mobile Header (Clean Icon-Only Menu + Centered Logo + Icon-Only Bell) */}
          <div className="flex md:hidden items-center justify-between w-full">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1 text-foreground hover:text-primary transition-colors cursor-pointer"
              title="Abrir Menu"
            >
              <MenuIcon size={26} weight="bold" />
            </button>

            <Link to="/" className="flex items-center">
              <img 
                src={logoFull} 
                alt="screeK Logo" 
                className="h-7 w-auto" 
              />
            </Link>

            <button
              onClick={() => navigate('/notifications')}
              className="p-1 text-foreground hover:text-primary transition-colors cursor-pointer"
              title="Notificações"
            >
              <Bell size={24} weight="bold" />
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center gap-4 sm:gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src={logoFull} 
                alt="screeK Logo" 
                className="h-8 sm:h-7 w-auto hover:opacity-90 transition-opacity" 
              />
            </Link>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[145px] min-w-[145px] sm:h-10">
                <MapPin size={16} weight="bold" className="text-foreground/70 mr-1 shrink-0" />
                <SelectValue>{selectedCity}</SelectValue>
              </SelectTrigger>

              <SelectContent>
                {['Arapiraca', 'Maceió', 'Recife', 'São Paulo'].map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <nav ref={dropdownRef} className="hidden md:flex items-center justify-center gap-8 relative">
            
            <div className="relative">
              <button
                onClick={() => toggleDropdown('cinema')}
                className={`px-3 py-1 h-16 text-sm font-display font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  isCinemaActive 
                    ? 'text-primary border-y-4 border-primary' 
                    : 'text-foreground/40 border-y-4 border-transparent hover:text-foreground'
                }`}
              >
                CINEMA
              </button>

              {openDropdown === 'cinema' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-background border-4 border-foreground/40 shadow-[6px_6px_0px_0px_var(--border)] z-50 py-2">
                  <Link
                    to="/movies?status=now_playing"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2 text-xs font-bold font-display uppercase tracking-wide hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
                  >
                    Filmes em Cartaz
                  </Link>
                  <Link
                    to="/movies?status=upcoming"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2 text-xs font-bold font-display uppercase tracking-wide hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
                  >
                    Em Breve
                  </Link>
                  <Link
                    to="/movies"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2 text-xs font-bold font-display uppercase tracking-wide hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
                  >
                    Catálogo
                  </Link>
                  <Link
                    to="/cinemas"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2 text-xs font-bold font-display uppercase tracking-wide hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
                  >
                    Cinemas
                  </Link>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => toggleDropdown('social')}
                className={`px-3 py-1 h-16 text-sm font-display font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  isSocialActive 
                    ? 'text-primary border-y-4 border-primary' 
                    : 'text-foreground/40 border-y-4 border-transparent hover:text-foreground'
                }`}
              >
                SOCIAL
              </button>

              {openDropdown === 'social' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-background border-4 border-foreground/40 shadow-[6px_6px_0px_0px_var(--border)] z-50 py-2">
                  <Link
                    to="/feed"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2 text-xs font-bold font-display uppercase tracking-wide hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
                  >
                    Feed
                  </Link>
                  <Link
                    to="/lists"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2 text-xs font-bold font-display uppercase tracking-wide hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
                  >
                    Minhas Listas
                  </Link>
                  <Link
                    to="/reviews"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2 text-xs font-bold font-display uppercase tracking-wide hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
                  >
                    Reviews
                  </Link>
                  <Link
                    to="/users"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2 text-xs font-bold font-display uppercase tracking-wide hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
                  >
                    Usuários
                  </Link>
                </div>
              )}
            </div>

          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              title={theme === 'dark' ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}
            >
              {theme === 'dark' ? <Sun size={20} weight="bold" className="text-secondary" /> : <Moon size={20} weight="bold" className="text-primary" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/search')}
              title="Buscar Filmes"
            >
              <MagnifyingGlass size={20} weight="bold" className="text-foreground/60" />
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 border-2 border-primary bg-primary/10 hover:bg-primary hover:text-white transition-all font-bold text-xs uppercase"
                >
                  <User size={18} weight="bold" className="text-secondary" />
                  <span>{user.username}</span>
                </Link>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={logout}
                  title="Sair"
                  className="h-9 w-9"
                >
                  <SignOut size={18} weight="bold" />
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openModal('register')}
                >
                  CRIAR CONTA
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => openModal('login')}
                >
                  FAZER LOGIN
                </Button>
              </>
            )}

          </div>
        </div>
      </header>

      {/* Mobile Side Drawer (Menu Hamburguer Lateral) */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-background border-r-4 border-foreground z-50 p-5 flex flex-col justify-between shadow-[10px_10px_0px_0px_var(--border)] overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              {/* Top Drawer Header */}
              <div className="flex items-center justify-between border-b-2 border-foreground/20 pb-4">
                <img src={logoFull} alt="screeK Logo" className="h-7 w-auto" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="border-2 border-foreground p-1 hover:bg-primary/20 text-foreground cursor-pointer shadow-[2px_2px_0px_0px_var(--border)]"
                >
                  <XIcon size={20} weight="bold" />
                </button>
              </div>

              {/* Seleção de Cidade */}
              <div className="space-y-2">
                <label className="text-xs font-display font-extrabold uppercase text-foreground/50">Cidade</label>
                <Select value={selectedCity} onValueChange={(val) => { setSelectedCity(val); setIsMobileMenuOpen(false); }}>
                  <SelectTrigger className="w-full">
                    <MapPin size={16} weight="bold" className="text-foreground/70 mr-1 shrink-0" />
                    <SelectValue>{selectedCity}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {['Arapiraca', 'Maceió', 'Recife', 'São Paulo'].map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Modo Claro / Escuro */}
              <div className="space-y-2">
                <label className="text-xs font-display font-extrabold uppercase text-foreground/50">Tema</label>
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-2.5 border-2 border-foreground bg-card hover:bg-card/80 text-foreground font-display font-bold text-xs uppercase shadow-[2px_2px_0px_0px_var(--border)] cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {theme === 'dark' ? <Sun size={18} weight="bold" className="text-warning" /> : <Moon size={18} weight="bold" className="text-primary" />}
                    <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
                  </div>
                  <span className="text-[10px] opacity-60">Alternar</span>
                </button>
              </div>

              {/* Links de Navegação */}
              <div className="space-y-3 pt-2 border-t-2 border-foreground/10">
                <label className="text-xs font-display font-extrabold uppercase text-foreground/50">Navegação</label>
                <div className="space-y-1">
                  <Link
                    to="/movies?status=now_playing"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-xs font-bold font-display uppercase hover:bg-primary/10 text-foreground/80 hover:text-primary transition-colors"
                  >
                    Filmes em Cartaz
                  </Link>
                  <Link
                    to="/movies?status=upcoming"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-xs font-bold font-display uppercase hover:bg-primary/10 text-foreground/80 hover:text-primary transition-colors"
                  >
                    Em Breve
                  </Link>
                  <Link
                    to="/feed"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-xs font-bold font-display uppercase hover:bg-primary/10 text-foreground/80 hover:text-primary transition-colors"
                  >
                    Feed Social
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Login / Register Buttons in Mobile Drawer */}
            <div className="pt-6 border-t-2 border-foreground/20 space-y-2">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 border-2 border-primary bg-primary/10">
                    <User size={20} weight="bold" className="text-secondary" />
                    <span className="font-bold text-xs uppercase">{user.username}</span>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full justify-center text-xs"
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  >
                    SAIR DA CONTA
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    className="w-full justify-center text-xs"
                    onClick={() => { openModal('register'); setIsMobileMenuOpen(false); }}
                  >
                    CRIAR CONTA
                  </Button>
                  <Button
                    variant="default"
                    className="w-full justify-center text-xs"
                    onClick={() => { openModal('login'); setIsMobileMenuOpen(false); }}
                  >
                    FAZER LOGIN
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Main Page Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer (Exact Figma PC Layout | Tabbed Accordion on Mobile) */}
      <footer className="bg-background border-t-4 border-foreground py-10 px-4 sm:px-12 mt-12 mb-16 md:mb-0">
        <div className="max-w-6xl mx-auto">
          
          {/* 1. DESKTOP FOOTER (Exact Match to Figma Screenshot) */}
          <div className="hidden md:flex flex-row justify-between items-start gap-12">
            
            {/* Left Column: Logo + Copyright underneath */}
            <div className="space-y-4 pr-6 shrink-0">
              <Link to="/" className="inline-block">
                <img 
                  src={logoFull} 
                  alt="screeK Logo" 
                  className="h-12 w-auto" 
                />
              </Link>
              <p className="text-xs text-foreground/60 font-display font-extrabold tracking-wide max-w-[210px]">
                © 2026 screeK Inc. Todos os direitos reservados.
              </p>
            </div>

            {/* Right Columns Grid: Cinema, Social, Políticas, Redes Sociais */}
            <div className="grid grid-cols-4 gap-12 flex-1">
              <div className="space-y-3">
                <h3 className="text-primary font-display font-black text-base uppercase tracking-wider">Cinema</h3>
                <ul className="space-y-1.5 text-xs font-bold text-foreground/70">
                  <li><Link to="/movies?status=now_playing" className="hover:text-primary underline transition-colors">Filmes em Cartaz</Link></li>
                  <li><Link to="/movies?status=upcoming" className="hover:text-primary underline transition-colors">Em Breve</Link></li>
                  <li><Link to="/movies" className="hover:text-primary underline transition-colors">Catálogo</Link></li>
                  <li><Link to="/cinemas" className="hover:text-primary underline transition-colors">Cinemas</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-primary font-display font-black text-base uppercase tracking-wider">Social</h3>
                <ul className="space-y-1.5 text-xs font-bold text-foreground/70">
                  <li><Link to="/feed" className="hover:text-primary underline transition-colors">Feed</Link></li>
                  <li><Link to="/lists" className="hover:text-primary underline transition-colors">Minhas Listas</Link></li>
                  <li><Link to="/reviews" className="hover:text-primary underline transition-colors">Reviews</Link></li>
                  <li><Link to="/users" className="hover:text-primary underline transition-colors">Usuários</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-primary font-display font-black text-base uppercase tracking-wider">Políticas</h3>
                <ul className="space-y-1.5 text-xs font-bold text-foreground/70">
                  <li><Link to="#" className="hover:text-primary underline transition-colors">Termos de Uso</Link></li>
                  <li><Link to="#" className="hover:text-primary underline transition-colors">Privacidade</Link></li>
                  <li><Link to="#" className="hover:text-primary underline transition-colors">FAQ</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-primary font-display font-black text-base uppercase tracking-wider">Redes Sociais</h3>
                <div className="grid grid-cols-2 gap-2 w-24">
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-foreground/70 hover:bg-primary text-background flex items-center justify-center transition-colors" title="YouTube"><YoutubeLogo size={22} weight="fill" /></a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-foreground/70 hover:bg-primary text-background flex items-center justify-center transition-colors" title="Twitter / X"><TwitterLogo size={22} weight="fill" /></a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-foreground/70 hover:bg-primary text-background flex items-center justify-center transition-colors" title="Instagram"><InstagramLogo size={22} weight="fill" /></a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-foreground/70 hover:bg-primary text-background flex items-center justify-center transition-colors" title="Facebook"><FacebookLogo size={22} weight="fill" /></a>
                </div>
              </div>
            </div>

          </div>

          {/* 2. MOBILE FOOTER (Horizontal Tabs Row + Centered Logo Below) */}
          <div className="md:hidden space-y-6">
            <div className="border-b-2 border-foreground/20 pb-5 space-y-4">
              <div className="flex flex-wrap items-center justify-around gap-2 font-display font-extrabold text-xs uppercase">
                <button
                  onClick={() => toggleFooterTab('cinema')}
                  className={`py-1 px-2 transition-all cursor-pointer ${
                    activeFooterTab === 'cinema'
                      ? 'text-primary border-b-2 border-primary font-black scale-105'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  Cinema
                </button>

                <button
                  onClick={() => toggleFooterTab('social')}
                  className={`py-1 px-2 transition-all cursor-pointer ${
                    activeFooterTab === 'social'
                      ? 'text-primary border-b-2 border-primary font-black scale-105'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  Social
                </button>

                <button
                  onClick={() => toggleFooterTab('politicas')}
                  className={`py-1 px-2 transition-all cursor-pointer ${
                    activeFooterTab === 'politicas'
                      ? 'text-primary border-b-2 border-primary font-black scale-105'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  Políticas
                </button>

                <button
                  onClick={() => toggleFooterTab('redes')}
                  className={`py-1 px-2 transition-all cursor-pointer ${
                    activeFooterTab === 'redes'
                      ? 'text-primary border-b-2 border-primary font-black scale-105'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  Redes Sociais
                </button>
              </div>

              {/* Expanded Content Drawer Below Active Tab (Mobile Only) */}
              {activeFooterTab && (
                <div className="pt-3 border-t border-foreground/10 flex justify-center text-center animate-in fade-in slide-in-from-top-1 duration-150">
                  {activeFooterTab === 'cinema' && (
                    <ul className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-foreground/80">
                      <li><Link to="/movies?status=now_playing" className="hover:text-primary underline">Filmes em Cartaz</Link></li>
                      <li><Link to="/movies?status=upcoming" className="hover:text-primary underline">Em Breve</Link></li>
                      <li><Link to="/movies" className="hover:text-primary underline">Catálogo</Link></li>
                      <li><Link to="/cinemas" className="hover:text-primary underline">Cinemas</Link></li>
                    </ul>
                  )}

                  {activeFooterTab === 'social' && (
                    <ul className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-foreground/80">
                      <li><Link to="/feed" className="hover:text-primary underline">Feed</Link></li>
                      <li><Link to="/lists" className="hover:text-primary underline">Minhas Listas</Link></li>
                      <li><Link to="/reviews" className="hover:text-primary underline">Reviews</Link></li>
                      <li><Link to="/users" className="hover:text-primary underline">Usuários</Link></li>
                    </ul>
                  )}

                  {activeFooterTab === 'politicas' && (
                    <ul className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-foreground/80">
                      <li><Link to="#" className="hover:text-primary underline">Termos de Uso</Link></li>
                      <li><Link to="#" className="hover:text-primary underline">Privacidade</Link></li>
                      <li><Link to="#" className="hover:text-primary underline">FAQ</Link></li>
                    </ul>
                  )}

                  {activeFooterTab === 'redes' && (
                    <div className="flex items-center justify-center gap-3">
                      <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-foreground/70 hover:bg-primary text-background flex items-center justify-center transition-colors" title="YouTube"><YoutubeLogo size={20} weight="fill" /></a>
                      <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-foreground/70 hover:bg-primary text-background flex items-center justify-center transition-colors" title="Twitter / X"><TwitterLogo size={20} weight="fill" /></a>
                      <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-foreground/70 hover:bg-primary text-background flex items-center justify-center transition-colors" title="Instagram"><InstagramLogo size={20} weight="fill" /></a>
                      <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-foreground/70 hover:bg-primary text-background flex items-center justify-center transition-colors" title="Facebook"><FacebookLogo size={20} weight="fill" /></a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Bottom Centered Logo & Copyright */}
            <div className="flex flex-col items-center justify-center text-center space-y-3 pt-1">
              <Link to="/" className="inline-block">
                <img 
                  src={logoFull} 
                  alt="screeK Logo" 
                  className="h-12 w-auto" 
                />
              </Link>
              <p className="text-xs text-foreground/60 font-display font-extrabold tracking-wide">
                © 2026 screeK Inc. Todos os direitos reservados.
              </p>
            </div>
          </div>

        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Figma Mobile Dock - Fits 100% Screen Width) */}
      <nav className="fixed bottom-0 left-0 right-0 w-full z-40 md:hidden bg-background border-t-4 border-foreground py-2 px-1 flex items-center justify-around text-center box-border overflow-hidden shadow-[0_-4px_12px_rgba(0,0,0,0.2)]">
        <Link
          to="/movies"
          className="flex flex-col items-center gap-0.5 text-foreground/60 hover:text-primary transition-colors cursor-pointer"
        >
          <Ticket size={22} weight="bold" />
          <span className="text-[9px] font-display font-black uppercase tracking-wider">TICKET</span>
        </Link>

        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
            isCinemaActive ? 'text-secondary font-black' : 'text-foreground/60 hover:text-primary'
          }`}
        >
          <FilmReel size={22} weight="bold" />
          <span className="text-[9px] font-display font-black uppercase tracking-wider">CINEMA</span>
        </Link>

        <Link
          to="/search"
          className="flex flex-col items-center gap-0.5 text-foreground/60 hover:text-primary transition-colors cursor-pointer"
        >
          <MagnifyingGlass size={22} weight="bold" />
          <span className="text-[9px] font-display font-black uppercase tracking-wider">BUSCAR</span>
        </Link>

        <Link
          to="/feed"
          className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
            isSocialActive ? 'text-secondary font-black' : 'text-foreground/60 hover:text-primary'
          }`}
        >
          <Heart size={22} weight="bold" />
          <span className="text-[9px] font-display font-black uppercase tracking-wider">SOCIAL</span>
        </Link>

        <button
          onClick={() => (user ? navigate('/profile') : openModal('login'))}
          className="flex flex-col items-center gap-0.5 text-foreground/60 hover:text-primary transition-colors cursor-pointer"
        >
          <User size={22} weight="bold" />
          <span className="text-[9px] font-display font-black uppercase tracking-wider">PERFIL</span>
        </button>
      </nav>
    </div>
  );
};
