import client from "./client";

export const createTeam = (name) =>
  client.post("/api/v1/teams", { name });
