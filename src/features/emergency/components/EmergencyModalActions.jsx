const EmergencyModalActions = ({ mode, onAck, onResolve, onNo }) => {
  if ( mode === "RECHECK" ) {
    return (
      <div className="emergency-footer">
        <button className="emergency-btn emergency-btn--ok" onClick={onResolve}>
          정상 작동
        </button>
        <button className="emergency-btn emergency-btn--no" onClick={onNo}>
          아니오
        </button>
      </div>
    )
  }

  // 기본: ALERT
  return (
    <div className="emergency-footer">
      <button className="emergency-btn" onClick={onAck}>
        확인
      </button>
    </div>
  )
}

export default EmergencyModalActions