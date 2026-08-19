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
