import DateBadge from "./DateBadge.jsx";
import EventChip from "./EventChip.jsx";
import WeekdayHeader from "./WeekdayHeader.jsx";

function getCalendarWeeks(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

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
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex w-full">
          {week.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="flex min-h-[132px] flex-1 flex-col gap-1.5 border border-[#cbd9e6] p-2"
            >
              {day && (
                <>
                  <DateBadge day={day} isToday={day === todayDay} />
                  {(events[day] ?? []).map((event) => {
                    const { key, ...eventProps } = event;
                    const handleEventClick =
                      event.category === "personal"
                        ? onPersonalEventClick
                        : event.category === "team"
                          ? onTeamEventClick
                          : undefined;

                    return (
                      <EventChip
                        key={key}
                        {...eventProps}
                        onClick={
                          handleEventClick && event.id != null
                            ? () => handleEventClick(event)
                            : undefined
                        }
                      />
                    );
                  })}
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MonthGrid;
