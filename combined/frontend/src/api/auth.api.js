import http from "./axios";

// Token is read back automatically by the axios request interceptor.
function persist(data) {
  if (data?.token) localStorage.setItem("token", data.token);
  return data;
}

/** Register a new user. Returns { token, user }. */
export const register = async ({ name, email, password }) => {
  const res = await http.post("/api/auth/register", { name, email, password });
  return persist(res.data?.data);
};

/** Log in. Returns { token, user }. */
export const login = async ({ email, password }) => {
  const res = await http.post("/api/auth/login", { email, password });
  return persist(res.data?.data);
};

/** Current user from the stored token. Returns { user }. */
export const me = async () => {
  const res = await http.get("/api/auth/me");
  return res.data?.data;
};

export const logout = () => localStorage.removeItem("token");
