import { useEffect, useState } from "react";
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
import {
  createTeam,
  getMyTeams,
  getTeamDetail,
  joinTeam,
} from "../../api/team.js";
import { useAuth } from "../../auth/AuthContext.js";

const MY_CONTEXT = { id: "me", type: "me", label: "MY" };

const toTeamContext = ({ teamId, name, myRole }) => {
  const teamName = name.trim();

  return {
    id: `team-${teamId}`,
    teamId,
    type: "team",
    label: teamName,
    initial: Array.from(teamName)[0]?.toUpperCase() ?? "",
    teamName,
    myRole,
  };
};

function HomeLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [initialSelection] = useState(() => ({
    isMyPage: location.pathname === "/main/mypage",
    requestedContextId: location.state?.activeId,
  }));
  const [teamContexts, setTeamContexts] = useState([]);
  const [teamDetail, setTeamDetail] = useState(null);
  const [isTeamDetailLoading, setIsTeamDetailLoading] = useState(false);
  const [activeId, setActiveId] = useState(
    initialSelection.isMyPage ? "me" : null,
  );
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
  const [joinInviteCode, setJoinInviteCode] = useState("");
  const [createdTeamInviteCode, setCreatedTeamInviteCode] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const contexts = [MY_CONTEXT, ...teamContexts];
  const activeContext =
    contexts.find((context) => context.id === activeId) ?? MY_CONTEXT;
  const activeTeamId =
    activeContext.type === "team" ? activeContext.teamId : null;
  const activeTeamDetail =
    teamDetail?.teamId === activeTeamId ? teamDetail : null;
  const teams = teamContexts.map((context) => ({
    id: context.teamId,
    name: context.teamName,
    myRole: context.myRole,
  }));

  useEffect(() => {
    let isActive = true;

    const loadMyTeams = async () => {
      try {
        const participatingTeams = await getMyTeams();
        if (!isActive) return;

        const nextTeamContexts = participatingTeams.map(toTeamContext);

        setTeamContexts(nextTeamContexts);
        setActiveId((currentActiveId) => {
          if (initialSelection.isMyPage) return "me";

          const requestedContext = nextTeamContexts.find(
            (context) =>
              context.id === String(initialSelection.requestedContextId) ||
              String(context.teamId) ===
                String(initialSelection.requestedContextId),
          );

          if (requestedContext) return requestedContext.id;
          if (
            nextTeamContexts.some(
              (context) => context.id === currentActiveId,
            )
          ) {
            return currentActiveId;
          }

          return nextTeamContexts[0]?.id ?? "me";
        });
      } catch (error) {
        if (!isActive) return;

        console.error(error);
        alert(
          error?.message ||
            "참여 중인 팀 목록을 불러오지 못했습니다. 다시 시도해주세요.",
        );
        setActiveId((currentActiveId) => currentActiveId ?? "me");
      }
    };

    loadMyTeams();

    return () => {
      isActive = false;
    };
  }, [initialSelection]);

  useEffect(() => {
    if (activeTeamId === null) {
      return undefined;
    }

    const controller = new AbortController();

    const loadTeamDetail = async () => {
      setTeamDetail(null);
      setIsTeamDetailLoading(true);

      try {
        const detail = await getTeamDetail(activeTeamId, {
          signal: controller.signal,
        });

        setTeamDetail(detail);
        setTeamContexts((currentContexts) =>
          currentContexts.map((context) =>
            context.teamId === detail.teamId
              ? toTeamContext(detail)
              : context,
          ),
        );
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error(error);
        alert(
          error?.message ||
            "팀 상세 정보를 불러오지 못했습니다. 다시 시도해주세요.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsTeamDetailLoading(false);
        }
      }
    };

    loadTeamDetail();

    return () => controller.abort();
  }, [activeTeamId]);

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

  const handleCreateTeam = async (name) => {
    const createdTeam = await createTeam(name);
    const createdTeamContext = toTeamContext({
      ...createdTeam,
      myRole: "OWNER",
    });

    setTeamContexts((currentContexts) => [
      ...currentContexts.filter(
        (context) => context.teamId !== createdTeamContext.teamId,
      ),
      createdTeamContext,
    ]);
    setCreatedTeamInviteCode(createdTeam.inviteCode);
    setIsAddTeamModalOpen(false);
    setJoinTeamModalVariant("share");
    setIsJoinTeamModalOpen(true);
  };

  const handleJoinTeam = async (position) => {
    const joinedTeam = await joinTeam(joinInviteCode, position);
    const joinedTeamContext = toTeamContext({
      ...joinedTeam,
      myRole: joinedTeam.myRole ?? "MEMBER",
    });

    setTeamContexts((currentContexts) => [
      ...currentContexts.filter(
        (context) => context.teamId !== joinedTeamContext.teamId,
      ),
      joinedTeamContext,
    ]);
    setActiveId(joinedTeamContext.id);
    setJoinInviteCode("");
    setIsJoinTeamRoleModalOpen(false);

    if (location.pathname === "/main/mypage") {
      navigate("/main");
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#f3f4ff] px-10 py-6">
      <BrandLogo />
      <div className="flex flex-1 items-stretch gap-6">
        <div className="relative h-fit shrink-0">
          <IconRail
            contexts={contexts}
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
                setJoinInviteCode("");
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
            isCalendarContextReady: activeId !== null,
            teams,
            activeTeamId,
            teamDetail: activeTeamDetail,
            isTeamDetailLoading,
            onAddMilestone: () => setIsAddMilestoneModalOpen(true),
            onAddMember: () => {
              if (!activeTeamDetail?.inviteCode) {
                alert("초대 코드를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
                return;
              }

              setCreatedTeamInviteCode(activeTeamDetail.inviteCode);
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
        onSubmit={handleCreateTeam}
      />
      <JoinTeamModal
        isOpen={isJoinTeamModalOpen}
        variant={joinTeamModalVariant}
        inviteCode={createdTeamInviteCode || undefined}
        onClose={() => setIsJoinTeamModalOpen(false)}
        onSubmit={(inviteCode) => {
          setJoinInviteCode(inviteCode);
          setIsJoinTeamModalOpen(false);
          setIsJoinTeamRoleModalOpen(true);
        }}
      />
      <JoinTeamRoleModal
        isOpen={isJoinTeamRoleModalOpen}
        onClose={() => {
          setJoinInviteCode("");
          setIsJoinTeamRoleModalOpen(false);
        }}
        onSubmit={handleJoinTeam}
      />
      <AddMilestoneSelfModal
        isOpen={isAddMilestoneModalOpen}
        onClose={() => setIsAddMilestoneModalOpen(false)}
        onSubmit={() => setIsAddMilestoneModalOpen(false)}
      />
      <MeetingSuggestion
        isOpen={isMeetingSuggestionOpen}
        variant={meetingSuggestionVariant}
        teamId={activeTeamId}
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
        teamId={activeTeamId}
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
