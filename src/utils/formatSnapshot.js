import { formatDateTime } from "./formatDate"

/**
 * 스냅샷 key → 화면 표시용 한글 라벨 매핑
 *
 * 서버에서 내려오는 스냅샷 객체의 key를
 * 사용자에게 보여줄 한글 텍스트로 변환하기 위한 상수
 *
 * 예:
 *  temperature → "온도(°C)"
 *  created_at  → "스냅샷 시간"
 */

/** 스냅샷 key → 한글 라벨 */
export const SNAPSHOT_LABELS = {
  temperature: "온도(°C)",
  humidity: "습도(%)",
  noise: "소음(dB)",
  leak: "누수",
  danger_score: "위험도",
  created_at: "스냅샷 시간",
  heartbeat_last_seen: "마지막 통신 시각",
  reasons: "발생 원인",
  realtime_created_at: "실시간 감지 시각",
  realtime_updated_at: "실시간 갱신 시각",
  offline_updated_at: "통신 두절 감지 시각",
  last_sensor_created_at: "마지막 센서 수집 시각",
  offline_seconds: "미수신 경과"
}

/**
 * 숫자 포맷 유틸
 *
 * - 숫자일 경우 소수점 자릿수를 제한
 * - 숫자가 아니면 그대로 반환
 *
 * @param {any} v
 *   포맷할 값
 * @param {number} digits
 *   소수점 자릿수 (기본값: 2)
 *
 * @returns {any}
 *   포맷된 숫자 또는 원본 값
 */
const fmtNum = (v, digits = 2) =>
  typeof v === "number" ? Number(v.toFixed(digits)) : v

/**
 * 스냅샷 값 표시용 포맷 함수
 *
 * 스냅샷 데이터의 key와 value를 기준으로
 * UI에서 사람이 읽기 쉬운 형태로 변환한다.
 *
 * 처리 규칙:
 * - leak          : 누수 여부를 한글 상태로 변환
 * - created_at    : 날짜/시간 포맷 적용
 * - danger_score  : 소수점 2자리
 * - temperature   : 소수점 2자리
 * - humidity      : 정수
 * - noise         : 소수점 2자리
 *
 * @param {string} key
 *   스냅샷 필드 키
 * @param {any} value
 *   해당 필드의 값
 *
 * @returns {string | number}
 *   UI 표시용으로 가공된 값
 */

export const formatSnapshotValue = (key, value) => {
  // 누수 여부 처리 (boolean / number / string 대응)
  if (key === "leak") {
    if(value === true || value === 1 || value === "1") return "누수 없음"
    if(value === false || value === 0 || value === "0") return "누수 감지"
    return String(value)
  }

  // 발생 원인 배열 처리
  if (key === "reasons") {
    if (!Array.isArray(value)) return String(value)

    const REASON_LABEL_MAP = {
      REALTIME_LEAK: "실시간 누수 감지",
      REALTIME_SCORE: "실시간 위험 점수 초과",
      OFFLINE_LEAK: "통신 두절 중 누수 의심",
      OFFLINE_SENSOR: "통신 두절 중 센서 임계치 초과"
    }

    return value
      .map(v => REASON_LABEL_MAP[v] || v)
      .join(", ")
  }

  // 시간 계열 필드 공통 처리
  if (
    key === "created_at" ||
    key === "heartbeat_last_seen" ||
    key === "realtime_created_at" ||
    key === "realtime_updated_at" ||
    key === "offline_updated_at" ||
    key === "last_sensor_created_at"
  ) {
    return formatDateTime(value)
  }

  // 센서/점수 값 포맷
  if (key === "danger_score") return fmtNum(value, 2)
  if (key === "temperature") return fmtNum(value, 2)
  if (key === "humidity") return fmtNum(value, 0)
  if (key === "noise") return fmtNum(value, 2)

  // 초 → "분 초" 포맷
  const formatSeconds = (sec) => {
    if (typeof sec !== "number") return String(sec)
    const s = Math.floor(sec)
    const m = Math.floor(s / 60)
    const r = s % 60
    return m > 0 ? `${m}분 ${r}초` : `${r}초`
  }

  if (key === "offline_seconds") {
    return formatSeconds(value)
  }
    
  // 기본 처리: 문자열은 그대로, 그 외는 문자열 변환
  return typeof value === "string" ? value : String(value)
}