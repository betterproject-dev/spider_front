import { useEffect, useState } from 'react';
import './App.css'
import Routers from './Route'
import Header from "./components/Header/Header.jsx";
import { io } from 'socket.io-client';

const socket = io("http://localhost:5000", {
  reconnectionAttempts: 3,  // 재연결 시도 3회
  timeout: 5000
});

function App() {
  const [realTimeData, setRealTimeData] = useState([]);

  // 웹소켓으로 온도, 습도, 소음, 누수 센서값을 받아서 realTimeData에 넣음
  // 가장 최신 데이터가 realTimeData 배열 마지막 방에 있음 (최대 20개까지 저장)
  useEffect(() => {
    const handleData = (newData) => {
      // console.log("실시간 들어오는 데이터 : ", newData)  // 개발 끝나면 삭제
      setRealTimeData(prev => {
        const newItem = {
          // timestamp : newData.timestamp,
          temperature_factory : newData.temperature,
          temperature : newData.temperature_DS18B20,
          humidity : newData.humidity,
          noise : newData.noise,
          leak : newData.leak ? 1 : 0,
        }
  
        return [...prev, newItem].slice(-20); // 최근 20개까지 저장
      });
    }

    const handleConnectError = (err) => {
      console.warn("현재 서버에 연결할 수 없습니다.");
    };

    socket.on("sensor_data", handleData);
    socket.on("connect_error", handleConnectError);

    // 컴포넌트가 사라질 때 리스너 해제
    return () => {
      socket.off("sensor_data", handleData);
      socket.off("connect_error", handleConnectError);
    }
  }, []);

  return (
    <div className="app-layout">
      <Header  />
      <main className="app-main">
        <Routers realTimeData={realTimeData} />
      </main>
    </div>
  );
}

export default App
