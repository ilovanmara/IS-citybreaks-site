import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  logout() {
    this.username = '';
    this.username = this.apiService.logout();
  }
  username = '';

  title = 'app-citybreaks';
  showMenu = true;

  constructor(private apiService: ApiService,
    private router: Router) {
}
  ngOnInit(): void {
    this.apiService.jwtUserToken.subscribe(token => {
      if (token) {
        const decoded: any = jwtDecode(token);
        this.username = decoded.username;
        this.showMenu = false;
      } else {
        this.username = '';
        this.showMenu = true;
      }
    });
  }
}
