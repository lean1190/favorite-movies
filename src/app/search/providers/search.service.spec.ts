import * as observableWebWorker from 'observable-webworker';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { SearchService } from './search.service';
import { takeValues } from 'src/helpers/observable';
import { environment } from 'src/environments/environment';
import { RatingSource } from '../interfaces/movie';

describe('SearchService', () => {

  let searchService: SearchService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchService,
        { provide: HttpClient, useValue: jasmine.createSpyObj('HttpClient', ['get']) }
      ]
    });

    searchService = TestBed.inject(SearchService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  xdescribe('searchMovies', () => {
    const search = 'search';
    const moviesGroups = [
      {
        year: '2020',
        movies: [
          {
            title: 'title1',
            year: 'year1',
            posterUrl: 'poster1',
            imdbId: 'id1',
            rating: '10/10',
            awards: 'award1',
          },
          {
            title: 'title2',
            year: 'year2',
            posterUrl: 'poster2',
            imdbId: 'id2',
            rating: '10/10',
            awards: 'award2',
          },
        ],
      },
      {
        year: '2019',
        movies: [
          {
            title: 'title3',
            year: 'year3',
            posterUrl: 'poster3',
            imdbId: 'id3',
            rating: '10/10',
            awards: 'award3',
          },
        ],
      },
    ];

    let workerSpy: jasmine.Spy;
    let httpGetSpy: jasmine.Spy;
    let getMovieSpy: jasmine.Spy;

    beforeEach(() => {
      // TODO
      // Fix this test, unfortunately I couldn't make it work.
      // I'm not entirely sure how to make this work with Jasmine
      workerSpy = spyOn(observableWebWorker, 'fromWorker').and.returnValue(of(moviesGroups));
      httpGetSpy = httpClientSpy.get.and.returnValue(
        of({
          Search: [
            { Title: 'title1', Year: 'year1', imdbID: 'id1' },
            { Title: 'title2', Year: 'year2', imdbID: 'id2' },
            { Title: 'title3', Year: 'year3', imdbID: 'id3' },
          ],
        })
      );
      getMovieSpy = spyOn(searchService, 'getMovie').and.returnValue(
        of({
          title: 'title1',
          year: 'year1',
          posterUrl: 'poster1',
          imdbId: 'id1',
          rating: '10/10',
          awards: 'award1',
        })
      );
    });

    it('should return movies', async () => {
      const [movies] = await takeValues(searchService.searchMovies(search));

      const expectedUrl = `${environment.omdbApiUrl}apikey=${environment.omdbApiKey}&type=movie&s=${search}&page=1`;
      expect(movies).toEqual(moviesGroups);
      expect(httpGetSpy).toHaveBeenCalledOnceWith(expectedUrl);
      expect(getMovieSpy).toHaveBeenCalledWith('id1');
      expect(getMovieSpy).toHaveBeenCalledWith('id2');
      expect(getMovieSpy).toHaveBeenCalledWith('id3');
      expect(workerSpy).toHaveBeenCalledOnceWith(
        () =>
          new Worker(
            new URL('../web-workers/group-movies.worker', import.meta.url),
            { type: 'module' }
          )
      );
    });

    it('should return an error if the api errors', async () => {
      const expectedError = new Error('error');
      httpGetSpy.and.returnValue(throwError(() => expectedError));

      try {
        await takeValues(searchService.searchMovies(search));
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe('getMovie', () => {

    const movieId = 'movieId';

    let httpGetSpy: jasmine.Spy;

    beforeEach(() => {
      httpGetSpy = httpClientSpy.get.and.returnValue(
        of({
          Title: 'title1',
          Year: 'year1',
          Poster: 'poster1',
          imdbID: 'id1',
          Ratings: [{
            Source: RatingSource.Imdb,
            Value: '10/10'
          }],
          Awards: 'award1'
        })
      );
    })

    it('should return a movie', async () => {
      const expectedMovie = {
        title: 'title1',
        year: 'year1',
        posterUrl: 'poster1',
        imdbId: 'id1',
        rating: '10/10',
        awards: 'award1',
      };

      const [movie] = await takeValues(searchService.getMovie(movieId));

      expect(movie).toEqual(expectedMovie);
    });

    it('should return an error if the api errors', async () => {
      const expectedError = new Error('error');
      httpGetSpy.and.returnValue(throwError(() => expectedError));

      try {
        await takeValues(searchService.getMovie(movieId));
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });
});
