function SuggestionCard({ title, description, variant = "off", onClick }) {
  const variantStyle =
    variant === "on"
      ? "border border-purple-900 bg-purple-100"
      : "bg-gray-100";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full shrink-0 cursor-pointer flex-col items-start gap-2 rounded-16 p-4 text-left ${variantStyle}`}
    >
      <span className="text-subtitle1 text-gray-900">{title}</span>
      <span className="whitespace-pre-line text-body1 text-gray-700">
        {description}
      </span>
    </button>
  );
}

export default SuggestionCard;
