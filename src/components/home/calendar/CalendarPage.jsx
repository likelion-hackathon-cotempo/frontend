import { useState } from "react";
import MonthNav from "./MonthNav.jsx";
import MonthGrid from "./MonthGrid.jsx";
import CreateEventButton from "./CreateEventButton.jsx";
import UpcomingEventsRow from "./UpcomingEventsRow.jsx";
import CalendarFilters from "./CalendarFilters.jsx";
import AddTeamEventModal from "../../modal/AddTeamEventModal.jsx";
import AddPersonalModal from "../../modal/AddPersonalModal.jsx";
import useCalendarEvents from "./useCalendarEvents.js";
import {
  createPersonalSchedule,
  createTeamEvent,
  deletePersonalSchedule,
  deleteTeamEvent,
  updatePersonalSchedule,
  updateTeamEvent,
} from "../../../api/calendar.js";
import { useAuth } from "../../../auth/AuthContext.js";
import {
  getMemberTimeZone,
  getZonedDateTimeParts,
} from "../../../utils/dateTime.js";

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
  const { currentUser } = useAuth();
  const timeZone = getMemberTimeZone(currentUser);
  const today = getZonedDateTimeParts(new Date(), timeZone);
  const [viewDate, setViewDate] = useState(() => ({
    year: today.year,
    month: today.month - 1,
  }));
  const [activeFilters, setActiveFilters] = useState([]);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedPersonalEvent, setSelectedPersonalEvent] = useState(null);
  const [selectedTeamEvent, setSelectedTeamEvent] = useState(null);

  const { year, month } = viewDate;
  const isCurrentMonth = year === today.year && month === today.month - 1;
  const { events, eventsByDay, isLoading, error, refresh } = useCalendarEvents({
    enabled: isContextReady,
    context,
    teamId: activeTeamId,
    year,
    month: month + 1,
    timeZone,
  });
  const teamMembers = (teamDetail?.members ?? []).map((member) => ({
    id: member.memberId,
    initial: getInitial(member.name),
    name: member.name,
  }));

  const changeMonth = (offset) => {
    const date = new Date(Date.UTC(year, month + offset, 1));
    setViewDate({ year: date.getUTCFullYear(), month: date.getUTCMonth() });
  };
  const goToPrevMonth = () => changeMonth(-1);
  const goToNextMonth = () => changeMonth(1);
  const closeEventModal = () => {
    setIsCreateEventOpen(false);
    setSelectedPersonalEvent(null);
    setSelectedTeamEvent(null);
  };
  const handleSubmitPersonalSchedule = async (schedule) => {
    if (selectedPersonalEvent) {
      await updatePersonalSchedule(selectedPersonalEvent.id, schedule);
    } else {
      await createPersonalSchedule(schedule);
    }

    closeEventModal();
    refresh();
  };
  const handleDeletePersonalSchedule = async () => {
    if (!selectedPersonalEvent) return;

    await deletePersonalSchedule(selectedPersonalEvent.id);
    closeEventModal();
    refresh();
  };
  const handleSubmitTeamEvent = async (event) => {
    if (activeTeamId == null) {
      throw new Error("팀 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }

    if (selectedTeamEvent) {
      await updateTeamEvent(activeTeamId, selectedTeamEvent.id, event);
    } else {
      await createTeamEvent(activeTeamId, event);
    }

    closeEventModal();
    refresh();
  };
  const handleDeleteTeamEvent = async () => {
    if (activeTeamId == null || !selectedTeamEvent) return;

    await deleteTeamEvent(activeTeamId, selectedTeamEvent.id);
    closeEventModal();
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
        <CreateEventButton
          onClick={() => {
            setSelectedPersonalEvent(null);
            setSelectedTeamEvent(null);
            setIsCreateEventOpen(true);
          }}
        />
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
        todayDay={isCurrentMonth ? today.day : null}
        onPersonalEventClick={
          context === "me"
            ? (event) => {
                setSelectedPersonalEvent(event);
                setIsCreateEventOpen(true);
              }
            : undefined
        }
        onTeamEventClick={
          context === "team"
            ? (event) => {
                setSelectedTeamEvent(event);
                setIsCreateEventOpen(true);
              }
            : undefined
        }
      />
      {context === "me" ? (
        <AddPersonalModal
          key={selectedPersonalEvent?.id ?? "creation"}
          isOpen={isCreateEventOpen}
          variant={selectedPersonalEvent ? "revision" : "creation"}
          initialSchedule={selectedPersonalEvent}
          timeZone={timeZone}
          onClose={closeEventModal}
          onSubmit={handleSubmitPersonalSchedule}
          onDelete={handleDeletePersonalSchedule}
        />
      ) : (
        <AddTeamEventModal
          key={selectedTeamEvent?.id ?? "creation"}
          isOpen={isCreateEventOpen}
          variant={selectedTeamEvent ? "revision" : "creation"}
          initialEvent={selectedTeamEvent}
          members={teamMembers}
          timeZone={timeZone}
          onClose={closeEventModal}
          onSubmit={handleSubmitTeamEvent}
          onDelete={handleDeleteTeamEvent}
        />
      )}
    </div>
  );
}

export default CalendarPage;
