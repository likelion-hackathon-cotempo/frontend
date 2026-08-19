import { useState } from "react";
import MonthNav from "./MonthNav.jsx";
import MonthGrid from "./MonthGrid.jsx";
import CreateEventButton from "./CreateEventButton.jsx";
import UpcomingEventsRow from "./UpcomingEventsRow.jsx";
import CalendarFilters from "./CalendarFilters.jsx";
import AddTeamEventModal from "../../modal/AddTeamEventModal.jsx";
import AddPersonalModal from "../../modal/AddPersonalModal.jsx";
import useCalendarEvents from "./useCalendarEvents.js";
import { createPersonalSchedule } from "../../../api/calendar.js";

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
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

const getInitial = (name) =>
  Array.from(String(name ?? "").trim())[0]?.toUpperCase() ?? "";

function CalendarPage({
  context,
  isContextReady,
  teams,
  activeTeamId,
  teamDetail,
}) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [activeFilters, setActiveFilters] = useState([]);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const { events, eventsByDay, isLoading, error, refresh } = useCalendarEvents({
    enabled: isContextReady,
    context,
    teamId: activeTeamId,
    year,
    month: month + 1,
  });
  const teamMembers = (teamDetail?.members ?? []).map((member) => ({
    id: member.memberId,
    initial: getInitial(member.name),
    name: member.name,
  }));

  const goToPrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const handleCreatePersonalSchedule = async (schedule) => {
    await createPersonalSchedule(schedule);
    setIsCreateEventOpen(false);
    refresh();
  };

  const filters = buildFilters(context, teams);
  const availableFilterIds = new Set(filters.map((filter) => filter.id));
  const visibleActiveFilters = activeFilters.filter((filterId) =>
    availableFilterIds.has(filterId),
  );
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
      <UpcomingEventsRow events={events} isLoading={isLoading} />
      {error && (
        <p role="alert" className="text-body2 text-red-700">
          {error}
        </p>
      )}
      <CalendarFilters
        filters={filters}
        activeFilters={visibleActiveFilters}
        onToggle={toggleFilter}
      />
      <MonthGrid
        year={year}
        month={month}
        events={filterEvents(eventsByDay, visibleActiveFilters)}
        todayDay={isCurrentMonth ? today.getDate() : null}
      />
      {context === "me" ? (
        <AddPersonalModal
          isOpen={isCreateEventOpen}
          onClose={() => setIsCreateEventOpen(false)}
          onSubmit={handleCreatePersonalSchedule}
        />
      ) : (
        <AddTeamEventModal
          isOpen={isCreateEventOpen}
          members={teamMembers}
          onClose={() => setIsCreateEventOpen(false)}
          onSubmit={() => setIsCreateEventOpen(false)}
        />
      )}
    </div>
  );
}

export default CalendarPage;
