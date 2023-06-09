import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SecurityService } from 'src/app/security.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  standalone: true,
  imports: [CommonModule, NgbTimepickerModule, FormsModule]
})
export class EventComponent implements OnInit {

  @Input() date!: Date;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  dateOfEvent: any;
  startTime = { hour: 8, minute: 0 };

  constructor(public activeModal: NgbActiveModal, private http: HttpClient) { }

  ngOnInit(): void {
    this.dateOfEvent = this.date.toLocaleString("ru-RU", { weekday: "long", month: "long", day: "numeric" });
  }

  createEvent() {
    let tempDate = this.date;
    tempDate.setHours(this.startTime.hour, this.startTime.minute);
    let startDate = new Date(tempDate);

    if (!(document.getElementById("textEvent") as HTMLInputElement).value) {
      (document.getElementById("textEvent") as HTMLInputElement).setCustomValidity("Порода потомца - обязательный параметр");
      (document.getElementById("textEvent") as HTMLInputElement).reportValidity();
      return;
    }

    if (startDate.getHours() < 8 || startDate.getHours() > 20) {
      alert("Выберете время 8:00-20:00");
      return;
    }

    let newEvent = {
      start: startDate,
      end: null,
      title: (document.getElementById("textEvent") as HTMLInputElement).value,
      client: SecurityService.currentUser(),
      color: {
        primary: 'red',
      },
      additional: (document.getElementById("textDescription") as HTMLInputElement).value
    }
    this.passEntry.emit(newEvent);
  }

  validateDates() {
    if (this.startTime.hour < 8) {
      this.startTime = { hour: 8, minute: 0 };
    }
    if (this.startTime.hour > 20) {
      this.startTime = { hour: 20, minute: 0 };
    }
    if (this.startTime.hour == 20 && this.startTime.minute > 0) {
      this.startTime = { hour: 20, minute: 0 };
    }
  }
}
