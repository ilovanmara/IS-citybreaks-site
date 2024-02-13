import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-money',
  templateUrl: './money.component.html',
  styleUrl: './money.component.css'
})
export class MoneyComponent implements OnInit{

  amount: any;

  constructor(private apiService: ApiService){}
  userMoney: any;

  ngOnInit(): void {
    const userEmail = this.apiService.getEmail();
    this.apiService.getMoneyByEmail(userEmail).subscribe(
      (userMoney) => {
        this.userMoney = userMoney;
      }
    )
  }

  addMoney() {
    const userEmail = this.apiService.getEmail();
    this.apiService.addMoneyByEmail(userEmail, this.amount).subscribe(
      (newBalance) => {
        this.userMoney = newBalance;
      },
      (error) => {
        console.error('Failed to add money:', error);
      }
    );
  }

}
