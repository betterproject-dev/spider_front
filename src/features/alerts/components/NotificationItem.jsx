import { useMemo } from "react"
import { formatDateTime } from "../../../utils/formatDate"

const REASON_TO_CLASS = (code) => {
  const cls = []
  if (code.includes("OFFLINE")) return "offline"
  if (code.includes("LEAK")) return "leak"
  if (code.includes("SCORE")) return "score"
  if (code.includes("SENSOR")) return "sensor"
  return cls.join(" ")
}

const REASON_LABEL_MAP = {
  REALTIME_LEAK: "실시간 누수",
  REALTIME_SCORE: "점수 초과",
  OFFLINE_LEAK: "통신두절+누수",
  OFFLINE_SENSOR: "통신두절+센서"
}

const NotificationItem = ({ data, onClick, onResolveClick }) => {
  const isActive = !data.endedAt

  // snapshot에서 reason만 안전하게 뽑기
  const reasons = useMemo(() => {
    let s = data?.snapshot
    for (let i = 0; i < 2; i++) {
      if (typeof s === "string") {
        try { s = JSON.parse(s)} catch {break}
      }
    }
    const arr = s?.reasons
    return Array.isArray(arr) ? arr : []
  }, [data?.snapshot])

  return (
    <div className={`nitem ${isActive ? "active" : "resolved"}`} onClick={onClick}>
      <div className="nitem-top">
        <span className="nitem-title">{data.title || "알림"}</span>
        <span className={`nitem-badge ${isActive ? "b-active" : "b-resolved"}`}>
          {isActive? "진행중" : "완료"}
        </span>
      </div>

      <div className="nitem-msg">{data.message}</div>

      {reasons.length > 0 && (
        <div className="areasons">
          {reasons.slice(0, 3).map((code) => (
            <span
              key={code}
              className={`areason-chip ${REASON_TO_CLASS(code)}`}
              title={code}
            >
              {REASON_LABEL_MAP[code] || code}
            </span>
          ))}
          {reasons.length > 3 && (
            <span className="areason-chip">+{reasons.length - 3}</span>
          )}
        </div>
      )}

      <div className="nitem-meta">
        <span>호기: {data.machineId ?? "-"}</span>
        <span>{formatDateTime(data.startedAt)}</span>
      </div>

      {/* 진행중일 때만 해결 버튼 */}
      {isActive && (
        <button 
          className="nresolve-btn" 
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onResolveClick?.()
          }} 
        >
          해결
        </button>
      )}
    </div>
  )
}

export default NotificationItem