import { CheckIcon, PlusIcon } from "../../icons/index.jsx";
import SidePanelCard from "./SidePanelCard.jsx";
import ActionButton from "./ActionButton.jsx";

function MilestoneCard({ milestones, onAddMilestone, onRecommendMilestones }) {
  return (
    <SidePanelCard
      title="Milestone"
      headerAction={
        <button
          type="button"
          onClick={onAddMilestone}
          aria-label="마일스톤 추가"
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-purple-500 text-purple-900"
        >
          <PlusIcon className="h-[19px] w-[19px]" />
        </button>
      }
    >
      <div className="flex w-full flex-col gap-2">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="flex w-full items-center justify-between rounded-2xl border border-purple-600 bg-purple-100 px-4 py-3"
          >
            <div className="flex flex-col gap-1 text-gray-900">
              <p className="text-body3">{milestone.dueLabel}</p>
              <p className="text-subtitle3">{milestone.title}</p>
            </div>
            <CheckIcon className="h-6 w-6 text-gray-900" />
          </div>
        ))}
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
