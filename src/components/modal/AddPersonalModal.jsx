import { useEffect, useState } from "react";
import closeIcon from "../../assets/icons/close.svg";
import DateInput from "./DateInput.jsx";
import Meridiem from "./Meridiem.jsx";
import ModalButton from "./ModalButton.jsx";
import RadioButton from "./RadioButton.jsx";
import Textfield from "./Textfield.jsx";
import TimeInput from "./TimeInput.jsx";

const PRIORITIES = ["Low", "Medium", "High"];

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

function AddPersonal({ isOpen, onClose, onSubmit }) {
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState(DEFAULT_DATE);
  const [endDate, setEndDate] = useState(DEFAULT_DATE);
  const [startMeridiem, setStartMeridiem] = useState();
  const [endMeridiem, setEndMeridiem] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [priority, setPriority] = useState("Low");

  const isEndTimeEarlier =
    startTime &&
    endTime &&
    startMeridiem &&
    endMeridiem &&
    startDate === endDate &&
    convertToMinutes(endTime, endMeridiem) <
      convertToMinutes(startTime, startMeridiem);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEndTimeEarlier) return;

    onSubmit?.({
      eventName,
      startDate,
      endDate,
      startTime: { ...startTime, meridiem: startMeridiem },
      endTime: { ...endTime, meridiem: endMeridiem },
      priority,
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section className="rounded-28 bg-white p-6">
        <div className="flex flex-col items-end gap-7" onSubmit={handleSubmit}>
          <div className="flex w-full flex-col items-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="size-6 cursor-pointer"
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
              </div>
            </div>
          </div>

          <ModalButton
            type="submit"
            variant={isEndTimeEarlier ? "off" : "on"}
            disabled={isEndTimeEarlier}
            className="w-24.5"
          >
            Done
          </ModalButton>
        </div>
      </section>
    </div>
  );
}

export default AddPersonal;
