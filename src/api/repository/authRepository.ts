import type { Login, Users } from "../../utils/types";
import { PROVIDER_GET, PROVIDER_POST } from "../provider";

const delay = (): Promise<void> =>
  new Promise((res) => setTimeout(() => res(), 800));

export const login = async (data: Login) => {
  await delay();
  const response = await PROVIDER_POST("api/auth/login", data);
  return response;
};

export const register = async (data: Users) => {
  await delay();
  const response = await PROVIDER_POST("api/auth/register", data);
  return response;
};

export const logout = async () => {
  await delay();
  const response = await PROVIDER_GET("api/auth/logout");
  return response;
};

export const forgotPass = async (data: Users) => {
  await delay();
  const response = await PROVIDER_POST("api/auth/forgot-password", data);
  return response;
};

export const getUser = async () => {
  await delay();
  const response = await PROVIDER_GET("user");
  return response;
};