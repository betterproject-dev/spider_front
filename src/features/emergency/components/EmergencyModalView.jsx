import EmergencyModalActions from "./EmergencyModalActions"

const EmergencyModalView = ({
  isOpen,
  title,
  statusText,
  message,
  dangerScore,
  mode,
  onAck,
  onResolve,
  onNo
}) => {
  if (!isOpen) return null

  return (
    <div className="emergency-backdrop">
      <div className="emergency-modal">
        <div className="emergency-header">
          <h2>{title}</h2>
        </div>

        <div className="emergency-body">
          <div className="emergency-icon">
            <span className="emergency-icon-text">!</span>
          </div>
          <p className="emergency-status">{statusText}</p>
          <p className="emergency-message">{message}</p>
          {dangerScore != null && (
            <p className="emergency-score">위험 점수: {dangerScore}</p>
          )}

          {mode === "RECHECK" && (
            <p className="emergency-recheck">긴급 상황이 해결되었습니까?</p>
          )}
        </div>
        <EmergencyModalActions 
          mode={mode}
          onAck={onAck}
          onResolve={onResolve}
          onNo={onNo}
        />
      </div>
    </div>
  )
}

export default EmergencyModalView