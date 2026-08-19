import { StarIcon } from "../../icons/index.jsx";

const COLOR_STYLES = {
  blue: { bg: "bg-[#eef2ff]", border: "border-[#b5c2eb]", text: "text-[#4338ca]" },
  red: { bg: "bg-[#fef2f2]", border: "border-[#f7c4c4]", text: "text-[#b91c1c]" },
  green: { bg: "bg-[#f0fdf4]", border: "border-[#bdeecc]", text: "text-[#15803d]" },
  p: { bg: "bg-[#faf5ff]", border: "border-[#e8d2ff]", text: "text-[#7e22ce]" },
};

function EventChip({ color, title, person, isMultiDay = false, onClick }) {
  const style = COLOR_STYLES[color];
  const widthClass = isMultiDay ? "w-full min-w-0" : "w-[77px]";

  if (color === "p") {
    return (
      <div
        className={`flex items-center gap-1 rounded-[6px] border-[0.8px] px-2 py-1.5 ${widthClass} ${style.bg} ${style.border}`}
      >
        <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-[#7e22ce]">
          <StarIcon className="h-[6px] w-[6px]" />
        </span>
        <p className={`truncate text-title5 ${style.text}`}>{title}</p>
      </div>
    );
  }

  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`flex flex-col items-start gap-0.5 rounded-[6px] border-[0.8px] px-2 py-1.5 ${widthClass} ${style.bg} ${style.border} ${onClick ? "cursor-pointer text-left" : ""}`}
    >
      <p className={`w-full truncate text-title5 ${style.text}`}>{title}</p>
      <span className="flex h-3 max-w-[64px] items-center justify-center rounded-[2px] bg-white px-1">
        <span className={`truncate text-label2 ${style.text}`}>{person}</span>
      </span>
    </Component>
  );
}

export default EventChip;
