export const schedules = [
  {
    id: 'schedule-1',
    doctorId: 'doctor-profile-1',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    endTime: new Date(Date.now() + 25 * 60 * 60 * 1000), // Tomorrow + 1 hour
    isAvailable: true,
  },
  {
    id: 'schedule-2',
    doctorId: 'doctor-profile-1',
    startTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
    endTime: new Date(Date.now() + 49 * 60 * 60 * 1000), // Day after tomorrow + 1 hour
    isAvailable: false,
  },
];