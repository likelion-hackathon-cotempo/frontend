import { useCallback, useEffect, useMemo, useState } from "react";
import { getPersonalCalendar, getTeamCalendar } from "../../../api/calendar.js";
import { isEventVisibleForContext } from "./mapCalendarEvents.js";

const pad = (value) => String(value).padStart(2, "0");

const parseDateOnly = (value) => {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  if (!matched) return null;

  const [, year, month, day] = matched;
  return new Date(Number(year), Number(month) - 1, Number(day));
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

const formatDate = (date) =>
  `${String(date.getFullYear()).slice(-2)}. ${pad(date.getMonth() + 1)}. ${pad(date.getDate())}`;

const formatTime = (date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

const getTimeLabel = (schedule, startDate, endDate) => {
  const hasStartTime = Boolean(schedule.startDateTime);
  const hasEndTime = Boolean(schedule.endDateTime);

  if (!hasStartTime && schedule.dueDateTime) return formatTime(startDate);
  if (!hasStartTime && !hasEndTime) return "All day";
  if (!hasEndTime) return formatTime(startDate);

  return `${formatTime(startDate)} - ${formatTime(endDate)}`;
};

const toCalendarEvent = (schedule) => {
  const startDate = getStartDate(schedule);
  if (!startDate) return null;

  const parsedEndDate = getEndDate(schedule, startDate);
  const endDate = parsedEndDate < startDate ? startDate : parsedEndDate;
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
    date: formatDate(startDate),
    time: getTimeLabel(schedule, startDate, endDate),
    members: getMemberInitials(schedule, category),
    memberIds: getMemberIds(schedule),
    startDate,
    endDate,
  };
};

const groupEventsByDay = (events, year, month) => {
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);

  return events.reduce((grouped, event) => {
    const eventStart = new Date(
      event.startDate.getFullYear(),
      event.startDate.getMonth(),
      event.startDate.getDate(),
    );
    const eventEnd = new Date(
      event.endDate.getFullYear(),
      event.endDate.getMonth(),
      event.endDate.getDate(),
    );
    const firstVisibleDate = eventStart < monthStart ? monthStart : eventStart;
    const lastVisibleDate = eventEnd > monthEnd ? monthEnd : eventEnd;

    for (
      let cursor = new Date(firstVisibleDate);
      cursor <= lastVisibleDate;
      cursor.setDate(cursor.getDate() + 1)
    ) {
      const day = cursor.getDate();
      grouped[day] = [...(grouped[day] ?? []), event];
    }

    return grouped;
  }, {});
};

function useCalendarEvents({ enabled = true, context, teamId, year, month }) {
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
        .map(toCalendarEvent)
        .filter(Boolean)
        .filter((event) => isEventVisibleForContext(context, event))
        .sort((left, right) => left.startDate - right.startDate),
    [context, schedules],
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
