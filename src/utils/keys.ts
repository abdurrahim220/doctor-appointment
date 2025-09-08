const REDIS_PREFIX = "myapp:";

export const userKeyById = (id: string): string => {
  return `${REDIS_PREFIX}user:${id}`;
};

export const allUsers = (): string => {
  return `${REDIS_PREFIX}users:all`;
};

export const patientProfileKeyById = (id: string): string => {
  return `${REDIS_PREFIX}patientProfile:${id}`;
};

export const allPatientProfiles = (): string => {
  return `${REDIS_PREFIX}patientProfiles:all`;
};