import { useCallback, useEffect, useState } from "react";
import closeIcon from "../../assets/icons/close.svg";
import DateInput from "./DateInput.jsx";
import ModalButton from "./ModalButton.jsx";
import SuggestionCard from "./SuggestionCard.jsx";
import Textfield from "./Textfield.jsx";
import {
  createRecommendedMilestones,
  recommendMilestones,
} from "../../api/calendar.js";
import {
  getZonedDateKey,
  normalizeTimeZone,
  zonedDateTimeToUtcIso,
} from "../../utils/dateTime.js";

const toDueDateTime = (date, timeZone) =>
  zonedDateTimeToUtcIso(
    date,
    { hour: "11", minute: "59", second: 59 },
    "PM",
    timeZone,
  );

const toRecommendation = (recommendation, index, timeZone) => ({
  ...recommendation,
  id: `${recommendation.title}-${recommendation.dueDateTime}-${index}`,
  description: `${new Intl.DateTimeFormat("en-US", {
    timeZone: normalizeTimeZone(timeZone),
    month: "short",
    day: "numeric",
  }).format(new Date(recommendation.dueDateTime))} · ${recommendation.description ?? ""}`,
});

function MilestoneSuggestion({
  isOpen,
  variant = "input",
  onClose,
  onNext,
  onBack,
  onSubmit,
  teamId,
  timeZone,
}) {
  const [projectType, setProjectType] = useState("");
  const [deadline, setDeadline] = useState(() =>
    getZonedDateKey(new Date(), timeZone),
  );
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRecommendationIds, setSelectedRecommendationIds] = useState([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [requestError, setRequestError] = useState("");

  const isInputVariant = variant === "input";
  const canRequest = projectType.trim() && deadline && teamId != null;

  const resetState = useCallback(() => {
    setProjectType("");
    setDeadline(getZonedDateKey(new Date(), timeZone));
    setRecommendations([]);
    setSelectedRecommendationIds([]);
    setIsRequesting(false);
    setIsCreating(false);
    setRequestError("");
  }, [timeZone]);

  const handleClose = useCallback(() => {
    resetState();
    onClose?.();
  }, [onClose, resetState]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, isOpen]);

  if (!isOpen || !["input", "select"].includes(variant)) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isInputVariant) {
      if (!canRequest || isRequesting) return;

      setIsRequesting(true);
      setRequestError("");

      try {
        const result = await recommendMilestones(teamId, {
          projectType: projectType.trim(),
          dueDateTime: toDueDateTime(deadline, timeZone),
        });
        const nextRecommendations = Array.isArray(result)
          ? result
              .slice(0, 6)
              .map((recommendation, index) =>
                toRecommendation(recommendation, index, timeZone),
              )
          : [];

        setRecommendations(nextRecommendations);
        setSelectedRecommendationIds([]);
        onNext?.();
      } catch (error) {
        console.error(error);
        setRequestError(
          error?.message ||
            "마일스톤을 추천받지 못했습니다. 잠시 후 다시 시도해주세요.",
        );
      } finally {
        setIsRequesting(false);
      }

      return;
    }

    if (selectedRecommendationIds.length === 0 || isCreating) return;

    const milestones = recommendations
      .filter(({ id }) => selectedRecommendationIds.includes(id))
      .map(({ title, dueDateTime }) => ({ title, dueDateTime }));

    setIsCreating(true);
    setRequestError("");

    try {
      await createRecommendedMilestones(teamId, milestones);
      onSubmit?.();
      resetState();
    } catch (error) {
      console.error(error);
      setRequestError(
        error?.message ||
          "마일스톤을 등록하지 못했습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        className={`${isInputVariant ? "h-[269px]" : "h-[806px] max-h-[calc(100vh-48px)]"} rounded-28 bg-white p-6`}
      >
        <form
          onSubmit={handleSubmit}
          className="flex h-full w-100 flex-col items-end gap-7"
        >
          <div className="flex min-h-0 w-full flex-1 flex-col items-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="size-6 cursor-pointer"
            >
              <img src={closeIcon} alt="" />
            </button>

            {isInputVariant ? (
              <div className="flex w-full flex-col gap-5">
                <Textfield
                  value={projectType}
                  onChange={(event) => setProjectType(event.target.value)}
                  placeholder="Project Type"
                  className="w-full"
                />

                <div className="flex flex-col gap-4">
                  <h3 className="text-title3 text-gray-900">
                    Earliest Deadline
                  </h3>
                  <DateInput
                    value={deadline}
                    onChange={(event) => setDeadline(event.target.value)}
                  />
                </div>

                {requestError ? (
                  <p role="alert" className="text-body3 text-red-600">
                    {requestError}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="flex min-h-0 w-full flex-1 flex-col gap-5">
                <h2 className="text-title1 text-gray-900">Recommendations</h2>

                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
                  {recommendations.length > 0 ? (
                    recommendations.map((recommendation) => (
                      <SuggestionCard
                        key={recommendation.id}
                        title={recommendation.title}
                        description={recommendation.description}
                        variant={
                          selectedRecommendationIds.includes(recommendation.id)
                            ? "on"
                            : "off"
                        }
                        onClick={() =>
                          setSelectedRecommendationIds((currentIds) =>
                            currentIds.includes(recommendation.id)
                              ? currentIds.filter((id) => id !== recommendation.id)
                              : [...currentIds, recommendation.id].slice(0, 6),
                          )
                        }
                      />
                    ))
                  ) : (
                    <p className="py-8 text-center text-body2 text-gray-700">
                      추천할 수 있는 마일스톤이 없습니다.
                    </p>
                  )}
                </div>

                {requestError ? (
                  <p role="alert" className="text-body3 text-red-600">
                    {requestError}
                  </p>
                ) : null}
              </div>
            )}
          </div>

          {isInputVariant ? (
            <ModalButton
              type="submit"
              variant={canRequest && !isRequesting ? "on" : "off"}
              disabled={!canRequest || isRequesting}
            >
              {isRequesting ? "Loading..." : "Get Recommendations"}
            </ModalButton>
          ) : (
            <div className="flex gap-2.5">
              <ModalButton
                type="button"
                variant="border"
                onClick={onBack}
                className="!w-28.5"
              >
                Enter Manually
              </ModalButton>
              <ModalButton
                type="submit"
                variant={
                  selectedRecommendationIds.length > 0 && !isCreating
                    ? "on"
                    : "off"
                }
                disabled={selectedRecommendationIds.length === 0 || isCreating}
                className="w-24.5"
              >
                {isCreating ? "Loading..." : "Done"}
              </ModalButton>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

export default MilestoneSuggestion;
