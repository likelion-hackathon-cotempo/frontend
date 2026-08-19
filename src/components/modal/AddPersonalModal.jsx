import { useEffect, useState } from "react";
import closeIcon from "../../assets/icons/close.svg";
import DateInput from "./DateInput.jsx";
import Meridiem from "./Meridiem.jsx";
import ModalButton from "./ModalButton.jsx";
import RadioButton from "./RadioButton.jsx";
import Textfield from "./Textfield.jsx";
import TimeInput from "./TimeInput.jsx";

const PRIORITIES = ["Low", "Medium", "High"];
const PRIORITY_WEIGHTS = {
  Low: 1,
  Medium: 2,
  High: 3,
};

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const convertToMinutes = ({ hour, minute }, meridiem) => {
  const hourNumber = Number(hour);
  const minuteNumber = Number(minute);
  const normalizedHour = (hourNumber % 12) + (meridiem === "PM" ? 12 : 0);

  return normalizedHour * 60 + minuteNumber;
};

const toUtcDateTime = (date, time, meridiem) => {
  const [year, month, day] = date.split("-").map(Number);
  const hour = (Number(time.hour) % 12) + (meridiem === "PM" ? 12 : 0);

  return new Date(
    year,
    month - 1,
    day,
    hour,
    Number(time.minute),
  ).toISOString();
};

function AddPersonal({ isOpen, onClose, onSubmit }) {
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState(getCurrentDate);
  const [endDate, setEndDate] = useState(getCurrentDate);
  const [startMeridiem, setStartMeridiem] = useState();
  const [endMeridiem, setEndMeridiem] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [priority, setPriority] = useState("Low");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
    startTime &&
    endTime &&
    startMeridiem &&
    endMeridiem &&
    !isDateRangeInvalid &&
    !isEndTimeEarlier &&
    !isSubmitting;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitError("");
    setIsSubmitting(true);

    try {
      await onSubmit?.({
        title: eventName.trim(),
        startDateTime: toUtcDateTime(startDate, startTime, startMeridiem),
        endDateTime: toUtcDateTime(endDate, endTime, endMeridiem),
        weight: PRIORITY_WEIGHTS[priority],
      });

      const currentDate = getCurrentDate();
      setEventName("");
      setStartDate(currentDate);
      setEndDate(currentDate);
      setStartMeridiem();
      setEndMeridiem();
      setStartTime();
      setEndTime();
      setPriority("Low");
    } catch (error) {
      console.error(error);
      setSubmitError(
        error?.message ||
          "개인 일정을 등록하지 못했습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setIsSubmitting(false);
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
        <form className="flex flex-col items-end gap-7" onSubmit={handleSubmit}>
          <div className="flex w-full flex-col items-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="size-6 cursor-pointer disabled:cursor-not-allowed"
            >
              <img src={closeIcon} alt="" />
            </button>

            <div className="flex w-full flex-col gap-5">
              <Textfield
                value={eventName}
                onChange={(event) => setEventName(event.target.value)}
                placeholder="New Event"
                className="w-full"
              />

              <div className="flex w-100 flex-col gap-6">
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
                  <h3 className="text-title3 text-gray-900">Priority</h3>
                  <div className="flex w-full flex-col gap-3">
                    {PRIORITIES.map((option) => (
                      <RadioButton
                        key={option}
                        name="personal-priority"
                        value={option}
                        label={option}
                        checked={priority === option}
                        onChange={() => setPriority(option)}
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
            </div>
          </div>

          <ModalButton
            type="submit"
            variant={canSubmit ? "on" : "off"}
            disabled={!canSubmit}
            className="w-24.5"
          >
            {isSubmitting ? "Saving..." : "Done"}
          </ModalButton>
        </form>
      </section>
    </div>
  );
}

export default AddPersonal;
