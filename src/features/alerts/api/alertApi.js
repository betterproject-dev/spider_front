import requestHandler from "../../../utils/requestHandler";


/**
 * 알림(Alert) 관련 API 모듈
 *
 * - Spring 서버와 통신
 * - 알림 조회 / 진행 상태 / 완료 상태 / 알림 종료(확인) 처리 담당
 * - 화면(컴포넌트)에서는 이 객체만 사용하도록 추상화
 */
export const alertApi = {
  /**
   * 전체 알림 조회 (기본 목록)
   *
   * - 진행중 + 완료 알림을 모두 포함
   * - 관리자 대시보드, 알림 이력 화면에서 사용
   *
   * @returns {Promise<ApiResponse>}
   */
  fetchAll: () =>
    requestHandler({
      method: "get",
      url: "/api/alerts",
      server: "spring"
    }),

  /**
   * 진행 중인 알림 조회
   *
   * - 아직 해결되지 않은(active) 알림만 조회
   * - 실시간 모니터링 화면 / 긴급 알림 모달에서 사용
   *
   * @returns {Promise<ApiResponse>}
   */
  fetchActive: () =>
    requestHandler({
      method: "get",
      url: "/api/alerts/active",
      server: "spring"
    }),
  
  /**
   * 완료된 알림 조회
   *
   * - 해결 처리된(resolved) 알림만 조회
   * - 알림 히스토리 / 로그 확인용
   *
   * @returns {Promise<ApiResponse>}
   */
  fetchResolved: () =>
    requestHandler({
      method: "get",
      url: "/api/alerts/resolved",
      server: "spring"
    }),
  
  /**
   * 알림 해결(종료) 처리
   *
   * - 특정 알림 ID를 PIN 인증을 통해 해결 상태로 변경
   * - 관리자 확인 또는 현장 조치 완료 시 호출
   *
   * @param {number | string} id
   *   해결할 알림의 ID
   * @param {number | string} pin
   *   관리자 PIN 번호 (문자열로 변환하여 전송)
   *
   * @returns {Promise<ApiResponse>}
   */
  resolveById: (id, pin) =>
    requestHandler({
      method: "post",
      url: `/api/alerts/${id}/resolve`,
      payload: { pin: String(pin)},
      server: "spring",
    })
  
}