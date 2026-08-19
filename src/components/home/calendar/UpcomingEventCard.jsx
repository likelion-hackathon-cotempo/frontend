import { CalendarSmallIcon, ClockIcon } from "../../icons/index.jsx";

const AVATAR_GRADIENTS = [
  { from: "#e1e1e1", to: "#646464" },
  { from: "#ffe8e8", to: "#ff6060" },
  { from: "#a1c8ff", to: "#006aff" },
  { from: "#b3ffcb", to: "#50cb76" },
  { from: "#ecdbff", to: "#6c11d4" },
];

function AvatarStack({ members }) {
  return (
    <div className="flex items-center">
      {members.map((member, index) => {
        const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
        return (
          <div
            key={`${member}-${index}`}
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-[16.1px] font-semibold text-white drop-shadow-[0_0_4.5px_rgba(52,56,65,0.1)]"
            style={{
              marginLeft: index === 0 ? 0 : -18,
              background: `linear-gradient(to bottom, ${gradient.from}, ${gradient.to})`,
            }}
          >
            {member}
          </div>
        );
      })}
    </div>
  );
}

function UpcomingEventCard({ title, date, time, members }) {
  return (
    <div className="flex w-[270px] shrink-0 items-end justify-between rounded-[28px] border border-white bg-white/65 px-5 py-4">
      <div className="flex flex-col gap-2">
        <p className="text-title2 text-gray-900">{title}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <CalendarSmallIcon className="h-4 w-4 text-gray-500" />
            <p className="text-label text-gray-500">{date}</p>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4 text-gray-500" />
            <p className="text-label text-gray-500">{time}</p>
          </div>
        </div>
      </div>
      <AvatarStack members={members} />
    </div>
  );
}

export default UpcomingEventCard;
