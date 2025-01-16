import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Appointment } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { AppointmentDetailsComponent } from '../appointment-details/appointment-details.component';

@Component({
  selector: 'app-appointment-list',
  template: `
    <div class="appointment-list-container">
      <div class="header">
        <div class="title-section">
          <h1>Randevularım</h1>
          <div class="search-box">
            <mat-form-field appearance="outline">
              <input matInput [formControl]="searchControl" placeholder="Başlık ile ara">
              <div *ngIf="searchControl.value" class="clear-icon" (click)="clearSearch()">✕</div>
            </mat-form-field>
          </div>
          <button mat-stroked-button class="filter-button" (click)="openCategoryDialog()" matTooltip="Kategori Filtrele">
            <i class="fas fa-filter"></i>
            <span>Filtrele</span>
          </button>
        </div>
        <div class="action-group">
          <button mat-fab extended color="primary" (click)="showAppointmentForm()" class="new-appointment-btn">
            Yeni Randevu Ekle
          </button>
          <button mat-fab extended color="warn" (click)="confirmDeleteAll()" class="delete-all-btn">
            <i class="fas fa-trash-alt"></i>
            Tümünü Sil
          </button>
        </div>
      </div>

      <div *ngIf="activeFilters" class="active-filters">
        <mat-chip-listbox>
          <mat-chip *ngIf="searchControl.value" (removed)="clearSearch()">
            <i class="fas fa-search"></i>
            "{{searchControl.value}}" ile arama
            <button matChipRemove class="chip-remove-button">
              &times;
            </button>
          </mat-chip>
          <mat-chip *ngFor="let category of selectedCategories" (removed)="removeCategory(category)">
            <i class="fas fa-tag"></i>
            {{category}} kategorisi
            <button matChipRemove class="chip-remove-button">
              &times;
            </button>
          </mat-chip>
          <mat-chip *ngIf="sortBy && sortBy !== 'nearest'" (removed)="clearSort()">
            <i class="fas fa-sort-amount-down"></i>
            {{getSortLabel()}}
            <button matChipRemove class="chip-remove-button">
              &times;
            </button>
          </mat-chip>
        </mat-chip-listbox>
      </div>

      <mat-table [dataSource]="filteredAppointments$" class="mat-elevation-z8">
        <ng-container matColumnDef="title">
          <mat-header-cell *matHeaderCellDef>Başlık</mat-header-cell>
          <mat-cell *matCellDef="let appointment">
            <div class="title-cell" (click)="showAppointmentDetails(appointment)">
              {{appointment.title}}
              <i class="fas fa-info-circle"></i>
            </div>
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="date">
          <mat-header-cell *matHeaderCellDef>Tarih</mat-header-cell>
          <mat-cell *matCellDef="let appointment">{{appointment.date | date:'dd/MM/yyyy'}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="time">
          <mat-header-cell *matHeaderCellDef>Saat</mat-header-cell>
          <mat-cell *matCellDef="let appointment">{{appointment.time}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="category">
          <mat-header-cell *matHeaderCellDef>Kategori</mat-header-cell>
          <mat-cell *matCellDef="let appointment">
            <span class="category-badge" [class]="'category-' + getCategoryClass(appointment.category || 'Genel')">
              {{appointment.category || 'Genel'}}
            </span>
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef>İşlemler</mat-header-cell>
          <mat-cell *matCellDef="let appointment">
            <div class="action-buttons">
              <button mat-stroked-button color="primary" (click)="editAppointment(appointment)" class="action-button" matTooltip="Düzenle">
                <i class="fas fa-edit"></i>
                Düzenle
              </button>
              <button mat-stroked-button color="warn" (click)="confirmDelete(appointment)" class="action-button" matTooltip="Sil">
                <i class="fas fa-trash-alt"></i>
                Sil
              </button>
            </div>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>

        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
            Randevu bulunamadı
          </td>
        </tr>
      </mat-table>
    </div>
  `,
  styleUrls: ['./appointment-list.component.scss'],
  styles: [`
    .title-cell {
      cursor: pointer;
      color: #1976D2;
      transition: color 0.2s ease;

      &:hover {
        color: #1565C0;
        text-decoration: underline;
      }
    }
  `]
})
export class AppointmentListComponent implements OnInit {
  appointments$: Observable<Appointment[]>;
  filteredAppointments$: Observable<Appointment[]>;
  displayedColumns: string[] = ['title', 'date', 'time', 'category', 'actions'];
  searchControl = new FormControl('');
  categoryFilter = new FormControl('');
  categories: string[] = ['İş', 'Kişisel', 'Sağlık', 'Eğitim', 'Diğer'];
  activeFilters = false;
  sortBy: 'nearest' | 'furthest' = 'nearest';
  selectedCategories: string[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog
  ) {
    this.appointments$ = this.appointmentService.getAppointments();
    this.filteredAppointments$ = this.appointments$;
    this.filterAndSortAppointments();
  }

