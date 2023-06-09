import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Event } from 'src/app/models/event';
import { User } from 'src/app/models/user';
import { SecurityService } from 'src/app/security.service';

@Component({
  selector: 'app-viewevent',
  templateUrl: './viewevent.component.html',
  styleUrls: ['./viewevent.component.css'],
  standalone: true,
  imports: [CommonModule, NgbTimepickerModule, FormsModule]
})
export class ViewEventComponent implements OnInit {

  @Input() event!: Event;
  dateOfEvent: any;
  startDate = { hour: 8, minute: 0 };
  user!: User;
  dateOfEventDate! : Date;

  constructor(public activeModal: NgbActiveModal, private http: HttpClient) { }

  ngOnInit(): void {
    this.user = SecurityService.currentUser();
    this.dateOfEvent = new Date(this.event.start).toLocaleString("ru-RU", { weekday: "long", month: "long", day: "numeric" });
    this.startDate = { hour: new Date(this.event.start).getHours(), minute: new Date(this.event.start).getMinutes() };
  }

  cancel() {
    this.http.delete<any>('http://localhost:8080/cancelEvent?id='+this.event.id)
    .subscribe(
      (result: any) => {
        this.activeModal.close('Close click');
      },
      (error: HttpErrorResponse) => {
        this.activeModal.close('Close click');
        console.log(error.error);
      }
    );
  }

  update() {
    let tempDate = new Date(this.dateOfEventDate)
    tempDate.setHours(this.startDate.hour, this.startDate.minute);
    let startDate = new Date(tempDate);
    this.event.start = startDate;
    this.http.put<any>('http://localhost:8080/updateEvent', this.event)
    .subscribe(
      (result: any) => {
        this.activeModal.close('Close click');
      },
      (error: HttpErrorResponse) => {
        this.activeModal.close('Close click');
        console.log(error.error);
      }
    );
  }

  validateDates() {
    if (this.startDate.hour < 8) {
      this.startDate = { hour: 8, minute: 0 };
    }
    if (this.startDate.hour > 20) {
      this.startDate = { hour: 20, minute: 0 };
    }
    if (this.startDate.hour == 20 && this.startDate.minute > 0) {
      this.startDate = { hour: 20, minute: 0 };
    }
  }
}
