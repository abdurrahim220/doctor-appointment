import { Gender, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
const saltRounds = 10;


export const users = [
  {
    id: 'user-admin-1',
    email: 'admin@healthcare.com',
    name: 'System Administrator',
    phone: '+1234567890',
    role: Role.ADMIN,
    gender: Gender.MALE,
    password: bcrypt.hashSync('password123', saltRounds),
    isActive: true,
    isDeleted: false,
  },

  {
    id: 'user-doctor-1',
    email: 'dr.smith@healthcare.com',
    name: 'Dr. John Smith',
    phone: '+1234567891',
    role: Role.DOCTOR,
    gender: Gender.MALE,
    password: bcrypt.hashSync('password123', saltRounds),
    isActive: true,
    isDeleted: false,
  },
  {
    id: 'user-patient-1',
    email: 'patient.jane@email.com',
    name: 'Jane Doe',
    phone: '+1234567892',
    role: Role.PATIENT,
    gender: Gender.FEMALE,
    password: bcrypt.hashSync('password123', saltRounds),
    isActive: true,
    isDeleted: false,
  },
  {
    id: 'user-nurse-1',
    email: 'nurse.mary@healthcare.com',
    name: 'Mary Johnson',
    phone: '+1234567893',
    role: Role.NURSE,
    gender: Gender.FEMALE,
    password: bcrypt.hashSync('password123', saltRounds),
    isActive: true,
    isDeleted: false,
  },
];
