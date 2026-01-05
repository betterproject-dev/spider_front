import { useCallback, useState } from 'react';
import './App.css'
import EmergencyAlertModal from './features/emergency/components/EmergencyAlertModal'
import Routers from './Route'
import Header from "./components/Header/Header.jsx";
import UseSocket from './hooks/UseSocket.jsx';

function App() {
  const [realTimeData, setRealTimeData] = useState([]);

  // handleSensorData : 웹소켓으로 센서값을 받아서 realTimeData에 넣음
  // 가장 최신 데이터가 realTimeData 배열 마지막 방에 있음 (최대 20개까지 저장)
  const handleSensorData = useCallback((newData) => {
    // console.log("실시간 들어오는 데이터 : ", newData)  // 개발 끝나면 삭제
    setRealTimeData(prev => {
      const newItem = {
        timestamp : newData.timestamp,
        temperature_factory : newData.temperature,  // 공장 내부 온도 (온습도 센서)
        temperature : newData.temperature_DS18B20,  // 기계 온도 (부착형 온도 센서)
        humidity : newData.humidity,
        noise : newData.noise,
        leak : newData.leak ? 1 : 0,  // 1(정상) or 0(누수)
      }

      return [...prev, newItem].slice(-20);
    });
  }, []);

  UseSocket("sensor_data", handleSensorData);

  return (
    
    <div className="app-layout">
      <Header  />
      <main className="app-main">
        <Routers realTimeData={realTimeData} />
      </main>
        
      <EmergencyAlertModal />
    </div>
    
  )
}

export default App
