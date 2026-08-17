import { useEffect, useState} from "react";
import { ProfileIcon } from "../icons/index.jsx";
import chevronDown from "../../assets/icons/chevron-down.svg";
import chevronUp from "../../assets/icons/chevron-up.svg";
import checkIcon from "../../assets/icons/check.svg";
import { getMe, updateMe } from "../../api/auth.js";

const COUNTRIES = ["KR", "VN", "US"];

function MyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("KR");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [timezone, setTimezone] = useState("");

  // 화면 뜰 때 내 정보 불러오기
  useEffect(() => {
    getMe()
      .then((me) => {
        setName(me.name ?? "");
        setEmail(me.email ?? "");
        setCountry(me.country ?? "KR");
        setTimezone(me.timezone ?? "");
      })
      .catch((err) => console.error(err));
  }, []);
  const handleSave = async () => {
    try {
      await updateMe({ name, country, timezone });
      alert("저장되었습니다");
    } catch (err) {
      console.error(err);
      alert("저장에 실패했어요");
    }
  };
  
  return (
    <section className="flex w-[555px] max-w-full flex-col gap-8">
      {/* 제목 - Display */}
      <h1 className="text-display text-gray-900">Profile</h1>

      {/* 아바타 */}
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-purple-500 to-purple-900 text-white">
        <ProfileIcon className="h-8 w-8" />
      </span>

      {/* Name */}
      <label className="flex flex-col gap-2">
        <span className="text-title2 text-gray-900">Name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-16 border border-gray-300 bg-white px-4 py-3 text-subtitle2 text-gray-900 outline-none focus:border-purple-700"
        />
      </label>

      {/* Email (읽기 전용) */}
      <div className="flex items-center gap-4">
        <span className="w-20 shrink-0 text-title2 text-gray-900">Email</span>
        <span className="text-subtitle2 text-gray-900">{email}</span>
      </div>

      {/* Country 드롭다운 */}
      <div className="relative flex items-center gap-4">
        <span className="w-20 shrink-0 text-title2 text-gray-900">Country</span>
        <button
          type="button"
          onClick={() => setIsCountryOpen((prev) => !prev)}
          className="flex items-center gap-1 text-subtitle2 text-gray-900"
        >
          {country}
          {/* 닫힘=아래화살표 / 열림=위화살표 */}
          <img src={isCountryOpen ? chevronUp : chevronDown} alt="" className="h-4 w-4" />
        </button>

        {isCountryOpen && (
          <div className="absolute left-24 top-8 z-10 flex w-44 flex-col gap-1 rounded-16 border border-gray-200 bg-white p-2 shadow-[0_0_16px_rgba(0,0,0,0.08)]">
            {COUNTRIES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setCountry(code)}
                className="flex items-center justify-between rounded-12 px-3 py-2 text-subtitle3 text-gray-700 hover:bg-purple-100"
              >
                {code}
                {country === code && <img src={checkIcon} alt="선택됨" className="h-4 w-4" />}
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

      {/* Timezone - 50자 제한 + 포커스 테두리 */}
      <label className="flex flex-col gap-2">
        <span className="text-title2 text-gray-900">Timezone</span>
        <div className="rounded-16 border border-gray-300 bg-white px-4 py-3 focus-within:border-purple-700">
          <textarea
            value={timezone}
            onChange={(e) => setTimezone(e.target.value.slice(0, 50))}
            maxLength={50}
            rows={3}
            placeholder="Enter your time zone."
            className="w-full resize-none bg-transparent text-subtitle2 text-gray-900 outline-none placeholder:text-gray-500"
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