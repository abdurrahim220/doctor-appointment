import { z } from "zod";

export const zodEnumFromTS = <T extends Record<string, string>>(enumObj: T) => {
  return z.enum(Object.values(enumObj) as [string, ...string[]]);
};

export const zodEnumFromTSWithDefault = <T extends Record<string, string>>(
  enumObj: T,
  defaultValue: T[keyof T],
) => {
  return z.enum(Object.values(enumObj) as [string, ...string[]]).default(defaultValue);
};