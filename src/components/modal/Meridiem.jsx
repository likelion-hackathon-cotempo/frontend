// 모달에서 사용하는 am/pm 선택 컴포넌트
// 현재 모달에서만 사용하므로 모달 폴더에 위치시킴
import { useEffect, useState } from "react";

const MERIDIEMS = ["AM", "PM"];

function Meridiem({
  value,
  defaultValue = "AM",
  onChange,
  className = "",
  disabled = false,
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = value ?? internalValue;

  useEffect(() => {
    onChange?.(selectedValue);
  }, [selectedValue, onChange]);

  const handleSelect = (nextValue) => {
    if (disabled || nextValue === selectedValue) return;

    if (value === undefined) {
      setInternalValue(nextValue);
    }
  };

  return (
    <div className={`flex rounded-8 bg-gray-200 p-0.75 ${className}`}>
      {MERIDIEMS.map((meridiem) => {
        const isSelected = selectedValue === meridiem;

        return (
          <button
            key={meridiem}
            type="button"
            aria-pressed={isSelected}
            disabled={disabled}
            onClick={() => handleSelect(meridiem)}
            className={`flex w-15.5 items-center px-2.5 py-1 justify-center rounded-8 text-subtitle2 text-black disabled:cursor-not-allowed  ${
              isSelected ? "bg-white" : "cursor-pointer"
            }`}
          >
            {meridiem}
          </button>
        );
      })}
    </div>
  );
}

export default Meridiem;
