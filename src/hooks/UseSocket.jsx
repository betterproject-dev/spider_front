import {useEffect} from "react";
import {io} from "socket.io-client";
import { axiosFlask } from "../utils/axiosFactory";

// 주소를 명시적으로 확인하기 위해 로그 추가 (디버깅용)
const SOCKET_URL = axiosFlask.defaults.baseURL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // 400 에러를 유발하는 polling을 건너뜁니다.
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  forceNew: false,
});

const UseSocket = (eventName, callback) => {
  useEffect(() => {
    if (!eventName || !callback) return;

    // 2. 데이터 수신 핸들러
    const onMessage = (data) => {
      callback(data);
    };

    // 3. 연결 에러 핸들러 (상세 이유 출력)
    const onConnectError = (err) => {
      // 서버에서 거절한 구체적인 이유를 확인하기 위함
      console.error(`❌ [Socket] '${eventName}' 연결 실패:`, err.message);
    };

    socket.on(eventName, onMessage);
    socket.on("connect_error", onConnectError);

    // 컴포넌트 언마운트 시 정리
    return () => {
      socket.off(eventName, onMessage);
      socket.off("connect_error", onConnectError);
    };
  }, [eventName, callback]);

  return socket;
};

export default UseSocket;
