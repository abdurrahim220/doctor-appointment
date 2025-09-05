const REDIS_PREFIX = "myapp:";

export const userKeyById = (id: string): string => {
  return `${REDIS_PREFIX}user:${id}`;
};

export const allUsers = (): string => {
  return `${REDIS_PREFIX}users:all`;
};