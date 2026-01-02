import { formatDateTime } from "../../../utils/formatDate"
import { alertApi } from "../api/alertApi";

const NotificationItem = ({ data, onClick, onResolved }) => {
  const isActive = !data.endedAt

  const handleResolve = async (e) => {
    e.stopPropagation(); // 카드 클릭(상세모달) 막기

    const ok = window.confirm("정말 정상가동으로 전환되어 해결 처리할까요?")
    if (!ok) return

    const res = await alertApi.resolveById(data.id)
    if (res.ok) onResolved?.()
    else alert(res.message ?? "해결 처리 실패")
  }

  return (
    <div className={`nitem ${isActive ? "active" : "resolved"}`} onClick={onClick}>
      <div className="nitem-top">
        <span className="nitem-title">{data.title || "알림"}</span>
        <span className={`nitem-badge ${isActive ? "b-active" : "b-resolved"}`}>
          {isActive? "진행중" : "완료"}
        </span>
      </div>

      <div className="nitem-msg">{data.message}</div>

      <div className="nitem-meta">
        <span>호기: {data.machineId ?? "-"}</span>
        <span>{formatDateTime(data.startedAt)}</span>
      </div>

      {/* 진행중일 때만 해결 버튼 */}
      {isActive && (
        <button className="nresolve-btn" onClick={handleResolve} type="button">
          해결
        </button>
      )}
    </div>
  )
}

export default NotificationItem