import { useOutletContext } from "react-router-dom";
import CalendarCard from "../components/home/calendar/CalendarCard.jsx";
import SidePanel from "../components/home/side-panel/SidePanel.jsx";

function Main() {
  const {
    context,
    teamId,
    onAddMilestone,
    onAddMember,
    onConfirmMeetingSuggestion,
    onRecommendMilestones,
  } = useOutletContext();

  return (
    <>
      <main className="min-w-0 flex-1">
        <CalendarCard context={context} teamId={teamId} />
      </main>
      <aside className="w-[325px] shrink-0 overflow-y-auto">
        <SidePanel
          context={context}
          onAddMilestone={onAddMilestone}
          onAddMember={onAddMember}
          onConfirmMeetingSuggestion={onConfirmMeetingSuggestion}
          onRecommendMilestones={onRecommendMilestones}
        />
      </aside>
    </>
  );
}

export default Main;
