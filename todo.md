
export const createAppointment = async (payload: IAppointment) => {
  const redisClient = await initializeRedisClient();

  // 🛑 Step 1: Prevent duplicate appointment for same patient/clinic
  const bloomKey = `${payload.clinicId}:${payload.patientId}`;
  const exists = await redisClient.sendCommand(["BF.EXISTS", bloomFiltersKey, bloomKey]);
  if (exists) {
    throw new AppError("Appointment already exists", status.CONFLICT);
  }

  // 🗓 Step 2: Get day of week from appointment date
  const appointmentTime = new Date(payload.date);
  const dayOfWeek = dayMap[appointmentTime.getDay()];

  // 🕒 Step 3: Find schedule
  const schedule = await prisma.schedule.findFirst({
    where: {
      doctorId: payload.doctorId,
      clinicId: payload.clinicId,
      isAvailable: true,
      dayOfWeek: { has: dayOfWeek },
    },
  });

  if (!schedule) {
    throw new AppError("No valid schedule found for this doctor", status.NOT_FOUND);
  }

  // Validate time range
  const scheduleDate = appointmentTime.toISOString().split("T")[0];
  const scheduleStart = new Date(`${scheduleDate}T${schedule.startTime}`);
  const scheduleEnd = new Date(`${scheduleDate}T${schedule.endTime}`);

  if (appointmentTime < scheduleStart || appointmentTime >= scheduleEnd) {
    throw new AppError("Appointment time is not within the schedule", status.BAD_REQUEST);
  }

  // Validate slot duration
  const minutesDiff = Math.floor(
    (appointmentTime.getTime() - scheduleStart.getTime()) / (1000 * 60),
  );
  if (minutesDiff % schedule.slotDuration !== 0) {
    throw new AppError("Appointment time is not on the slot duration", status.BAD_REQUEST);
  }

  // 🔄 Step 4: Transaction (appointment + schedule + notification)
  const appointment = await prisma.$transaction(async (tx) => {
    // Count existing appointments in this schedule slot
    const countAppointments = await tx.appointment.count({
      where: {
        doctorId: payload.doctorId,
        clinicId: payload.clinicId,
        date: { gte: scheduleStart, lt: scheduleEnd },
      },
    });

    if (countAppointments >= schedule.maxPatients) {
      throw new AppError("This schedule has reached its max patient capacity", status.CONFLICT);
    }

    // Create appointment
    const newAppointment = await tx.appointment.create({
      data: {
        ...payload,
        date: appointmentTime.toISOString(),
      },
    });

    // Update schedule capacity
    await tx.schedule.update({
      where: { id: schedule.id },
      data: { maxPatients: { decrement: 1 } },
    });

    // Create notification (example: doctor gets notified)
    await tx.notification.create({
      data: {
        userId: payload.doctorId,
        type: "APPOINTMENT_CREATED",
        message: `You have a new appointment with patient ${payload.patientId} on ${appointmentTime.toLocaleString()}`,
        metadata: {
          appointmentId: newAppointment.id,
          clinicId: payload.clinicId,
          patientId: payload.patientId,
        },
      },
    });

    return newAppointment;
  });

  // 🗄 Step 5: Cache in Redis
  await redisClient.set(appointmentKeyById(appointment.id), JSON.stringify(appointment), {
    EX: 60 * 60 * 24,
  });

  await redisClient.zAdd(allAppointmentZSet(), {
    score: appointmentTime.getTime(),
    value: appointment.id,
  });

  await redisClient.sendCommand(["BF.ADD", bloomFiltersKey, bloomKey]);

  return appointment;
};
