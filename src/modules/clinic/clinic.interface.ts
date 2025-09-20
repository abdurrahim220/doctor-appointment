
export type IClinic = {
  id: string;
  userId: string;
  name: string;
  address: string;
  doctors: IClinicDoctor[];
  nurses: IClinicNurse[];
  createdAt: Date;
  updatedAt: Date;
};

export type IClinicDoctor = {
  id: string;
  clinicId: string;
  doctorId: string;
};

export type IClinicNurse = {
  id: string;
  clinicId: string;
  nurseId: string;
};
