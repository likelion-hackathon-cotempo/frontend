// 모달에 사용하는 텍스트 필드 컴포넌트
// 테두리가 없고 height만 고정시키며, 모달에서 width 조정

function Textfield({ className = "", placeholder, ...props }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`h-7 border-0 bg-transparent p-0 text-title1 text-gray-700 outline-none placeholder:text-gray-500 focus:border-0 focus:outline-none focus:ring-0 ${className}`}
      {...props}
    />
  );
}

export default Textfield;
