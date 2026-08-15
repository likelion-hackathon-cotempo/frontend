import { useState } from "react";
import { ProfileIcon } from "../icons/index.jsx";

const COUNTRIES = ["KR", "VN", "US"];

function MyPage() {
  const [name, setName] = useState("Jane");
  const [country, setCountry] = useState("KR");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [timezone, setTimezone] = useState("");

  // 로그인한 유저 정보 (나중에 전역상태/API 응답으로 교체)
  const email = "Jane1234@gmail.com";

  const handleSave = () => {
    // TODO: API 연동 시 프로필 저장 요청
    console.log({ name, country, timezone });
  };

  return (
    <section className="flex w-[555px] max-w-full flex-col gap-8">
      {/* 제목 */}
      <h1 className="text-title1 text-gray-900">Profile</h1>

      {/* 아바타 */}
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-purple-500 to-purple-900 text-white">
        <ProfileIcon className="h-8 w-8" />
      </span>

      {/* Name */}
      <label className="flex flex-col gap-2">
        <span className="text-body3 text-gray-500">Name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-12 border border-gray-300 bg-white px-4 py-3 text-body1 text-gray-700 outline-none focus:border-purple-700"
        />
      </label>

      {/* Email (읽기 전용) */}
      <div className="flex items-center gap-4">
        <span className="w-20 shrink-0 text-body3 text-gray-500">Email</span>
        <span className="text-body1 text-gray-700">{email}</span>
      </div>

      {/* Country 드롭다운 */}
      <div className="relative flex items-center gap-4">
        <span className="w-20 shrink-0 text-body3 text-gray-500">Country</span>
        <button
          type="button"
          onClick={() => setIsCountryOpen((prev) => !prev)}
          className="flex items-center gap-1 text-body1 text-gray-700"
        >
          {country}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               className={isCountryOpen ? "rotate-180" : ""}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {isCountryOpen && (
          <div className="absolute left-24 top-8 z-10 flex w-44 flex-col gap-1 rounded-12 border border-gray-200 bg-white p-2 shadow-[0_0_16px_rgba(0,0,0,0.08)]">
            {COUNTRIES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setCountry(code)}
                className="flex items-center justify-between rounded-8 px-3 py-2 text-body2 text-gray-700 hover:bg-purple-100"
              >
                {code}
                {country === code && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setIsCountryOpen(false)}
                className="rounded-12 bg-purple-900 px-3 py-2 text-subtitle3 text-white"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Timezone (글자수 카운터) */}
      <label className="flex flex-col gap-2">
        <span className="text-body3 text-gray-500">Timezone</span>
        <div className="rounded-12 border border-gray-300 bg-white px-4 py-3">
          <textarea
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            maxLength={50}
            rows={3}
            placeholder="Enter your time zone."
            className="w-full resize-none bg-transparent text-body1 text-gray-700 outline-none placeholder:text-gray-500"
          />
          <p className="text-right text-body3 text-gray-500">{timezone.length}/50</p>
        </div>
      </label>

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-12 bg-purple-900 px-6 py-2 text-subtitle3 text-white"
        >
          Save
        </button>
      </div>
    </section>
  );
}

export default MyPage;