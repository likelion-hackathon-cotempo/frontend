import client from "./client";

let myTeamsRequest = null;

export const getMyTeams = () => {
  if (!myTeamsRequest) {
    myTeamsRequest = client.get("/api/v1/teams").finally(() => {
      myTeamsRequest = null;
    });
  }

  return myTeamsRequest;
};

export const getTeamDetail = (teamId, config) =>
  client.get(`/api/v1/teams/${teamId}`, config);

export const createTeam = (name) =>
  client.post("/api/v1/teams", { name });

export const joinTeam = (inviteCode, position) =>
  client.post("/api/v1/teams/join", { inviteCode, position });
