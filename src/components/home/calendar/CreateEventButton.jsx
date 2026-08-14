import { PlusIcon } from "../../icons/index.jsx";

function CreateEventButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg bg-purple-500 px-3 py-1 text-purple-900"
    >
      <PlusIcon className="h-4 w-4" />
      <span className="text-subtitle3">Create Event</span>
    </button>
  );
}

export default CreateEventButton;
