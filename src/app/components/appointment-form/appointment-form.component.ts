import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  isEditMode = false;
  categories = ['İş', 'Kişisel', 'Sağlık', 'Eğitim', 'Diğer'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { appointment?: Appointment }
  ) {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    this.appointmentForm = this.fb.group({
      title: ['', Validators.required],
      date: [formattedDate, Validators.required],
      time: ['12:00', Validators.required],
      category: [''],
      location: [''],
      notes: ['']
    });

    if (data?.appointment) {
      this.isEditMode = true;
      this.appointmentForm.patchValue({
        ...data.appointment,
        date: data.appointment.date
      });
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      
      if (this.isEditMode && this.data?.appointment) {
        this.dialogRef.close({
          ...formValue,
          id: this.data.appointment.id
        });
      } else {
        this.dialogRef.close(formValue);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 