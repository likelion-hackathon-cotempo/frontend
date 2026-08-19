import { useState } from "react";
import MonthNav from "./MonthNav.jsx";
import MonthGrid from "./MonthGrid.jsx";
import CreateEventButton from "./CreateEventButton.jsx";
import UpcomingEventsRow from "./UpcomingEventsRow.jsx";
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

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const getInitial = (name) =>
  Array.from(String(name ?? "").trim())[0]?.toUpperCase() ?? "";

function CalendarCard({
  context,
  isContextReady,
  activeTeamId,
  teamDetail,
}) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedPersonalEvent, setSelectedPersonalEvent] = useState(null);
  const [selectedTeamEvent, setSelectedTeamEvent] = useState(null);

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
      <MonthGrid
        year={year}
        month={month}
        events={eventsByDay}
        todayDay={isCurrentMonth ? today.getDate() : null}
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
          onClose={closeEventModal}
          onSubmit={handleSubmitTeamEvent}
          onDelete={handleDeleteTeamEvent}
        />
      )}
    </div>
  );
}

export default CalendarCard;
