import "../styles/MonitoringMain.css";
import { useState, useEffect } from "react";
import factoryImg from "../../../img/factory_bg.png";
import UseNavi from "../../../hooks/UseNavi";
import MessageSlider from "../../../components/MessageSlider/MessageSlider";
import { io } from "socket.io-client";
import Loading from "../../../components/Loading/Loading";

const MESSAGE_ROW_HEIGHT = 35;
const alertMessages = [
  { machine: "1호기", text: "온도 수치가 허용범위를 초과하였습니다." },
  { machine: "2호기", text: "전압 변동이 감지되었습니다." },
  { machine: "3호기", text: "누수가 발생했습니다." },
  { machine: "4호기", text: "진동 수치가 기준을 초과했습니다." },
];

const MonitoringMain = ({ realTimeData, lastScore }) => {
  const { goTo } = UseNavi();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [messageIndex, setMessageIndex] = useState(0);
  const [transitionOn, setTransitionOn] = useState(true);
  // WebSocket으로 받아올 온도/습도 상태
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);

  const getStatus = (score) => {
    if (score >= 70) return "danger";
    if (score >= 40) return "warning";
    return "safe";
  };

  const currentData = realTimeData[realTimeData.length - 1];
  const currentLeak = currentData && currentData.leak; // 누수 최신 데이터 (1개)

  // 현재 기계 1호기 위험도 상태
  // 위험점수 + 누수 여부(누수 발생 시 곧바로 위험)
  const currentStatus = currentLeak === 0 ? "danger" : getStatus(lastScore);

  // 센서 데이터 또는 위험점수가 들어오지 않는 경우 로딩
  if (!realTimeData || !lastScore) {
    return (
      <>
      <div className="wrap">
        <Loading />
      </div>
      </>
    )
  }

  // WebSocket 연결 및 데이터 수신
  useEffect(() => {
    // 실제 센서 서버 주소로 변경 필요
    const ws = io('ws://localhost:5000', {
      transports: ['websocket'],
    });

    ws.on('sensor_data', (data) => {      
      if (data.temperature !== undefined) setTemperature(data.temperature);
      if (typeof data.humidity !== undefined) setHumidity(data.humidity);
    });

    // 연결 성공 확인
    ws.on('connect', () => {
      console.log("서버와 연결되었습니다 ID:", ws.id);
    })
    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      ws.disconnect();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ticker = setInterval(() => {
      setMessageIndex((prev) => prev + 1);
    }, 3500);

    return () => clearInterval(ticker);
  }, []);

  const handleMessageTransitionEnd = () => {
    if (messageIndex === alertMessages.length) {
      setTransitionOn(false);
      setMessageIndex(0);
      setTimeout(() => setTransitionOn(true), 50);
    }
  };

  const todayweek = currentTime.getDay();
  const formattedDate = `${currentTime.getFullYear()}.${(currentTime.getMonth()+1)}.${currentTime.getDate()}`;
  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const seconds = String(currentTime.getSeconds()).padStart(2, '0');
  const time = `${hours}:${minutes}:${seconds}`;
  const sec = `${seconds}`;

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[todayweek];


  return (
    <>
      <div className="wrap">
        <div className="monitor_contents">
          <div className="left_container">
            <div className="clock">
              <p className="date">{formattedDate}</p>
              <p className="todayweek">{dayName}</p>
              <p className="time">{time}</p>
            </div>
            <div className="main_button_list">
              <div className="main_btn" onClick={() => goTo('/machine/1/items/defect')}>
                제품 불량 통계
              </div>
              <div className="main_btn">생산현황</div>
              <div className="main_btn">생산현황</div>
            </div>
          </div>
          <div className="right_container">
            <div className="factory_image">
              <img src={factoryImg} alt="factory" className="factory_img" />
            </div>
            <div className="machine_status">
              <div className="status_green">정상</div>
              <div className="status_yellow">주의</div>
              <div className="status_red">위험</div>
            </div>
            <div className="factory_TH">
              <div className="TH_text">공장 내부 온도 | 습도</div>
              <div className="temp">온도 : {temperature !== null ? `${temperature}℃` : "--"}</div>
              <div className="hum">습도 : {humidity !== null ? `${humidity}%` : "--"}</div>
            </div>
            <div className={`machine_1 ${currentStatus}`} onClick={() => goTo("/dashboard/1")}>
              1호기
            </div>
            <div className="machine_2">2호기</div>
            <div className="machine_3">3호기</div>
            <div className="machine_4">4호기</div>
            <div className="message-area">
              <MessageSlider messages={alertMessages} rowHeight={35} interval={3500} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MonitoringMain;
