import { useEffect, useState } from "react";
import closeIcon from "../../assets/icons/close.svg";
import ModalButton from "./ModalButton.jsx";
import Textfield from "./Textfield.jsx";

function AddTeamModal({ isOpen, onClose, onSubmit }) {
  const [teamName, setTeamName] = useState("");
  const isTeamNameEntered = teamName.trim().length > 0;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setTeamName("");
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    setTeamName("");
    onClose?.();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isTeamNameEntered) return;

    onSubmit?.(teamName.trim());
    setTeamName("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section className="flex rounded-28 bg-white p-6">
        <form onSubmit={handleSubmit} className="flex flex-col items-end gap-7">
          <div className="flex w-100 flex-col items-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="size-6 cursor-pointer"
            >
              <img src={closeIcon} alt="" />
            </button>

            <Textfield
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
              placeholder="Team name"
              className="w-full"
            />
          </div>

          <ModalButton
            type="submit"
            variant={isTeamNameEntered ? "on" : "off"}
            disabled={!isTeamNameEntered}
            className="w-24.5"
          >
            Next
          </ModalButton>
        </form>
      </section>
    </div>
  );
}

export default AddTeamModal;
