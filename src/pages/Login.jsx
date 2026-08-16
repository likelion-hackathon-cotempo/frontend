import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: API 연동 시 로그인 요청 → 성공하면 이동
    console.log({ email, password });
    navigate("/main");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="relative flex w-[440px] max-w-full flex-col gap-5 rounded-[28px] bg-white p-6 shadow-[0_0_16px_rgba(0,0,0,0.08)]"
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="닫기"
          className="absolute right-5 top-5 cursor-pointer text-gray-500 transition-colors hover:text-gray-700"
        >
          ✕
        </button>

        {/* 제목 - gap 8 */}
        <div className="flex flex-col gap-2">
          <h1 className="text-[40px] font-bold leading-[1.3] tracking-[-0.02em] text-gray-900">
            Welcome to
          </h1>
          <span className="text-title2 text-gray-700">logo</span>
        </div>

        {/* E-mail */}
        <label className="flex flex-col gap-2">
          <span className="text-title2 text-gray-900">E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="rounded-16 border border-gray-300 bg-white px-4 py-3 text-subtitle2 text-gray-900 outline-none placeholder:text-gray-500 focus:border-purple-700"
          />
        </label>

        {/* Password */}
        <label className="flex flex-col gap-2">
          <span className="text-title2 text-gray-900">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="rounded-16 border border-gray-300 bg-white px-4 py-3 text-subtitle2 text-gray-900 outline-none placeholder:text-gray-500 focus:border-purple-700"
          />
        </label>

        {/* Log in 버튼 - SubTitle1 */}
        <button
          type="submit"
          className="mt-2 cursor-pointer rounded-12 bg-purple-900 py-3 text-subtitle1 text-white transition-colors hover:bg-purple-700"
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
      </form>
    </div>
  );
}

export default Login;