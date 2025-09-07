import { AppointmentStatus, ScheduleType } from '@prisma/client';

export const appointments = [
  {
    id: 'appointment-1',
    date: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
    status: AppointmentStatus.BOOKED,
    notes: 'Regular checkup',
    patientId: 'patient-profile-1',
    doctorId: 'doctor-profile-1',
    scheduleId: 'schedule-2',
    clinicId: 'clinic-1',
    scheduleType: ScheduleType.BOOKED,
  },
];