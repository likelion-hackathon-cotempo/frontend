function IconRail({ contexts, activeId, onSelect, onAddTeam }) {
  return (
    <nav className="flex w-16 flex-col items-center gap-2 py-2">
      {contexts.map((ctx) => (
        <button
          key={ctx.id}
          type="button"
          onClick={() => onSelect(ctx.id)}
          className="flex flex-col items-center gap-1"
        >
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-full text-title3 ${
              activeId === ctx.id
                ? "bg-purple-700 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {ctx.type === "me" ? "MY" : ctx.initial}
          </span>
          <span className="text-label2 text-gray-700">{ctx.label}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onAddTeam}
        aria-label="팀 추가"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-title2 text-purple-700"
      >
        +
      </button>
    </nav>
  );
}

export default IconRail;
