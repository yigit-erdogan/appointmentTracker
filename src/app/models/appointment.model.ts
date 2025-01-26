export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  category?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  userId: string;
}

export type AppointmentCategory = 'Doktor' | 'Toplantı' | 'Kişisel' | string; 