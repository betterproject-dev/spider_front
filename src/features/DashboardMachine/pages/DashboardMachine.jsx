import Loading from "../../../components/Loading/Loading";
import Navbar from "../../../components/Navbar/Navbar";
import CurrentSensors from "../components/CurrentSensors";
import "../styles/DashboardMachine.css";
import DangerScoreGraph from "../components/DangerScoreGraph.jsx";

const DashboardMachine = ({ realTimeData }) => {

  return (
    <>
      <div className="wrap">
        <div className="dashboard_main">
          <Navbar />
          <div className="machine_title_area">
            <h1>1호기</h1>
          </div>
          {/* (임시) 주석 처리 -> 실시간 데이터가 들어오지 않으면 대시보드 대신 로딩 스페너를 보여주는 코드임. */}
          {/* { realTimeData.length === 0 && (
            <div className="current_sensor_container">
              <Loading message="센서 데이터 수신 대기 중..." />
            </div>
          )} */}
          <CurrentSensors realTimeData={realTimeData} />
          <DangerScoreGraph machine_number={1} />
        </div>
      </div>
    </>
  );
}

export default DashboardMachine;