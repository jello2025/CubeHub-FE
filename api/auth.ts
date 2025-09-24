import instance from ".";
import { storeToken } from "./storage";

interface UserInfo {
  username: string;
  password: string;
  email: string;
}

const login = async (userInfo: UserInfo) => {
  const { data } = await instance.post(
    "/mini-project/api/auth/login",
    userInfo
  );
  console.log(data.token);
  await storeToken(data.token);

  return data;
};

const register = async (userInfo: UserInfo) => {
  const { data } = await instance.post("/auth/register", userInfo);
  await storeToken(data.token);
  return data;
};

export { login, register };
