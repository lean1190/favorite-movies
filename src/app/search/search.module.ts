import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchComponent } from './search.component';

@NgModule({
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  declarations: [SearchComponent]
})
export class SearchModule {}
