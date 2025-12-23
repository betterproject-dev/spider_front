import axios from "axios";

const createAxios = (baseURL) => axios.create({
  baseURL,
  headers: {"Content-Type": "application/json; charset=utf-8"},
  // 로그인/쿠키 없으면 보통 false 권장
  // 필요해지면 true로 바꾸면 됨
  withCredentials: false
})

export const axiosFlask = createAxios(import.meta.env.VITE_FLASK_API_URL)
export const axiosSpring = createAxios(import.meta.env.VITE_SPRING_API_URL)