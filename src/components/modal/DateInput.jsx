// 모달에서 사용하는 날짜 입력 컴포넌트
// 모달 레이아웃에 따라 className으로 width 등을 덮어쓸 수 있음

function DateInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      type="date"
      className={`w-40 rounded-8 border border-gray-300 bg-white px-3 py-2 text-body2 text-gray-900 outline-none ${className}`}
    />
  );
}

export default DateInput;
