import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { SecurityService } from 'src/app/security.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  user!: User;

  constructor(private router: Router) {

  }

  ngOnInit(): void {
    this.user = SecurityService.currentUser();
    console.log(SecurityService.currentUser());
  }

  exit() {
    sessionStorage.removeItem('user');
    window.location.href = '/';
  }

  lk() {
    this.router.navigate(['login']);
  }

  feedback() {
    this.router.navigate(['feedback']);
  }

  about() {
    this.router.navigate(['about']);
  }

  actions() {
    this.router.navigate(['actions']);
  }
}
