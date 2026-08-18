import SidePanelCard from "./SidePanelCard.jsx";
import ActionButton from "./ActionButton.jsx";

function MeetingSuggestionCard({ onConfirm }) {
  return (
    <SidePanelCard title="Meeting Suggestions">
      <ActionButton label="Confirm This Time" onClick={onConfirm} />
    </SidePanelCard>
  );
}

export default MeetingSuggestionCard;
