import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordsMatch: boolean = true;
  errorMessage: string = '';

  constructor(private apiService: ApiService) {}

  onSubmit(registerForm: NgForm) {
    if (registerForm.invalid || (this.password != this.confirmPassword)) {
      return;
    }
    this.apiService.register(this.username, this.password).subscribe(res => {
      registerForm.reset();
      this.errorMessage = '';
    },
      error => {
        this.errorMessage = 'Registration failed. Please try again.'; 
      }
    );
  }
  onPasswordChange() {
    this.passwordsMatch = this.password === this.confirmPassword;
    this.errorMessage = '';
  }
}
