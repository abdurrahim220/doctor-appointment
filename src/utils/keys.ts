
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