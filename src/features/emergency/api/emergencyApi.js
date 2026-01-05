import requestHandler from "../../../utils/requestHandler";

export const emergencyApi = {
  fetchActiveEmergency: async () => {
    const res = await requestHandler({
      method: "get",
      server: "spring",
      url: "/api/alerts/active/emergency"
    })

    // 204면 "정상적으로 없음"이니까 ok:true로 취급하고 data:null로 통일
    if (res.status === 204) return { ok: true, data: null, status: 204 };

    if (!res.ok) return res
    return { ...res, data: res.data ?? null}
  },

  acknowledge: (id) =>
    requestHandler({
      method: "post",
      server: "spring",
      url: `/api/alerts/${id}/ack`
    }),

  resolve: (id) => 
    requestHandler({
      method: "post",
      server: "spring",
      url: `/api/alerts/${id}/resolve`
    }),

  // 10분 후 재확인할 때 이벤트 단건 조회
  getOne: (id) => 
    requestHandler({
      method: "get",
      server: "spring",
      url: `/api/alerts/${id}`
    }),
}