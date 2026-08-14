import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CaretRight, CaretLeft } from '@phosphor-icons/react';
import { HeroCarousel, type CarouselSlide } from '../components/custom/hero-carousel';
import { MovieCard, type MovieCardProps } from '../components/custom/movie-card';

// Local Carousel Assets from assets/carrousel
import carouselLogo1 from '../assets/carrousel/logo- 1.webp';
import carouselLogo2 from '../assets/carrousel/logo-2.png';
import carouselLogo3 from '../assets/carrousel/logo-3.jpg';
import carouselWallpaper1 from '../assets/carrousel/wallpaper-1.jpg';
import carouselWallpaper2 from '../assets/carrousel/wallpaper-2.jpg';
import carouselWallpaper3 from '../assets/carrousel/wallpaper-3.jpg';

// Local Poster Imports from assets/posters
import posterAngelDust from '../assets/posters/29389-angel-dust-0-1000-0-1500-crop.jpg';
import posterChainsawMan from '../assets/posters/1102673-chainsaw-man-the-movie-reze-arc-0-1000-0-1500-crop.jpg';
import posterComrades from '../assets/posters/27236-comrades-almost-a-love-story-0-1000-0-1500-crop.jpg';
import posterScorpion from '../assets/posters/58332-female-prisoner-701-scorpion-0-1000-0-1500-crop.jpg';
import posterMatsuko from '../assets/posters/31111-memories-of-matsuko-0-1000-0-1500-crop.jpg';
import posterPhantom from '../assets/posters/34615-phantom-of-the-paradise-0-1000-0-1500-crop.jpg';
import posterStendhal from '../assets/posters/25251-the-stendhal-syndrome-0-1000-0-1500-crop.jpg';
import posterHeroicTrio from '../assets/posters/21517-the-heroic-trio-0-1000-0-1500-crop.jpg';
import posterSheShoots from '../assets/posters/19800-she-shoots-straight-0-1000-0-1500-crop.jpg';
import posterObsession from '../assets/posters/1234472-obsession-2025-2-0-1000-0-1500-crop.jpg';
import posterRaw from '../assets/posters/327974-raw-0-1000-0-1500-crop.jpg';
import posterJohnnyGuitar from '../assets/posters/35197-johnny-guitar-0-1000-0-1500-crop.jpg';
import posterOpera from '../assets/posters/39226-opera-0-1000-0-1500-crop.jpg';
import posterWolfHouse from '../assets/posters/429571-the-wolf-house-0-1000-0-1500-crop.jpg';
import posterUndine from '../assets/posters/542796-undine-0-1000-0-1500-crop.jpg';
import posterAlpha from '../assets/posters/6vblWscFAbIm9V5CwHC7IImgAq9-0-1000-0-1500-crop.jpg';

const MOCK_HERO_SLIDES: CarouselSlide[] = [
  {
    id: 'speed-racer',
    title: 'Speed Racer',
    badge: 'ESTREIA',
    logoUrl: carouselLogo1,
    backdropUrl: carouselWallpaper1,
    category: 'Cinema - 2h56 - Ação Aventura',
    ageRating: 'L',
    directors: ['Lana Wachowski', 'Lilly Wachowski'],
    synopsis: 'Speed Racer é um piloto jovem e brilhante. Quando a corrupção nas ligas de corrida...',
    ticketLink: '/movies/speed-racer',
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man – Reze Arc',
    badge: 'DESTAQUE',
    logoUrl: carouselLogo2,
    backdropUrl: carouselWallpaper2,
    category: 'Cinema - 1h39 - Animação Ação',
    ageRating: '10',
    directors: ['Tatsuya Yoshihara'],
    synopsis: 'Denji conhece Reze, uma garota misteriosa que trabalha em um café local, e sua vida toma um rumo inesperado e sangrento.',
    ticketLink: '/movies/chainsaw-man',
  },
  {
    id: 'shin-godzilla',
    title: 'Shin Godzilla',
    badge: 'REEXIBIÇÃO',
    logoUrl: carouselLogo3,
    backdropUrl: carouselWallpaper3,
    category: 'Cinema - 2h00 - Ação Ficção',
    ageRating: '12',
    directors: ['Hideaki Anno', 'Shinji Higuchi'],
    synopsis: 'Uma força desconhecida ataca a Baía de Tóquio, desencadeando um pesadelo gigantesco enquanto o governo japonês luta contra o tempo.',
    ticketLink: '/movies/shin-godzilla',
  },
];

const MOCK_NOW_PLAYING: MovieCardProps[] = [
  {
    id: 'angel-dust',
    title: 'Angel Dust',
    posterUrl: posterAngelDust,
    rating: 4.5,
    duration: '1h57',
    genre: 'CRIME',
    ageRating: 'L',
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man – The Movie: Reze Arc',
    posterUrl: posterChainsawMan,
    rating: 4.5,
    duration: '1h39',
    genre: 'ANIMATION',
    ageRating: '18',
  },
  {
    id: 'comrades',
    title: 'Comrades, Almost a Love Story',
    posterUrl: posterComrades,
    rating: 4.5,
    duration: '1h57',
    genre: 'ROMANCE',
    ageRating: '16',
  },
  {
    id: 'scorpion',
    title: 'Female Prisoner #701: Scorpion',
    posterUrl: posterScorpion,
    rating: 4.5,
    duration: '1h27',
    genre: 'CRIME',
    ageRating: '14',
  },
  {
    id: 'alpha',
    title: 'Alpha',
    posterUrl: posterAlpha,
    rating: 4.5,
    duration: '2h08',
    genre: 'DRAMA',
    ageRating: '12',
  },
  {
    id: 'she-shoots',
    title: 'She Shoots Straight',
    posterUrl: posterSheShoots,
    rating: 4.3,
    duration: '1h32',
    genre: 'ACTION',
    ageRating: '14',
  },
];

