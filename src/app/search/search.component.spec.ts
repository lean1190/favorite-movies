import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { SearchService } from './providers/search.service';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  let searchInput: DebugElement;
  let searchServiceSpy: jasmine.SpyObj<SearchService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule],
      declarations: [SearchComponent],
      providers: [
        {
          provide: SearchService,
          useValue: jasmine.createSpyObj('SearchService', ['searchMovies']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;

    searchInput = fixture.debugElement.query(By.css('[data-test-hook="search-input"]')).nativeElement;
    searchServiceSpy = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;

    fixture.detectChanges();
    fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display movies after search', async () => {
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

    searchServiceSpy.searchMovies.and.returnValue(of(moviesGroups));
    sendInput(searchInput, 'harry potter');
    fixture.debugElement.query(By.css('.search-results-group'));
    // TODO
    // Add expectations to this test.
    // The intention is to look for the groups in the view that represent the response from the service.
  });

  function sendInput(inputElement: any, text: string) {
    inputElement.value = text;
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    return fixture.whenStable();
  }
});
