import FilterPill from "./FilterPill.jsx";

function CalendarFilters({ filters, activeFilters, onToggle }) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <FilterPill
          key={filter.id}
          label={filter.label}
          active={activeFilters.includes(filter.id)}
          onClick={() => onToggle(filter.id)}
        />
      ))}
    </div>
  );
}

export default CalendarFilters;
