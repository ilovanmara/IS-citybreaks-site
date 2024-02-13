import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  selectedFlight2: any;
  selectedFlight: any;
  returnFlight: any
  endDate: any;
  numberOfFlights: any;
  numberOfPersons: any;
  //private email: email
  constructor() { }
}
