const formatterCache = new Map();
const COUNTRY_TIME_ZONES = {
  KR: "Asia/Seoul",
  VN: "Asia/Ho_Chi_Minh",
  US: "America/Los_Angeles",
};

export const normalizeTimeZone = (timeZone) => {
  const candidate = String(timeZone ?? "").trim();
  if (!candidate) return "UTC";

  try {
    new Intl.DateTimeFormat("en", { timeZone: candidate }).format();
    return candidate;
  } catch {
    return "UTC";
  }
};

export const getMemberTimeZone = (member) => {
  const savedTimeZone = String(member?.timezone ?? "").trim();
  const countryTimeZone =
    COUNTRY_TIME_ZONES[String(member?.country ?? "").toUpperCase()];

  return normalizeTimeZone(savedTimeZone || countryTimeZone);
};

const getPartsFormatter = (timeZone) => {
  const normalizedTimeZone = normalizeTimeZone(timeZone);
  if (!formatterCache.has(normalizedTimeZone)) {
    formatterCache.set(
      normalizedTimeZone,
      new Intl.DateTimeFormat("en-CA", {
        timeZone: normalizedTimeZone,
        calendar: "gregory",
        numberingSystem: "latn",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }),
    );
  }

  return formatterCache.get(normalizedTimeZone);
};

export const getZonedDateTimeParts = (value, timeZone) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const values = Object.fromEntries(
    getPartsFormatter(timeZone)
      .formatToParts(date)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value: partValue }) => [type, Number(partValue)]),
  );

  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  };
};

const pad = (value) => String(value).padStart(2, "0");

export const toDateKey = ({ year, month, day }) =>
  `${year}-${pad(month)}-${pad(day)}`;

export const getZonedDateKey = (value, timeZone) => {
  const parts = getZonedDateTimeParts(value, timeZone);
  return parts ? toDateKey(parts) : null;
};

export const parseDateKey = (dateKey) => {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey ?? "");
  if (!matched) return null;

  return {
    year: Number(matched[1]),
    month: Number(matched[2]),
    day: Number(matched[3]),
  };
};

export const formatShortDateKey = (dateKey) => {
  const parts = parseDateKey(dateKey);
  if (!parts) return "";

  return `${String(parts.year).slice(-2)}. ${pad(parts.month)}. ${pad(parts.day)}`;
};

export const formatZonedTime = (value, timeZone) => {
  const parts = getZonedDateTimeParts(value, timeZone);
  return parts ? `${pad(parts.hour)}:${pad(parts.minute)}` : "";
};

export const formatZonedMonthDayTime = (value, timeZone) => {
  const parts = getZonedDateTimeParts(value, timeZone);
  if (!parts) return "";

  return `${pad(parts.month)}. ${pad(parts.day)} · ${pad(parts.hour)}:${pad(parts.minute)}`;
};

export const zonedDateTimeToUtcIso = (dateKey, time, meridiem, timeZone) => {
  const dateParts = parseDateKey(dateKey);
  if (!dateParts) throw new Error("유효하지 않은 날짜입니다.");

  const hour =
    (Number(time.hour) % 12) + (String(meridiem).toUpperCase() === "PM" ? 12 : 0);
  const second = Number(time.second ?? 0);
  const millisecond = Number(time.millisecond ?? 0);
  const targetAsUtc = Date.UTC(
    dateParts.year,
    dateParts.month - 1,
    dateParts.day,
    hour,
    Number(time.minute),
    second,
    millisecond,
  );
  let utcTime = targetAsUtc;

  // IANA timezone의 벽시계 시간을 UTC instant로 역산한다.
  // 반복 보정으로 DST 전환 전후의 offset 변경도 반영한다.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const displayed = getZonedDateTimeParts(new Date(utcTime), timeZone);
    const displayedAsUtc = Date.UTC(
      displayed.year,
      displayed.month - 1,
      displayed.day,
      displayed.hour,
      displayed.minute,
      displayed.second,
      new Date(utcTime).getUTCMilliseconds(),
    );
    const difference = targetAsUtc - displayedAsUtc;

    utcTime += difference;
    if (difference === 0) break;
  }

  return new Date(utcTime).toISOString();
};
