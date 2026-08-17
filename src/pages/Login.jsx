import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await login({ email, password });
    navigate("/main");
  } catch (err) {
    console.error(err);
    alert(err.message || "이메일/비밀번호를 확인해주세요");
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-purple-200 px-4">
      <form
        onSubmit={handleLogin}
        className="flex w-[440px] max-w-full flex-col gap-6 rounded-[28px] bg-white/60 p-5 shadow-[0_0_16px_rgba(0,0,0,0.08)] backdrop-blur-md"
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="닫기"
          className="cursor-pointer self-end text-gray-500 transition-colors hover:text-gray-700"
        >
          ✕
        </button>

        <div className="flex flex-col gap-2">
          <h1 className="text-[40px] font-bold leading-[1.3] tracking-[-0.02em] text-gray-900">
            Welcome to
          </h1>
          <span className="text-title1 text-purple-900">cotempo</span>
        </div>

        {/* E-mail - 라벨/글씨 gray-700 */}
        <label className="flex flex-col gap-2">
          <span className="text-title2 text-gray-700">E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="rounded-16 border border-gray-300 bg-white px-4 py-3 text-subtitle2 text-gray-700 outline-none placeholder:text-gray-500 focus:border-purple-700"
          />
        </label>

        {/* Password - 라벨/글씨 gray-700 */}
        <label className="flex flex-col gap-2">
          <span className="text-title2 text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="rounded-16 border border-gray-300 bg-white px-4 py-3 text-subtitle2 text-gray-700 outline-none placeholder:text-gray-500 focus:border-purple-700"
          />
        </label>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            className="cursor-pointer rounded-12 bg-purple-900 py-3 text-subtitle1 text-white transition-colors hover:bg-purple-700"
          >
            Log in
          </button>
          <p className="text-center text-body3 text-gray-500">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="cursor-pointer text-purple-900 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;