import { useEmergencyAlertContext } from '../context/EmergencyAlertContext'
import '../styles/EmergencyAlertModal.css'
import EmergencyModalView from './EmergencyModalView';
import { emergencyApi } from "../api/emergencyApi";
import { useEmergencyAlertFromServer } from "../hooks/useEmergencyAlertFromServer";
import { useState } from 'react';
import PinModal from '../../alerts/components/PinModal';

const EmergencyAlertModal = () => {
  const {alert, closeAlert} = useEmergencyAlertContext()
  const [pinOpen, setPinOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 서버가 "지금 띄울 1개"를 계속 내려줌 (ALERT or RECHECK)
  useEmergencyAlertFromServer({
    enabled: !alert.isOpen, // 모달 떠있을 땐 새로 덮어쓰지 않게
  }); 

  const handleAck = async () => {
    if (!alert.id) return
    await emergencyApi.acknowledge(alert.id)
    closeAlert() // 닫으면 다음 폴링에서 (필요 시) 다음 모달이 뜸
  }

  const handleResolve = async (pin) => {
    if (!alert.id) return;
    setLoading(true)
    const res = await emergencyApi.resolve(alert.id, pin);
    setLoading(false)

    // requestHandler가 ok를 주는 구조면 이게 제일 중요
    if (!res.ok) {
      // 여기서 에러 메시지 표시(토스트/alert 등)
      alert(res.message ?? "PIN 인증 실패");
      return; // 실패면 closeAlert 하면 안됨
    }

    setPinOpen(false)
    closeAlert();
  }

  const handleNo = () => {
    // "아니오"는 보통 그냥 닫기만 해도 됨.
    // (서버가 10분 조건 만족 시 다시 RECHECK로 뽑아줌)
    closeAlert()
  }

  return (
    <>
      <EmergencyModalView 
        isOpen={alert.isOpen}
        title={alert.title ?? (alert.machineNo ? `${alert.machineNo}호기 긴급 문제 발생` : "긴급 문제 발생")}
        statusText="작동 중지됨"
        message={alert.message}
        dangerScore={alert.dangerScore}
        mode={alert.mode ?? "ALERT"}
        onAck={handleAck}
        onResolve={() => setPinOpen(true)}
        onNo={handleNo}
      />

      <PinModal 
        open={pinOpen}
        loading={loading}
        onClose={() => !loading && setPinOpen(false)}
        onSubmit={handleResolve}
      />
    </>
  )
}

export default EmergencyAlertModal