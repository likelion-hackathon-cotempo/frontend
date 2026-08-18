import { useState } from "react";
import IconRail from "./IconRail.jsx";
import SubSideNav from "./SubSideNav.jsx";
import CalendarCard from "./calendar/CalendarCard.jsx";
import CalendarPage from "./calendar/CalendarPage.jsx";
import SidePanel from "./side-panel/SidePanel.jsx";

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
  const [activeId, setActiveId] = useState("team-1");

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
        {page === "calendar" ? (
          <main className="min-w-0 flex-1">
            <CalendarPage context={activeContext.type} teams={teams} />
          </main>
        ) : (
          <>
            <main className="min-w-0 flex-1">
              <CalendarCard context={activeContext.type} />
            </main>
            <aside className="w-[325px] shrink-0 overflow-y-auto">
              <SidePanel context={activeContext.type} />
            </aside>
          </>
        )}
      </div>
    </div>
  );
}

export default HomeLayout;
