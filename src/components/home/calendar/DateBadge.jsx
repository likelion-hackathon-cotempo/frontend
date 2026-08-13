function DateBadge({ day, isToday }) {
  return (
    <div
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-title4 ${
        isToday ? "bg-purple-900 text-gray-50" : "text-gray-700"
      }`}
    >
      {day}
    </div>
  );
}

export default DateBadge;
