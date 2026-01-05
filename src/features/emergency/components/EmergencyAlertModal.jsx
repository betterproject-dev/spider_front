import { useEmergencyAlertContext } from '../context/EmergencyAlertContext'
import '../styles/EmergencyAlertModal.css'
import EmergencyModalView from './EmergencyModalView';
import { emergencyApi } from "../api/emergencyApi";
import { useEmergencyAlertFromServer } from "../hooks/useEmergencyAlertFromServer";

const EmergencyAlertModal = () => {
  const {alert, closeAlert} = useEmergencyAlertContext()

  // 서버가 "지금 띄울 1개"를 계속 내려줌 (ALERT or RECHECK)
  useEmergencyAlertFromServer({
    enabled: !alert.isOpen, // 모달 떠있을 땐 새로 덮어쓰지 않게
  }); 

  const handleAck = async () => {
    if (!alert.id) return
    await emergencyApi.acknowledge(alert.id)
    closeAlert() // 닫으면 다음 폴링에서 (필요 시) 다음 모달이 뜸
  }

  const handleResolve = async () => {
    if (alert.id) await emergencyApi.resolve(alert.id);
    closeAlert(); // resolve 후 닫으면 다음 폴링에서 다음 대상이 뜸
  }

  const handleNo = () => {
    // "아니오"는 보통 그냥 닫기만 해도 됨.
    // (서버가 10분 조건 만족 시 다시 RECHECK로 뽑아줌)
    closeAlert()
  }

  return (
    <EmergencyModalView 
      isOpen={alert.isOpen}
      title={alert.title ?? (alert.machineNo ? `${alert.machineNo}호기 긴급 문제 발생` : "긴급 문제 발생")}
      statusText="작동 중지됨"
      message={alert.message}
      dangerScore={alert.dangerScore}
      mode={alert.mode ?? "ALERT"}
      onAck={handleAck}
      onResolve={handleResolve}
      onNo={handleNo}
    />
  )
}

export default EmergencyAlertModal