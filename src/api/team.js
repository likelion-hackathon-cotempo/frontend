import client from "./client";

export const getMyTeams = (config) =>
  client.get("/api/v1/teams", config);

export const getTeamDetail = (teamId, config) =>
  client.get(`/api/v1/teams/${teamId}`, config);

export const createTeam = (name) =>
  client.post("/api/v1/teams", { name });
