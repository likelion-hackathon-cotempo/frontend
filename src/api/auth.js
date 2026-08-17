import client from "./client";

export const signup = (body) => client.post("/api/v1/auth/signup", body);
export const login = (body) => client.post("/api/v1/auth/login", body);
export const logout = () => client.post("/api/v1/auth/logout");
export const getMe = () => client.get("/api/v1/members/me");
export const updateMe = (body) => client.patch("/api/v1/members/me", body);