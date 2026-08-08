import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  MagnifyingGlass, 
  User, 
  SignOut, 
  MapPin,
  CaretDown,
  YoutubeLogo,
  TwitterLogo,
  InstagramLogo,
  FacebookLogo
} from '@phosphor-icons/react';
import { useAuthStore } from '../stores/authStore';
import { useAuthModalStore } from '../stores/authModalStore';
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

  const [openDropdown, setOpenDropdown] = useState<'cinema' | 'social' | null>(null);
  const [selectedCity, setSelectedCity] = useState('Arapiraca');
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      
      <AuthModal />

      <header className="sticky top-0 z-40 bg-background border-b-2 border-foreground/30 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src={logoFull} 
                alt="screeK Logo" 
                className="h-8 sm:h-7 w-auto hover:opacity-90 transition-opacity" 
              />
            </Link>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[145px] min-w-[145px] sm:h-10 ">
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

          <div className="flex items-center gap-3">
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


      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t-4 border-foreground/40 bg-background py-10 px-6 sm:px-12 text-foreground font-display">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8 md:gap-4">
          
          <div className="flex flex-col justify-content items-center space-y-8 max-w-xs">
            <img src={logoFull} alt="screeK Logo" className="h-16 w-auto" />
            <p className="text-xs font-bold text-foreground/60 leading-relaxed pt-2">
              © 2026 screeK Inc. Todos os direitos reservados.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-primary font-extrabold text-base ">Cinema</h3>
            <ul className="space-y-1.5 text-xs font-bold text-foreground/80">
              <li>
                <Link to="/movies?status=now_playing" className="hover:text-primary underline text-sm transition-colors">
                  Filmes em Cartaz
                </Link>
              </li>
              <li>
                <Link to="/movies?status=upcoming" className="hover:text-primary underline text-sm transition-colors">
                  Em Breve
                </Link>
              </li>
              <li>
                <Link to="/movies" className="hover:text-primary underline text-sm transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/cinemas" className="hover:text-primary underline text-sm transition-colors">
                  Cinemas
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-primary font-extrabold text-base ">Social</h3>
            <ul className="space-y-1.5 text-xs font-bold text-foreground/80">
              <li>
                <Link to="/feed" className="hover:text-primary underline text-sm transition-colors">
                  Feed
                </Link>
              </li>
              <li>
                <Link to="/lists" className="hover:text-primary underline text-sm transition-colors">
                  Minhas Listas
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-primary underline text-sm transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/users" className="hover:text-primary underline text-sm transition-colors">
                  Usuários
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-6">
            <div className="space-y-3">
              <h3 className="text-primary font-extrabold text-base">Políticas</h3>
              <ul className="space-y-1.5 text-xs font-bold text-foreground/80">
                <li>
                  <Link to="#" className="hover:text-primary underline text-sm transition-colors">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary underline text-sm transition-colors">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary underline transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
              <h3 className="text-primary font-extrabold text-base">Redes Sociais</h3>
              <div className="grid grid-cols-2 gap-2 w-28">
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-12 h-12 bg-foreground/60 hover:bg-primary text-background flex items-center justify-center transition-colors"
                  title="YouTube"
                >
                  <YoutubeLogo size={24} weight="fill" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-12 h-12 bg-foreground/60 hover:bg-primary text-background flex items-center justify-center transition-colors"
                  title="Twitter / X"
                >
                  <TwitterLogo size={24} weight="fill" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-12 h-12 bg-foreground/60 hover:bg-primary text-background flex items-center justify-center transition-colors"
                  title="Instagram"
                >
                  <InstagramLogo size={24} weight="fill" />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-12 h-12 bg-foreground/60 hover:bg-primary text-background flex items-center justify-center transition-colors"
                  title="Facebook"
                >
                  <FacebookLogo size={24} weight="fill" />
                </a>
              </div>
            </div>

        </div>
      </footer>

    </div>
  );
};
