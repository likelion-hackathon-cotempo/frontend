import DateBadge from "./DateBadge.jsx";
import EventChip from "./EventChip.jsx";
import WeekdayHeader from "./WeekdayHeader.jsx";

function getCalendarWeeks(year, month) {
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const cells = [];
  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

const EVENT_ROW_HEIGHT = 46;
const EVENT_AREA_TOP = 38;
const MIN_WEEK_HEIGHT = 132;

function getEventIdentity(event) {
  return (
    event.key ??
    [
      event.category,
      event.id,
      event.title,
      event.startDate?.getTime?.(),
      event.endDate?.getTime?.(),
    ].join(":")
  );
}

function isMultiDayEvent(event, segment) {
  if (segment.endColumn > segment.startColumn) return true;
  if (event.startDateKey && event.endDateKey) {
    return event.startDateKey !== event.endDateKey;
  }
  if (!(event.startDate instanceof Date) || !(event.endDate instanceof Date)) {
    return false;
  }

  return (
    event.startDate.getFullYear() !== event.endDate.getFullYear() ||
    event.startDate.getMonth() !== event.endDate.getMonth() ||
    event.startDate.getDate() !== event.endDate.getDate()
  );
}

function getWeekEventSegments(week, eventsByDay) {
  const segmentsByEvent = new Map();

  week.forEach((day, dayIndex) => {
    if (!day) return;

    (eventsByDay[day] ?? []).forEach((event) => {
      const identity = getEventIdentity(event);
      const current = segmentsByEvent.get(identity);

      if (current) {
        current.endColumn = dayIndex;
        return;
      }

      segmentsByEvent.set(identity, {
        identity,
        event,
        startColumn: dayIndex,
        endColumn: dayIndex,
      });
    });
  });

  const segments = [...segmentsByEvent.values()].sort((left, right) => {
    const startDifference = left.startColumn - right.startColumn;
    if (startDifference !== 0) return startDifference;

    return right.endColumn - left.endColumn;
  });
  const laneEndColumns = [];

  segments.forEach((segment) => {
    let lane = laneEndColumns.findIndex(
      (endColumn) => endColumn < segment.startColumn,
    );

    if (lane === -1) lane = laneEndColumns.length;

    laneEndColumns[lane] = segment.endColumn;
    segment.lane = lane;
  });

  return { segments, laneCount: laneEndColumns.length };
}

function MonthGrid({
  year,
  month,
  events,
  todayDay,
  onPersonalEventClick,
  onTeamEventClick,
}) {
  const weeks = getCalendarWeeks(year, month);

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[28px] border border-[#cbd9e6]">
      <WeekdayHeader />
      {weeks.map((week, weekIndex) => {
        const { segments, laneCount } = getWeekEventSegments(week, events);
        const weekHeight = Math.max(
          MIN_WEEK_HEIGHT,
          EVENT_AREA_TOP + laneCount * EVENT_ROW_HEIGHT + 8,
        );

        return (
          <div
            key={weekIndex}
            className="relative grid w-full grid-cols-7"
            style={{ minHeight: weekHeight }}
          >
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="border border-[#cbd9e6] p-2"
              >
                {day && (
                  <DateBadge day={day} isToday={day === todayDay} />
                )}
              </div>
            ))}

            <div className="pointer-events-none absolute inset-0 grid grid-cols-7">
              {segments.map((segment) => {
                const { event } = segment;
                const { key, ...eventProps } = event;
                const handleEventClick =
                  event.category === "personal"
                    ? onPersonalEventClick
                    : event.category === "team"
                      ? onTeamEventClick
                      : undefined;

                return (
                  <div
                    key={`${key ?? segment.identity}:${weekIndex}`}
                    className="pointer-events-auto z-10 mx-2 min-w-0 self-start"
                    style={{
                      gridColumn: `${segment.startColumn + 1} / ${segment.endColumn + 2}`,
                      gridRow: 1,
                      marginTop:
                        EVENT_AREA_TOP + segment.lane * EVENT_ROW_HEIGHT,
                    }}
                  >
                    <EventChip
                      {...eventProps}
                      isMultiDay={isMultiDayEvent(event, segment)}
                      onClick={
                        handleEventClick && event.id != null
                          ? () => handleEventClick(event)
                          : undefined
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MonthGrid;
