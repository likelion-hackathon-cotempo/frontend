import { useEffect, useRef, useState } from "react";
import closeIcon from "../../assets/icons/close.svg";
import copyIcon from "../../assets/icons/copy.svg";
import CodeCard from "./CodeCard.jsx";
import ModalButton from "./ModalButton.jsx";

const CODE_LENGTH = 6;
const MOCK_INVITE_CODE = "Y2EQ93";
const createEmptyCode = () => Array(CODE_LENGTH).fill("");

function JoinTeam({
  isOpen,
  variant = "input",
  inviteCode = MOCK_INVITE_CODE,
  onClose,
  onSubmit,
}) {
  const [code, setCode] = useState(createEmptyCode);
  const [isCopied, setIsCopied] = useState(false);
  const inputRefs = useRef([]);
  const isInputVariant = variant === "input";
  const isComplete = code.every(Boolean);
  const normalizedInviteCode = String(inviteCode)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, CODE_LENGTH);
  const shareCode = Array.from(
    { length: CODE_LENGTH },
    (_, index) => normalizedInviteCode[index] ?? "",
  );
  const displayedCode = isInputVariant ? code : shareCode;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setCode(createEmptyCode());
        setIsCopied(false);
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !["input", "share"].includes(variant)) return null;

  const handleClose = () => {
    setCode(createEmptyCode());
    setIsCopied(false);
    onClose?.();
  };

  const handleCodeChange = (index, event) => {
    const nextCharacter = event.currentTarget.value;

    setCode((currentCode) =>
      currentCode.map((character, characterIndex) =>
        characterIndex === index ? nextCharacter : character,
      ),
    );

    if (nextCharacter && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isComplete) return;

    const inviteCode = code.join("");
    setCode(createEmptyCode());
    onSubmit?.(inviteCode);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(normalizedInviteCode);
    setIsCopied(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section className="w-100 rounded-28 bg-white p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-end">
            <button
              type="button"
              aria-label="Close"
              onClick={handleClose}
              className="size-6 cursor-pointer"
            >
              <img src={closeIcon} alt="" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-5">
              <div className="flex flex-col items-center gap-1 text-center">
                <h2 className="text-subtitle1 text-gray-900">
                  {isInputVariant
                    ? "Enter your invite code"
                    : "Share your invite code"}
                </h2>
                <p className="whitespace-nowrap text-body3 text-gray-700">
                  {isInputVariant
                    ? "Enter the 6-digit code from your team admin to join the team."
                    : "Share this 6-digit code with your team members."}
                </p>
              </div>

              <div className="flex gap-1">
                {displayedCode.map((character, index) => (
                  <CodeCard
                    key={isInputVariant ? index : `${character}-${index}`}
                    ref={
                      isInputVariant
                        ? (element) => {
                            inputRefs.current[index] = element;
                          }
                        : undefined
                    }
                    variant={character ? "filled" : "empty"}
                    aria-label={`Invite code character ${index + 1}`}
                    readOnly={!isInputVariant}
                    onChange={
                      isInputVariant
                        ? (event) => handleCodeChange(index, event)
                        : undefined
                    }
                  >
                    {character}
                  </CodeCard>
                ))}
              </div>
            </div>

            <ModalButton
              type={isInputVariant ? "submit" : "button"}
              size="big"
              variant={isInputVariant && !isComplete ? "off" : "on"}
              disabled={isInputVariant && !isComplete}
              onClick={isInputVariant ? undefined : handleCopy}
              className={isInputVariant ? "" : "gap-2"}
            >
              {isInputVariant ? (
                "Next"
              ) : (
                <>
                  <img src={copyIcon} alt="" className="size-6" />
                  {isCopied ? "Copied!" : "Copy Invite Code"}
                </>
              )}
            </ModalButton>
          </div>
        </form>
      </section>
    </div>
  );
}

export default JoinTeam;
