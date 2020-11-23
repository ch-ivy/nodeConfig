import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {
  NgbModalModule,
  NgbPaginationModule,
  NgbAlertModule,
} from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatRippleModule,
    MatButtonModule,
    NgbModalModule,
    MatInputModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    HttpClientModule,
    NgbAlertModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
