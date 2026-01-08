import { useCallback, useEffect, useState } from 'react';
import './App.css'
import EmergencyAlertModal from './features/emergency/components/EmergencyAlertModal'
import Routers from './Route'
import Header from "./components/Header/Header.jsx";
import UseSocket from './hooks/UseSocket.jsx';
import requestHandler from './utils/requestHandler.js';

function App() {
  const [realTimeData, setRealTimeData] = useState([]);
  const [scores, setScores] = useState([]);

  // === 실시간 센서값 불러오기 ===
  // 가장 최신 데이터가 realTimeData 배열 마지막 방에 있음 (최대 20개까지 저장)
  const handleSensorData = useCallback((newData) => {
    setRealTimeData(prev => {
      const newItem = {
        timestamp : newData.timestamp,
        temperature : newData.temperature,  // 공장 내부 온도 (온습도 센서)
        temperature_DS18B20 : newData.temperature_DS18B20,  // 기계 온도 (부착형 온도 센서)
        humidity : newData.humidity,
        noise : newData.noise,
        leak : newData.leak ? 1 : 0,  // 1(정상) or 0(누수)
      }

      return [...prev, newItem].slice(-20);
    });
  }, []);

  UseSocket("sensor_data", handleSensorData);

  // === 위험점수 불러오기 ===
  const getScore = async () => {
    const res = await requestHandler({
      method: "get",
      url: '/sensormodel/load_score/1'
    })
    const { data, message, ok } = res.data
    return data
  }

  const lastData = scores && scores.length > 0 ? scores[scores.length - 1] : null;
  // 점수가 존재하면 소수점 1자리까지, 없으면 0.0으로 표시
  const lastScore = lastData ? parseFloat(lastData.dangerScore).toFixed(2) : "0.0";


  useEffect(() => {
    const load = async () => {
      const result = await getScore();
      setScores(result);
    };

    // 1. 컴포넌트가 처음 나타날 때 한 번 실행
    load();

    // 2. 1분(60,000ms)마다 load 함수를 실행하는 타이머 설정
    const timerId = setInterval(() => {
      load();
    }, 60000);

    // 3. Cleanup 함수: 컴포넌트가 사라질 때 타이머를 제거하여 메모리 누수 방지
    return () => {
      clearInterval(timerId);
    };
  }, []); // 빈 배열이므로 마운트 시에만 타이머 생성

  return (
    
    <div className="app-layout">
      <Header  />
      <main className="app-main">
        <Routers realTimeData={realTimeData} scores={scores} lastScore={lastScore} />
      </main>
        
      <EmergencyAlertModal />
    </div>
    
  )
}

export default App
