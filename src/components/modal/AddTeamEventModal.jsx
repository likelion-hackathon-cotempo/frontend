import { useEffect, useState } from "react";
import closeIcon from "../../assets/icons/close.svg";
import DateInput from "./DateInput.jsx";
import Meridiem from "./Meridiem.jsx";
import ModalButton from "./ModalButton.jsx";
import Textfield from "./Textfield.jsx";
import TimeInput from "./TimeInput.jsx";
import MemberChip from "./MemberChip.jsx";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const DEFAULT_DATE = getCurrentDate();

const convertToMinutes = ({ hour, minute }, meridiem) => {
  const hourNumber = Number(hour);
  const minuteNumber = Number(minute);
  const normalizedHour = (hourNumber % 12) + (meridiem === "PM" ? 12 : 0);

  return normalizedHour * 60 + minuteNumber;
};

function AddTeamEventModal({ isOpen, members, onClose, onSubmit }) {
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState(DEFAULT_DATE);
  const [endDate, setEndDate] = useState(DEFAULT_DATE);
  const [startMeridiem, setStartMeridiem] = useState();
  const [endMeridiem, setEndMeridiem] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  const isDateRangeInvalid = endDate < startDate;

  const isEndTimeEarlier =
    startTime &&
    endTime &&
    startMeridiem &&
    endMeridiem &&
    startDate === endDate &&
    convertToMinutes(endTime, endMeridiem) <
      convertToMinutes(startTime, startMeridiem);

  const canSubmit =
    eventName.trim().length > 0 &&
    !isDateRangeInvalid &&
    !isEndTimeEarlier &&
    selectedMemberIds.length > 0;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleMember = (memberId) => {
    setSelectedMemberIds((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId],
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmit?.({
      title: eventName.trim(),
      startDate,
      endDate,
      startTime: { ...startTime, meridiem: startMeridiem },
      endTime: { ...endTime, meridiem: endMeridiem },
      memberIds: selectedMemberIds,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section className="rounded-28 bg-white p-6 drop-shadow-[0_0_10px_rgba(0,0,0,0.15)]">
        <form onSubmit={handleSubmit} className="flex flex-col items-end gap-7">
          <button
            type="button"
            onClick={onClose}
            className="size-6 cursor-pointer"
          >
            <img src={closeIcon} alt="" />
          </button>

          <div className="flex w-100 flex-col gap-6">
            <Textfield
              value={eventName}
              onChange={(event) => setEventName(event.target.value)}
              placeholder="New Event"
              className="w-full"
            />

            <div className="flex w-full flex-col gap-4">
              <h3 className="text-title3 text-gray-900">Date</h3>
              <div className="flex w-full items-center justify-between">
                <DateInput
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
                <span className="text-body2 text-gray-900">-</span>
                <DateInput
                  value={endDate}
                  min={startDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-4">
              <h3 className="text-title3 text-gray-900">Time</h3>
              <div className="flex h-21 w-full items-end">
                <div className="flex w-32.5 flex-col gap-3">
                  <Meridiem onChange={setStartMeridiem} />
                  <TimeInput onChange={setStartTime} />
                </div>

                <span className="flex h-9 flex-1 items-center justify-center text-subtitle2">
                  -
                </span>

                <div className="flex w-32.5 flex-col gap-3">
                  <Meridiem onChange={setEndMeridiem} />
                  <TimeInput onChange={setEndTime} />
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-4">
              <h3 className="text-title3 text-gray-900">Members</h3>
              <div className="flex w-full flex-wrap gap-2">
                {members.map((member, index) => (
                  <MemberChip
                    key={member.id}
                    initial={member.initial}
                    name={member.name}
                    index={index}
                    selected={selectedMemberIds.includes(member.id)}
                    onToggle={() => toggleMember(member.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <ModalButton
            type="submit"
            size="small"
            variant={canSubmit ? "on" : "off"}
            disabled={!canSubmit}
            className="w-24.5"
          >
            Done
          </ModalButton>
        </form>
      </section>
    </div>
  );
}

export default AddTeamEventModal;
