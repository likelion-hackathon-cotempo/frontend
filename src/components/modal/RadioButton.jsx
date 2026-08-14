// 모달에 사용하는 라디오 버튼 컴포넌트

function RadioButton({ label, checked, className = "", ...inputProps }) {
  return (
    <label
      className={`flex w-full items-center gap-3 rounded-12 border p-2 ${
        checked ? "border-purple-900" : "border-gray-300"
      } cursor-pointer ${className}`}
    >
      <input
        {...inputProps}
        type="radio"
        checked={checked}
        className="size-5 shrink-0 appearance-none rounded-full border border-gray-300 checked:border-[6px] checked:border-purple-900"
      />
      <span className="text-body2 text-gray-900">{label}</span>
    </label>
  );
}

export default RadioButton;
