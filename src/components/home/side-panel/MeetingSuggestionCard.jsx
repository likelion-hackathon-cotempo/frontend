import SidePanelCard from "./SidePanelCard.jsx";
import ActionButton from "./ActionButton.jsx";

function MeetingSuggestionCard({ day, time, timezone, onConfirm }) {
  return (
    <SidePanelCard title="Meeting Suggestions">
      <div className="flex w-full flex-col gap-2">
        <p className="text-body2 text-gray-900">
          {"This week's only overlapping time for everyone is "}
          <span className="font-semibold">
            {day} at {time} ({timezone}).
          </span>
          {" Would you like to make it your recurring team meeting?"}
        </p>
        <ActionButton label="Confirm This Time" onClick={onConfirm} />
      </div>
    </SidePanelCard>
  );
}

export default MeetingSuggestionCard;
