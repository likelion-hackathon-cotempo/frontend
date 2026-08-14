// 모달에서 사용하는 버튼 컴포넌트
// small의 on/off는 내용에 맞게 너비가 늘어나고, border와 big은 고정 크기를 사용

const SIZE_STYLES = {
  small: "px-2.5 py-2 text-subtitle3",
  big: "h-13 w-90 text-subtitle1",
};

const VARIANT_STYLES = {
  off: "bg-purple-200 text-gray-900",
  on: "bg-purple-900 text-white",
  border:
    "h-9 w-18.5 border border-gray-700 bg-gray-100 text-subtitle3 text-gray-700 px-2.5 py-2",
};

function ModalButton({
  children,
  size = "small",
  variant = "off",
  className = "",
  type = "button",
  ...buttonProps
}) {
  const sizeStyle = variant === "border" ? "" : SIZE_STYLES[size];
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <button
      {...buttonProps}
      type={type}
      className={`flex shrink-0 items-center justify-center rounded-12 ${sizeStyle} ${variantStyle} ${className}`}
    >
      {children}
    </button>
  );
}

export default ModalButton;