const MOCK_RE_RELEASES: MovieCardProps[] = [
  {
    id: 'johnny-guitar',
    title: 'Johnny Guitar',
    posterUrl: posterJohnnyGuitar,
    rating: 4.5,
    duration: '1h50',
    genre: 'WESTERN',
    tagType: 're_release',
  },
  {
    id: 'opera',
    title: 'Opera',
    posterUrl: posterOpera,
    rating: 4.4,
    duration: '1h47',
    genre: 'HORROR',
    tagType: 're_release',
  },
  {
    id: 'wolf-house',
    title: 'The Wolf House',
    posterUrl: posterWolfHouse,
    rating: 4.5,
    duration: '1h15',
    genre: 'ANIMATION',
    tagType: 're_release',
  },
  {
    id: 'raw',
    title: 'Raw',
    posterUrl: posterRaw,
    rating: 4.2,
    duration: '1h39',
    genre: 'HORROR',
    tagType: 're_release',
  },
  {
    id: 'matsuko',
    title: 'Memories of Matsuko',
    posterUrl: posterMatsuko,
    rating: 4.5,
    duration: '2h10',
    genre: 'DRAMA',
    tagType: 're_release',
  },
];

const MOCK_UPCOMING: MovieCardProps[] = [
  {
    id: 'phantom-paradise',
    title: 'Phantom of the Paradise',
    posterUrl: posterPhantom,
    duration: '1h32',
    genre: 'DRAMA',
    eventLabel: 'ESTREIA 03/04',
  },
  {
    id: 'stendhal-syndrome',
    title: 'The Stendhal Syndrome',
    posterUrl: posterStendhal,
    duration: '1h59',
    genre: 'THRILLER',
    tagType: 'pre_sale',
    eventLabel: 'ESTREIA 05/04',
    isPreSale: true,
  },
  {
    id: 'heroic-trio',
    title: 'The Heroic Trio',
    posterUrl: posterHeroicTrio,
    duration: '1h28',
    genre: 'ACTION',
    eventLabel: 'REEXIBIÇÃO 04/04',
  },
  {
    id: 'undine',
    title: 'Undine',
    posterUrl: posterUndine,
    duration: '1h30',
    genre: 'ROMANCE',
    eventLabel: 'ESTREIA 08/04',
  },
  {
    id: 'obsession',
    title: 'Obsession',
    posterUrl: posterObsession,
    duration: '1h45',
    genre: 'DRAMA',
    tagType: 'pre_sale',
    eventLabel: 'ESTREIA 09/04',
    isPreSale: true,
  },
];

interface MovieSectionProps {
  title: string;
  linkTo: string;
  movies: MovieCardProps[];
}

const MovieSection: React.FC<MovieSectionProps> = ({ title, linkTo, movies }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-primary tracking-wide">
            {title}
          </h2>
          <Link
            to={linkTo}
            className="text-xs sm:text-sm font-display font-bold text-foreground/70 hover:text-secondary transition-colors inline-flex items-baseline gap-1"
          >
            <span>Ver Todos</span>
            <CaretRight size={12} weight="bold" className="self-center" />
          </Link>
        </div>

        {/* Top Right Fixed Navigation Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="w-7 h-7 sm:w-10 sm:h-10 bg-foreground/80 hover:bg-primary text-background border-2 border-foreground flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_var(--border)] cursor-pointer"
            aria-label="Anterior"
          >
            <CaretLeft size={16} weight="bold" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-7 h-7 sm:w-10 sm:h-10 bg-foreground/80 hover:bg-primary text-background border-2 border-foreground flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_var(--border)] cursor-pointer"
            aria-label="Próximo"
          >
            <CaretRight size={16} weight="bold" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={containerRef}
          className="flex items-stretch gap-4 overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="w-[165px] sm:w-[190px] shrink-0">
              <MovieCard {...movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Home: React.FC = () => {
  return (
    <div className="w-full py-6 space-y-10">
      <div className="w-full overflow-hidden">
        <HeroCarousel slides={MOCK_HERO_SLIDES} />
      </div>

      <div className="max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-0 space-y-10">
        <MovieSection
          title="Em Cartaz"
          linkTo="/movies?status=now_playing"
          movies={MOCK_NOW_PLAYING}
        />

        <MovieSection
          title="Reexibições"
          linkTo="/movies?status=re_release"
          movies={MOCK_RE_RELEASES}
        />

        <MovieSection
          title="Em Breve"
          linkTo="/movies?status=upcoming"
          movies={MOCK_UPCOMING}
        />
      </div>
    </div>
  );
};
