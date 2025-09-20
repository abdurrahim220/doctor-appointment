import { AppointmentStatus, ScheduleType } from "../../types/schema.types";

export type IAppointment = {
  id: string;
  date: string;
  status: AppointmentStatus;
  notes?: string;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  clinicId: string;
  scheduleType: ScheduleType;
  createdAt: Date;
  updatedAt: Date;
};

export type IMedicalRecord = {
  id: string;
  patientId: string;
  appointmentId?: string;
  diagnosis?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};
