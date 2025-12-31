import { useEffect, useRef } from "react"
import { useOutsideClick } from "../hooks/useOutsideClick"
import { formatDateTime } from "../../../utils/formatDate"
import { createPortal } from "react-dom"
import { formatSnapshotValue, SNAPSHOT_LABELS } from "../../../utils/formatSnapshot"

const AlertDetailModal = ({ open, alert, onClose }) => {
  const ref = useRef(null)

  // 바깥 클릭 닫기
  useOutsideClick(ref, () => {
    if (open) onClose()
  })

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  if (!open || !alert) return null
  
  let snapshot = alert?.snapshot
  for (let i = 0; i < 2; i++) {
    if (typeof snapshot === "string") {
      try {
        snapshot = JSON.parse(snapshot)
      } catch {
        break
      }
    }
  }
 
  if (!snapshot || typeof snapshot !== "object") snapshot = null;

  const isActive = !alert.endedAt

  const modalUI = (
    <div className="amodal-backdrop" onMouseDown={onClose}>
      <div 
        className="amodal" 
        ref={ref}
        onMouseDown={(e) => e.stopPropagation()} // 내부 클릭은 닫히지 않게
      >
        <div className="amodal-header">
          <div className="amodal-title">{alert.title ?? "알림 상세"}</div>
          <button className="amodal-close" onClick={onClose} type="button">✕</button>
        </div>

        <div className="amodal-sub">
          <span>호기: {alert.machineId ?? "-"}</span>
          <span className={`amodal-status ${isActive ? "s-active" : "s-resolved"}`}>
            {isActive ? "진행중" : "완료"}
          </span>
        </div>

        <div className="amodal-msg">
          {alert.message}
        </div>

        <div className="amodal-meta">
          <div>발생: {formatDateTime(alert.startedAt)}</div>
          {alert.endedAt && <div>종료: {formatDateTime(alert.endedAt)}</div>}
        </div>

        {/* snapshot */}
        <div className="amodal-snapshot">
          <div className="amodal-section-title">스냅샷</div>
          {snapshot ? (
            <div className="amodal-grid">
              {Object.entries(snapshot).map(([k, v]) => (
                <div key={k} className="amodal-row">
                  <div className="amodal-k">{SNAPSHOT_LABELS[k] ?? k}</div>
                  <div className="amodal-v">{String(formatSnapshotValue(k, v))}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="amodal-empty">스냅샷 데이터가 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalUI, document.body)
}

export default AlertDetailModal;