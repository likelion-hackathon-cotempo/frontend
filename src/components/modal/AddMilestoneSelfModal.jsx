import { useCallback, useEffect, useState } from "react";
import closeIcon from "../../assets/icons/close.svg";
import DateInput from "./DateInput.jsx";
import Meridiem from "./Meridiem.jsx";
import ModalButton from "./ModalButton.jsx";
import Textfield from "./Textfield.jsx";
import TimeInput from "./TimeInput.jsx";

const pad = (value) => String(value).padStart(2, "0");

const getFormValues = (milestone) => {
  const dueDate = milestone?.dueDateTime
    ? new Date(milestone.dueDateTime)
    : new Date();
  const hour = dueDate.getHours();

  return {
    title: milestone?.title ?? "",
    date: `${dueDate.getFullYear()}-${pad(dueDate.getMonth() + 1)}-${pad(dueDate.getDate())}`,
    meridiem: hour >= 12 ? "PM" : "AM",
    time: {
      hour: pad(hour % 12 || 12),
      minute: pad(dueDate.getMinutes()),
    },
  };
};

const toDueDateTime = (date, time, meridiem) => {
  const [year, month, day] = date.split("-").map(Number);
  const hour = (Number(time.hour) % 12) + (meridiem === "PM" ? 12 : 0);

  return new Date(
    year,
    month - 1,
    day,
    hour,
    Number(time.minute),
  ).toISOString();
};

function AddMilestoneSelfModal({
  isOpen,
  variant = "creation",
  initialMilestone,
  onClose,
  onSubmit,
  onDelete,
}) {
  const initialValues = getFormValues(initialMilestone);
  const [title, setTitle] = useState(initialValues.title);
  const [date, setDate] = useState(initialValues.date);
  const [meridiem, setMeridiem] = useState(initialValues.meridiem);
  const [time, setTime] = useState(initialValues.time);
  const [pendingAction, setPendingAction] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const isRevision = variant === "revision";
  const isSubmitting = pendingAction !== null;
  const canSubmit = Boolean(
    title.trim() && date && time && meridiem && !isSubmitting,
  );

  const resetForm = useCallback(() => {
    const values = getFormValues(initialMilestone);
    setTitle(values.title);
    setDate(values.date);
    setMeridiem(values.meridiem);
    setTime(values.time);
    setSubmitError("");
  }, [initialMilestone]);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    resetForm();
    onClose?.();
  }, [isSubmitting, onClose, resetForm]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setPendingAction("save");
    setSubmitError("");

    try {
      await onSubmit?.({
        title: title.trim(),
        dueDateTime: toDueDateTime(date, time, meridiem),
      });
    } catch (error) {
      console.error(error);
      setSubmitError(
        error?.message ||
          `마일스톤을 ${isRevision ? "수정" : "등록"}하지 못했습니다. 잠시 후 다시 시도해주세요.`,
      );
    } finally {
      setPendingAction(null);
    }
  };

  const handleDelete = async () => {
    if (!isRevision || isSubmitting) return;

    setPendingAction("delete");
    setSubmitError("");

    try {
      await onDelete?.();
    } catch (error) {
      console.error(error);
      setSubmitError(
        error?.message ||
          "마일스톤을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setPendingAction(null);
    }
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
              disabled={isSubmitting}
              className="size-6 cursor-pointer disabled:cursor-not-allowed"
            >
              <img src={closeIcon} alt="" />
            </button>

            <div className="flex w-full flex-col gap-5">
              <Textfield
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="New Milestone"
                disabled={isSubmitting}
                className="w-full"
              />

              <div className="flex w-32.5 flex-col gap-6">
                <div className="flex w-full flex-col gap-4">
                  <h3 className="text-title3 text-gray-900">Date</h3>
                  <DateInput
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    disabled={isSubmitting}
                    className="h-9.5 w-full"
                  />
                </div>

                <div className="flex w-full flex-col gap-4">
                  <h3 className="text-title3 text-gray-900">Time</h3>
                  <div className="flex w-full flex-col gap-3">
                    <Meridiem
                      defaultValue={initialValues.meridiem}
                      onChange={setMeridiem}
                      disabled={isSubmitting}
                    />
                    <TimeInput
                      key={`${initialValues.time.hour}-${initialValues.time.minute}`}
                      defaultHour={initialValues.time.hour}
                      defaultMinute={initialValues.time.minute}
                      onChange={setTime}
                    />
                  </div>
                </div>
              </div>

              {submitError ? (
                <p className="text-body3 text-red-600">
                  {submitError}
                </p>
              ) : null}
            </div>
          </div>

          <div className={`flex gap-2.5 ${isRevision ? "" : "w-full"}`}>
            {isRevision ? (
              <ModalButton
                type="button"
                variant="border"
                disabled={isSubmitting}
                onClick={handleDelete}
              >
                {pendingAction === "delete" ? "Deleting..." : "Delete"}
              </ModalButton>
            ) : null}
            <ModalButton
              type="submit"
              variant={canSubmit ? "on" : "off"}
              disabled={!canSubmit}
              className={isRevision ? "w-24.5" : "w-full"}
            >
              {pendingAction === "save" ? "Saving..." : "Done"}
            </ModalButton>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddMilestoneSelfModal;
