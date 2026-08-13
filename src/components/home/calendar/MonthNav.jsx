import { ChevronIcon } from "../../icons/index.jsx";

function MonthNav({ monthLabel, onPrevMonth, onNextMonth }) {
  return (
    <div className="flex items-center gap-4">
      <p className="text-[20px] leading-[1.3] font-bold tracking-[-0.4px] text-gray-900">
        {monthLabel}
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="이전 달"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-purple-900"
        >
          <ChevronIcon className="h-6 w-6 rotate-180" />
        </button>
        <button
          type="button"
          onClick={onNextMonth}
          aria-label="다음 달"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-purple-900"
        >
          <ChevronIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

export default MonthNav;
