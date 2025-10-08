import instance from ".";
import { getToken, storeToken } from "./storage";

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
  email: string;
}

// 🔹 Existing APIs
const login = async (userInfo: Login) => {
  const { data } = await instance.post("/auth/login", userInfo);
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
  return res.data;
};

const updateUserById = async (userId: string) => {
  const res = await instance.put(`auth/${userId}`);
  return res;
};

const getAllUsers = async (): Promise<IClass[]> => {
  const res = await instance.get("auth/getAll");
  return res.data;
};

const getScramble = async () => {
  const res = await instance.get("/scramble/daily");
  return res.data;
};

interface SubmitSolvePayload {
  scrambleId: string;
  duration: number;
}

// 🔹 FIXED: align POST route with backend
const submitSolve = async (payload: SubmitSolvePayload) => {
  const res = await instance.post("/scramble/submit", payload);
  return res.data;
};

// 🔹 NEW: Leaderboard API
export interface ILeaderboardItem {
  user: string; // user ObjectId
  time: number;
}

export interface ILeaderboardResponse {
  scrambleId: string;
  leaderboard: ILeaderboardItem[];
}

const getLeaderboard = async (): Promise<ILeaderboardResponse> => {
  const token = await getToken();
  const res = await instance.get("/scramble/leaderboard", {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("HERE", res.data);
  return res.data;
};

const getUserById = async (userId: string) => {
  const res = await instance.get(`/auth/${userId}`);
  const data = res.data;
  return data;
};

const getUserScrambleHistory = async (userId: string) => {
  const res = await instance.get(`/scramble/${userId}/history`);
  return res.data.history;
};

const updateUserStats = async (
  userId: string,
  updatedStats: Partial<{ ao5: number; ao12: number; single: number }>
) => {
  const res = await instance.put(`/auth/${userId}`, updatedStats);
  return res.data;
};

// 🔹 EXPORT ALL
export {
  getAllUsers,
  getLeaderboard,
  getMyProfile,
  getScramble,
  getUserById,
  getUserScrambleHistory,
  login,
  register,
  submitSolve,
  updateUserById,
  updateUserStats,
};
