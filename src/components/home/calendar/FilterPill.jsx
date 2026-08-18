function FilterPill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 cursor-pointer rounded-full border px-5 py-2 text-subtitle3 ${
        active
          ? "border-purple-700 bg-purple-700 text-purple-100"
          : "border-gray-500 bg-purple-100 text-gray-500"
      }`}
    >
      {label}
    </button>
  );
}

export default FilterPill;
