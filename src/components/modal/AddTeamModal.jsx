import { useEffect, useState } from "react";
import closeIcon from "../../assets/icons/close.svg";
import ModalButton from "./ModalButton.jsx";
import Textfield from "./Textfield.jsx";

function AddTeamModal({ isOpen, onClose, onSubmit }) {
  const [teamName, setTeamName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isTeamNameEntered = teamName.trim().length > 0;
  const canSubmit = isTeamNameEntered && !isSubmitting;

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);

    try {
      await onSubmit?.(teamName.trim());
      setTeamName("");
    } catch (error) {
      console.error(error);
      alert(error?.message || "팀 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
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
              disabled={isSubmitting}
              className="w-full"
            />
          </div>

          <ModalButton
            type="submit"
            variant={canSubmit ? "on" : "off"}
            disabled={!canSubmit}
            className="w-24.5"
          >
            {isSubmitting ? "Creating..." : "Next"}
          </ModalButton>
        </form>
      </section>
    </div>
  );
}

export default AddTeamModal;
