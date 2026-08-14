function SidePanelCard({ title, children }) {
  return (
    <div className="flex w-full flex-col gap-[18px] rounded-[28px] border border-white bg-white/65 p-5 shadow-[0_0_16px_rgba(0,0,0,0.08)]">
      <p className="text-subtitle1 text-gray-900">{title}</p>
      {children}
    </div>
  );
}

export default SidePanelCard;
