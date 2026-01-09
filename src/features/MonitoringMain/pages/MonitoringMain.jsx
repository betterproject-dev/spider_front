import "../styles/MonitoringMain.css";
import { useState, useEffect, useMemo, memo, useCallback } from "react";
import factoryImg from "../../../img/factory_bg.png";
import UseNavi from "../../../hooks/UseNavi";
import MessageSlider from "../../../components/MessageSlider/MessageSlider";
import { io } from "socket.io-client";
import SidebarCalendar from "../components/SidebarCalendar";
import Loading from "../../../components/Loading/Loading";
import DigitalClock from "../components/DigitalClock";

const getStatus = (score) => {
  if (score >= 70) return { label: "위험", class: "danger", type: 2 };
  if (score >= 40) return { label: "주의", class: "warning", type: 2 };
  return { label: "정상", class: "safe", type: 0 };
};

const SOCKET_SERVER_URL = 'ws://localhost:5000'

const MonitoringMain = memo(({ realTimeData, lastScore }) => {
  const { goTo } = UseNavi();
  
  // =====  state  =====
  // WebSocket으로 받아올 온도/습도 상태
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);


  // ===== Memoized Values  =====
  // 현재 상태 출력 (위험점수+누수)
  const currentStatus = useMemo(() => {
    const currentData = realTimeData[realTimeData.length - 1];
    // 누수 발생(0) 시 곧바로 위험 처리
    if (currentData?.leak === 0) return { label: "위험", class: "danger", type: 1 };
    return getStatus(lastScore);
  }, [realTimeData, lastScore]);

  // 알림 메시지
  // 1호기 제외는 더미 데이터
  const alertMessages = useMemo(() => {
    const getMessageText = (type, label) => {
      if (type === 0) return "현재 모든 시스템이 정상 가동 중입니다.";
      if (type === 1) return "누수가 발생했습니다.";
      return `위험점수가 [${label}] 수준에 도달했습니다.`;
    };

    return [
      { machine: "1호기", text: getMessageText(currentStatus.type, currentStatus.label), status: currentStatus.class },
      { machine: "2호기", text: "위험점수가 [주의] 수준에 도달했습니다.", status: "warning" },
      { machine: "3호기", text: "현재 모든 시스템이 정상 가동 중입니다.", status: "safe" },
      { machine: "4호기", text: "누수가 발생했습니다.", status: "danger" },
    ];
  }, [currentStatus]);

  const handleNavigate = useCallback(() => {
    goTo("/dashboard/1")
  }, [goTo])


  // =====  Effects  =====
  // WebSocket 연결 및 데이터 수신
  useEffect(() => {
    // 실제 센서 서버 주소로 변경 필요
    const ws = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    });

    ws.on('sensor_data', (data) => {      
      if (data.temperature !== undefined) setTemperature(data.temperature);
      if (data.humidity !== undefined) setHumidity(data.humidity);
    });

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      ws.disconnect();
    };
  }, []);

  // =====  기타  =====
  // 센서 데이터 또는 위험점수가 들어오지 않는 경우 로딩
  if (!realTimeData || !lastScore) {
    return (
      <>
      <div className="wrap">
        <Loading message="센서 데이터 수신 대기 중..." />
      </div>
      </>
    )
  }

  return (
    <>
      <div className="wrap">
        <div className="monitor_contents">
          <div className="left_container">
            <DigitalClock />
            <div className="sidebar_content_area">
              <SidebarCalendar />
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
            <div className={`machine_1 ${currentStatus.class}`} onClick={handleNavigate}>
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
});

export default MonitoringMain;
