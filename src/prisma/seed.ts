
import { users } from './seedData/users';

import { clinics, clinicDoctors } from './seedData/clinics';
import { schedules } from './seedData/schedules';
import { appointments } from './seedData/appointments';
import { medicalRecords } from './seedData/medicalRecords';
import { reviews } from './seedData/reviews';
import logger from '../utils/logger';
import prisma from './client';
import { doctorProfiles, nurseProfiles, patientProfiles } from './seedData/allProfiles';

async function main() {
  logger.info('🌱 Starting seed process...');

  // Clean up existing data (be careful with this in production!)
  await prisma.medicalRecord.deleteMany();
  await prisma.review.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.clinicDoctor.deleteMany();
  await prisma.clinic.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.nurseProfile.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  logger.info('🧹 Cleaned up existing data');

  // Create users
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }
  logger.info(`👥 Created ${users.length} users`);

  // Create profiles
  for (const profile of patientProfiles) {
    await prisma.patientProfile.upsert({
      where: { id: profile.id },
      update: profile,
      create: profile,
    });
  }
  logger.info(`👤 Created ${patientProfiles.length} patient profiles`);

  for (const profile of doctorProfiles) {
    await prisma.doctorProfile.upsert({
      where: { id: profile.id },
      update: profile,
      create: profile,
    });
  }
  logger.info(`👨‍⚕️ Created ${doctorProfiles.length} doctor profiles`);

  for (const profile of nurseProfiles) {
    await prisma.nurseProfile.upsert({
      where: { id: profile.id },
      update: profile,
      create: profile,
    });
  }
  logger.info(`👩‍⚕️ Created ${nurseProfiles.length} nurse profiles`);

  // Create clinics
  for (const clinic of clinics) {
    await prisma.clinic.upsert({
      where: { id: clinic.id },
      update: clinic,
      create: clinic,
    });
  }
  logger.info(`🏥 Created ${clinics.length} clinics`);

  // Create clinic doctors
  for (const clinicDoctor of clinicDoctors) {
    await prisma.clinicDoctor.upsert({
      where: { id: clinicDoctor.id },
      update: clinicDoctor,
      create: clinicDoctor,
    });
  }
  logger.info(`🔗 Created ${clinicDoctors.length} clinic doctor relationships`);

  // Create schedules
  for (const schedule of schedules) {
    await prisma.schedule.upsert({
      where: { id: schedule.id },
      update: schedule,
      create: schedule,
    });
  }
  logger.info(`📅 Created ${schedules.length} schedules`);

  // Create appointments
  for (const appointment of appointments) {
    await prisma.appointment.upsert({
      where: { id: appointment.id },
      update: appointment,
      create: appointment,
    });
  }
  logger.info(`📋 Created ${appointments.length} appointments`);

  // Create medical records
  for (const medicalRecord of medicalRecords) {
    await prisma.medicalRecord.upsert({
      where: { id: medicalRecord.id },
      update: medicalRecord,
      create: medicalRecord,
    });
  }
  logger.info(`📋 Created ${medicalRecords.length} medical records`);

  // Create reviews
  for (const review of reviews) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: review,
      create: review,
    });
  }
  logger.info(`⭐ Created ${reviews.length} reviews`);

  logger.info('🌱 Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    logger.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });