import client from "./client";

export const getMilestones = (teamId, config) =>
  client.get(`/api/v1/teams/${teamId}/milestones`, config);

export const createMilestone = (teamId, body) =>
  client.post(`/api/v1/teams/${teamId}/milestones`, body);

export const updateMilestone = (teamId, milestoneId, body) =>
  client.patch(`/api/v1/teams/${teamId}/milestones/${milestoneId}`, body);

export const deleteMilestone = (teamId, milestoneId) =>
  client.delete(`/api/v1/teams/${teamId}/milestones/${milestoneId}`);
