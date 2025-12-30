import { useEffect, useRef } from "react"
import { useEmergencyAlertContext } from "../context/EmergencyAlertContext"
import { emergencyApi } from "../api/emergencyApi"

export const useEmergencyAlertFromServer = ({intervalMs = 5000, enabled = true} = {}) => {
  const { openAlert, closeAlert } = useEmergencyAlertContext()
  const showingIdRef = useRef(null)

  useEffect(() => {
    if (!enabled) return

    let timer = null
    let cancelled = false;

    const fetchEmergency = async () => {
      const res = await emergencyApi.fetchActiveEmergency()

      if (cancelled) return;
      if (!res.ok) return;

      const dto  = res.data;
      // 아무것도 없으면 "닫기"는 하지 말고, 다음에 새 이벤트 뜰 수 있게만 초기화
      if (!dto?.id) {
        showingIdRef.current = null;
        return;
      }

      // 이미 같은 이벤트를 띄우고 있으면 무시
      if (showingIdRef.current === dto.id) return
      showingIdRef.current = dto.id

      openAlert({
        id: dto.id,
        machineNo: dto.machineId,
        title: dto.title,
        message: dto.message,
        dangerScore: dto.dangerScore,
        startedAt: dto.startedAt,
        mode: dto.mode ?? "ALERT",  // 서버가 정해준 mode 쓰기
        level: dto.level
      })
    }

    fetchEmergency()
    timer = setInterval(fetchEmergency, intervalMs)

    return () => {
      cancelled = true
      if (timer) clearInterval(timer)
    }
  }, [enabled, intervalMs, openAlert])
}