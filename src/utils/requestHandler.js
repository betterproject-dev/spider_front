import { axiosFlask, axiosSpring } from "./axiosFactory"

/**
 * 공통 요청 헬퍼
 * @param {"get"|"post"|"put"|"patch"|"delete"} method
 * @param {string} url
 * @param {object|FormData} [payload]
 * @param {object} [params] - GET 쿼리스트링
 * @param {"flask"|"spring"} [server] - 호출할 백엔드 선택
 * @param {(data:any)=>void} [onSuccess]
 * @param {(msg:string, err:any)=>void} [onError]
 * @param {(v:boolean)=>void} [setLoading]
 * @returns {Promise<{ok:boolean, data?:any, message?:string, status?:number}>}
 */

const requestHandler = async ({
  method = "get",
  url,
  payload,
  params,
  server = "flask",
  onSuccess,
  onError,
  setLoading,
}) => {
  const api = server === "spring" ? axiosSpring : axiosFlask
  const m = (method || "get").toLowerCase();
  
  try {
    setLoading?.(true)

    let res
    if (m === "get") {
      res = await api.get(url, {params:params ?? payload})
    } else if (m === "delete") {
      res = await api.delete(url, {data: payload, params})
    } else {
      // post/put/patch
      res = await api[m](url, payload, params ? {params} : undefined)
    }

    const responseData = res.data; // 서버에서 보낸 객체
    // Spring 서버의 경우 ApiResponse 구조를 따름 { success, data, message }
    if (server === "spring") {
      if (responseData.success) {
        // 성공 시 데이터만 추출해서 전달
        const finalData = responseData.data;
        const message = responseData.message;

        onSuccess?.(finalData)
        return {ok:true, data: finalData, message: message, status:res.status}
      } else {
        // 백엔드에서 success: false로 보낸 경우
        const errorMsg = responseData.message || "오류가 발생했습니다."
        onError?.(errorMsg, responseData)
        return {ok: false, message: errorMsg, status:res.status}
      }
    }

    onSuccess?.(responseData);
    return { ok: true, data: responseData, status: res.status };
  } catch (err) {
    const status = err?.response?.status;
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "요청 처리 중 오류가 발생했습니다.";

    onError?.(msg, err);
    return { ok: false, message: msg, status };
  } finally {
    setLoading?.(false)
  }

}

export default requestHandler