import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  private userAppointments: { [userId: string]: Appointment[] } = {};

  constructor(private authService: AuthService) {
    this.loadAppointments();
  }

  private loadAppointments(): void {
    const savedAppointments = localStorage.getItem('userAppointments');
    if (savedAppointments) {
      this.userAppointments = JSON.parse(savedAppointments);
      this.updateCurrentUserAppointments();
    }
  }

  private saveAppointments(): void {
    localStorage.setItem('userAppointments', JSON.stringify(this.userAppointments));
    this.updateCurrentUserAppointments();
  }

  private updateCurrentUserAppointments(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const userAppointments = this.userAppointments[currentUser.id] || [];
      this.appointmentsSubject.next(userAppointments);
    } else {
      this.appointmentsSubject.next([]);
    }
  }

  getAppointments(): Observable<Appointment[]> {
    this.updateCurrentUserAppointments();
    return this.appointmentsSubject.asObservable();
  }

  addAppointment(appointment: Omit<Appointment, 'id' | 'status' | 'userId'>): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      if (!this.userAppointments[currentUser.id]) {
        this.userAppointments[currentUser.id] = [];
      }
      this.userAppointments[currentUser.id].push({
        ...appointment,
        id: Date.now().toString(),
        status: 'pending',
        userId: currentUser.id
      });
      this.saveAppointments();
    }
  }

  updateAppointment(appointment: Appointment): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const userAppointments = this.userAppointments[currentUser.id] || [];
      const index = userAppointments.findIndex(a => a.id === appointment.id);
      if (index !== -1) {
        userAppointments[index] = appointment;
        this.userAppointments[currentUser.id] = userAppointments;
        this.saveAppointments();
      }
    }
  }

  updateAppointmentStatus(appointmentId: string, userId: string, status: 'approved' | 'rejected'): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.role === 'provider') {
      const userAppointments = this.userAppointments[userId] || [];
      const index = userAppointments.findIndex(a => a.id === appointmentId);
      if (index !== -1) {
        userAppointments[index] = {
          ...userAppointments[index],
          status
        };
        this.userAppointments[userId] = userAppointments;
        this.saveAppointments();
      }
    }
  }

  deleteAppointment(id: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const userAppointments = this.userAppointments[currentUser.id] || [];
      this.userAppointments[currentUser.id] = userAppointments.filter(a => a.id !== id);
      this.saveAppointments();
    }
  }

  deleteAllAppointments(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userAppointments[currentUser.id] = [];
      this.saveAppointments();
    }
  }

  getAppointmentById(id: string): Appointment | undefined {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const userAppointments = this.userAppointments[currentUser.id] || [];
      return userAppointments.find(a => a.id === id);
    }
    return undefined;
  }

  // Hizmet sağlayıcılar için tüm randevuları getir
  getAllAppointments(): Observable<Appointment[]> {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.role === 'provider') {
      const allAppointments = Object.values(this.userAppointments)
        .flat()
        .sort((a, b) => {
          // Önce bekleyen randevular
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          
          // Sonra tarihe göre sırala
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });
      this.appointmentsSubject.next(allAppointments);
    } else {
      this.updateCurrentUserAppointments();
    }
    return this.appointmentsSubject.asObservable();
  }
} 