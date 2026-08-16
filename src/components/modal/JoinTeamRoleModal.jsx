import { useEffect, useState } from "react";
import closeIcon from "../../assets/icons/close.svg";
import ModalButton from "./ModalButton.jsx";
import Textfield from "./Textfield.jsx";

function JoinTeamRoleModal({ isOpen, onClose, onSubmit }) {
  const [role, setRole] = useState("");
  const isRoleEntered = role.trim().length > 0;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setRole("");
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    setRole("");
    onClose?.();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isRoleEntered) return;

    const submittedRole = role.trim();
    setRole("");
    onSubmit?.(submittedRole);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section className="w-100 rounded-28 bg-white p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="size-6 cursor-pointer"
            >
              <img src={closeIcon} alt="" />
            </button>
          </div>

          <div className="flex flex-col items-start gap-8">
            <Textfield
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="Enter your role"
              className="w-full"
            />

            <ModalButton
              type="submit"
              size="big"
              variant={isRoleEntered ? "on" : "off"}
              disabled={!isRoleEntered}
            >
              Join
            </ModalButton>
          </div>
        </form>
      </section>
    </div>
  );
}

export default JoinTeamRoleModal;
