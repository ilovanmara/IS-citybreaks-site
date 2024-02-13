import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit{

  reservations: any[] = [];
  userId: any;
  flights: any[] = [];
  returnflights: any[] = [];

constructor(private apiService: ApiService){}

  ngOnInit(): void {
    const userEmail = this.apiService.getEmail();
    const userId = this.userId;
    this.apiService.getUserIdByEmail(userEmail).subscribe(
      (userId) => {
      this.apiService.getReservationsByUserId(userId).subscribe((reservations) => {
        reservations.forEach((reservation: {
          id: any;
          returnFlightId: any; flightId: number; 
        }) => {
          if (reservation.flightId) {
            this.apiService.getFlightById(reservation.flightId).subscribe(flightDetails => {
              this.flights[reservation.id] = flightDetails;
            });
          }
          if (reservation.returnFlightId) {
            this.apiService.getFlightById(reservation.returnFlightId).subscribe(flightDetails => {
              this.returnflights[reservation.id] = flightDetails;
            });
          }
        });
        this.reservations = reservations;
    });
  });
  }

  onDelete(reservationId: any) {
    this.apiService.cancelReservation(reservationId).subscribe(
      () => {
      
        this.reservations = this.reservations.filter(reservation => reservation.id !== reservationId);
      }
    );
  }
  
}
