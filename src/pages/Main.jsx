import { useOutletContext } from "react-router-dom";
import CalendarCard from "../components/home/calendar/CalendarCard.jsx";
import SidePanel from "../components/home/side-panel/SidePanel.jsx";

function Main() {
  const {
    context,
    isCalendarContextReady,
    activeTeamId,
    teams,
    teamDetail,
    isTeamDetailLoading,
    milestones,
    isMilestonesLoading,
    milestoneError,
    onAddMilestone,
    onEditMilestone,
    onToggleMilestone,
    onAddMember,
    onConfirmMeetingSuggestion,
    onRecommendMilestones,
  } = useOutletContext();

  return (
    <>
      <main className="min-w-0 flex-1">
        <CalendarCard
          context={context}
          isContextReady={isCalendarContextReady}
          activeTeamId={activeTeamId}
          teamDetail={teamDetail}
        />
      </main>
      <aside className="w-[325px] shrink-0 overflow-y-auto">
        <SidePanel
          context={context}
          teams={teams}
          teamDetail={teamDetail}
          isTeamDetailLoading={isTeamDetailLoading}
          milestones={milestones}
          isMilestonesLoading={isMilestonesLoading}
          milestoneError={milestoneError}
          onAddMilestone={onAddMilestone}
          onEditMilestone={onEditMilestone}
          onToggleMilestone={onToggleMilestone}
          onAddMember={onAddMember}
          onConfirmMeetingSuggestion={onConfirmMeetingSuggestion}
          onRecommendMilestones={onRecommendMilestones}
        />
      </aside>
    </>
  );
}

export default Main;
