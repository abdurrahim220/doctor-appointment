import { Gender, ProfileStatus, Role, Specialty } from "../../types/schema.types";
import { IPost } from "../post/post.interface";

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  gender: Gender;
  posts?: IPost[];
  patientProfile?: IPatientProfile;
  doctorProfile?: IDoctorProfile;
  nurseProfile?: INurseProfile;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IPatientProfile = {
  id?: string;
  userId: string;
  dateOfBirth: string;
  status?: ProfileStatus;
};

export type IDoctorProfile = {
  id?: string;
  userId: string;
  specialty: Specialty;
  licenseNumber: string;
  status?: ProfileStatus;
  // schedules?: Schedule[];
  // appointments?: Appointment[];
  // clinics?: ClinicDoctor[];
};

export type INurseProfile = {
  id?: string;
  userId: string;
  profileStatus: ProfileStatus;
  licenseNumber: string;
  status: ProfileStatus;
};





