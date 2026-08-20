import { useEffect, useState } from "react";
import closeIcon from "../../assets/icons/close.svg";
import DateInput from "./DateInput.jsx";
import Meridiem from "./Meridiem.jsx";
import ModalButton from "./ModalButton.jsx";
import Textfield from "./Textfield.jsx";
import TimeInput from "./TimeInput.jsx";
import MemberChip from "./MemberChip.jsx";
import {
  getZonedDateTimeParts,
  toDateKey,
  zonedDateTimeToUtcIso,
} from "../../utils/dateTime.js";

const convertToMinutes = ({ hour, minute }, meridiem) => {
  const hourNumber = Number(hour);
  const minuteNumber = Number(minute);
  const normalizedHour = (hourNumber % 12) + (meridiem === "PM" ? 12 : 0);

  return normalizedHour * 60 + minuteNumber;
};

const toDateInputValue = (date, timeZone) =>
  toDateKey(getZonedDateTimeParts(date, timeZone));

const toTimeInputValue = (date, timeZone) => {
  const { hour, minute } = getZonedDateTimeParts(date, timeZone);

  return {
    hour: String(hour % 12 || 12).padStart(2, "0"),
    minute: String(minute).padStart(2, "0"),
    meridiem: hour >= 12 ? "PM" : "AM",
  };
};

function AddTeamEventModal({
  isOpen,
  variant = "creation",
  initialEvent,
  members = [],
  timeZone,
  onClose,
  onSubmit,
  onDelete,
}) {
  const isRevision = variant === "revision";
  const initialStartDate = initialEvent?.startDate ?? new Date();
  const initialEndDate = initialEvent?.endDate ?? initialStartDate;
  const initialStartTime = toTimeInputValue(initialStartDate, timeZone);
  const initialEndTime = toTimeInputValue(initialEndDate, timeZone);
  const initialMemberIds =
    initialEvent?.memberIds?.length > 0
      ? initialEvent.memberIds
      : isRevision
        ? members.map((member) => member.id)
        : [];
  const [eventName, setEventName] = useState(initialEvent?.title ?? "");
  const [startDate, setStartDate] = useState(() =>
    toDateInputValue(initialStartDate, timeZone),
  );
  const [endDate, setEndDate] = useState(() =>
    toDateInputValue(initialEndDate, timeZone),
  );
  const [startMeridiem, setStartMeridiem] = useState(
    initialStartTime.meridiem,
  );
  const [endMeridiem, setEndMeridiem] = useState(initialEndTime.meridiem);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [selectedMemberIds, setSelectedMemberIds] =
    useState(initialMemberIds);
  const [pendingAction, setPendingAction] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const isSubmitting = pendingAction !== null;

  const isDateRangeInvalid = endDate < startDate;

  const isEndTimeEarlier =
    startTime &&
    endTime &&
    startMeridiem &&
    endMeridiem &&
    startDate === endDate &&
    convertToMinutes(endTime, endMeridiem) <
      convertToMinutes(startTime, startMeridiem);

  const canSubmit = Boolean(
    eventName.trim().length > 0 &&
    startTime &&
    endTime &&
    startMeridiem &&
    endMeridiem &&
    !isDateRangeInvalid &&
    !isEndTimeEarlier &&
    selectedMemberIds.length > 0 &&
    !isSubmitting,
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const toggleMember = (memberId) => {
    setSelectedMemberIds((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitError("");
    setPendingAction("save");

    try {
      await onSubmit?.({
        title: eventName.trim(),
        startDateTime: zonedDateTimeToUtcIso(
          startDate,
          startTime,
          startMeridiem,
          timeZone,
        ),
        endDateTime: zonedDateTimeToUtcIso(
          endDate,
          endTime,
          endMeridiem,
          timeZone,
        ),
      });

    } catch (error) {
      console.error(error);
      setSubmitError(
        error?.message ||
          `팀 일정을 ${isRevision ? "수정" : "등록"}하지 못했습니다. 잠시 후 다시 시도해주세요.`,
      );
    } finally {
      setPendingAction(null);
    }
  };

  const handleDelete = async () => {
    if (!isRevision || isSubmitting) return;

    setSubmitError("");
    setPendingAction("delete");

    try {
      await onDelete?.();
    } catch (error) {
      console.error(error);
      setSubmitError(
        error?.message ||
          "팀 일정을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose?.();
      }}
    >
      <section className="rounded-28 bg-white p-6 drop-shadow-[0_0_10px_rgba(0,0,0,0.15)]">
        <form onSubmit={handleSubmit} className="flex flex-col items-end gap-7">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="size-6 cursor-pointer disabled:cursor-not-allowed"
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
                  <Meridiem
                    defaultValue={startMeridiem}
                    onChange={setStartMeridiem}
                  />
                  <TimeInput
                    defaultHour={startTime?.hour}
                    defaultMinute={startTime?.minute}
                    onChange={setStartTime}
                  />
                </div>

                <span className="flex h-9 flex-1 items-center justify-center text-subtitle2">
                  -
                </span>

                <div className="flex w-32.5 flex-col gap-3">
                  <Meridiem
                    defaultValue={endMeridiem}
                    onChange={setEndMeridiem}
                  />
                  <TimeInput
                    defaultHour={endTime?.hour}
                    defaultMinute={endTime?.minute}
                    onChange={setEndTime}
                  />
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

            {submitError && (
              <p role="alert" className="text-body2 text-red-700">
                {submitError}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isRevision && (
              <ModalButton
                type="button"
                variant="border"
                disabled={isSubmitting}
                onClick={handleDelete}
              >
                {pendingAction === "delete" ? "Deleting..." : "Delete"}
              </ModalButton>
            )}
            <ModalButton
              type="submit"
              size="small"
              variant={canSubmit ? "on" : "off"}
              disabled={!canSubmit}
              className="w-24.5"
            >
              {pendingAction === "save" ? "Saving..." : "Done"}
            </ModalButton>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddTeamEventModal;
