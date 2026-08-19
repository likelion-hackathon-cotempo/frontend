import { CheckIcon, PlusIcon } from "../../icons/index.jsx";
import SidePanelCard from "./SidePanelCard.jsx";
import ActionButton from "./ActionButton.jsx";

const pad = (value) => String(value).padStart(2, "0");

const formatDueDate = (dueDateTime) => {
  const dueDate = new Date(dueDateTime);

  if (Number.isNaN(dueDate.getTime())) return "";

  return `${pad(dueDate.getMonth() + 1)}. ${pad(dueDate.getDate())} · ${pad(dueDate.getHours())}:${pad(dueDate.getMinutes())}`;
};

function MilestoneCard({
  milestones,
  isLoading,
  error,
  onAddMilestone,
  onEditMilestone,
  onRecommendMilestones,
}) {
  return (
    <SidePanelCard
      title="Milestone"
      headerAction={
        onAddMilestone ? (
          <button
            type="button"
            onClick={onAddMilestone}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-purple-500 text-purple-900"
          >
            <PlusIcon className="h-[19px] w-[19px]" />
          </button>
        ) : null
      }
    >
      <div className="flex w-full flex-col gap-2">
        <div
          className={`flex flex-col gap-2 pr-1 ${milestones.length > 3 ? "max-h-[205px] overflow-y-auto" : ""}`}
        >
          {isLoading ? (
            <p className="py-4 text-center text-body3 text-gray-700">
              Loading...
            </p>
          ) : null}
          {!isLoading && milestones.length === 0 ? (
            <p className="py-4 text-center text-body3 text-gray-700">
              No milestones yet.
            </p>
          ) : null}
          {milestones.map((milestone) => (
            <div
              key={milestone.milestoneId}
              className="flex w-full shrink-0 items-center rounded-2xl border border-purple-600 bg-purple-100 px-4 py-3"
            >
              <button
                type="button"
                onClick={() => onEditMilestone?.(milestone)}
                className="min-w-0 flex-1 cursor-pointer text-left text-gray-900"
              >
                <span className="block text-body3">
                  {formatDueDate(milestone.dueDateTime)}
                </span>
                <span className="mt-1 block truncate text-subtitle3">
                  {milestone.title}
                </span>
              </button>
              <CheckIcon
                className={`h-6 w-6 shrink-0 ${milestone.completed ? "text-gray-900" : "text-white"}`}
              />
            </div>
          ))}
        </div>
        {error ? (
          <p className="text-body3 text-red-600">
            {error}
          </p>
        ) : null}
        {onRecommendMilestones ? (
          <ActionButton
            label="Recommend Milestones"
            onClick={onRecommendMilestones}
          />
        ) : null}
      </div>
    </SidePanelCard>
  );
}

export default MilestoneCard;
