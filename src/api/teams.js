import client from "./client";

export const getMyTeams = () => client.get("/api/v1/teams");

export const getTeamDetail = (teamId) => client.get(`/api/v1/teams/${teamId}`);

export const getTeamMembers = (teamId) => client.get(`/api/v1/teams/${teamId}/members`);

export const getTeamMilestones = (teamId) => client.get(`/api/v1/teams/${teamId}/milestones`);

export const createTeamMilestone = (teamId, body) =>
  client.post(`/api/v1/teams/${teamId}/milestones`, body);

export const updateTeamMilestone = (teamId, milestoneId, body) =>
  client.patch(`/api/v1/teams/${teamId}/milestones/${milestoneId}`, body);

export const deleteTeamMilestone = (teamId, milestoneId) =>
  client.delete(`/api/v1/teams/${teamId}/milestones/${milestoneId}`);
