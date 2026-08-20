import MilestoneCard from "./MilestoneCard.jsx";
import MeetingSuggestionCard from "./MeetingSuggestionCard.jsx";
import PeopleCard from "./PeopleCard.jsx";

const COUNTRY_LABELS = {
  KR: "South Korea",
  VN: "Vietnam",
  US: "United States",
};

const getInitial = (name) =>
  Array.from(name.trim())[0]?.toUpperCase() ?? "";

function SidePanel({
  context,
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
  timeZone,
}) {
  const members = (teamDetail?.members ?? []).map((member) => ({
    id: member.memberId,
    initial: getInitial(member.name),
    name: member.name,
    subtitle: [
      COUNTRY_LABELS[member.country] ?? member.country,
      member.position ?? member.role,
    ]
      .filter(Boolean)
      .join(" · "),
  }));
  const myTeams = teams.map((team) => ({
    id: team.id,
    initial: getInitial(team.name),
    name: team.name,
    subtitle: team.myRole,
  }));

  return (
    <div className="flex w-full flex-col gap-6">
      {context === "team" ? (
        <>
          <MilestoneCard
            milestones={milestones}
            isLoading={isMilestonesLoading}
            error={milestoneError}
            onAddMilestone={onAddMilestone}
            onEditMilestone={onEditMilestone}
            onToggleMilestone={onToggleMilestone}
            onRecommendMilestones={onRecommendMilestones}
            timeZone={timeZone}
          />
          <MeetingSuggestionCard
            day="Thursday"
            time="10:00 AM"
            timezone="KST"
            onConfirm={onConfirmMeetingSuggestion}
          />
          <PeopleCard
            title="Member"
            items={members}
            isLoading={isTeamDetailLoading}
            emptyMessage="No members yet."
            showAddButton
            onAdd={onAddMember}
          />
        </>
      ) : (
        <PeopleCard
          title="My Teams"
          items={myTeams}
          emptyMessage="No teams yet."
          showAddButton={false}
        />
      )}
    </div>
  );
}

export default SidePanel;
