import { useEffect, useState } from "react";
import closeIcon from "../../assets/icons/close.svg";
import DateInput from "./DateInput.jsx";
import ModalButton from "./ModalButton.jsx";
import RadioButton from "./RadioButton.jsx";
import SuggestionCard from "./SuggestionCard.jsx";

const MEETING_DURATIONS = [
  { label: "30 min", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "1 hr 30 min", value: 90 },
  { label: "2 hr", value: 120 },
];

const MOCK_SUGGESTIONS = [
  {
    id: 1,
    title: "Thursday, Aug 13 · 10:00 AM (KST)",
    description: "Everyone is available at this time.",
  },
  {
    id: 2,
    title: "Friday, Aug 16 · 14:00 AM (KST)",
    description:
      "Everyone is available,But the time is less preferred by Sally. Everyone is available,But the time is less preferred by Sally.",
  },
  {
    id: 3,
    title: "Friday, Aug 14 · 11:00 AM (KST)",
    description:
      "4 of 5 members are available.\nAlex is unavailable at this time.",
  },
  {
    id: 4,
    title: "Monday, Aug 17 · 09:30 AM (KST)",
    description: "Everyone is available at this time.",
  },
  {
    id: 5,
    title: "Tuesday, Aug 18 · 15:00 PM (KST)",
    description:
      "4 of 5 members are available.\nJane is unavailable at this time.",
  },
  {
    id: 6,
    title: "Wednesday, Aug 19 · 13:00 PM (KST)",
    description:
      "Everyone is available,\nBut the time is less preferred by Liam.",
  },
];

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function MeetingSuggestion({
  isOpen,
  variant = "input",
  onClose,
  onNext,
  onBack,
  onSubmit,
  initialStartDate = getCurrentDate(),
  initialEndDate = initialStartDate,
  initialDuration = 30,
}) {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [duration, setDuration] = useState(initialDuration);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState();

  const isInputVariant = variant === "input";
  const isDateRangeInvalid = !startDate || !endDate || endDate < startDate;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !["input", "select"].includes(variant)) return null;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isInputVariant) {
      if (!isDateRangeInvalid) onNext?.({ startDate, endDate, duration });
      return;
    }

    const suggestion = MOCK_SUGGESTIONS.find(
      ({ id }) => id === selectedSuggestionId,
    );

    if (suggestion) {
      onSubmit?.({ startDate, endDate, duration, suggestion });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section className="h-[542px] rounded-28 bg-white p-6">
        <form
          onSubmit={handleSubmit}
          className="flex h-full w-100 flex-col items-end gap-7"
        >
          <div className="flex min-h-0 w-full flex-1 flex-col items-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="size-6 cursor-pointer"
            >
              <img src={closeIcon} alt="" />
            </button>

            <div className="flex min-h-0 w-full flex-1 flex-col gap-5">
              <h2 className="text-title1 text-gray-900">Meeting Suggestions</h2>

              {isInputVariant ? (
                <div className="flex w-full flex-col gap-2.5">
                  <div className="flex w-full flex-col gap-4">
                    <h3 className="text-title3 text-gray-900">
                      Recommendation Period
                    </h3>

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
                    <h3 className="text-title3 text-gray-900">
                      Meeting Duration
                    </h3>

                    <div className="flex w-full flex-col gap-3">
                      {MEETING_DURATIONS.map((option) => (
                        <RadioButton
                          key={option.value}
                          name="meeting-duration"
                          value={option.value}
                          label={option.label}
                          checked={duration === option.value}
                          onChange={() => setDuration(option.value)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto">
                  {MOCK_SUGGESTIONS.map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.id}
                      title={suggestion.title}
                      description={suggestion.description}
                      variant={
                        selectedSuggestionId === suggestion.id ? "on" : "off"
                      }
                      onClick={() => setSelectedSuggestionId(suggestion.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {isInputVariant ? (
            <ModalButton
              type="submit"
              variant={isDateRangeInvalid ? "off" : "on"}
              disabled={isDateRangeInvalid}
              className="w-24.5"
            >
              Next
            </ModalButton>
          ) : (
            <div className="flex gap-2.5">
              <ModalButton type="button" variant="border" onClick={onBack}>
                Back
              </ModalButton>
              <ModalButton
                type="submit"
                variant={selectedSuggestionId ? "on" : "off"}
                disabled={!selectedSuggestionId}
                className="w-24.5"
              >
                Done
              </ModalButton>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

export default MeetingSuggestion;
