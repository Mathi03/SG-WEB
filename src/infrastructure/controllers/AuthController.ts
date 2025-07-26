/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@infrastructure/models/user";
import ApiHandler from "@utils/ApiHandler";

async function login(data: { email: string; password: string }): Promise<any> {
  const res = await ApiHandler.post(`/auth/sign-in`, {
    data,
  });

  return res;
}

function signup(data: User) {
  return ApiHandler.post(`/signup`, {
    data,
  });
}

export default {
  login,
  signup,
};
