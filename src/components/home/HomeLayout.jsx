import { useState } from "react";
import { Outlet } from "react-router-dom";
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
  const [activeId, setActiveId] = useState("me");

  const activeContext = MOCK_CONTEXTS.find((ctx) => ctx.id === activeId);
  const teams = MOCK_CONTEXTS.filter((ctx) => ctx.type === "team").map((ctx) => ({
    id: ctx.id,
    name: ctx.teamName,
  }));

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#f3f4ff] px-10 py-6">
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
          onLogout={() => {}}
        />
        <Outlet context={{ context: activeContext.type, teams }} />
      </div>
    </div>
  );
}

export default HomeLayout;
