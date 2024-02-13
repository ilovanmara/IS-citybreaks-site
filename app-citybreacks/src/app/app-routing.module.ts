import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BookingComponent } from './booking/booking.component';
import { FlightsComponent } from './flights/flights.component';
import { FinalBookingComponent } from './final-booking/final-booking.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { MoneyComponent } from './money/money.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    component: FlightsComponent
  },
  {
    path: 'booking/:flightId',
    component: BookingComponent
  },
  {
    path: 'final-booking',
    component: FinalBookingComponent
  },
  {
    path: 'reservations',
    component: ReservationsComponent
  },
  {
    path: 'money',
    component: MoneyComponent
  },
  {
    path: 'final-booking/:flightId/:returnFlightId',
    component: FinalBookingComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
