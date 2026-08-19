import { useOutletContext } from "react-router-dom";
import CalendarPage from "../components/home/calendar/CalendarPage.jsx";

function MainCalendar() {
  const {
    context,
    isCalendarContextReady,
    teams,
    activeTeamId,
    teamDetail,
    teamId,
  } = useOutletContext();
  const selectedTeamId = activeTeamId ?? teamId;

  return (
    <main className="min-w-0 flex-1">
      <CalendarPage
        context={context}
        isContextReady={isCalendarContextReady}
        teams={teams}
        activeTeamId={selectedTeamId}
        teamDetail={teamDetail}
      />
    </main>
  );
}

export default MainCalendar;
