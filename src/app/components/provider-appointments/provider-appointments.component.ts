import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Appointment } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-provider-appointments',
  template: `
    <div class="provider-appointments-container">
      <h1>Randevu Talepleri</h1>

      <div class="appointments-table" *ngIf="appointments$ | async as appointments">
        <table mat-table [dataSource]="appointments" class="mat-elevation-z8">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Başlık</th>
            <td mat-cell *matCellDef="let appointment">{{appointment.title}}</td>
          </ng-container>

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Tarih</th>
            <td mat-cell *matCellDef="let appointment">{{appointment.date | date:'dd/MM/yyyy'}}</td>
          </ng-container>

          <ng-container matColumnDef="time">
            <th mat-header-cell *matHeaderCellDef>Saat</th>
            <td mat-cell *matCellDef="let appointment">{{appointment.time}}</td>
          </ng-container>

          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Kategori</th>
            <td mat-cell *matCellDef="let appointment">
              <span class="category-badge">{{appointment.category || 'Genel'}}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Durum</th>
            <td mat-cell *matCellDef="let appointment">
              <span class="status-badge" [class]="'status-' + appointment.status">
                {{getStatusText(appointment.status)}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>İşlemler</th>
            <td mat-cell *matCellDef="let appointment">
              <ng-container *ngIf="appointment.status === 'pending'">
                <button mat-icon-button color="primary" (click)="approveAppointment(appointment)">
                  <mat-icon>check_circle</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="rejectAppointment(appointment)">
                  <mat-icon>cancel</mat-icon>
                </button>
              </ng-container>
              <span *ngIf="appointment.status !== 'pending'" class="processed-text">
                İşlem yapıldı
              </span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell no-data-message" [attr.colspan]="displayedColumns.length">
              Randevu talebi bulunamadı
            </td>
          </tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .provider-appointments-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;

      h1 {
        margin: 0 0 20px 0;
        font-size: 24px;
        color: #333;
      }
    }

    .appointments-table {
      table {
        width: 100%;
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;

        th {
          background: #f5f5f5;
          color: #333;
          font-weight: 500;
          padding: 12px 16px;
        }

        td {
          padding: 12px 16px;
        }
      }
    }

    .category-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      background-color: #e0e0e0;
      color: #333;
      font-size: 12px;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;

      &.status-pending {
        background-color: #fff3e0;
        color: #e65100;
      }

      &.status-approved {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      &.status-rejected {
        background-color: #ffebee;
        color: #c62828;
      }
    }

    .processed-text {
      color: #666;
      font-size: 14px;
      font-style: italic;
    }

    .no-data-message {
      text-align: center;
      padding: 20px;
      color: #666;
    }
  `]
})
export class ProviderAppointmentsComponent implements OnInit {
  appointments$: Observable<Appointment[]>;
  displayedColumns: string[] = ['title', 'date', 'time', 'category', 'status', 'actions'];

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.appointments$ = this.appointmentService.getAllAppointments();
  }

  ngOnInit(): void {
    // Component başladığında randevuları yükle
    this.refreshAppointments();
  }

  refreshAppointments(): void {
    this.appointments$ = this.appointmentService.getAllAppointments();
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Bekliyor';
      case 'approved': return 'Onaylandı';
      case 'rejected': return 'Reddedildi';
      default: return status;
    }
  }

  approveAppointment(appointment: Appointment): void {
    this.appointmentService.updateAppointmentStatus(appointment.id, appointment.userId, 'approved');
    this.snackBar.open('Randevu onaylandı', 'Tamam', { duration: 3000 });
    // Listeyi yenile
    this.refreshAppointments();
  }

  rejectAppointment(appointment: Appointment): void {
    this.appointmentService.updateAppointmentStatus(appointment.id, appointment.userId, 'rejected');
    this.snackBar.open('Randevu reddedildi', 'Tamam', { duration: 3000 });
    // Listeyi yenile
    this.refreshAppointments();
  }
} 