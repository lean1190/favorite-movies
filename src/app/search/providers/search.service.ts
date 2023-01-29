import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { fromWorker } from 'observable-webworker';

import { MoviesGroup, Movie, RatingSource } from '../interfaces/movie';
import { environment } from '../../../environments/environment';

@Injectable()
export class SearchService {

  private readonly apiBaseUrl = `${environment.omdbApiUrl}apikey=${environment.omdbApiKey}&type=movie`;

  constructor(private httpClient: HttpClient) {}

  public searchMovies(title: string): Observable<MoviesGroup[]> {

    const getMoviesDetails = (result: SearchResponse) => forkJoin(_.map(result.Search, (movie) => this.getMovie(movie.imdbID)));
    const groupMoviesWorker = (movies: Observable<Movie[]>) => fromWorker<Movie[], MoviesGroup[]>(() => new Worker(
      new URL('../web-workers/group-movies.worker', import.meta.url),
      { type: 'module' }
    ), movies);

    // Just fetch 1 page for now
    return this.httpClient.get<SearchResponse>(`${this.apiBaseUrl}&s=${title}&page=1`).pipe(
      switchMap((result) => getMoviesDetails(result).pipe(groupMoviesWorker))
    );
  }

  public getMovie(imdbId: string): Observable<Movie> {
    return this.httpClient.get<DetailResponse>(`${this.apiBaseUrl}&i=${imdbId}`).pipe(
      map((details) => ({
        title: details.Title,
        year: details.Year,
        posterUrl: details.Poster,
        imdbId: details.imdbID,
        rating: details.Ratings.find((rating) => rating.Source === RatingSource.Imdb)?.Value as string,
        awards: details.Awards
      })
    ));
  }
}

interface SearchResponse {
  Search: SearchMovieResponse[];
  totalResults: string;
  Response: string;
}

interface SearchMovieResponse {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface DetailResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: {
    Source: RatingSource;
    Value: string;
  }[],
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}
