import { useEffect, useRef } from "react"
import { useEmergencyAlertContext } from "../context/EmergencyAlertContext"
import { emergencyApi } from "../api/emergencyApi"

/**
 * useEmergencyAlertFromServer
 *
 * 서버(Spring)에서 "진행 중인 긴급 알림"을 주기적으로 조회하여
 * 새로운 알림이 발생했을 때만 모달을 띄우는 커스텀 훅
 *
 * 주요 특징:
 * - polling 방식 (setInterval)
 * - 동일한 알림 ID 중복 표시 방지
 * - 알림이 없을 경우 기존 알림을 강제로 닫지 않음
 * - enabled 옵션으로 동작 제어 가능
 *
 * @param {Object} options
 * @param {number} options.intervalMs
 *   서버 polling 주기 (ms, 기본값: 5000)
 * @param {boolean} options.enabled
 *   훅 활성화 여부 (기본값: true)
 */
export const useEmergencyAlertFromServer = ({intervalMs = 5000, enabled = true} = {}) => {
  const { openAlert, closeAlert } = useEmergencyAlertContext()

   /**
   * 현재 화면에 표시 중인 알림 ID
   *
   * - 동일한 알림이 반복적으로 서버에서 내려오는 경우
   *   모달을 다시 띄우지 않기 위해 useRef 사용
   */
  const showingIdRef = useRef(null)

  useEffect(() => {
    if (!enabled) return

    let timer = null
    let cancelled = false;

    /**
     * 서버에서 현재 진행 중인 긴급 알림 조회
     */
    const fetchEmergency = async () => {
      const res = await emergencyApi.fetchActiveEmergency()

      // 언마운트 이후 요청 무시
      if (cancelled) return;

      // 요청 실패 시 무시
      if (!res.ok) return;

      const dto  = res.data;

      /**
       * 진행 중인 알림이 없을 경우
       *
       * - 현재 알림을 강제로 닫지는 않음
       * - 다음 알림을 정상적으로 받을 수 있도록
       *   showingIdRef만 초기화
       */
      if (!dto?.id) {
        showingIdRef.current = null;
        return;
      }

      /**
       * 동일한 알림이면 다시 띄우지 않음
       */
      if (showingIdRef.current === dto.id) return
      showingIdRef.current = dto.id

      /**
       * 긴급 알림 모달 오픈
       *
       * - 서버에서 내려준 mode/level을 그대로 사용
       * - Context를 통해 전역 알림 상태 관리
       */
      openAlert({
        id: dto.id,
        machineNo: dto.machineNumber,
        title: dto.title,
        message: dto.message,
        dangerScore: dto.dangerScore,
        startedAt: dto.startedAt,
        mode: dto.mode ?? "ALERT",  // 서버가 정해준 mode 쓰기
        level: dto.level
      })
    }

    // 최초 1회 즉시 실행
    fetchEmergency()

    // 주기적 polling 시작
    timer = setInterval(fetchEmergency, intervalMs)

    /**
     * cleanup
     * - 컴포넌트 언마운트 시 polling 중단
     * - 비동기 응답 무시 처리
     */
    return () => {
      cancelled = true
      if (timer) clearInterval(timer)
    }
  }, [enabled, intervalMs, openAlert])
}