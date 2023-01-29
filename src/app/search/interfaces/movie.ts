export interface Movie {
  title: string;
  year: string;
  posterUrl: string;
  imdbId: string;
  rating: string;
  awards: string;
}

export interface MoviesGroup {
  year: string;
  movies: Movie[];
}
