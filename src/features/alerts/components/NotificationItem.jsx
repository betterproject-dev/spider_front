import { formatDateTime } from "../../../utils/formatDate"

const NotificationItem = ({ data, onClick }) => {
  const isActive = !data.endedAt

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
    </div>
  )
}

export default NotificationItem