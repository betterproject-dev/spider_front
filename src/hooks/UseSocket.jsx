import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_FLASK_API_URL, {
  reconnectionAttempts: 3,  // 재연결 시도 3회
  timeout: 5000
});

/**
 * 특정 웹소켓 이벤트를 구독하고 해제하는 커스텀 훅
 * @param {string} eventName - 서버에서 보낸 이벤트 이름 (예: 'sensor_data')
 * @param {function} callback - 데이터를 받았을 때 실행할 함수
 */

const UseSocket = (eventName, callback) => {
  useEffect(() => {
    // 이벤트 이름이나 콜백이 없으면 실행하지 않음
    if (!eventName || !callback) return;

    socket.on(eventName, callback);

    // 공통 연결 에러 처리
    const handleConnectError = (err) => {
      console.warn(`[Socket] '${eventName}' 연결 시도 중 에러 발생 (서버 확인 필요)`);
    };
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off(eventName, callback);
      socket.off("connect_error", handleConnectError);
    }
  }, [eventName, callback]);
};

export default UseSocket;