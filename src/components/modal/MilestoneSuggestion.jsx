import { useCallback, useEffect, useState } from "react";
import closeIcon from "../../assets/icons/close.svg";
import DateInput from "./DateInput.jsx";
import ModalButton from "./ModalButton.jsx";
import SuggestionCard from "./SuggestionCard.jsx";
import Textfield from "./Textfield.jsx";

const MOCK_RECOMMENDATIONS = [
  {
    id: 1,
    title: "Project Kickoff",
    description: "Aug 10 · Project setup and team alignment",
  },
  {
    id: 2,
    title: "User Research Complete",
    description: "Aug 14 · Complete research and define key insights",
  },
  {
    id: 3,
    title: "Wireframe Complete",
    description: "Aug 18 · Finalize the core user flow and wireframes",
  },
  {
    id: 4,
    title: "Prototype Review",
    description: "Aug 21 · Review the interactive prototype",
  },
  {
    id: 5,
    title: "Usability Testing",
    description:
      "Aug 25 · Validate the product with target usersValidate the product with target usersValidate the product with target usersValidate the product with target users",
  },
  {
    id: 6,
    title: "Final Presentation",
    description: "Aug 28 · Present the completed project",
  },
];

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function MilestoneSuggestion({
  isOpen,
  variant = "input",
  onClose,
  onNext,
  onBack,
  onSubmit,
}) {
  const [projectType, setProjectType] = useState("");
  const [deadline, setDeadline] = useState(getCurrentDate);
  const [selectedRecommendationId, setSelectedRecommendationId] = useState(1);

  const isInputVariant = variant === "input";
  const canRequest = projectType.trim() && deadline;

  const resetState = useCallback(() => {
    setProjectType("");
    setDeadline(getCurrentDate());
    setSelectedRecommendationId(1);
  }, []);

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isInputVariant) {
      if (canRequest) onNext?.({ projectType: projectType.trim(), deadline });
      return;
    }

    const recommendation = MOCK_RECOMMENDATIONS.find(
      ({ id }) => id === selectedRecommendationId,
    );

    onSubmit?.({ projectType: projectType.trim(), deadline, recommendation });
    resetState();
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
              </div>
            ) : (
              <div className="flex min-h-0 w-full flex-1 flex-col gap-5">
                <h2 className="text-title1 text-gray-900">Recommendations</h2>

                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
                  {MOCK_RECOMMENDATIONS.map((recommendation) => (
                    <SuggestionCard
                      key={recommendation.id}
                      title={recommendation.title}
                      description={recommendation.description}
                      variant={
                        selectedRecommendationId === recommendation.id
                          ? "on"
                          : "off"
                      }
                      onClick={() =>
                        setSelectedRecommendationId(recommendation.id)
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {isInputVariant ? (
            <ModalButton
              type="submit"
              variant={canRequest ? "on" : "off"}
              disabled={!canRequest}
            >
              Get Recommendations
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
              <ModalButton type="submit" variant="on" className="w-24.5">
                Done
              </ModalButton>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

export default MilestoneSuggestion;
