import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckIcon } from "../components/icons/index.jsx";

const COUNTRIES = ["KR", "VN", "US"];

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");

  // 5칸 다 채워지면 버튼 활성화
  const isValid = name && email && password && country && timezone;

  const handleSignup = (e) => {
    e.preventDefault();
    if (!isValid) return;
    // TODO: API 연동 시 회원가입 요청 (name/email/password/country/timezone)
    console.log({ name, email, password, country, timezone });
    navigate("/login"); // 성공하면 로그인 페이지로
  };

  return (
    <div className="flex min-h-screen items-center bg-white px-[155px] py-24">
      <div className="flex w-full items-start justify-between gap-16">
        {/* 왼쪽: 헤드라인 (40px Medium, 검정) */}
        <h1 className="w-[531px] text-[40px] font-medium leading-[1.4] tracking-[-0.02em] text-black">
          Start planning with a calendar built for teams across borders.
        </h1>

        {/* 오른쪽: 폼 */}
        <form onSubmit={handleSignup} className="flex w-[440px] flex-col gap-6">
          {/* Name (최대 30) */}
          <label className="flex flex-col gap-2">
            <span className="text-title2 text-gray-700">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 30))}
              maxLength={30}
              placeholder="Enter your name"
              className="rounded-12 border border-gray-300 bg-white px-4 py-3 text-subtitle2 text-gray-700 outline-none placeholder:text-gray-500 focus:border-purple-700"
            />
          </label>

          {/* E-mail (type=email) */}
          <label className="flex flex-col gap-2">
            <span className="text-title2 text-gray-700">E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.slice(0, 100))}
              maxLength={100}
              placeholder="Enter your E-mail"
              className="rounded-12 border border-gray-300 bg-white px-4 py-3 text-subtitle2 text-gray-700 outline-none placeholder:text-gray-500 focus:border-purple-700"
            />
          </label>

          {/* Password (type=password) */}
          <label className="flex flex-col gap-2">
            <span className="text-title2 text-gray-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="rounded-12 border border-gray-300 bg-white px-4 py-3 text-subtitle2 text-gray-700 outline-none placeholder:text-gray-500 focus:border-purple-700"
            />
          </label>

          {/* Country (KR/VN/US 택1, 3줄 다 체크) */}
          <div className="flex flex-col gap-2">
            <span className="text-title2 text-gray-700">Country</span>
            <div className="flex flex-col gap-2">
              {COUNTRIES.map((code) => {
                const selected = country === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCountry(code)}
                    className={`flex cursor-pointer items-center justify-between rounded-12 border px-4 py-3 text-subtitle2 transition-colors ${
                      selected
                        ? "border-purple-600 bg-purple-200 text-gray-900"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {code}
                    <CheckIcon className={`h-4 w-4 ${selected ? "text-purple-900" : "text-gray-500"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timezone (최대 50 + 카운터) */}
          <label className="flex flex-col gap-2">
            <span className="text-title2 text-gray-700">Timezone</span>
            <div className="rounded-12 border border-gray-300 bg-white px-4 py-3 focus-within:border-purple-700">
              <textarea
                value={timezone}
                onChange={(e) => setTimezone(e.target.value.slice(0, 50))}
                maxLength={50}
                rows={3}
                placeholder="Enter your time zone."
                className="w-full resize-none bg-transparent text-subtitle2 text-gray-700 outline-none placeholder:text-gray-500"
              />
              <p className="text-right text-body3 text-gray-500">{timezone.length}/50</p>
            </div>
          </label>

          {/* Sign up (다 채워야 활성화 → /login) */}
          <button
            type="submit"
            disabled={!isValid}
            className={`rounded-12 py-3 text-subtitle1 transition-colors ${
              isValid
                ? "cursor-pointer bg-purple-900 text-white hover:bg-purple-700"
                : "cursor-not-allowed bg-purple-200 text-gray-500"
            }`}
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;