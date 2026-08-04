import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>로그인</h1>
      <button
        type="button"
        className="cursor-pointer border border-gray-950"
        onClick={() => navigate("/signup")}
      >
        회원가입
      </button>
    </div>
  );
}

export default Login;
