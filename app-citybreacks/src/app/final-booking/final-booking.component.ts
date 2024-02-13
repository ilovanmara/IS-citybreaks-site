import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-final-booking',
  templateUrl: './final-booking.component.html',
  styleUrl: './final-booking.component.css'
})
export class FinalBookingComponent implements OnInit{
  flight: any;
  returnFlight: any;
  numberOfFlight: any;
  message: string = '';
  errorMsg: string = '';

  constructor(private flightService: SharedService, private apiService: ApiService){}

  ngOnInit(): void {
    this.flight = this.flightService.selectedFlight;
    this.numberOfFlight = this.flightService.numberOfFlights;
    console.log(this.flight); 
    console.log(this.numberOfFlight); 
    if (this.numberOfFlight === 2) {
      this.returnFlight = this.flightService.returnFlight;
      console.log(this.returnFlight); 
    }
  }


  finalBook() {
  const userEmail = this.apiService.getEmail();
  console.log(userEmail);
   this.apiService.getUserIdByEmail(userEmail).subscribe(
    (userId) => {
      console.log('User ID:', userId);
      
      const reservationData= {
        flightId: this.flightService.selectedFlight.id,
        returnFlightId: this.flightService.returnFlight ? this.flightService.returnFlight.id : null,
        userId: userId,
        numberOfPersons: this.flightService.numberOfPersons
      };

      console.log('Reservation Data:', reservationData); 

      this.apiService.createReservation(reservationData).subscribe(
        () => {
          console.log('Reservation created successfully');
          this.message = "Reservation created successfully!";
        },
        (error) => {
          console.error('Error creating reservation:', error);
          this.errorMsg= 'Please add more money before making the reservation.';
         
        }
      );
    },
    (error) => {
      console.error('Error getting user ID:', error);
    }
  );
  }
  
  calculateTotalPrice(): number {
      if (this.flight && this.returnFlight) {
        return this.flight.price * this.flightService.numberOfPersons + this.returnFlight.price * this.flightService.numberOfPersons;
      } else if (this.flight) {
        return this.flight.price;
      } else {
        return 0;
      }
  }



}
