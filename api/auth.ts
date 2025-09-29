import instance from ".";
import { storeToken } from "./storage";

interface UserInfo {
  username: string;
  password: string;
  email: string;
  image: string;
  ao12: number;
  ao5: number;
  single: number;
}

interface Login {
  username: string;
  password: string;
}

export interface IClass {
  _id: string;
  username: string;
  image: string;
  ao12: number;
  ao5: number;
  single: number;
}

const login = async (userInfo: Login) => {
  const { data } = await instance.post("/auth/login", userInfo);
  console.log(data.token);
  await storeToken(data.token);

  return data;
};

const register = async (userInfo: UserInfo) => {
  const { data } = await instance.post("/auth/register", userInfo);
  await storeToken(data.token);
  return data;
};

const getMyProfile = async (): Promise<IClass> => {
  const res = await instance.get("/auth/myProfile");
  const data = res.data;
  return data;
};

const updateUserById = async (userId: string) => {
  const res = instance.put(`auth/${userId}`);
  return res;
};

const getAllUsers = async (): Promise<IClass[]> => {
  const res = await instance.get("auth/getAll");
  const data = res.data;
  return data;
};

export { getAllUsers, getMyProfile, login, register, updateUserById };
