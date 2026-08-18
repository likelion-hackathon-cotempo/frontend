import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IconRail from "./IconRail.jsx";
import SubSideNav from "./SubSideNav.jsx";
import CalendarCard from "./calendar/CalendarCard.jsx";
import CalendarPage from "./calendar/CalendarPage.jsx";
import SidePanel from "./side-panel/SidePanel.jsx";
import MyPage from "../mypage/MyPage.jsx";
import AddTeamModal from "../modal/AddTeamModal.jsx";
import JoinTeamModal from "../modal/JoinTeamModal.jsx";
import JoinTeamRoleModal from "../modal/JoinTeamRoleModal.jsx";
import TeamActionMenu from "../modal/TeamActionMenu.jsx";
import AddMilestoneSelfModal from "../modal/AddMilestoneSelfModal.jsx";
import MeetingSuggestion from "../modal/MeetingSuggestion.jsx";
import MilestoneSuggestion from "../modal/MilestoneSuggestion.jsx";

const MOCK_CONTEXTS = [
  { id: "me", type: "me", label: "MY" },
  {
    id: "team-1",
    type: "team",
    label: "Culture...",
    initial: "C",
    teamName: "Culture Land",
  },
  {
    id: "team-2",
    type: "team",
    label: "Teamn...",
    initial: "T",
    teamName: "Teamname",
  },
];

function HomeLayout({ page = "home" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const requestedContextId = location.state?.activeId;
  const initialActiveId = MOCK_CONTEXTS.some((context) => context.id === requestedContextId)
    ? requestedContextId
    : "team-1";
  const [activeId, setActiveId] = useState(page === "mypage" ? "me" : initialActiveId);
  const [isTeamActionMenuOpen, setIsTeamActionMenuOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isJoinTeamModalOpen, setIsJoinTeamModalOpen] = useState(false);
  const [isJoinTeamRoleModalOpen, setIsJoinTeamRoleModalOpen] = useState(false);
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
  const [isMeetingSuggestionOpen, setIsMeetingSuggestionOpen] = useState(false);
  const [isMilestoneSuggestionOpen, setIsMilestoneSuggestionOpen] =
    useState(false);
  const [milestoneSuggestionVariant, setMilestoneSuggestionVariant] =
    useState("input");
  const [meetingSuggestionVariant, setMeetingSuggestionVariant] =
    useState("input");
  const [joinTeamModalVariant, setJoinTeamModalVariant] = useState("input");

  const activeContext = MOCK_CONTEXTS.find((ctx) => ctx.id === activeId);
  const teams = MOCK_CONTEXTS.filter((ctx) => ctx.type === "team").map((ctx) => ({
    id: ctx.id,
    name: ctx.teamName,
  }));

  const handleContextSelect = (contextId) => {
    if (page === "mypage" && contextId !== "me") {
      navigate("/main", { state: { activeId: contextId } });
      return;
    }

    setActiveId(contextId);
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#f3f4ff] px-10 py-6">
      <span className="text-title1 text-gray-900">logo</span>
      <div className="flex flex-1 items-stretch gap-6">
        <div className="relative h-fit shrink-0">
          <IconRail
            contexts={MOCK_CONTEXTS}
            activeId={activeId}
            onSelect={handleContextSelect}
            onAddTeam={() => setIsTeamActionMenuOpen((isOpen) => !isOpen)}
          />
          <div className="absolute left-0 top-full z-10 mt-3 w-max">
            <TeamActionMenu
              isOpen={isTeamActionMenuOpen}
              onCreate={() => {
                setIsTeamActionMenuOpen(false);
                setIsAddTeamModalOpen(true);
              }}
              onJoin={() => {
                setIsTeamActionMenuOpen(false);
                setJoinTeamModalVariant("input");
                setIsJoinTeamModalOpen(true);
              }}
            />
          </div>
        </div>
        <SubSideNav
          context={activeContext.type}
          teamName={activeContext.type === "me" ? "MY" : activeContext.teamName}
          onLogout={() => {}}
        />
        {page === "calendar" ? (
          <main className="min-w-0 flex-1">
            <CalendarPage context={activeContext.type} teams={teams} />
          </main>
        ) : page === "mypage" ? (
          <main className="min-w-0 flex-1">
            <MyPage />
          </main>
        ) : (
          <>
            <main className="min-w-0 flex-1">
              <CalendarCard />
            </main>
            <aside className="w-[325px] shrink-0 overflow-y-auto">
              <SidePanel
                context={activeContext.type}
                onAddMilestone={() => setIsAddMilestoneModalOpen(true)}
                onAddMember={() => {
                  setJoinTeamModalVariant("share");
                  setIsJoinTeamModalOpen(true);
                }}
                onConfirmMeetingSuggestion={() => {
                  setMeetingSuggestionVariant("input");
                  setIsMeetingSuggestionOpen(true);
                }}
                onRecommendMilestones={() => {
                  setMilestoneSuggestionVariant("input");
                  setIsMilestoneSuggestionOpen(true);
                }}
              />
            </aside>
          </>
        )}
      </div>
      <AddTeamModal
        isOpen={isAddTeamModalOpen}
        onClose={() => setIsAddTeamModalOpen(false)}
        onSubmit={() => {
          setIsAddTeamModalOpen(false);
          setJoinTeamModalVariant("share");
          setIsJoinTeamModalOpen(true);
        }}
      />
      <JoinTeamModal
        isOpen={isJoinTeamModalOpen}
        variant={joinTeamModalVariant}
        onClose={() => setIsJoinTeamModalOpen(false)}
        onSubmit={() => {
          setIsJoinTeamModalOpen(false);
          setIsJoinTeamRoleModalOpen(true);
        }}
      />
      <JoinTeamRoleModal
        isOpen={isJoinTeamRoleModalOpen}
        onClose={() => setIsJoinTeamRoleModalOpen(false)}
        onSubmit={() => setIsJoinTeamRoleModalOpen(false)}
      />
      <AddMilestoneSelfModal
        isOpen={isAddMilestoneModalOpen}
        onClose={() => setIsAddMilestoneModalOpen(false)}
        onSubmit={() => setIsAddMilestoneModalOpen(false)}
      />
      <MeetingSuggestion
        isOpen={isMeetingSuggestionOpen}
        variant={meetingSuggestionVariant}
        onClose={() => {
          setIsMeetingSuggestionOpen(false);
          setMeetingSuggestionVariant("input");
        }}
        onNext={() => setMeetingSuggestionVariant("select")}
        onBack={() => setMeetingSuggestionVariant("input")}
        onSubmit={() => {
          setIsMeetingSuggestionOpen(false);
          setMeetingSuggestionVariant("input");
        }}
      />
      <MilestoneSuggestion
        isOpen={isMilestoneSuggestionOpen}
        variant={milestoneSuggestionVariant}
        onClose={() => {
          setIsMilestoneSuggestionOpen(false);
          setMilestoneSuggestionVariant("input");
        }}
        onNext={() => setMilestoneSuggestionVariant("select")}
        onBack={() => setMilestoneSuggestionVariant("input")}
        onSubmit={() => {
          setIsMilestoneSuggestionOpen(false);
          setMilestoneSuggestionVariant("input");
        }}
      />
    </div>
  );
}

export default HomeLayout;
