import { useOutletContext } from "react-router-dom";
import CalendarPage from "../components/home/calendar/CalendarPage.jsx";

function MainCalendar() {
  const { context, teamId, teams } = useOutletContext();

  return (
    <main className="min-w-0 flex-1">
      <CalendarPage context={context} teamId={teamId} teams={teams} />
    </main>
  );
}

export default MainCalendar;
