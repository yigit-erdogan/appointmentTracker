import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-appointment-details',
  template: `
    <div class="appointment-details">
      <h2 mat-dialog-title>Randevu Detayları</h2>
      <mat-dialog-content>
        <div class="detail-section">
          <div class="detail-item">
            <label>Başlık:</label>
            <span>{{data.title}}</span>
          </div>
          <div class="detail-item">
            <label>Tarih:</label>
            <span>{{data.date | date:'dd/MM/yyyy'}}</span>
          </div>
          <div class="detail-item">
            <label>Saat:</label>
            <span>{{data.time}}</span>
          </div>
          <div class="detail-item">
            <label>Kategori:</label>
            <span class="category-badge" [class]="'category-' + getCategoryClass(data.category || 'Genel')">
              {{data.category || 'Genel'}}
            </span>
          </div>
          <div class="detail-item notes-section">
            <label>Notlar:</label>
            <p *ngIf="data.notes" class="notes">{{data.notes}}</p>
            <p *ngIf="!data.notes" class="no-notes">Bu randevu için not bulunmamaktadır.</p>
          </div>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="close()">Kapat</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .appointment-details {
      padding: 20px;
      max-width: 500px;
    }

    .detail-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .detail-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;

      label {
        min-width: 80px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.54);
      }

      span {
        color: rgba(0, 0, 0, 0.87);
      }
    }

    .notes-section {
      margin-top: 8px;
      
      label {
        margin-bottom: 8px;
      }

      .notes {
        margin: 0;
        white-space: pre-line;
        line-height: 1.5;
      }

      .no-notes {
        margin: 0;
        color: rgba(0, 0, 0, 0.38);
        font-style: italic;
      }
    }

    .category-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
    }

    .category-is {
      background-color: #1E88E5;
      color: white;
    }

    .category-kisisel {
      background-color: #7B1FA2;
      color: white;
    }

    .category-saglik {
      background-color: #43A047;
      color: white;
    }

    .category-egitim {
      background-color: #FB8C00;
      color: white;
    }

    .category-diger {
      background-color: #757575;
      color: white;
    }

    .category-genel {
      background-color: #ECEFF1;
      color: #455A64;
    }
  `]
})
export class AppointmentDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<AppointmentDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  getCategoryClass(category: string): string {
    switch (category) {
      case 'İş':
        return 'is';
      case 'Kişisel':
        return 'kisisel';
      case 'Sağlık':
        return 'saglik';
      case 'Eğitim':
        return 'egitim';
      case 'Diğer':
        return 'diger';
      default:
        return 'genel';
    }
  }

  close(): void {
    this.dialogRef.close();
  }
} 