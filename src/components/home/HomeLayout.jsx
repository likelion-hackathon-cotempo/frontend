import { useState } from "react";
import IconRail from "./IconRail.jsx";
import SubSideNav from "./SubSideNav.jsx";

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
  const [activeId, setActiveId] = useState("team-1");
  const [activeMenu, setActiveMenu] = useState("home");

  const activeContext = MOCK_CONTEXTS.find((ctx) => ctx.id === activeId);

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50 px-10 py-6">
      <span className="text-title1 text-gray-900">logo</span>
      <div className="flex flex-1 items-stretch gap-6">
        <IconRail
          contexts={MOCK_CONTEXTS}
          activeId={activeId}
          onSelect={setActiveId}
          onAddTeam={() => {}}
        />
        <SubSideNav
          context={activeContext.type}
          teamName={activeContext.type === "me" ? "MY" : activeContext.teamName}
          activeMenu={activeMenu}
          onSelectMenu={setActiveMenu}
          onLogout={() => {}}
        />
        <main className="flex-1 rounded-2xl bg-white p-6">
          <p className="text-body2 text-gray-500">캘린더 영역 (다음 PR)</p>
        </main>
        <aside className="w-80 rounded-2xl bg-white p-6">
          <p className="text-body2 text-gray-500">사이드 패널 (다음 PR)</p>
        </aside>
      </div>
    </div>
  );
}

export default HomeLayout;
