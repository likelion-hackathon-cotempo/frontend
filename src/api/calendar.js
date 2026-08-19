import client from "./client";

const withCalendarParams = (year, month, config = {}) => ({
  ...config,
  params: {
    ...config.params,
    year,
    month,
  },
});

export const getPersonalCalendar = (year, month, config) =>
  client.get(
    "/api/v1/dashboard",
    withCalendarParams(year, month, config),
  );

export const getTeamCalendar = (teamId, year, month, config) =>
  client.get(
    `/api/v1/teams/${teamId}/calendar`,
    withCalendarParams(year, month, config),
  );

export const createPersonalSchedule = (body) =>
  client.post("/api/v1/schedules", body);

export const updatePersonalSchedule = (personalScheduleId, body) =>
  client.patch(`/api/v1/schedules/${personalScheduleId}`, body);

export const deletePersonalSchedule = (personalScheduleId) =>
  client.delete(`/api/v1/schedules/${personalScheduleId}`);

export const createTeamEvent = (teamId, body) =>
  client.post(`/api/v1/teams/${teamId}/events`, body);

export const updateTeamEvent = (teamId, eventId, body) =>
  client.patch(`/api/v1/teams/${teamId}/events/${eventId}`, body);

export const deleteTeamEvent = (teamId, eventId) =>
  client.delete(`/api/v1/teams/${teamId}/events/${eventId}`);

export const recommendMeetingTimes = (teamId, body, config) =>
  client.post(
    `/api/v1/teams/${teamId}/events/recommendations`,
    body,
    config,
  );

export const recommendMilestones = (teamId, body) =>
  client.post(`/api/v1/teams/${teamId}/milestones/recommendations`, body);

export const createRecommendedMilestones = (teamId, milestones) =>
  client.post(`/api/v1/teams/${teamId}/milestones/recommendations/bulk`, {
    milestones,
  });
