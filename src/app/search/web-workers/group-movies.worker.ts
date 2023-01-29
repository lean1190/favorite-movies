import * as _ from 'lodash';
import { DoWork, runWorker } from 'observable-webworker';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Movie, MoviesGroup } from '../interfaces/movie';

export class GroupMoviesWorker implements DoWork<Movie[], MoviesGroup[]> {

  public work(movies: Observable<Movie[]>): Observable<MoviesGroup[]> {
    return movies.pipe(
      map((movies) => {
        const groupedMovies = _.groupBy(movies, 'year');
        return _.chain(groupedMovies)
          .map((movies, year) => ({ year, movies }))
          .orderBy('year', 'desc')
          .value();
      })
    );
  }
}

runWorker(GroupMoviesWorker);
