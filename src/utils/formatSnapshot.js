import { formatDateTime } from "./formatDate"

/** 스냅샷 key → 한글 라벨 */
export const SNAPSHOT_LABELS = {
  temperature: "온도(°C)",
  humidity: "습도(%)",
  noise: "소음(dB)",
  leak: "누수",
  danger_score: "위험도",
  created_at: "스냅샷 시간",
}

/** 숫자 포맷 */
const fmtNum = (v, digits = 2) =>
  typeof v === "number" ? Number(v.toFixed(digits)) : v

/** 스냅샷 값 표시용 포맷 */
export const formatSnapshotValue = (key, value) => {
  // 누수 boolean 처리
  if (key === "leak") {
    if(value === true || value === 1 || value === "1") return "누수 없음"
    if(value === false || value === 0 || value === "0") return "누수 감지"
    return String(value)
  }

  // 스냅샷 시간
  if ( key === "created_at") {
    return formatDateTime(value)
  }

  if (key === "danger_score") return fmtNum(value, 2);
  if (key === "temperature") return fmtNum(value, 2);
  if (key === "humidity") return fmtNum(value, 0);
  if (key === "noise") return fmtNum(value, 2);

  return typeof value === "string" ? value : String(value)
}