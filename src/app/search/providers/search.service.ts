import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MoviesGroup } from '../interfaces/movie';

@Injectable()
export class SearchService {

  constructor(httpClient: HttpClient) {}

  public searchMovies(title: string): Observable<MoviesGroup[]> {
    return of([]);
  }
}
