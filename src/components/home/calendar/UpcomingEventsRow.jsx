import UpcomingEventCard from "./UpcomingEventCard.jsx";

function UpcomingEventsRow({ events, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex h-[122px] items-center text-body2 text-gray-500">
        Loading schedules...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex h-[122px] items-center text-body2 text-gray-500">
        No schedules this month.
      </div>
    );
  }

  return (
    <div
      className="flex min-w-0 gap-3 overflow-x-auto pb-1"
      style={{
        maskImage: "linear-gradient(to right, black 85%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, black 85%, transparent 100%)",
      }}
    >
      {events.map((event) => (
        <UpcomingEventCard
          key={event.key}
          title={event.title}
          date={event.date}
          time={event.time}
          members={event.members}
        />
      ))}
    </div>
  );
}

export default UpcomingEventsRow;
