import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Feedback } from 'src/app/models/feedback';
import { User } from 'src/app/models/user';
import { SecurityService } from 'src/app/security.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FeedbackComponent  implements OnInit {
  
  user!: User;
  feedbacks!: Array<Feedback>;
  feedback: Feedback = new Feedback({});

  constructor(private router: Router, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.user = SecurityService.currentUser();
    this.getFeedbacks();
  }

  createFeedback() {
    if (this.feedback.text.trim().length != 0) {
    this.feedback.client = SecurityService.currentUser();
    console.log(this.feedback);
    this.http.post<any>('http://localhost:8080/createFeedback', this.feedback , {headers: {'Content-Type':'application/json'}})
    .subscribe(
      (result: any) => {
        this.getFeedbacks();
        this.feedback.text = "";
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
    }
  }

  deleteFeedback(id: number) {
    this.http.delete<any>('http://localhost:8080/deleteFeedback?id='+id)
    .subscribe(
      (result: any) => {
        this.getFeedbacks();
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }

  getFeedbacks() {
    this.http.get<any>('http://localhost:8080/getFeedbacks')
    .subscribe(
      (result: any) => {
        this.feedbacks = result;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }
}