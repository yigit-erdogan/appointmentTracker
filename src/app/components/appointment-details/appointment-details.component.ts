import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-details',
  template: `
    <h2 mat-dialog-title>Randevu Detayları</h2>
    
    <mat-dialog-content>
      <div class="details-container">
        <div class="detail-row">
          <span class="label">Başlık:</span>
          <span class="value">{{ data.title }}</span>
        </div>
        
        <div class="detail-row">
          <span class="label">Tarih:</span>
          <span class="value">{{ data.date | date:'dd/MM/yyyy' }}</span>
        </div>
        
        <div class="detail-row">
          <span class="label">Saat:</span>
          <span class="value">{{ data.time }}</span>
        </div>
        
        <div class="detail-row">
          <span class="label">Kategori:</span>
          <span class="value">{{ data.category || 'Genel' }}</span>
        </div>

        <div class="detail-row">
          <span class="label">Durum:</span>
          <span class="value status-badge" [class]="'status-' + data.status">
            {{ getStatusText(data.status) }}
          </span>
        </div>
        
        <div class="detail-row" *ngIf="data.notes">
          <span class="label">Notlar:</span>
          <span class="value notes">{{ data.notes }}</span>
        </div>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Kapat</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .details-container {
      min-width: 300px;
      padding: 16px;
    }

    .detail-row {
      display: flex;
      margin-bottom: 16px;
      align-items: flex-start;

      .label {
        font-weight: 500;
        min-width: 100px;
        color: #666;
      }

      .value {
        flex: 1;
        
        &.notes {
          white-space: pre-wrap;
        }
      }
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
  `]
})
export class AppointmentDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Appointment) {}

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Bekliyor';
      case 'approved': return 'Onaylandı';
      case 'rejected': return 'Reddedildi';
      default: return status;
    }
  }
} 