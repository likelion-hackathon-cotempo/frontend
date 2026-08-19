import { useEffect, useState } from "react";
import closeIcon from "../../assets/icons/close.svg";
import ModalButton from "./ModalButton.jsx";
import Textfield from "./Textfield.jsx";

function JoinTeamRoleModal({ isOpen, onClose, onSubmit }) {
  const [position, setPosition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPositionEntered = position.trim().length > 0;
  const canSubmit = isPositionEntered && !isSubmitting;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setPosition("");
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    setPosition("");
    onClose?.();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);

    try {
      await onSubmit?.(position.trim());
      setPosition("");
    } catch (error) {
      console.error(error);
      alert(error?.message || "팀 참여에 실패했습니다. 다시 시도해주세요.");
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
              value={position}
              onChange={(event) => setPosition(event.target.value)}
              placeholder="Enter your role"
              disabled={isSubmitting}
              className="w-full"
            />

            <ModalButton
              type="submit"
              size="big"
              variant={canSubmit ? "on" : "off"}
              disabled={!canSubmit}
            >
              {isSubmitting ? "Joining..." : "Join"}
            </ModalButton>
          </div>
        </form>
      </section>
    </div>
  );
}

export default JoinTeamRoleModal;
