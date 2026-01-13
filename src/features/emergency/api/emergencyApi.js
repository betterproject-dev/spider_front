import requestHandler from "../../../utils/requestHandler";

export const emergencyApi = {
  /**
   * 진행 중인 긴급 알림 조회
   * 이제 requestHandler가 Spring의 ApiResponse를 처리하므로 로직이 단순해집니다.
   */
  fetchActiveEmergency: async () => {
    const res = await requestHandler({
      method: "get",
      server: "spring",
      url: "/api/alerts/active/emergency"
    })

    // Spring 백엔드에서 데이터가 없으면 ApiResponse.success(null)을 보낼 것이므로
    // res.ok가 true라면 res.data는 알아서 null 혹은 데이터가 됩니다.
    return res;
  },

  /**
   * 알림 인지(Acknowledge) 처리
   */
  acknowledge: (id) =>
    requestHandler({
      method: "post",
      server: "spring",
      url: `/api/alerts/${id}/ack`
    }),
  
  /**
   * 알림 해결(Resolve) 처리
   */
  resolve: (id, pin) => 
    requestHandler({
      method: "post",
      server: "spring",
      url: `/api/alerts/${id}/resolve`,
      payload: { pin: String(pin)}
    }),

  /**
   * 10분 후 재확인할 때 이벤트 단건 조회
   */
  getOne: (id) => 
    requestHandler({
      method: "get",
      server: "spring",
      url: `/api/alerts/${id}`
    }),
}