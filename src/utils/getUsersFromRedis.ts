import initializeRedisClient from "../config/redis.client";

export const getUsersFromRedis = async (page: number, limit: number) => {
  const redisClient = await initializeRedisClient();

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const usersRaw = await redisClient.zRevRange("users", start, end);

  // Safely convert to string array
  const usersArray = Array.isArray(usersRaw) ? usersRaw : [];

  const parsedUsers = usersArray.map((u) => JSON.parse(u as string));

  return parsedUsers;
};

