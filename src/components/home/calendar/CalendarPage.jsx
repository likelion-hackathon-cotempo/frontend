import { useEffect, useState } from "react";
import MonthNav from "./MonthNav.jsx";
import MonthGrid from "./MonthGrid.jsx";
import CreateEventButton from "./CreateEventButton.jsx";
import UpcomingEventsRow from "./UpcomingEventsRow.jsx";
import CalendarFilters from "./CalendarFilters.jsx";
import AddTeamEventModal from "../../modal/AddTeamEventModal.jsx";
import AddPersonalModal from "../../modal/AddPersonalModal.jsx";
import { getDashboard, getTeamCalendar } from "../../../api/calendar.js";
import { mapEventsToGrid } from "./mapCalendarEvents.js";

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MOCK_TEAM_MEMBERS = [
  { id: 1, initial: "J", name: "Jane" },
  { id: 2, initial: "S", name: "Sally" },
  { id: 3, initial: "A", name: "Alex" },
  { id: 4, initial: "L", name: "Liam" },
];

function buildFilters(context, teams) {
  if (context === "team") {
    return [
      { id: "team", label: "Team Schedule" },
      { id: "holiday", label: "Public Holiday" },
      { id: "milestone", label: "Milestone" },
    ];
  }

  return [
    { id: "personal", label: "My Schedule" },
    { id: "holiday", label: "Public Holiday" },
    ...teams.map((team) => ({ id: `team:${team.name}`, label: team.name })),
  ];
}

function eventMatchesFilter(event, filterId) {
  if (filterId.startsWith("team:")) {
    return event.category === "team" && event.teamName === filterId.slice(5);
  }

  return event.category === filterId;
}

// 개인(MY) 캘린더에서는 마일스톤을 보여주지 않기로 팀에서 결정함
// (같은 유형 프로젝트가 여러 팀에 있으면 마일스톤이 헷갈려서 팀별 화면에서만 노출)
function excludeMilestonesForMe(context, eventsByDay) {
  if (context !== "me") return eventsByDay;

  const filtered = {};
  Object.entries(eventsByDay).forEach(([day, events]) => {
    const kept = events.filter((event) => event.category !== "milestone");
    if (kept.length > 0) filtered[day] = kept;
  });
  return filtered;
}

function filterEvents(eventsByDay, activeFilters) {
  if (activeFilters.length === 0) return eventsByDay;

  const filtered = {};
  Object.entries(eventsByDay).forEach(([day, events]) => {
    const matched = events.filter((event) =>
      activeFilters.some((filterId) => eventMatchesFilter(event, filterId)),
    );
    if (matched.length > 0) filtered[day] = matched;
  });
  return filtered;
}

function CalendarPage({ context, teamId, teams }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [activeFilters, setActiveFilters] = useState([]);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [events, setEvents] = useState([]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const goToPrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const hasNoTeamSelected = context === "team" && !teamId;

  useEffect(() => {
    if (hasNoTeamSelected) return undefined;

    let cancelled = false;
    const request =
      context === "team"
        ? getTeamCalendar(teamId, year, month + 1)
        : getDashboard(year, month + 1);

    request
      .then((result) => {
        if (!cancelled) setEvents(result);
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) setEvents([]);
      });

    return () => {
      cancelled = true;
    };
  }, [context, teamId, year, month, hasNoTeamSelected]);

  const eventsByDay = hasNoTeamSelected ? {} : mapEventsToGrid(events);
  const filters = buildFilters(context, teams);
  const toggleFilter = (filterId) => {
    setActiveFilters((current) =>
      current.includes(filterId)
        ? current.filter((id) => id !== filterId)
        : [...current, filterId],
    );
  };

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
      <CalendarFilters filters={filters} activeFilters={activeFilters} onToggle={toggleFilter} />
      <MonthGrid
        year={year}
        month={month}
        events={filterEvents(excludeMilestonesForMe(context, eventsByDay), activeFilters)}
        todayDay={isCurrentMonth ? today.getDate() : null}
      />
      {context === "me" ? (
        <AddPersonalModal
          isOpen={isCreateEventOpen}
          onClose={() => setIsCreateEventOpen(false)}
          onSubmit={() => setIsCreateEventOpen(false)}
        />
      ) : (
        <AddTeamEventModal
          isOpen={isCreateEventOpen}
          members={MOCK_TEAM_MEMBERS}
          onClose={() => setIsCreateEventOpen(false)}
          onSubmit={() => setIsCreateEventOpen(false)}
        />
      )}
    </div>
  );
}

export default CalendarPage;
