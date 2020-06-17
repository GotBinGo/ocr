import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogFrontComponent } from './dialog-front/dialog-front.component';
import {MatStepperModule} from '@angular/material/stepper';
import { HttpClientModule } from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
// import { WebcamModule } from 'ngx-webcam';
import { WebCamModule } from 'ack-angular-webcam';

@NgModule({
  declarations: [
    AppComponent,
    DialogFrontComponent
  ],
  imports: [
    BrowserModule,
    WebCamModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatStepperModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
