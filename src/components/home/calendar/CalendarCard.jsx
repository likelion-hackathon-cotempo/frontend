import { useState } from "react";
import MonthNav from "./MonthNav.jsx";
import MonthGrid from "./MonthGrid.jsx";
import CreateEventButton from "./CreateEventButton.jsx";
import UpcomingEventsRow from "./UpcomingEventsRow.jsx";

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MOCK_EVENTS = {
  5: [{ color: "blue", title: "Interview", person: "Sally" }],
  10: [{ color: "red", title: "Weekly Meeting", person: "ALL" }],
  13: [{ color: "p", title: "Wireframe Complete" }],
  18: [{ color: "green", title: "Summer Vacation", person: "Sally" }],
  25: [{ color: "p", title: "QA Complete" }],
  28: [{ color: "p", title: "Final Presentation" }],
};

function CalendarCard() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const goToPrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <MonthNav
          monthLabel={`${MONTH_LABELS[month]} ${year}`}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
        />
        <CreateEventButton onClick={() => {}} />
      </div>
      <UpcomingEventsRow />
      <MonthGrid
        year={year}
        month={month}
        events={MOCK_EVENTS}
        todayDay={isCurrentMonth ? today.getDate() : null}
      />
    </div>
  );
}

export default CalendarCard;
