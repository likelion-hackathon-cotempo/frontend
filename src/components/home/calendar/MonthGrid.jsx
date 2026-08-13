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

function MonthGrid({ year, month, events, todayDay }) {
  const weeks = getCalendarWeeks(year, month);

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[28px] border border-[#cbd9e6]">
      <WeekdayHeader />
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex w-full">
          {week.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="flex h-[132px] w-full shrink-0 flex-col gap-1.5 border border-[#cbd9e6] p-2"
            >
              {day && (
                <>
                  <DateBadge day={day} isToday={day === todayDay} />
                  {(events[day] ?? []).map((event, eventIndex) => (
                    <EventChip key={eventIndex} {...event} />
                  ))}
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
