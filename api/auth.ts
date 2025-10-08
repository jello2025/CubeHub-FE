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
  streak: number;
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

interface UpdateUserStatsPayload {
  ao5?: number;
  ao12?: number;
  single?: number;
  image?: string; // added optional image property
}

const updateUserStats = async (
  userId: string,
  updatedStats: UpdateUserStatsPayload
) => {
  const res = await instance.put(`/auth/${userId}`, updatedStats);
  return res.data;
};

export interface IPost {
  _id: string;
  image: string;
  description?: string;
  date: string;
  user: IClass; // populated user
}

// 🔹 Get all posts
const getAllPosts = async (): Promise<IPost[]> => {
  const token = await getToken();
  const res = await instance.get("/posts/getAll", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🔹 Create new post
interface CreatePostPayload {
  image: string;
  description?: string;
  user: string; // userId
}
const createPost = async (postData: {
  image: string;
  description?: string;
  user: string;
}) => {
  const res = await instance.post("/posts/", postData);
  return res.data;
};

// 🔹 Get posts by a single user
const getUserPosts = async (userId: string): Promise<IPost[]> => {
  const token = await getToken();
  const res = await instance.get(`/posts/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🔹 EXPORT ALL
export {
  createPost,
  getAllPosts,
  getAllUsers,
  getLeaderboard,
  getMyProfile,
  getScramble,
  getUserById,
  getUserPosts,
  getUserScrambleHistory,
  login,
  register,
  submitSolve,
  updateUserById,
  updateUserStats,
};
