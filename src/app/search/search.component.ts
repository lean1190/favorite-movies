import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';

import { MoviesGroup } from './interfaces/movie';
import { SearchService } from './providers/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less'],
  providers: [SearchService]
})
export class SearchComponent {

  public searchForm;
  public movies: Observable<MoviesGroup[]>;

  constructor(formBuilder: FormBuilder, private searchService: SearchService) {
    this.searchForm = formBuilder.group({
      title: new FormControl('', Validators.required)
    });

    this.movies = this.searchForm.controls.title.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((title) => this.searchService.searchMovies(title as string))
    );
  }
}
