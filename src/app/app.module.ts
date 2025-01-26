import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { SearchDialogComponent } from './components/search-dialog/search-dialog.component';
import { CategoryDialogComponent } from './components/category-dialog/category-dialog.component';
import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProviderAppointmentsComponent } from './components/provider-appointments/provider-appointments.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ProviderGuard } from './guards/provider.guard';

@NgModule({
  declarations: [
    AppComponent,
    AppointmentListComponent,
    AppointmentFormComponent,
    DeleteDialogComponent,
    SearchDialogComponent,
    CategoryDialogComponent,
    AppointmentDetailsComponent,
    LoginComponent,
    RegisterComponent,
    ProviderAppointmentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatChipsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatMenuModule,
    MatCardModule,
    MatSnackBarModule,
    MatListModule
  ],
  providers: [AuthService, AuthGuard, ProviderGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
