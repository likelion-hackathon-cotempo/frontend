import MilestoneCard from "./MilestoneCard.jsx";
import MeetingSuggestionCard from "./MeetingSuggestionCard.jsx";
import PeopleCard from "./PeopleCard.jsx";

const MOCK_MILESTONES = [
  { id: 1, dueLabel: "08. 13 · 20:00", title: "Wireframe Complete" },
  { id: 2, dueLabel: "08. 25 · 20:00", title: "QA Complete" },
  { id: 3, dueLabel: "08. 28 · 20:00", title: "Final Presentation" },
];

const MOCK_MEMBERS = [
  { id: 1, initial: "J", name: "Jane", subtitle: "South Korea · UX Designer" },
  { id: 2, initial: "S", name: "Sally", subtitle: "Vietnam · Product Manager" },
  { id: 3, initial: "A", name: "Alex", subtitle: "United States · Frontend" },
  { id: 4, initial: "L", name: "Liam", subtitle: "South Korea · Backend" },
];

const MOCK_MY_TEAMS = [
  { id: 1, initial: "J", name: "Culture Land", subtitle: "ddd · Hackathon" },
  { id: 2, initial: "S", name: "aaaaaaa", subtitle: "ddd · Global Project" },
];

function SidePanel({ context, onAddMilestone, onAddMember }) {
  return (
    <div className="flex w-full flex-col gap-6">
      <MilestoneCard
        milestones={MOCK_MILESTONES}
        onAddMilestone={onAddMilestone}
        onRecommendMilestones={() => {}}
      />
      {context === "team" ? (
        <>
          <MeetingSuggestionCard
            day="Thursday"
            time="10:00 AM"
            timezone="KST"
            onConfirm={() => {}}
          />
          <PeopleCard title="Member" items={MOCK_MEMBERS} showAddButton onAdd={onAddMember} />
        </>
      ) : (
        <PeopleCard title="My Teams" items={MOCK_MY_TEAMS} showAddButton={false} />
      )}
    </div>
  );
}

export default SidePanel;
