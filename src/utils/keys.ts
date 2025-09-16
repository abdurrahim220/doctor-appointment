
const REDIS_PREFIX = "myapp:";
export const userKeyById = (id: string): string => {
  return `${REDIS_PREFIX}user:${id}`;
};
export const allUsersZSet = (): string => {
  return `${REDIS_PREFIX}users:zset`;
};
export const patientProfileKeyById = (id: string): string => {
  return `${REDIS_PREFIX}patientProfile:${id}`;
};
export const allPatientProfilesZSet = (): string => {
  return `${REDIS_PREFIX}patientProfiles:zset`;
};

export const doctorProfileKeyById = (id: string): string => {
  return `${REDIS_PREFIX}doctorProfile:${id}`;
};
export const allDoctorProfilesZSet = (): string => {
  return `${REDIS_PREFIX}doctorProfiles:zset`;
};

export const nurseProfileKeyById = (id: string): string => {
  return `${REDIS_PREFIX}nurseProfile:${id}`;
};
export const allNurseProfilesZSet = (): string => {
  return `${REDIS_PREFIX}nurseProfiles:zset`;
};


export const clinicKeyById = (id: string): string => {
  return `${REDIS_PREFIX}clinic:${id}`;
};
export const allClinicZSet = (): string => {
  return `${REDIS_PREFIX}clinic:zset`;
};


export const clinicDoctorKeyById = (id: string): string => {
  return `${REDIS_PREFIX}clinicDoctor:${id}`;
};
export const allClinicDoctorZSet = (): string => {
  return `${REDIS_PREFIX}clinicDoctor:zset`;
};
export const clinicNurseKeyById = (id: string): string => {
  return `${REDIS_PREFIX}clinicNurse:${id}`;
};
export const allClinicNurseZSet = (): string => {
  return `${REDIS_PREFIX}clinicNurse:zset`;
};
