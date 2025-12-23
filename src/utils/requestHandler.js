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

    onSuccess?.(res.data);
    return { ok: true, data: res.data, status: res.status };
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