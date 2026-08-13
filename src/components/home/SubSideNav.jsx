const BASE_MENU_ITEMS = [
  { id: "home", label: "Home" },
  { id: "calendar", label: "Calendar" },
];

function SubSideNav({ context, teamName, teamInitial, activeMenu, onSelectMenu }) {
  const menuItems =
    context === "me"
      ? [...BASE_MENU_ITEMS, { id: "mypage", label: "My Page" }]
      : BASE_MENU_ITEMS;

  return (
    <aside className="flex w-60 flex-col gap-6 py-2">
      <div className="flex items-center gap-2 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-title4 text-purple-700">
          {teamInitial}
        </span>
        <span className="text-title2 text-gray-900">{teamName}</span>
      </div>
      <ul className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelectMenu(item.id)}
              className={`w-full rounded-lg px-3 py-2 text-left text-subtitle3 ${
                activeMenu === item.id
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-700"
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default SubSideNav;
