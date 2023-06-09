import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit {
  
  constructor(private router: Router) {

  }

  ngOnInit(): void {
    
  }

  main() {
    this.router.navigate(['']);
  }
}
