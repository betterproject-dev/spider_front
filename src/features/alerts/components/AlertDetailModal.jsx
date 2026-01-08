import { useCallback, useEffect, useMemo, useRef } from "react"
import { useOutsideClick } from "../hooks/useOutsideClick"
import { formatDateTime } from "../../../utils/formatDate"
import { createPortal } from "react-dom"
import { formatSnapshotValue, SNAPSHOT_LABELS } from "../../../utils/formatSnapshot"

/**
 * AlertDetailModal
 *
 * 개별 알림(Alert)의 상세 정보를 보여주는 모달 컴포넌트
 *
 * 주요 기능:
 * - 바깥 영역 클릭 시 닫힘
 * - ESC 키 입력 시 닫힘
 * - 진행중 / 완료 상태 표시
 * - 발생/종료 시간 표시
 * - 스냅샷 데이터(JSON) 시각화
 * - createPortal을 사용하여 body 하위에 렌더링
 *
 * @param {Object} props
 * @param {boolean} props.open
 *   모달 표시 여부
 * @param {Object|null} props.alert
 *   알림 상세 데이터 객체
 * @param {Function} props.onClose
 *   모달 닫기 콜백
 */
const AlertDetailModal = ({ open, alert, onClose }) => {
  const ref = useRef(null)

  const handleOutside = useCallback(() => {
    if (open) onClose()
  }, [open, onClose])

  /**
   * 모달 외부 클릭 시 닫기 처리
   * - ref 영역(모달 본체)을 제외한 클릭만 감지
   */
  useOutsideClick(ref, handleOutside)

  /**
   * ESC 키로 모달 닫기
   * - 모달이 열려 있을 때만 이벤트 등록
   */
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  /**
   * 스냅샷 데이터 파싱
  *
  * - 서버에서 string(JSON) 또는 object 형태로 올 수 있음
  * - 이중 stringify 된 경우까지 고려하여 최대 2회 파싱 시도
  */
 const snapshot = useMemo(() => {
   let s = alert?.snapshot
   for (let i = 0; i < 2; i++) {
     if (typeof s === "string") {
       try {
         s = JSON.parse(s)
        } catch {
          break
        }
      }
    }
    if (!s || typeof s !== "object") return null
    return s
  }, [alert?.snapshot])
  
  // 모달 비활성화 또는 알림 데이터 없음
  if (!open || !alert) return null

  // 알림 진행 상태 (종료 시간이 없으면 진행중)
  const isActive = !alert.endedAt

  /**
   * 모달 UI 구조
   * - backdrop 클릭 시 닫힘
   * - 내부 클릭은 이벤트 전파 차단
   */
  const modalUI = (
    <div className="amodal-backdrop" onMouseDown={onClose}>
      <div 
        className="amodal" 
        ref={ref}
        onMouseDown={(e) => e.stopPropagation()} // 내부 클릭은 닫히지 않게
      > 
        {/* 헤더 */}
        <div className="amodal-header">
          <div className="amodal-title">{alert.title ?? "알림 상세"}</div>
          <button className="amodal-close" onClick={onClose} type="button">✕</button>
        </div>

        {/* 서브 정보 */}
        <div className="amodal-sub">
          <span>호기: {alert.machineId ?? "-"}</span>
          <span className={`amodal-status ${isActive ? "s-active" : "s-resolved"}`}>
            {isActive ? "진행중" : "완료"}
          </span>
        </div>

        {/* 메시지 */}
        <div className="amodal-msg">
          {alert.message}
        </div>

        {/* 발생 / 종료 시간 */}
        <div className="amodal-meta">
          <div>발생: {formatDateTime(alert.startedAt)}</div>
          {alert.endedAt && <div>종료: {formatDateTime(alert.endedAt)}</div>}
        </div>

        {/* 스냅샷 영역  */}
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

   /**
   * Portal 렌더링
   * - 부모 DOM 구조와 관계없이 body 하위에 모달 렌더링
   * - z-index / overflow 문제 방지
   */
  return createPortal(modalUI, document.body)
}

export default AlertDetailModal;