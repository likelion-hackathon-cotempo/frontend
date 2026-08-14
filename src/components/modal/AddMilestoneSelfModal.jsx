import { useCallback, useEffect, useState } from "react";
import closeIcon from "../../assets/icons/close.svg";
import DateInput from "./DateInput.jsx";
import Meridiem from "./Meridiem.jsx";
import ModalButton from "./ModalButton.jsx";
import Textfield from "./Textfield.jsx";
import TimeInput from "./TimeInput.jsx";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function AddMilestoneSelfModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(getCurrentDate);
  const [meridiem, setMeridiem] = useState();
  const [time, setTime] = useState();
  const canSubmit = title.trim().length > 0;

  const resetForm = useCallback(() => {
    setTitle("");
    setDate(getCurrentDate());
    setMeridiem(undefined);
    setTime(undefined);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose?.();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmit?.({
      title: title.trim(),
      date,
      time: { ...time, meridiem },
    });
    resetForm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section className="rounded-28 bg-white p-6">
        <form
          onSubmit={handleSubmit}
          className="flex w-68.5 flex-col items-end gap-7"
        >
          <div className="flex w-full flex-col items-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="size-6 cursor-pointer"
            >
              <img src={closeIcon} alt="" />
            </button>

            <div className="flex w-full flex-col gap-5">
              <Textfield
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="New Milestone"
                className="w-full"
              />

              <div className="flex w-32.5 flex-col gap-6">
                <div className="flex w-full flex-col gap-4">
                  <h3 className="text-title3 text-gray-900">Date</h3>
                  <DateInput
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="h-9.5 w-full"
                  />
                </div>

                <div className="flex w-full flex-col gap-4">
                  <h3 className="text-title3 text-gray-900">Time</h3>
                  <div className="flex w-full flex-col gap-3">
                    <Meridiem onChange={setMeridiem} />
                    <TimeInput onChange={setTime} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ModalButton
            type="submit"
            variant={canSubmit ? "on" : "off"}
            disabled={!canSubmit}
            className="w-full"
          >
            Done
          </ModalButton>
        </form>
      </section>
    </div>
  );
}

export default AddMilestoneSelfModal;
