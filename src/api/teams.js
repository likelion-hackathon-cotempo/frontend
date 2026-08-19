import client from "./client";

let myTeamsRequest = null;

export const getMyTeams = (config) => {
  if (config) return client.get("/api/v1/teams", config);

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

export const getTeamMembers = (teamId, config) =>
  client.get(`/api/v1/teams/${teamId}/members`, config);

export const getTeamMilestones = (teamId, config) =>
  client.get(`/api/v1/teams/${teamId}/milestones`, config);

export const createTeamMilestone = (teamId, body) =>
  client.post(`/api/v1/teams/${teamId}/milestones`, body);

export const updateTeamMilestone = (teamId, milestoneId, body) =>
  client.patch(`/api/v1/teams/${teamId}/milestones/${milestoneId}`, body);

export const deleteTeamMilestone = (teamId, milestoneId) =>
  client.delete(`/api/v1/teams/${teamId}/milestones/${milestoneId}`);
