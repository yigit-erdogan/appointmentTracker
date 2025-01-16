import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  template: `
    <div class="delete-dialog">
      <div class="dialog-content">
        <div class="text-content">
          <h2>{{data.isAll ? 'Tüm Randevular Silinecek' : 'Randevu Silinecek'}}</h2>
          <p class="appointment-title">{{data.title}}</p>
          <p class="confirmation-text">
            {{data.isAll ? 'Tüm randevularınızı silmek istediğinize emin misiniz?' : 'Bu randevuyu silmek istediğinize emin misiniz?'}}
          </p>
        </div>

        <div class="button-container">
          <button mat-flat-button class="confirm-button" (click)="onConfirm()">
            {{data.isAll ? 'Tümünü Sil' : 'Sil'}}
          </button>
          <button mat-stroked-button class="cancel-button" (click)="onCancel()">
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .delete-dialog {
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    }

    .dialog-content {
      padding: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .warning-circle {
      width: 48px;
      height: 48px;
      background: linear-gradient(45deg, #ff5252, #f44336);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2);

      mat-icon {
        color: white;
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
    }

    .text-content {
      margin-bottom: 32px;

      h2 {
        color: #333;
        font-size: 24px;
        font-weight: 500;
        margin: 0 0 20px 0;
      }

      .appointment-title {
        color: #f44336;
        font-size: 18px;
        font-weight: 500;
        margin: 0 0 20px 0;
        padding: 12px 24px;
        background: linear-gradient(to right, #ffebee, #ffcdd2);
        border-radius: 12px;
        display: inline-block;
        box-shadow: 0 2px 8px rgba(244, 67, 54, 0.1);
      }

      .confirmation-text {
        color: #666;
        font-size: 16px;
        margin: 0;
        line-height: 1.5;
      }
    }

    .button-container {
      display: flex;
      gap: 16px;

      button {
        min-width: 120px;
        padding: 8px 32px;
        font-weight: 500;
        border-radius: 12px;
        transition: all 0.2s ease;
      }

      .cancel-button {
        border: 2px solid #e0e0e0;
        color: #666;

        &:hover {
          background: #f5f5f5;
          border-color: #d5d5d5;
        }
      }

      .confirm-button {
        background: linear-gradient(45deg, #ff5252, #f44336);
        color: white;
        border: none;
        box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2);

        &:hover {
          box-shadow: 0 6px 16px rgba(244, 67, 54, 0.3);
          transform: translateY(-1px);
        }
      }
    }
  `]
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      title: string,
      isAll?: boolean
    }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
} 