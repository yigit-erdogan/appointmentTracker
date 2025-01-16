import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-dialog',
  template: `
    <div class="search-dialog">
      <h2 mat-dialog-title>Randevu Ara</h2>
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Başlık ile ara</mat-label>
          <input matInput [formControl]="searchControl" placeholder="Arama yapın...">
          <button *ngIf="searchControl.value" matSuffix mat-icon-button (click)="clearSearch()">
            <i class="fas fa-times"></i>
          </button>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="cancel()">İptal</button>
        <button mat-raised-button color="primary" (click)="search()">
          <i class="fas fa-search"></i> Ara
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .search-dialog {
      padding: 20px;
    }
    .search-field {
      width: 100%;
    }
    mat-dialog-actions {
      margin-bottom: -8px;
    }
  `]
})
export class SearchDialogComponent {
  searchControl = new FormControl(this.data.searchTerm || '');

  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { searchTerm: string }
  ) {}

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  search(): void {
    this.dialogRef.close(this.searchControl.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
} 