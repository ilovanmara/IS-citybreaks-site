import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit{

  selectedFlight: any;
  endDate: any;
  flights: any[] = [];
  returnFlights: any[] = [];
  constructor(private flightService: SharedService, private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    // Retrieve the selected flight from the shared service
    this.selectedFlight = this.flightService.selectedFlight;
    this.endDate = this.flightService.endDate;
    console.log('Date:', this.endDate); 
    if (this.selectedFlight && this.endDate) {
      this.apiService.getFlightsByCitiesAndDate(
        this.selectedFlight.arrivalCity,
        this.selectedFlight.deparureCity,
        this.endDate
      ).subscribe((flights) => {
        console.log('Return Flights:', flights); 
        this.returnFlights = flights;
        this.flightService.selectedFlight = null;
        this.flightService.endDate = null;
      });
    }
  }

  onBookReturn(flight: any, returnFlight: any) {
    this.apiService.book2(flight, returnFlight);
    console.log(returnFlight);
    }
  onBook(flight: any) {
    this.apiService.book3(flight);
  }

}
