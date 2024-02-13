import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  username: string = '';
  password: string = '';
  hidePassword: boolean = true;

  constructor(private apiService: ApiService,
    private router: Router, private sharedService: SharedService) {
}
  ngOnInit(): void {
    this.apiService.jwtUserToken.subscribe(token => {
      if (token) {
        this.router.navigateByUrl('/').then();
      }
    });

  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  
  onSubmit(loginForm: NgForm): void {
    if (loginForm.invalid) {
      return;
    }
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    this.apiService.login(this.username, this.password);
    if (this.sharedService.selectedFlight) {
      // Redirect to booking page with the selected flight
      this.router.navigate(['/booking', this.sharedService.selectedFlight.id]);
    }
    return loginForm.reset();
  }
}
