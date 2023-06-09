import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent  implements OnInit {
  
  user: User = new User({});

  constructor(private router: Router, private http: HttpClient) {

  }

  ngOnInit(): void {
    
  }

  register() {
    if (this.user.email == null || this.user.phone == null || this.user.name == null || this.user.password == null) {
      alert("Проверьте правильность заполнения полей");
      return;
    }
    if (this.user.email.length == 0 || this.user.phone.length == 0 || this.user.name.length == 0 || this.user.password.length == 0) {
      alert("Проверьте правильность заполнения полей");
      return;
    }
    this.http.post<any>('http://localhost:8080/register', this.user)
    .subscribe({
      error: this.error.bind(this),
      next: this.success.bind(this)
    });
  }

  error(data: any) {
    alert("Данный email уже зарегистрирован!");
  }

  success(data: any) {
    this.router.navigate(['login']);
  }

  login() {
    this.router.navigate(['login']);
  }
}