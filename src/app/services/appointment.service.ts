import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private STORAGE_KEY = 'appointments';
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  appointments$ = this.appointmentsSubject.asObservable();

  constructor() {
    this.loadAppointments();
  }

  private loadAppointments(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const appointments = JSON.parse(stored).map((app: any) => ({
        ...app,
        date: new Date(app.date)
      }));
      this.appointmentsSubject.next(appointments);
    }
  }

  private saveAppointments(appointments: Appointment[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(appointments));
    this.appointmentsSubject.next(appointments);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointments$;
  }

  addAppointment(appointment: Omit<Appointment, 'id'>): void {
    const appointments = this.appointmentsSubject.value;
    const newAppointment = {
      ...appointment,
      id: Date.now().toString()
    };
    this.saveAppointments([...appointments, newAppointment]);
  }

  updateAppointment(appointment: Appointment): void {
    const appointments = this.appointmentsSubject.value;
    const index = appointments.findIndex(a => a.id === appointment.id);
    if (index !== -1) {
      appointments[index] = appointment;
      this.saveAppointments(appointments);
    }
  }

  deleteAppointment(id: string): void {
    const appointments = this.appointmentsSubject.value;
    this.saveAppointments(appointments.filter(a => a.id !== id));
  }

  deleteAllAppointments(): void {
    this.saveAppointments([]);
  }

  getAppointmentById(id: string): Appointment | undefined {
    return this.appointmentsSubject.value.find(a => a.id === id);
  }
} 