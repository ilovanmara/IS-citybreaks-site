import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private token = '';
  private jwtToken$ = new BehaviorSubject<string>(this.token);
  private API_URL = 'http://localhost:3000/api';
  private email = '';

  constructor(private http: HttpClient,
              private router: Router,
              private toast: ToastrService,
              private flightService: SharedService ) {
    const fetchedToken = localStorage.getItem('act');

    if(fetchedToken){
      this.token = atob(fetchedToken);
      this.jwtToken$.next(this.token);
    }

  }

   getEmail(): string {
   
   console.log('User Email:', this.email);
    return this.email;
  }

  getFlights(): Observable<any> {
    return this.http.get(`${this.API_URL}/flights`)
    .pipe(
      catchError(error => {
        console.error('Error fetching flights:', error);
        throw error;
      })
    );
  }

  getUserIdByEmail(email: string): Observable<any> {
    return this.http.get(`${this.API_URL}/auth/${email}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching user ID:', error);
          throw error;
        })
      );
  }

  getMoneyByEmail(email: string): Observable<any> {
    return this.http.get(`${this.API_URL}/auth/money/${email}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching user ID:', error);
          throw error;
        })
      );
  }

  addMoneyByEmail(email: string, amount: number) {
    return this.http.patch(`${this.API_URL}/auth/${email}`, { amount })
      .pipe(
        catchError(error => {
          console.error('Error fetching user ID:', error);
          throw error;
        })
      );
  }

  getFlightById(flightId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/flights/${flightId}`)
    .pipe(
      catchError(error => {
        console.error('Error fetching flights:', error);
        throw error;
      })
    );
  }

  getAllUniqueArrivalCities(): Observable<any> {
    return this.http.get(`${this.API_URL}/flights/unique-arrival-cities`)
    .pipe(
      tap(response => console.log('Arrival Cities API Response:', response)),
      catchError(error => {
        console.error('Error fetching unique arrival cities:', error);
        throw error;
      })
    );
  }

  createReservation(reservationData: any): Observable<any>{
    return this.http.post(`${this.API_URL}/reservation`, reservationData)
      .pipe(
        catchError(error => {
          console.error('Error creating reservation:', error);
          this.toast.error('Error creating reservation. Please try again.');
          throw error;
        })
      )
  }

  cancelReservation(id: number): Observable<any>{
    return this.http.delete(`${this.API_URL}/reservation/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error creating reservation:', error);
          this.toast.error('Error creating reservation. Please try again.');
          throw error;
        })
      )
  }
  

  get jwtUserToken(): Observable<string> {
    return this.jwtToken$.asObservable();
  }

  verifyToken(token: string) {
    return this.http.post(`${this.API_URL}/auth/verifyToken`, {token});
  }

  getAllUniqueDepartureCities(): Observable<any> {
    return this.http.get(`${this.API_URL}/flights/unique-departure-cities`)
    .pipe(
      catchError(error => {
        console.error('Error fetching flights:', error);
        throw error;
      })
    );
  }

  getFlightsByCitiesAndDate(deparureCity: string, arrivalCity: string, departureDate: string): Observable<any> {
    const params = new HttpParams()
      .set('deparureCity', deparureCity)
      .set('arrivalCity', arrivalCity)
      .set('departureDate', departureDate);

    return this.http.get(`${this.API_URL}/flights/cities-and-date`, { params });
  }

  getReservationsByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/reservation/userId/${userId}`);
  }

  login(email: string, password: string) {

    this.http.post(`${this.API_URL}/auth/login`, {email, password})

      .subscribe((res: any) => {
        this.token = res.token;
        this.email = email;

        if (this.token) {
          this.toast.success('Login successful, redirecting now...', '', {
            timeOut: 700,
            positionClass: 'toast-top-center'
          }).onHidden.toPromise().then(() => {
            this.jwtToken$.next(this.token);
            localStorage.setItem('act', btoa(this.token));
            const selectedFlight = this.flightService.selectedFlight;
            console.log(selectedFlight);

            if (selectedFlight) {
              this.router.navigateByUrl(`/booking/${selectedFlight.id}`).then();
            } else {
              this.router.navigateByUrl('/').then();
            }
          });
        }
      }, (err: HttpErrorResponse) => {
        this.toast.error('Authentication failed, try again', '', {
          timeOut: 1000,
          positionClass: 'toast-top-center'
        });
      });
  
  }
    logout() {
    this.token = '';
    this.email = '';
    this.flightService.selectedFlight = '';
    this.jwtToken$.next(this.token);
    this.toast.success('Logged out succesfully', '', {
      timeOut: 500
    }).onHidden.subscribe(() => {
      localStorage.removeItem('act');
      this.router.navigateByUrl('/login').then();
    });
    return '';
  }

  register(email: string, password: string) {

    return this.http.post(`${this.API_URL}/auth/register`, {email, password}).pipe(
      // @ts-ignore
      catchError((err: HttpErrorResponse) => {
        this.toast.error(err.error.message, '', {
          timeOut: 2000,
          positionClass: 'toast-top-center'
        });
      })
    );
  }

  book(flight: any, endDate: any): void {
    this.flightService.selectedFlight2 = flight;
    this.flightService.selectedFlight = flight;
    if (this.token) {
      const flightId = flight.id;
      this.flightService.selectedFlight = flight;
      this.flightService.endDate = endDate;
      this.router.navigate(['/booking', flightId]);
    } else {
      this.router.navigateByUrl('/login');
      this.toast.error('Please log in to book a flight.', '', {
        timeOut: 2000,
        positionClass: 'toast-top-center',
      });
    }
  }

  book2(flight: any, returnFlight: any): void {
      const flightId = flight.id;
      this.flightService.selectedFlight = flight;
      this.flightService.returnFlight = returnFlight;
      const returnFlightId = returnFlight.id;
      this.flightService.numberOfFlights = 2;
      console.log(this.flightService.numberOfFlights);
      console.log(this.flightService.returnFlight);
      this.router.navigate(['/final-booking', flightId, returnFlightId]);

  }

  book3(flight: any): void {
    const flightId = flight.id;
    this.flightService.selectedFlight = flight;
    this.flightService.numberOfFlights = 1;
    console.log(this.flightService.numberOfFlights);
    this.router.navigateByUrl('/final-booking').then();
}

  validateJWT() {
    throw new Error('Method not implemented.');
  }
}
