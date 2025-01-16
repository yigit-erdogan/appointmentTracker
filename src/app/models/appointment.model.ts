export interface Appointment {
  id: string;
  title: string;
  date: Date;
  time: string;
  notes?: string;
  category?: string;
  location?: string;
}

export type AppointmentCategory = 'Doktor' | 'Toplantı' | 'Kişisel' | string; 