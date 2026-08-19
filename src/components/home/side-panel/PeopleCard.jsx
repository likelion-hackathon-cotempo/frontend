import { PlusIcon } from "../../icons/index.jsx";
import SidePanelCard from "./SidePanelCard.jsx";

const AVATAR_GRADIENTS = [
  { from: "#e1e1e1", to: "#646464" },
  { from: "#ffe8e8", to: "#ff6060" },
  { from: "#c8d5ff", to: "#2b5dff" },
  { from: "#b3ffcb", to: "#50cb76" },
  { from: "#ecdbff", to: "#6c11d4" },
];

function PeopleCard({
  title,
  items,
  isLoading = false,
  emptyMessage = "",
  showAddButton,
  onAdd,
}) {
  return (
    <SidePanelCard title={title}>
      <div className="flex w-full flex-col gap-2">
        {isLoading && (
          <p className="py-3 text-center text-body2 text-gray-500">
            Loading...
          </p>
        )}
        {!isLoading && items.length === 0 && emptyMessage && (
          <p className="py-3 text-center text-body2 text-gray-500">
            {emptyMessage}
          </p>
        )}
        {items.map((item, index) => {
          const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
          return (
            <div
              key={item.id}
              className="flex w-full items-center gap-3 rounded-2xl border border-purple-600 bg-purple-100 px-4 py-3"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[20px] font-semibold text-white drop-shadow-[0_0_5.8px_rgba(52,56,65,0.1)]"
                style={{ background: `linear-gradient(to bottom, ${gradient.from}, ${gradient.to})` }}
              >
                {item.initial}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-subtitle2 text-gray-900">{item.name}</p>
                <p className="text-body2 text-gray-500">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
        {showAddButton && (
          <button
            type="button"
            onClick={onAdd}
            aria-label="추가"
            className="flex w-full cursor-pointer items-center justify-center rounded-2xl border border-purple-600 bg-purple-200 px-4 py-3"
          >
            <PlusIcon className="h-6 w-6 text-purple-900" />
          </button>
        )}
      </div>
    </SidePanelCard>
  );
}

export default PeopleCard;
