import createTeamIcon from "../../assets/icons/create-team.svg";
import joinTeamIcon from "../../assets/icons/join-team.svg";

function TeamActionMenu({ isOpen, onCreate, onJoin }) {
  if (!isOpen) return null;

  return (
    <div className="inline-flex flex-col gap-2 rounded-16 bg-white p-3">
      <button
        type="button"
        onClick={onCreate}
        className="flex cursor-pointer items-center gap-3 whitespace-nowrap px-3 py-1 text-body1 text-gray-700"
      >
        <img src={createTeamIcon} alt="" className="size-6" />
        Create a Team
      </button>
      <button
        type="button"
        onClick={onJoin}
        className="flex cursor-pointer items-center gap-3 whitespace-nowrap px-3 py-1 text-body1 text-gray-700"
      >
        <img src={joinTeamIcon} alt="" className="size-6" />
        Join a Team
      </button>
    </div>
  );
}

export default TeamActionMenu;
