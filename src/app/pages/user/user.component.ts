import { registerLocaleData } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { collapseAnimation } from 'angular-calendar';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import {
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { CustomDateFormatter } from '../../custom-date-formatter.provider';
import localeRu from '@angular/common/locales/ru';
import { SecurityService } from 'src/app/security.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { Subject } from 'rxjs';
import { EventComponent } from '../event/event.component';
import { ViewEventComponent } from '../viewevent/viewevent.component';

registerLocaleData(localeRu);

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [collapseAnimation],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class UserComponent implements OnInit {
  
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  } | undefined;
  refresh = new Subject<void>();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  currentUser?: User = SecurityService.currentUser();

  constructor(private modalService: NgbModal,
    private http: HttpClient, private router: Router) { }


  ngOnInit(): void {
    if (SecurityService.currentUser() != null) {
        if (SecurityService.currentUser().roles[0].id == 1) {
            this.router.navigate(['admin']);
        }
    } else {
      this.router.navigate(['login']);
    }
    this.refreshScedule();
  }

  createEvent() {
    console.log(this.viewDate);
    const modalRef = this.modalService.open(EventComponent, { size: 'lg' });
      modalRef.componentInstance.date = this.viewDate;
      modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
        this.addEvent(receivedEntry);
        this.http.post<any>('http://localhost:8080/event/', receivedEntry)
        .subscribe(
          (result: any) => {
            this.refreshScedule();
          },
          (error: HttpErrorResponse) => {
            console.log(error.error);
          }
        );
        modalRef.dismiss();
      });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  addEvent(event: CalendarEvent): void {
    if (this.events.some(e => e.id === event.id)) {
      return;
    }
      this.events.push({
        id: event.id,
        start: new Date(event.start),
        end: new Date(event.end!),
        title: event.title,
        color: event.color,
        allDay: false,
      });
      this.refresh.next();
  }

  onOpen(date: Date) {
    console.log(date);
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.http.get<any>('http://localhost:8080/getEvent?id='+event.id)
    .subscribe(
      (result: any) => {
        const modalRef = this.modalService.open(ViewEventComponent, { size: 'lg' });
        modalRef.componentInstance.event = result;
        modalRef.closed.subscribe(e => {
          window.location.reload();
        });
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  refreshScedule() {
    this.events = new Array();
    
    this.http.get<any>('http://localhost:8080/getEvents?id='+SecurityService.currentUser().id)
    .subscribe(
      (result: any) => {
        result.forEach((e: CalendarEvent<any>) => this.addEvent(e));
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }
}