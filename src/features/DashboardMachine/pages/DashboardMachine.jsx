import { useState, useEffect, memo, useCallback } from "react";
import "../styles/DashboardMachine.css";
import DangerScoreGraph from "../components/DangerScoreGraph.jsx";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Camera from "../components/Camera";
import Loading from "../../../components/Loading/Loading";
import CurrentSensors from "../components/CurrentSensors";
import requestHandler from "../../../utils/requestHandler.js";
import { useParams } from "react-router-dom";

/** [상수 분리] */
const HEARTBEAT_INTERVAL = 5000;
const CLOCK_UPDATE_INTERVAL = 1000; // 1초
const WORKING_STATUS = {
  ONLINE: { class: 'working_on', label: '작동 ON' },
  OFFLINE: { class: 'working_off', label: '작동 OFF' }
};

// 시계만 담당하는 컴포넌트를 분리하여 부모의 리렌더링 전파를 막음
const DigitalClock = memo(() => {
  // 시간 표시
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), CLOCK_UPDATE_INTERVAL);
    return () => clearInterval(timer);
  }, []);
  const formattedDate = `${currentTime.getFullYear()}/${(currentTime.getMonth()+1).toString().padStart(2,'0')}/${currentTime.getDate().toString().padStart(2,'0')}`;
  const time = `${currentTime.getHours().toString().padStart(2,'0')}:${currentTime.getMinutes().toString().padStart(2,'0')}:${currentTime.getSeconds().toString().padStart(2,'0')}`;

  return <p>{formattedDate} {time}</p>
})

const DashboardMachine = ({ realTimeData, scores, lastScore }) => {
  const { machineNum } = useParams();

  // 현재 선택한 기계 번호
  const [selectedMachine, setSelectedMachine] = useState(Number(machineNum) || 1);

  // spring에서 센서의 작동 여부를 가져옴
  const [isWorking, setIsWorking] = useState(false);

  // API 호출 함수를 useCallback으로 감싸 효율화
  const fetchHeartbeatStatus = useCallback(async (machineId) => {
    const { ok, data } = await requestHandler({
      method: "get",
      url: `/api/heartbeat/status/${machineId}`,
      server: "spring"
    });

    if (ok) setIsWorking(data.status === "ONLINE");
    else setIsWorking(false);
  }, []);

  useEffect(() => {
    // 기계 변경 시 즉시 실행
    fetchHeartbeatStatus(selectedMachine);

    const interval = setInterval(() => {
      fetchHeartbeatStatus(selectedMachine);
    }, HEARTBEAT_INTERVAL);

    return () => clearInterval(interval);
  }, [selectedMachine, fetchHeartbeatStatus]);

  // 기계 변경 핸들러 최적화
  const handleMachineChange = useCallback((num) => {
    setSelectedMachine(num);
  }, []);

  const status = isWorking ? WORKING_STATUS.ONLINE : WORKING_STATUS.OFFLINE;
  return (
    <>
      <div className="wrap">
        {/* 상단 */}
        <div className="dashboard_main">
          <PageHeader
            selectedMachine={selectedMachine}
            onMachineChange={handleMachineChange}
          />
          <div className="dash-status-row">
            <div className="dash-status-on">
              {/* isWorking 여부에 따라 상수의 값을 가져옴 */}
              <p className={status.class}>{status.label}</p>
            </div>
            <div className="dash-title">
              <h1>{selectedMachine}호기</h1>
            </div>
            <div className="dash-date">
              <DigitalClock />
            </div>
          </div>
        </div>
        <div className="dash-sensor-row">
          { realTimeData.length === 0 && (
            <div className="current_sensor_container">
              <Loading message="센서 데이터 수신 대기 중..." />
            </div>
          )}
          <CurrentSensors realTimeData={realTimeData} selectedMachine={selectedMachine} />
        </div>
        <div className="dash-main-row">
          <div className="dash-graph-box">
            <DangerScoreGraph machine_number={selectedMachine} scores={scores} lastScore={lastScore} />
          </div>
          <div className="dash-cctv-box">
            <Camera selectedMachine={selectedMachine} />
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(DashboardMachine);