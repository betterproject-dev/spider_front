import { useEffect, useState } from "react";
import Loading from "../../../components/Loading/Loading";
import CurrentSensors from "../components/CurrentSensors";
import "../styles/DashboardMachine.css";
import DangerScoreGraph from "../components/DangerScoreGraph.jsx";
import PageHeader from "../../../components/PageHeader/PageHeader";

const DashboardMachine = ({ realTimeData }) => {
  const [selectedMachine, setSelectedMachine] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 작동 여부 (임시 : realTimeData에 값이 들어있는지 여부 -> 추후에 소켓 작동 여부로 변경)
  const isWorking = realTimeData.length !== 0;

  // 현재 시간 보여주는 거 추후에 커스텀 훅으로 수정
  const formattedDate = `${currentTime.getFullYear()}/${(currentTime.getMonth()+1)}/${currentTime.getDate()}`;
  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const seconds = String(currentTime.getSeconds()).padStart(2, '0');
  const time = `${hours}:${minutes}:${seconds}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="wrap">
        <div className="dashboard_main">
          <PageHeader
            selectedMachine={selectedMachine}
            onMachineChange={setSelectedMachine}
          />
          <div className="dashboard_title_area">
            <div className="dashboard_isWorking">
              <p className={isWorking ? 'working_on' : 'working_off'}>작동 {isWorking ? "ON" : "OFF"}</p>
            </div>
            <div className="dashboard_title">
              <h1>{selectedMachine}호기</h1>
            </div>
            <div className="dashboard_nowTime">
              <p>{formattedDate} {time}</p>
            </div>
          </div>
          {/* (임시) 주석 처리 -> 실시간 데이터가 들어오지 않으면 대시보드 대신 로딩 스페너를 보여주는 코드임. */}
          {/* { realTimeData.length === 0 && (
            <div className="current_sensor_container">
              <Loading message="센서 데이터 수신 대기 중..." />
            </div>
          )} */}
          <CurrentSensors realTimeData={realTimeData} />
          <DangerScoreGraph machine_number={selectedMachine} />
        </div>
      </div>
    </>
  );
}

export default DashboardMachine;