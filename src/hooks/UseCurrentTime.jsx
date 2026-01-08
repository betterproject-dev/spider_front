import { useState, useEffect } from 'react';

const CLOCK_UPDATE_INTERVAL = 1000; // 1초

/**
 * 실시간 현재 시간을 관리하고 다양한 포맷으로 제공하는 커스텀 훅
 * @returns {Object} 현재 시간 객체 및 포맷팅된 문자열들
 */
export const UseCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // CLOCK_UPDATE_INTERVAL마다 새로운 Date 객체를 생성하여 상태 업데이트
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), CLOCK_UPDATE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return {
    // 원본 Date 객체
    date: currentTime,

    // YYYY.MM.DD 형식 (예: 2024.5.20)
    formattedDate: `${currentTime.getFullYear()}.${currentTime.getMonth() + 1}.${currentTime.getDate()}`,

    // 영문 요일 이름 (예: Monday)
    dayName: dayNames[currentTime.getDay()],

    // 24시간제 시분초 문자열 (예: 14:30:05)
    time: currentTime.toLocaleTimeString('en-GB', { hour12: false }),

    // 두 자릿수로 맞춘 시/분/초 각각의 값
    hours: String(currentTime.getHours()).padStart(2, '0'),
    minutes: String(currentTime.getMinutes()).padStart(2, '0'),
    seconds: String(currentTime.getSeconds()).padStart(2, '0'),
  };
};

export default UseCurrentTime;