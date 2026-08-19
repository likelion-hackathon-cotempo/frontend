// 백엔드 CalendarEventDto.type -> 프론트 카테고리/칩 색상 매핑
// (EventChip은 blue/red/green/p 4가지 색상만 지원해서 HOLIDAY/ACADEMIC은 임시로 green에 배정)
const CATEGORY_BY_TYPE = {
  PERSONAL_SCHEDULE: "personal",
  TEAM_EVENT: "team",
  MILESTONE: "milestone",
  HOLIDAY: "holiday",
  ACADEMIC: "academic",
};

const COLOR_BY_TYPE = {
  PERSONAL_SCHEDULE: "blue",
  TEAM_EVENT: "red",
  MILESTONE: "p",
  HOLIDAY: "green",
  ACADEMIC: "green",
};

// MY 캘린더에서는 소속 팀을 특정하기 어려운 마일스톤을 노출하지 않는다.
export function isEventVisibleForContext(context, event) {
  return context !== "me" || event.category !== "milestone";
}

function eventDay(event) {
  const raw = event.startDate || event.startDateTime || event.dueDateTime;
  if (!raw) return null;

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getDate();
}

export function mapEventsToGrid(events) {
  const eventsByDay = {};

  (events ?? []).forEach((event) => {
    const day = eventDay(event);
    if (!day) return;

    const chip = {
      id:
        event.personalScheduleId ??
        event.teamEventId ??
        event.eventId ??
        event.id,
      color: COLOR_BY_TYPE[event.type] ?? "blue",
      title: event.title,
      person: event.memberName ?? "",
      category: CATEGORY_BY_TYPE[event.type] ?? "personal",
      teamName: event.teamName,
    };

    if (!eventsByDay[day]) eventsByDay[day] = [];
    eventsByDay[day].push(chip);
  });

  return eventsByDay;
}
