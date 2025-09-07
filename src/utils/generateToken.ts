import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config";

const generateToken = (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { userId, role },
    config.jwt_secret as string,
    {
      expiresIn: config.jwt_expires_in,
    } as SignOptions
  );

  const refreshToken = jwt.sign(
    { userId, role },
    config.jwt_refresh_secret as string,
    {
      expiresIn: config.jwt_refresh_expires_in,
    } as SignOptions
  );

  return { accessToken, refreshToken };
};

export default generateToken;
