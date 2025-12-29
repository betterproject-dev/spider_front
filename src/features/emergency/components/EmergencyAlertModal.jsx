import { useEffect } from 'react';
import { useEmergencyAlertContext } from '../context/EmergencyAlertContext'
import '../styles/EmergencyAlertModal.css'

const EmergencyAlertModal = () => {
  const {alert, closeAlert, openAlert} = useEmergencyAlertContext()

  useEffect(() => {
    // 테스트용: 1초 뒤 강제 오픈
    const t = setTimeout(() => {
      openAlert({ machineNo: 4, sensorValue: 98, message: "온도 허용치 30초 초과" });
    }, 1000);
    return () => clearTimeout(t);
  }, [openAlert]);

  if (!alert.isOpen) return null

  return (
    <div className="emergency-backdrop">
      <div className="emergency-modal">
        <div className="emergency-header">
          <h2>{alert.machineNo}호기 긴급 문제 발생</h2>
        </div>

        <div className="emergency-body">
          <div className="emergency-icon">
            <span className="emergency-icon-text">!</span>
          </div>
          <p className="emergency-status">작동 중지됨</p>
          <p className="emergency-message">{alert.message}</p>
          <p className="emergency-sensor">
            센서값 : <strong>{alert.sensorValue}</strong>
          </p>
        </div>
        <div className="emergency-footer">
          <button className="emergency-btn" onClick={closeAlert}>
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmergencyAlertModal