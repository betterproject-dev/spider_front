import { useState, useEffect } from "react";
import "../styles/DashboardMachine.css";
import DangerScoreGraph from "../components/DangerScoreGraph.jsx";
import PageHeader from "../../../components/PageHeader/PageHeader";
import MessageSlider from "../../../components/MessageSlider/MessageSlider";
import Camera from "../components/Camera";
import Loading from "../../../components/Loading/Loading";
import CurrentSensors from "../components/CurrentSensors";
import UseNavi from "../../../hooks/UseNavi.jsx";

// 메시지 슬라이더용 데이터 (MonitoringMain에서 복사)
const MESSAGE_ROW_HEIGHT = 35;
const alertMessages = [
  { machine: "4호기", text: "긴급위험 발생." },
  { machine: "4호기", text: "온도 수치가 허용범위를 초과하였습니다." },
  { machine: "4호기", text: "습도 비정상." },
];

const DashboardMachine = ({ realTimeData }) => {
  const { goTo } = UseNavi();

  // 시간 표시
  const [currentTime, setCurrentTime] = useState(new Date());
  // 현재 선택한 기계 번호
  const [selectedMachine, setSelectedMachine] = useState(1);
  // 메시지 슬라이더 (MonitoringMain과 동일)
  const [messageIndex, setMessageIndex] = useState(0);
  const [transitionOn, setTransitionOn] = useState(true);

  // 작동 여부 (임시 : realTimeData에 값이 들어있는지 여부 -> 추후에 소켓 작동 여부로 변경)
  const isWorking = realTimeData.length !== 0;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const formattedDate = `${currentTime.getFullYear()}/${(currentTime.getMonth()+1).toString().padStart(2,'0')}/${currentTime.getDate().toString().padStart(2,'0')}`;
  const time = `${currentTime.getHours().toString().padStart(2,'0')}:${currentTime.getMinutes().toString().padStart(2,'0')}:${currentTime.getSeconds().toString().padStart(2,'0')}`;

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

  return (
    <>
      <div className="wrap">
        {/* 상단 */}
        <div className="dashboard_main">
          <PageHeader
            selectedMachine={selectedMachine}
            onMachineChange={setSelectedMachine}
          />
          <div className="dash-status-row">
            <div className="dash-status-on">
              <p className={isWorking ? 'working_on' : 'working_off'}>작동 {isWorking ? "ON" : "OFF"}</p>
            </div>
            <div className="dash-title">
              <h1>{selectedMachine}호기</h1>
            </div>
            <div className="dash-date">
              <p>{formattedDate} {time}</p>
            </div>
          </div>
        </div>
        <div className="dash-sensor-row">
          {/* (임시) 주석 처리 -> 실시간 데이터가 들어오지 않으면 대시보드 대신 로딩 스페너를 보여주는 코드임. */}
          {/* { realTimeData.length === 0 && (
            <div className="current_sensor_container">
              <Loading message="센서 데이터 수신 대기 중..." />
            </div>
          )} */}
          <CurrentSensors realTimeData={realTimeData} />
        </div>
        <div className="dash-main-row">
          <div className="dash-graph-box">
            <DangerScoreGraph machine_number={selectedMachine} />
          </div>
          <div className="dash-cctv-box" onClick={() => {goTo('/items/defect')}}>
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