import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProviderAppointmentsComponent } from './components/provider-appointments/provider-appointments.component';
import { AuthGuard } from './guards/auth.guard';
import { ProviderGuard } from './guards/provider.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'appointments', component: AppointmentListComponent, canActivate: [AuthGuard] },
  { path: 'provider', component: ProviderAppointmentsComponent, canActivate: [AuthGuard, ProviderGuard] },
  { path: '', redirectTo: '/appointments', pathMatch: 'full' },
  { path: '**', redirectTo: '/appointments' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
