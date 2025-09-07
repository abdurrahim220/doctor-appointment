import { ProfileStatus, Specialty } from '@prisma/client';

export const patientProfiles = [
  {
    id: 'patient-profile-1',
    userId: 'user-patient-1',
    dateOfBirth: new Date('1990-05-15'),
    status: ProfileStatus.ACTIVE,
  },
];

export const doctorProfiles = [
  {
    id: 'doctor-profile-1',
    userId: 'user-doctor-1',
    specialty: Specialty.CARDIOLOGY,
    licenseNumber: 'MD123456',
    status: ProfileStatus.ACTIVE,
  },
];

export const nurseProfiles = [
  {
    id: 'nurse-profile-1',
    userId: 'user-nurse-1',
    licenseNumber: 'RN654321',
    status: ProfileStatus.ACTIVE,
  },
];