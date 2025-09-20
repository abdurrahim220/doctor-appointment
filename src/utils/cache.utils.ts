import initializeRedisClient from "../config/redis.client";
import { IUser } from "../modules/user/user.interface";
import { allUsersZSet, userKeyById } from "./keys";

// ✅ Add or update a user in cache
export const addOrUpdateUserInCache = async (user: IUser) => {
  const redisClient = await initializeRedisClient();

  // Update single user cache
  await redisClient.set(userKeyById(user.id), JSON.stringify(user));

  // Remove old entry in ZSet if exists
  const cachedAllUsers = await redisClient.zRange(allUsersZSet(), 0, -1);
  for (const u of cachedAllUsers) {
    const parsed = JSON.parse(u);
    if (parsed.id === user.id) {
      await redisClient.zRem(allUsersZSet(), u);
      break;
    }
  }

  // Add updated user into ZSet
  await redisClient.zAdd(allUsersZSet(), {
    score: new Date(user.createdAt).getTime(),
    value: JSON.stringify(user),
  });
};

// ✅ Remove a user from cache
export const removeUserFromCache = async (id: string) => {
  const redisClient = await initializeRedisClient();

  // Remove single user cache
  await redisClient.del(userKeyById(id));

  // Remove from ZSet
  const cachedAllUsers = await redisClient.zRange(allUsersZSet(), 0, -1);
  for (const u of cachedAllUsers) {
    const parsed = JSON.parse(u);
    if (parsed.id === id) {
      await redisClient.zRem(allUsersZSet(), u);
      break;
    }
  }
};
