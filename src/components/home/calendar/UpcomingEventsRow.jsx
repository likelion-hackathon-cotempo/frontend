import UpcomingEventCard from "./UpcomingEventCard.jsx";

const MOCK_UPCOMING_EVENTS = [
  { id: 1, title: "Interview", date: "26. 08. 12", time: "13:00 - 15:00", members: ["J"] },
  { id: 2, title: "Weekly Meeting", date: "26. 08. 12", time: "13:00 - 15:00", members: ["J", "S", "A", "L"] },
  { id: 3, title: "Weekly Meeting", date: "26. 08. 12", time: "13:00 - 15:00", members: ["J", "S", "A", "L"] },
];

function UpcomingEventsRow() {
  return (
    <div
      className="flex gap-3 overflow-x-auto"
      style={{
        maskImage: "linear-gradient(to right, black 85%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, black 85%, transparent 100%)",
      }}
    >
      {MOCK_UPCOMING_EVENTS.map((event) => (
        <UpcomingEventCard
          key={event.id}
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
