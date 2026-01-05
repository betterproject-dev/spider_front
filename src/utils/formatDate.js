/**
 * ISO 날짜 문자열을 한국 시간 형식의 날짜·시간 문자열로 변환한다.
 *
 * - 유효한 ISO 문자열이면: `YYYY.MM.DD HH:MM:SS` 형식으로 반환
 * - 값이 없으면("-") 반환
 * - Date 변환이 불가능하면 원본 문자열 그대로 반환
 *
 * @param {string | null | undefined} iso
 *   ISO 8601 형식의 날짜 문자열
 *   예: "2025-01-02T10:15:30Z"
 *
 * @returns {string}
 *   포맷된 날짜·시간 문자열 또는 "-" 또는 원본 문자열
 */
export const formatDateTime = (iso) => {
  // 값이 없을 경우 표시용 대체 문자열 반환
  if (!iso) return "-"

  // ISO 문자열을 Date 객체로 변환
  const d = new Date(iso)

  // Date 변환 실패(NaN) 시 원본 문자열 그대로 반환
  if (Number.isNaN(d.getTime())) return iso

  // 한국 로케일 기준, 24시간제 날짜·시간 포맷
  return d.toLocaleString("ko-KR", {
    hour12: false,        // 24시간제
    year: "numeric",      // 연도 (YYYY)
    month: "2-digit",     // 월 (MM)
    day: "2-digit",       // 일 (DD)
    hour: "2-digit",      // 시 (HH)
    minute: "2-digit",    // 분 (MM)
    second: "2-digit"     // 초 (SS)
  })
}