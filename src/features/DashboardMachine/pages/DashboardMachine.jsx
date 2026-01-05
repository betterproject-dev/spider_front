import { useState, useEffect } from "react";
import "../styles/DashboardMachine.css";
import MessageSlider from "../../../components/MessageSlider/MessageSlider";
import Camera from "../components/Camera";

// 메시지 슬라이더용 데이터 (MonitoringMain에서 복사)
const MESSAGE_ROW_HEIGHT = 35;
const alertMessages = [
  { machine: "4호기", text: "긴급위험 발생." },
  { machine: "4호기", text: "온도 수치가 허용범위를 초과하였습니다." },
  { machine: "4호기", text: "습도 비정상." },
];

const DashboardMachine = () => {
  // 시간 표시
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const formattedDate = `${currentTime.getFullYear()}/${(currentTime.getMonth()+1).toString().padStart(2,'0')}/${currentTime.getDate().toString().padStart(2,'0')}`;
  const time = `${currentTime.getHours().toString().padStart(2,'0')}:${currentTime.getMinutes().toString().padStart(2,'0')}:${currentTime.getSeconds().toString().padStart(2,'0')}`;

  // 메시지 슬라이더 (MonitoringMain과 동일)
  const [messageIndex, setMessageIndex] = useState(0);
  const [transitionOn, setTransitionOn] = useState(true);
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

  // 센서 상태 예시 데이터
  const sensors = [
    { label: "온도", value: "35℃", status: "정상" },
    { label: "습도", value: "35℃", status: "비정상" },
    { label: "소음", value: "35℃", status: "비정상" },
    { label: "누수", value: "정상", status: "정상" },
  ];

  return (
    <>
      <div className="dashboard-layout">
        {/* 상단 */}
        <div className="dash-status-row">
          <div className="dash-status-on">정상작동중 ON</div>
          <div className="dash-title">1호기</div>
          <div className="dash-date">{formattedDate} {time}</div>
        </div>
        <div className="dash-sensor-row">
          {sensors.map((s, idx) => (
            <div key={idx} className={`dash-sensor-box ${s.status === '정상' ? 'normal' : 'abnormal'}`}>
              <div className="dash-sensor-label">{s.label}</div>
              <div className="dash-sensor-value">
                <span className={s.status === '정상' ? 'text-green' : 'text-red'}>{s.status}</span> {s.value}
              </div>
            </div>
          ))}
        </div>
        <div className="dash-main-row">
          <div className="dash-graph-box">
            <div className="dash-graph-title">위험 점수 그래프<br/>(선 그래프)</div>
          </div>
          <div className="dash-warning-box">
            <div className="dash-warning-icon" />
            <div className="dash-warning-text">주의</div>
          </div>
          <div className="dash-cctv-box">
            <Camera />
          </div>
        </div>
        {/* Message 영역 - MessageSlider 컴포넌트로 분리 */}
        <div className="message-area">
          <MessageSlider messages={alertMessages} rowHeight={35} interval={3500} />
        </div>
      </div>
    </>
  );
}

export default DashboardMachine;