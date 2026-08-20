import { useEffect, useState } from "react";
import { ProfileIcon } from "../icons/index.jsx";
import chevronDown from "../../assets/icons/chevron-down.svg";
import chevronUp from "../../assets/icons/chevron-up.svg";
import checkIcon from "../../assets/icons/check.svg";
import { getMe, updateMe } from "../../api/auth.js";
import { useAuth } from "../../auth/AuthContext.js";

const COUNTRIES = ["KR", "VN", "US"];

function MyPage() {
  const { setCurrentUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("KR");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [timezone, setTimezone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);

    try {
      await updateMe({ name, country, timezone });
      setCurrentUser((current) => ({
        ...current,
        name,
        country,
        timezone,
      }));
      alert("저장되었습니다");
    } catch (err) {
      console.error(err);
      alert("저장에 실패했어요");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="flex w-[555px] max-w-full flex-col gap-12">
      {/* 제목 - Display */}
      <h1 className="text-display text-gray-900">Profile</h1>

      <div className="flex w-full flex-col items-end gap-10">
        <div className="flex w-full flex-col gap-8">
          <div className="flex items-end gap-10">
            {/* 아바타 */}
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#ac98e9] bg-gradient-to-b from-purple-500 to-purple-900 text-white shadow-[0_0_16px_rgba(0,0,0,0.08)]">
              <ProfileIcon className="h-8 w-8" />
            </span>

            {/* Name */}
            <label className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="text-title2 text-gray-500">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-16 border border-gray-300 bg-white px-4 py-3 text-subtitle2 text-gray-900 outline-none focus:border-purple-700"
              />
            </label>
          </div>

          <div className="flex w-full flex-col gap-5">
            {/* Email (읽기 전용) */}
            <div className="flex items-center gap-4">
              <span className="w-20 shrink-0 text-title2 text-gray-500">Email</span>
              <span className="text-subtitle2 text-gray-900">{email}</span>
            </div>

            {/* Country 드롭다운 */}
            <div className="relative flex items-center gap-4">
              <span className="w-20 shrink-0 text-title2 text-gray-500">Country</span>
              <button
                type="button"
                onClick={() => setIsCountryOpen((prev) => !prev)}
                aria-expanded={isCountryOpen}
                aria-haspopup="listbox"
                className="flex cursor-pointer items-center gap-1 text-subtitle2 text-gray-900"
              >
                {country}
                {/* 닫힘=아래화살표 / 열림=위화살표 */}
                <img
                  src={isCountryOpen ? chevronUp : chevronDown}
                  alt=""
                  className="h-4 w-4"
                />
              </button>

              {isCountryOpen && (
                <div
                  role="listbox"
                  className="absolute left-24 top-8 z-10 flex w-44 flex-col gap-1 rounded-16 border border-gray-200 bg-white p-2 shadow-[0_0_16px_rgba(0,0,0,0.08)]"
                >
                  {COUNTRIES.map((code) => (
                    <button
                      key={code}
                      type="button"
                      role="option"
                      aria-selected={country === code}
                      onClick={() => {
                        setCountry(code);
                        setIsCountryOpen(false);
                      }}
                      className="flex cursor-pointer items-center justify-between rounded-12 px-3 py-2 text-subtitle3 text-gray-700 hover:bg-purple-100"
                    >
                      {code}
                      {country === code && (
                        <img src={checkIcon} alt="선택됨" className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Timezone - 50자 제한 + 포커스 테두리 */}
            <label className="flex flex-col gap-4">
              <span className="text-title2 text-gray-500">Timezone</span>
              <div className="flex h-[120px] flex-col rounded-16 border border-gray-300 bg-white px-4 py-3 focus-within:border-purple-700">
                <textarea
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value.slice(0, 50))}
                  maxLength={50}
                  placeholder="Enter your time zone."
                  className="min-h-0 w-full flex-1 resize-none bg-transparent text-subtitle2 text-gray-900 outline-none placeholder:text-gray-500"
                />
                <p className="text-right text-body3 text-gray-500">
                  {timezone.length}/50
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="cursor-pointer rounded-12 bg-purple-900 px-6 py-2 text-subtitle3 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default MyPage;
