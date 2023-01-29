import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchComponent } from './search.component';

@NgModule({
  imports: [ReactiveFormsModule, HttpClientModule],
  declarations: [SearchComponent]
})
export class SearchModule {}
