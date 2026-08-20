import { useCallback, useEffect, useMemo, useState } from "react";
import { getPersonalCalendar, getTeamCalendar } from "../../../api/calendar.js";
import {
  formatShortDateKey,
  formatZonedTime,
  getZonedDateKey,
  parseDateKey,
} from "../../../utils/dateTime.js";
import { isEventVisibleForContext } from "./mapCalendarEvents.js";

const parseDateOnly = (value) => {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  if (!matched) return null;

  const [, year, month, day] = matched;
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
};

const parseDateTime = (value) => {
  if (!value) return null;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getStartDate = (schedule) =>
  parseDateTime(schedule.startDateTime) ??
  parseDateTime(schedule.dueDateTime) ??
  parseDateOnly(schedule.startDate) ??
  parseDateOnly(schedule.endDate);

const getEndDate = (schedule, startDate) =>
  parseDateTime(schedule.endDateTime) ??
  parseDateTime(schedule.dueDateTime) ??
  parseDateOnly(schedule.endDate) ??
  startDate;

const getCategory = (schedule) => {
  const type = String(schedule.type ?? "").toUpperCase();

  if (type.includes("MILESTONE")) return "milestone";
  if (type.includes("HOLIDAY") || type.includes("ACADEMIC")) return "holiday";
  if (type.includes("TEAM") || schedule.teamId != null) return "team";
  return "personal";
};

const getMemberInitials = (schedule, category) => {
  const names = Array.isArray(schedule.members)
    ? schedule.members
        .map((member) => member?.name ?? member?.memberName)
        .filter(Boolean)
    : [schedule.memberName].filter(Boolean);

  if (names.length === 0 && category === "team" && schedule.teamName) {
    names.push(schedule.teamName);
  }

  return names
    .map((name) => Array.from(String(name).trim())[0]?.toUpperCase())
    .filter(Boolean);
};

const getMemberIds = (schedule) =>
  Array.isArray(schedule.members)
    ? schedule.members
        .map((member) => member?.memberId ?? member?.id)
        .filter((memberId) => memberId != null)
    : [];

const getTimeLabel = (schedule, startDate, endDate, timeZone) => {
  const hasStartTime = Boolean(schedule.startDateTime);
  const hasEndTime = Boolean(schedule.endDateTime);

  if (!hasStartTime && schedule.dueDateTime) {
    return formatZonedTime(startDate, timeZone);
  }
  if (!hasStartTime && !hasEndTime) return "All day";
  if (!hasEndTime) return formatZonedTime(startDate, timeZone);

  return `${formatZonedTime(startDate, timeZone)} - ${formatZonedTime(endDate, timeZone)}`;
};

const getScheduleDateKey = (schedule, date, timeZone, edge) => {
  const dateTimeValue =
    edge === "start"
      ? (schedule.startDateTime ?? schedule.dueDateTime)
      : (schedule.endDateTime ?? schedule.dueDateTime);
  const dateOnlyValue =
    edge === "start"
      ? (schedule.startDate ?? schedule.endDate)
      : (schedule.endDate ?? schedule.startDate);

  if (dateTimeValue) return getZonedDateKey(date, timeZone);
  return dateOnlyValue ?? getZonedDateKey(date, timeZone);
};

const toCalendarEvent = (schedule, timeZone) => {
  const startDate = getStartDate(schedule);
  if (!startDate) return null;

  const parsedEndDate = getEndDate(schedule, startDate);
  const endDate = parsedEndDate < startDate ? startDate : parsedEndDate;
  const startDateKey = getScheduleDateKey(
    schedule,
    startDate,
    timeZone,
    "start",
  );
  const endDateKey = getScheduleDateKey(schedule, endDate, timeZone, "end");
  if (!startDateKey || !endDateKey) return null;
  const category = getCategory(schedule);
  const colorByCategory = {
    personal: "blue",
    team: "red",
    milestone: "p",
    holiday: "green",
  };
  const id =
    category === "team"
      ? (schedule.teamEventId ?? schedule.eventId ?? schedule.id)
      : (schedule.personalScheduleId ?? schedule.id);

  return {
    key: [schedule.type, id, startDate.toISOString()].join(":"),
    id,
    title: schedule.title,
    weight: schedule.weight,
    category,
    color: colorByCategory[category],
    person:
      schedule.memberName ??
      (category === "team" ? "ALL" : (schedule.country ?? "MY")),
    teamName: schedule.teamName,
    date: formatShortDateKey(startDateKey),
    time: getTimeLabel(schedule, startDate, endDate, timeZone),
    members: getMemberInitials(schedule, category),
    memberIds: getMemberIds(schedule),
    startDate,
    endDate,
    startDateKey,
    endDateKey,
  };
};

const groupEventsByDay = (events, year, month) => {
  const monthStart = Date.UTC(year, month - 1, 1);
  const monthEnd = Date.UTC(year, month, 0);

  return events.reduce((grouped, event) => {
    const startParts = parseDateKey(event.startDateKey);
    const endParts = parseDateKey(event.endDateKey);
    if (!startParts || !endParts) return grouped;

    const eventStart = Date.UTC(
      startParts.year,
      startParts.month - 1,
      startParts.day,
    );
    const eventEnd = Date.UTC(
      endParts.year,
      endParts.month - 1,
      endParts.day,
    );
    const firstVisibleDate = Math.max(eventStart, monthStart);
    const lastVisibleDate = Math.min(eventEnd, monthEnd);

    for (
      let cursor = firstVisibleDate;
      cursor <= lastVisibleDate;
      cursor += 86400000
    ) {
      const day = new Date(cursor).getUTCDate();
      grouped[day] = [...(grouped[day] ?? []), event];
    }

    return grouped;
  }, {});
};

function useCalendarEvents({
  enabled = true,
  context,
  teamId,
  year,
  month,
  timeZone,
}) {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const refresh = useCallback(() => {
    setRefreshToken((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!enabled || (context === "team" && teamId == null)) {
      return undefined;
    }

    const controller = new AbortController();

    const loadCalendar = async () => {
      setSchedules([]);
      setError(null);
      setIsLoading(true);

      try {
        const result =
          context === "team"
            ? await getTeamCalendar(teamId, year, month, {
                signal: controller.signal,
              })
            : await getPersonalCalendar(year, month, {
                signal: controller.signal,
              });

        setSchedules(Array.isArray(result) ? result : []);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        console.error(requestError);
        setError(
          requestError?.message ||
            "일정을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadCalendar();
    return () => controller.abort();
  }, [context, enabled, month, refreshToken, teamId, year]);

  const events = useMemo(
    () =>
      schedules
        .map((schedule) => toCalendarEvent(schedule, timeZone))
        .filter(Boolean)
        .filter((event) => isEventVisibleForContext(context, event))
        .sort((left, right) => left.startDate - right.startDate),
    [context, schedules, timeZone],
  );

  const eventsByDay = useMemo(
    () => groupEventsByDay(events, year, month),
    [events, month, year],
  );

  if (!enabled || (context === "team" && teamId == null)) {
    return {
      events: [],
      eventsByDay: {},
      isLoading: true,
      error: null,
      refresh,
    };
  }

  return { events, eventsByDay, isLoading, error, refresh };
}

export default useCalendarEvents;
