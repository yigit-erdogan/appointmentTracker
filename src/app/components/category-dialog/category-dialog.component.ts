import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-category-dialog',
  template: `
    <div class="category-dialog">
      <h2 mat-dialog-title>Filtrele</h2>
      <mat-dialog-content>
        <div class="filter-section">
          <h3>Tarih Sıralaması</h3>
          <div class="sort-list">
            <div class="sort-item" 
                 (click)="selectSort('nearest')"
                 [class.selected]="data.sortBy === 'nearest'">
              <i class="fas fa-clock"></i>
              <span>En Yakın Tarih</span>
              <i *ngIf="data.sortBy === 'nearest'" class="fas fa-check text-success"></i>
            </div>
            <div class="sort-item" 
                 (click)="selectSort('furthest')"
                 [class.selected]="data.sortBy === 'furthest'">
              <i class="fas fa-calendar"></i>
              <span>En Uzak Tarih</span>
              <i *ngIf="data.sortBy === 'furthest'" class="fas fa-check text-success"></i>
            </div>
          </div>
        </div>

        <div class="filter-section">
          <h3>Kategoriler</h3>
          <div class="category-list">
            <div class="category-item all-category" 
                 (click)="selectAllCategories()"
                 [class.selected]="data.selectedCategories.length === 0">
              <i class="fas fa-list"></i>
              <span>Tümü</span>
              <i *ngIf="data.selectedCategories.length === 0" class="fas fa-check text-success"></i>
            </div>
            <div *ngFor="let category of data.categories" 
                class="category-item"
                [class]="getCategoryClass(category)"
                [class.selected]="isSelected(category)"
                (click)="toggleCategory(category)">
              <i class="fas fa-tag"></i>
              <span>{{category}}</span>
              <i *ngIf="isSelected(category)" class="fas fa-check text-success"></i>
            </div>
          </div>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="cancel()">İptal</button>
        <button mat-raised-button color="primary" (click)="apply()">Uygula</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .category-dialog {
      padding: 20px;
    }
    .filter-section {
      margin-bottom: 24px;

      h3 {
        margin: 0 0 12px 0;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.87);
        font-weight: 500;
      }
    }
    .category-list, .sort-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .category-item, .sort-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0);
        transition: background-color 0.2s ease;
      }

      &:hover::before {
        background-color: rgba(0, 0, 0, 0.04);
      }

      &.selected {
        &::before {
          background-color: rgba(0, 0, 0, 0.08);
        }
        transform: scale(1.02);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      i {
        font-size: 16px;
        color: inherit;
        transition: color 0.2s ease;
        position: relative;
        z-index: 1;
        
        &.text-success {
          color: #4caf50;
        }
      }

      span {
        flex: 1;
        font-size: 14px;
        color: inherit;
        position: relative;
        z-index: 1;
      }
    }

    .sort-item {
      background-color: #f5f5f5;
      color: rgba(0, 0, 0, 0.87);

      &.selected {
        background-color: #e0e0e0;
      }
    }

    .all-category {
      background-color: #ECEFF1;
      color: #455A64;
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
  `]
})
export class CategoryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      categories: string[],
      selectedCategories: string[],
      sortBy: 'nearest' | 'furthest'
    }
  ) {
    if (!this.data.sortBy) {
      this.data.sortBy = 'nearest';
    }
    if (!this.data.selectedCategories) {
      this.data.selectedCategories = [];
    }
  }

  getCategoryClass(category: string): string {
    switch (category) {
      case 'İş':
        return 'category-is';
      case 'Kişisel':
        return 'category-kisisel';
      case 'Sağlık':
        return 'category-saglik';
      case 'Eğitim':
        return 'category-egitim';
      case 'Diğer':
        return 'category-diger';
      default:
        return 'all-category';
    }
  }

  isSelected(category: string): boolean {
    return this.data.selectedCategories.includes(category);
  }

  toggleCategory(category: string): void {
    const index = this.data.selectedCategories.indexOf(category);
    if (index === -1) {
      this.data.selectedCategories.push(category);
    } else {
      this.data.selectedCategories.splice(index, 1);
    }
  }

  selectAllCategories(): void {
    this.data.selectedCategories = [];
  }

  selectSort(sort: 'nearest' | 'furthest'): void {
    this.data.sortBy = sort;
  }

  apply(): void {
    this.dialogRef.close(this.data);
  }

  cancel(): void {
    this.dialogRef.close();
  }
} 