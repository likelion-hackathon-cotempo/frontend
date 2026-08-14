// 모달에서 사용하는 시간 입력 컴포넌트
// 시간은 12시간제로 12시까지 입력가능. 분은 0~59까지 입력가능. 입력값이 없으면 01으로 초기화

import { useEffect, useState } from "react";

function TimeInput({
  defaultHour = "01",
  defaultMinute = "00",
  onChange,
}) {
  const [hour, setHour] = useState(defaultHour);
  const [minute, setMinute] = useState(defaultMinute);

  useEffect(() => {
    onChange?.({ hour, minute });
  }, [hour, minute, onChange]);

  const handleChange = (unit, value) => {
    const nextValue = value.replace(/\D/g, "").slice(0, 2);

    if (unit === "hour") {
      setHour(nextValue);
      return;
    }

    setMinute(nextValue);
  };

  const formatValue = (unit, value) => {
    const max = unit === "hour" ? 12 : 59;
    const fallback = unit === "hour" ? 1 : 0;
    const number = Number(value);
    const formattedValue =
      value === "" || number < fallback ? fallback : Math.min(number, max);

    return String(formattedValue).padStart(2, "0");
  };

  const handleBlur = (unit) => {
    if (unit === "hour") {
      const nextHour = formatValue("hour", hour);
      setHour(nextHour);
      return;
    }

    const nextMinute = formatValue("minute", minute);
    setMinute(nextMinute);
  };

  return (
    <div className="flex h-9 items-center justify-center gap-5 rounded-8 bg-gray-200 text-subtitle2 text-gray-900 outline-none">
      <input
        type="text"
        inputMode="numeric"
        value={hour}
        maxLength={2}
        onChange={(event) => handleChange("hour", event.target.value)}
        onBlur={() => handleBlur("hour")}
        className="w-5 text-center outline-none"
      />
      <span className="text-subtitle2 text-gray-900">:</span>
      <input
        type="text"
        inputMode="numeric"
        value={minute}
        maxLength={2}
        onChange={(event) => handleChange("minute", event.target.value)}
        onBlur={() => handleBlur("minute")}
        className="w-5 text-center outline-none"
      />
    </div>
  );
}

export default TimeInput;