  ngOnInit(): void {
    this.searchControl.valueChanges.subscribe(() => {
      this.filterAndSortAppointments();
    });

    this.categoryFilter.valueChanges.subscribe(() => {
      this.filterAndSortAppointments();
    });
  }

  filterAndSortAppointments(): void {
    this.filteredAppointments$ = this.appointments$.pipe(
      map(appointments => {
        let filtered = appointments.filter(appointment => {
          const searchValue = this.searchControl.value || '';
          const matchesSearch = searchValue === '' || 
            appointment.title.toLowerCase().includes(searchValue.toLowerCase());
          const matchesCategory = this.selectedCategories.length === 0 || 
            (appointment.category && this.selectedCategories.includes(appointment.category));
          return matchesSearch && matchesCategory;
        });

        filtered = filtered.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          const timeA = a.time.split(':').map(Number);
          const timeB = b.time.split(':').map(Number);

          dateA.setHours(timeA[0], timeA[1]);
          dateB.setHours(timeB[0], timeB[1]);

          return this.sortBy === 'nearest' 
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        });

        return filtered;
      })
    );

    this.activeFilters = !!(
      this.searchControl.value || 
      this.selectedCategories.length > 0 || 
      this.sortBy !== 'nearest'
    );
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.filterAndSortAppointments();
  }

  clearCategoryFilter(): void {
    this.selectedCategories = [];
    this.filterAndSortAppointments();
  }

  showAppointmentForm(): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '500px',
      data: { appointment: undefined },
      disableClose: true,
      panelClass: 'appointment-form-dialog',
      enterAnimationDuration: '150ms',
      exitAnimationDuration: '150ms'
    });

    dialogRef.afterClosed().subscribe(appointment => {
      if (appointment) {
        this.appointmentService.addAppointment(appointment);
      }
    });
  }

  editAppointment(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '500px',
      data: { appointment: appointment },
      disableClose: true,
      panelClass: 'appointment-form-dialog',
      enterAnimationDuration: '150ms',
      exitAnimationDuration: '150ms'
    });

    dialogRef.afterClosed().subscribe(updatedAppointment => {
      if (updatedAppointment) {
        this.appointmentService.updateAppointment(updatedAppointment);
      }
    });
  }

  confirmDelete(appointment: Appointment): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '450px',
      data: { title: appointment.title },
      disableClose: true,
      panelClass: 'delete-dialog-container',
      enterAnimationDuration: '150ms',
      exitAnimationDuration: '150ms',
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAppointment(appointment.id.toString());
      }
    });
  }

  deleteAppointment(id: string): void {
    this.appointmentService.deleteAppointment(id);
  }

  openSearchDialog(): void {
    const dialogRef = this.dialog.open(SearchDialogComponent, {
      width: '400px',
      data: { 
        searchTerm: this.searchControl.value
      },
      autoFocus: true,
      panelClass: 'search-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.searchControl.setValue(result);
      }
    });
  }

  openCategoryDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: {
        categories: this.categories,
        selectedCategories: [...this.selectedCategories],
        sortBy: this.sortBy
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedCategories = result.selectedCategories;
        this.sortBy = result.sortBy;
        this.filterAndSortAppointments();
      }
    });
  }

  getSortLabel(): string {
    switch (this.sortBy) {
      case 'nearest':
        return 'En Yakın Tarih';
      case 'furthest':
        return 'En Uzak Tarih';
      default:
        return '';
    }
  }

  clearSort(): void {
    this.sortBy = 'nearest';
    this.filterAndSortAppointments();
  }

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
        return 'general';
    }
  }

  confirmDeleteAll(): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '450px',
      data: { title: 'tüm randevuları', isAll: true },
      disableClose: true,
      panelClass: 'delete-dialog-container',
      enterAnimationDuration: '150ms',
      exitAnimationDuration: '150ms',
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAllAppointments();
      }
    });
  }

  deleteAllAppointments(): void {
    this.appointmentService.deleteAllAppointments();
  }

  getSelectedCategoriesLabel(): string {
    if (this.selectedCategories.length === 0) return '';
    if (this.selectedCategories.length === 1) return `${this.selectedCategories[0]} kategorisi`;
    return `${this.selectedCategories.length} kategori seçili`;
  }

  removeCategory(category: string): void {
    this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    this.filterAndSortAppointments();
  }

  showAppointmentDetails(appointment: any): void {
    this.dialog.open(AppointmentDetailsComponent, {
      width: '500px',
      data: appointment,
      panelClass: 'appointment-details-dialog'
    });
  }
}
