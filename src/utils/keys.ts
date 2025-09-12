// src/utils/keys.ts
const REDIS_PREFIX = "myapp:";

/**
 * Single-user key.
 * Always store a single user object as a JSON string (String type).
 */
export const userKeyById = (id: string): string => {
  return `${REDIS_PREFIX}user:${id}`;
};

/**
 * All users (for pagination).
 * Always stored as a Redis ZSET with scores = createdAt timestamps.
 */
export const allUsersZSet = (): string => {
  return `${REDIS_PREFIX}users:zset`;
};

/**
 * Patient profile single key.
 */
export const patientProfileKeyById = (id: string): string => {
  return `${REDIS_PREFIX}patientProfile:${id}`;
};

/**
 * Patient profiles (for pagination).
 * Same strategy as users.
 */
export const allPatientProfilesZSet = (): string => {
  return `${REDIS_PREFIX}patientProfiles:zset`;
};
