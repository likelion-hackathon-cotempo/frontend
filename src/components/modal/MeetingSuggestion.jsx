import { useEffect, useState } from "react";
import closeIcon from "../../assets/icons/close.svg";
import DateInput from "./DateInput.jsx";
import ModalButton from "./ModalButton.jsx";
import RadioButton from "./RadioButton.jsx";
import SuggestionCard from "./SuggestionCard.jsx";
import { recommendMeetingTimes } from "../../api/calendar.js";

const MEETING_DURATIONS = [
  { label: "30 min", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "1 hr 30 min", value: 90 },
  { label: "2 hr", value: 120 },
];

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const toUtcDateTime = (date, isEndOfDay = false) => {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(
    year,
    month - 1,
    day,
    isEndOfDay ? 23 : 0,
    isEndOfDay ? 59 : 0,
    isEndOfDay ? 59 : 0,
    isEndOfDay ? 999 : 0,
  ).toISOString();
};

const meetingTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  weekday: "long",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const formatMeetingTime = (dateTime) => {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return dateTime;

  const parts = Object.fromEntries(
    meetingTimeFormatter
      .formatToParts(date)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );

  return `${parts.weekday}, ${parts.month} ${parts.day} · ${parts.hour}:${parts.minute} ${parts.dayPeriod} (KST)`;
};

const toSuggestion = (suggestion, index) => ({
  ...suggestion,
  id: `${suggestion.startDateTime}-${suggestion.endDateTime}-${index}`,
  title: formatMeetingTime(suggestion.startDateTime),
  description: suggestion.description ?? "",
});

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
  teamId,
}) {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [duration, setDuration] = useState(initialDuration);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestError, setRequestError] = useState("");

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isInputVariant) {
      if (isDateRangeInvalid || teamId == null || isRequesting) return;

      setIsRequesting(true);
      setRequestError("");
      setSuggestions([]);
      setSelectedSuggestionId();

      try {
        const result = await recommendMeetingTimes(teamId, {
          startDateTime: toUtcDateTime(startDate),
          endDateTime: toUtcDateTime(endDate, true),
          durationMinutes: duration,
        });
        const nextSuggestions = Array.isArray(result)
          ? result.map(toSuggestion)
          : [];

        setSuggestions(nextSuggestions);
        onNext?.({ startDate, endDate, duration });
      } catch (error) {
        console.error(error);
        setRequestError(
          error?.message ||
            "회의 시간을 추천받지 못했습니다. 잠시 후 다시 시도해주세요.",
        );
      } finally {
        setIsRequesting(false);
      }

      return;
    }

    const suggestion = suggestions.find(
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
      <section className="h-135.5 rounded-28 bg-white p-6">
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

                  {requestError ? (
                    <p role="alert" className="text-body3 text-red-600">
                      {requestError}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto">
                  {suggestions.length > 0 ? (
                    suggestions.map((suggestion) => (
                      <SuggestionCard
                        key={suggestion.id}
                        title={suggestion.title}
                        description={suggestion.description}
                        variant={
                          selectedSuggestionId === suggestion.id ? "on" : "off"
                        }
                        onClick={() => setSelectedSuggestionId(suggestion.id)}
                      />
                    ))
                  ) : (
                    <p className="py-8 text-center text-body2 text-gray-700">
                      선택한 기간에 추천할 수 있는 회의 시간이 없습니다.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {isInputVariant ? (
            <ModalButton
              type="submit"
              variant={isDateRangeInvalid || isRequesting ? "off" : "on"}
              disabled={isDateRangeInvalid || isRequesting}
              className="w-24.5"
            >
              {isRequesting ? "Loading..." : "Next"}
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
