import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { SecurityService } from 'src/app/security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent implements OnInit {

  user: User = new User({});

  constructor(private router: Router, private http: HttpClient) {

  }

  ngOnInit(): void {
    if (SecurityService.currentUser() != null) {
      if (SecurityService.currentUser().roles[0].id == 1) {
        this.router.navigate(['admin']);
      } else {
        this.router.navigate(['user']);
      }
    }
  }

  login() {
    if (this.user.email == null || this.user.password == null) {
      alert("Проверьте учетные данные");
      return;
    }
    if (this.user.email.length == 0 || this.user.password.length == 0) {
      alert("Проверьте учетные данные");
      return;
    }
    this.http.post<any>('http://localhost:8080/login', this.user)
      .subscribe({
        error: this.error.bind(this),
        next: this.success.bind(this)
      });
  }

  error(data: any) {
    alert("Проверьте учетные данные");
    this.user.password = "";
  }

  success(data: User) {
    this.user.password = "";
    console.log(data);
    sessionStorage.setItem("user", JSON.stringify(data));
    if (data.roles[0].id == 1) {
      this.router.navigate(['admin']);
    } else {
      this.router.navigate(['user']);
    }
  }

  register() {
    this.router.navigate(['register']);
  }
}