import { useOutletContext } from "react-router-dom";
import CalendarCard from "../components/home/calendar/CalendarCard.jsx";
import SidePanel from "../components/home/side-panel/SidePanel.jsx";
import { useAuth } from "../auth/AuthContext.js";
import { getMemberTimeZone } from "../utils/dateTime.js";

function Main() {
  const { currentUser } = useAuth();
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
    teamId,
    onAddMilestone,
    onEditMilestone,
    onToggleMilestone,
    onAddMember,
    onConfirmMeetingSuggestion,
    onRecommendMilestones,
  } = useOutletContext();
  const selectedTeamId = activeTeamId ?? teamId;

  return (
    <>
      <main className="min-w-0 flex-1">
        <CalendarCard
          context={context}
          isContextReady={isCalendarContextReady}
          activeTeamId={selectedTeamId}
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
          timeZone={getMemberTimeZone(currentUser)}
        />
      </aside>
    </>
  );
}

export default Main;
