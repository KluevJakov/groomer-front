import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user';
import { SecurityService } from './security.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'groomer-front';

  constructor(private router: Router) {

  }
  
  main() {
    this.router.navigate(['']);
  }

}
