import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.css'
})
export class FlightsComponent implements OnInit {

  flights: any[] = []; // Assuming your flights are of type 'any'
  searchFlights: any[] = [];
  searchFlightsBack: any[] = [];
  searchForm: FormGroup = this.fb.group({
    destination: ['', Validators.required],
    departureCity: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    numberOfPersons: ['', Validators.required]
  });
  showReturnFlights: boolean = false;
  uniqueDestinations: string[] = [];
  uniqueArrivalCities: string[] = [];
  
  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private flightService: SharedService) {}

  ngOnInit(): void {
    this.apiService.getFlights().subscribe((flights) => {
      console.log('Flights:', flights);
      this.flights = flights;
      this.searchFlights = this.flights;
    });
    this.apiService.getAllUniqueArrivalCities().subscribe((uniqueDestinations) => {
      console.log('Unique Destinations:', uniqueDestinations);
      this.uniqueDestinations = uniqueDestinations;
    });
    this.apiService.getAllUniqueDepartureCities().subscribe((uniqueArrivalCities) => {
      console.log('Unique Arrival Cities:', uniqueArrivalCities);
      this.uniqueArrivalCities = uniqueArrivalCities;
    });
  
  }
  searchError: boolean = false;

  onSearch(): void {
    const formValues = this.searchForm.value;
    this.flightService.numberOfPersons = formValues.numberOfPersons;
    this.apiService.getFlightsByCitiesAndDate(
      formValues.departureCity,
      formValues.destination,
      formValues.startDate
    ).subscribe((flights) => {
      this.searchFlights = flights;
    });
    this.apiService.getFlightsByCitiesAndDate(
      formValues.destination,
      formValues.departureCity,
      formValues.endDate
    ).subscribe((flights) => {
      this.searchFlightsBack = flights;
    });
    this.showReturnFlights = true;
  }

  onBook(flight: any): void {
    // const flightId = flight.id;
    // this.router.navigate(['/booking', flightId]);;
    const formValues = this.searchForm.value;
    this.apiService.book(flight, formValues.endDate);
  }

}
