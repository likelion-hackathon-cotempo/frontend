const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function WeekdayHeader() {
  return (
    <div className="flex w-full items-center">
      {WEEKDAYS.map((day) => (
        <div
          key={day}
          className="flex flex-1 items-center justify-center border border-[#cbd9e6] bg-[#f8fafc] px-2.5 py-3"
        >
          <p className="text-body2 text-gray-900">{day}</p>
        </div>
      ))}
    </div>
  );
}

export default WeekdayHeader;
