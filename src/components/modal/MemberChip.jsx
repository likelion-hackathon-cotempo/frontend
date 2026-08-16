// 팀 일정 추가 모달에서 참여자를 선택하는 칩 컴포넌트

const AVATAR_GRADIENTS = [
  { from: "#e1e1e1", to: "#646464" },
  { from: "#ffe8e8", to: "#ff6060" },
  { from: "#c8d5ff", to: "#2b5dff" },
  { from: "#b3ffcb", to: "#50cb76" },
  { from: "#ecdbff", to: "#6c11d4" },
];

function MemberChip({ initial, name, index, selected, onToggle }) {
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-16 border px-2 py-1 ${
        selected ? "border-purple-900 bg-purple-100" : "border-gray-300"
      }`}
    >
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11.4px] font-semibold text-white"
        style={{ background: `linear-gradient(to bottom, ${gradient.from}, ${gradient.to})` }}
      >
        {initial}
      </span>
      <span className="text-body2 text-gray-900">{name}</span>
    </button>
  );
}

export default MemberChip;
