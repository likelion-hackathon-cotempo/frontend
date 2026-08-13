import {
  HomeIcon,
  CalendarIcon,
  MyPageIcon,
  TeamPlaceholderIcon,
  LogoutIcon,
} from "../icons/index.jsx";

const MENU_CONFIG = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "calendar", label: "Calendar", Icon: CalendarIcon },
  { id: "mypage", label: "My Page", Icon: MyPageIcon, meOnly: true },
];

function SubSideNav({ context, teamName, activeMenu, onSelectMenu, onLogout }) {
  const menuItems = MENU_CONFIG.filter((item) => !item.meOnly || context === "me");

  return (
    <aside className="flex h-full w-[241px] flex-col justify-between rounded-[28px] border-2 border-white bg-white/65 px-3 py-5 shadow-[0_0_16px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-200">
            <TeamPlaceholderIcon className="h-5 w-5 text-purple-900" />
          </span>
          <span className="text-[18px] text-gray-900">{teamName}</span>
        </div>
        <ul className="flex flex-col gap-1">
          {menuItems.map(({ id, label, Icon }) => {
            const isActive = activeMenu === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onSelectMenu(id)}
                  className={`flex w-full items-center gap-2 rounded-full px-4 py-3 ${
                    isActive ? "bg-purple-200 text-purple-900" : "text-gray-700"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className={isActive ? "text-title3" : "text-subtitle3"}>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="flex items-center gap-2 rounded-xl px-4 py-3 text-gray-700"
      >
        <LogoutIcon className="h-6 w-6" />
        <span className="text-subtitle3">Log Out</span>
      </button>
    </aside>
  );
}

export default SubSideNav;
