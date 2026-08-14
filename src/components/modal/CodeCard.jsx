// 팀 참여 모달에서 코드의 입력 상태와 공유 코드를 보여주는 카드

import { useState } from "react";

const VARIANT_STYLES = {
  empty: "bg-gray-200 px-2.5 py-4",
  filled: "bg-gray-200 p-2.5",
  active: "border border-purple-900 bg-purple-100 p-2.5",
};

const normalizeCodeCharacter = (inputValue) =>
  String(inputValue)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 1);

function CodeCard({
  children,
  variant = "empty",
  onChange,
  onFocus,
  onBlur,
  className = "",
  readOnly = false,
  ...inputProps
}) {
  const [internalValue, setInternalValue] = useState(() =>
    normalizeCodeCharacter(children ?? ""),
  );
  const [interactionVariant, setInteractionVariant] = useState(null);
  const currentValue = internalValue;
  const currentVariant = interactionVariant ?? variant;
  const variantStyle = VARIANT_STYLES[currentVariant] ?? VARIANT_STYLES.empty;

  const handleChange = (event) => {
    const nextValue = normalizeCodeCharacter(event.currentTarget.value);
    event.currentTarget.value = nextValue;

    setInternalValue(nextValue);

    onChange?.(event);
  };

  const handleFocus = (event) => {
    if (!readOnly) {
      setInteractionVariant("active");
    }

    onFocus?.(event);
  };

  const handleBlur = (event) => {
    if (!readOnly) {
      setInteractionVariant(event.target.value ? "filled" : "empty");
    }

    onBlur?.(event);
  };

  return (
    <input
      {...inputProps}
      type="text"
      value={currentValue}
      maxLength={1}
      placeholder="_"
      readOnly={readOnly}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`h-16.5 w-12 shrink-0 rounded-8 text-center text-title1 text-gray-900 outline-none placeholder:text-gray-900 focus:placeholder:text-transparent ${variantStyle} ${className}`}
    />
  );
}

export default CodeCard;
