import { ProfileIcon, PlusIcon } from "../icons/index.jsx";

function IconRail({ contexts, activeId, onSelect, onAddTeam }) {
  return (
    <nav className="flex w-16 shrink-0 flex-col items-start gap-4">
      {contexts.map((ctx) => {
        const isActive = ctx.id === activeId;
        return (
          <button
            key={ctx.id}
            type="button"
            onClick={() => onSelect(ctx.id)}
            className="flex w-full flex-col items-center gap-2"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full border shadow-[0_0_16px_rgba(0,0,0,0.08)] ${
                isActive
                  ? "border-[#ac98e9] bg-gradient-to-b from-purple-900/0 to-purple-900/70 text-white"
                  : "border-white bg-white/65 text-gray-900"
              }`}
            >
              {ctx.type === "me" ? (
                <ProfileIcon className="h-[30px] w-[30px]" />
              ) : (
                <span className="text-title2 tracking-tight">{ctx.initial}</span>
              )}
            </span>
            <span className="w-full truncate text-center text-body1 text-gray-900">
              {ctx.label}
            </span>
          </button>
        );
      })}
      <button
        type="button"
        onClick={onAddTeam}
        aria-label="팀 추가"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500 text-purple-900 drop-shadow-[0_0_8px_rgba(0,0,0,0.08)]"
      >
        <PlusIcon className="h-[30px] w-[30px]" />
      </button>
    </nav>
  );
}

export default IconRail;
