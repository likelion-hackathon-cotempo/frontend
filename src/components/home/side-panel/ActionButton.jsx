import { ChevronIcon } from "../../icons/index.jsx";

function ActionButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-2xl border border-purple-600 bg-purple-200 px-4 py-3"
    >
      <span className="text-title3 text-purple-900">{label}</span>
      <ChevronIcon className="h-6 w-6 text-purple-900" />
    </button>
  );
}

export default ActionButton;
