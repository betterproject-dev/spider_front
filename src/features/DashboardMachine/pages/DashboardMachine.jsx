import { useState, useEffect } from "react";
import "../styles/DashboardMachine.css";
import DangerScoreGraph from "../components/DangerScoreGraph.jsx";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Camera from "../components/Camera";
import Loading from "../../../components/Loading/Loading";
import CurrentSensors from "../components/CurrentSensors";
import requestHandler from "../../../utils/requestHandler.js";
import { useParams } from "react-router-dom";

const DashboardMachine = ({ realTimeData, scores, lastScore }) => {
  const { machineNum } = useParams();

  // 시간 표시
  const [currentTime, setCurrentTime] = useState(new Date());
  // 현재 선택한 기계 번호
  const [selectedMachine, setSelectedMachine] = useState(Number(machineNum) || 1);

  // spring에서 센서의 작동 여부를 가져옴
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const formattedDate = `${currentTime.getFullYear()}/${(currentTime.getMonth()+1).toString().padStart(2,'0')}/${currentTime.getDate().toString().padStart(2,'0')}`;
  const time = `${currentTime.getHours().toString().padStart(2,'0')}:${currentTime.getMinutes().toString().padStart(2,'0')}:${currentTime.getSeconds().toString().padStart(2,'0')}`;

  useEffect(() => {
    const fetchHeartbeatStatus = async () => {
      const { ok, data } = await requestHandler({
        method: "get",
        url: `/api/heartbeat/status/${selectedMachine}`,
        server: "spring",
        onError: (msg) => console.error(msg)
      });

      if (ok) setIsWorking(data.status === "ONLINE");
      else setIsWorking(false);
    };

    fetchHeartbeatStatus();
    const interval = setInterval(fetchHeartbeatStatus, 5000);
    return () => clearInterval(interval);
  }, [selectedMachine]);

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

export default DashboardMachine;