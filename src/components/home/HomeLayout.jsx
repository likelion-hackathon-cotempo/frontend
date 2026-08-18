import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import IconRail from "./IconRail.jsx";
import SubSideNav from "./SubSideNav.jsx";
import AddTeamModal from "../modal/AddTeamModal.jsx";
import JoinTeamModal from "../modal/JoinTeamModal.jsx";
import JoinTeamRoleModal from "../modal/JoinTeamRoleModal.jsx";
import TeamActionMenu from "../modal/TeamActionMenu.jsx";
import AddMilestoneSelfModal from "../modal/AddMilestoneSelfModal.jsx";
import MeetingSuggestion from "../modal/MeetingSuggestion.jsx";
import MilestoneSuggestion from "../modal/MilestoneSuggestion.jsx";
import BrandLogo from "../common/BrandLogo.jsx";
import { logout } from "../../api/auth.js";
import { useAuth } from "../../auth/AuthContext.js";

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

function HomeLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const requestedContextId = location.state?.activeId;
  const initialActiveId = MOCK_CONTEXTS.some((context) => context.id === requestedContextId)
    ? requestedContextId
    : location.pathname === "/main/mypage"
      ? "me"
      : "team-1";
  const [activeId, setActiveId] = useState(initialActiveId);
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const activeContext = MOCK_CONTEXTS.find((ctx) => ctx.id === activeId);
  const teams = MOCK_CONTEXTS.filter((ctx) => ctx.type === "team").map((ctx) => ({
    id: ctx.id,
    name: ctx.teamName,
  }));

  const handleContextSelect = (contextId) => {
    setActiveId(contextId);

    if (location.pathname === "/main/mypage" && contextId !== "me") {
      navigate("/main");
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
      setIsAuthenticated(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      alert(error?.message || "로그아웃에 실패했습니다. 다시 시도해주세요.");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#f3f4ff] px-10 py-6">
      <BrandLogo />
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
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
        <Outlet
          context={{
            context: activeContext.type,
            teams,
            onAddMilestone: () => setIsAddMilestoneModalOpen(true),
            onAddMember: () => {
              setJoinTeamModalVariant("share");
              setIsJoinTeamModalOpen(true);
            },
            onConfirmMeetingSuggestion: () => {
              setMeetingSuggestionVariant("input");
              setIsMeetingSuggestionOpen(true);
            },
            onRecommendMilestones: () => {
              setMilestoneSuggestionVariant("input");
              setIsMilestoneSuggestionOpen(true);
            },
          }}
        />
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
