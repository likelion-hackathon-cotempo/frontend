import { useState } from "react";
import MonthNav from "./MonthNav.jsx";
import MonthGrid from "./MonthGrid.jsx";
import CreateEventButton from "./CreateEventButton.jsx";
import UpcomingEventsRow from "./UpcomingEventsRow.jsx";
import AddTeamEventModal from "../../modal/AddTeamEventModal.jsx";

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MOCK_EVENTS = {
  5: [{ color: "blue", title: "Interview", person: "Sally", category: "personal" }],
  10: [{ color: "red", title: "Weekly Meeting", person: "ALL", category: "team" }],
  13: [{ color: "p", title: "Wireframe Complete", category: "milestone" }],
  18: [{ color: "green", title: "Summer Vacation", person: "Sally", category: "personal" }],
  25: [{ color: "p", title: "QA Complete", category: "milestone" }],
  28: [{ color: "p", title: "Final Presentation", category: "milestone" }],
};

// 개인(MY) 캘린더에서는 마일스톤을 보여주지 않기로 팀에서 결정함
// (같은 유형 프로젝트가 여러 팀에 있으면 마일스톤이 헷갈려서 팀별 화면에서만 노출)
function visibleEventsFor(context, eventsByDay) {
  if (context !== "me") return eventsByDay;

  const filtered = {};
  Object.entries(eventsByDay).forEach(([day, events]) => {
    const kept = events.filter((event) => event.category !== "milestone");
    if (kept.length > 0) filtered[day] = kept;
  });
  return filtered;
}

const MOCK_TEAM_MEMBERS = [
  { id: 1, initial: "J", name: "Jane" },
  { id: 2, initial: "S", name: "Sally" },
  { id: 3, initial: "A", name: "Alex" },
  { id: 4, initial: "L", name: "Liam" },
];

function CalendarCard({ context }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const goToPrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <MonthNav
          monthLabel={`${MONTH_LABELS[month]} ${year}`}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
        />
        <CreateEventButton onClick={() => setIsCreateEventOpen(true)} />
      </div>
      <UpcomingEventsRow />
      <MonthGrid
        year={year}
        month={month}
        events={visibleEventsFor(context, MOCK_EVENTS)}
        todayDay={isCurrentMonth ? today.getDate() : null}
      />
      <AddTeamEventModal
        isOpen={isCreateEventOpen}
        members={MOCK_TEAM_MEMBERS}
        onClose={() => setIsCreateEventOpen(false)}
        onSubmit={() => setIsCreateEventOpen(false)}
      />
    </div>
  );
}

export default CalendarCard;
