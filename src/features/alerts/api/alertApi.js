import requestHandler from "../../../utils/requestHandler";

export const alertApi = {
  // 전체 알림 ( 기본 )
  fetchAll: () =>
    requestHandler({
      method: "get",
      url: "/api/alerts",
      server: "spring"
    }),

  // 진행중
  fetchActive: () =>
    requestHandler({
      method: "get",
      url: "/api/alerts/active",
      server: "spring"
    }),
  
  // 완료
  fetchResolved: () =>
    requestHandler({
      method: "get",
      url: "/api/alerts/resolved",
      server: "spring"
    }),

  resolveById: (id) =>
    requestHandler({
      method: "post",
      url: `/api/alerts/${id}/resolve`,
      server: "spring",
    })
  
}