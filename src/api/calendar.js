import client from "./client";

export const getDashboard = (year, month) =>
  client.get("/api/v1/dashboard", { params: { year, month } });

export const getTeamCalendar = (teamId, year, month) =>
  client.get(`/api/v1/teams/${teamId}/calendar`, { params: { year, month } });

export const createTeamEvent = (teamId, body) =>
  client.post(`/api/v1/teams/${teamId}/events`, body);

export const updateTeamEvent = (teamId, eventId, body) =>
  client.patch(`/api/v1/teams/${teamId}/events/${eventId}`, body);

export const deleteTeamEvent = (teamId, eventId) =>
  client.delete(`/api/v1/teams/${teamId}/events/${eventId}`);

export const createPersonalSchedule = (body) => client.post("/api/v1/schedules", body);

export const updatePersonalSchedule = (personalScheduleId, body) =>
  client.patch(`/api/v1/schedules/${personalScheduleId}`, body);

export const deletePersonalSchedule = (personalScheduleId) =>
  client.delete(`/api/v1/schedules/${personalScheduleId}`);
