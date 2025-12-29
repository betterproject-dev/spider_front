import Loading from "../../../components/Loading/Loading";
import Navbar from "../../../components/Navbar/Navbar";
import CurrentSensors from "../components/CurrentSensors";
import "../styles/DashboardMachine.css";

const DashboardMachine = ({ realTimeData }) => {

  return (
    <>
      <div className="wrap">
        <div className="dashboard_main">
          <Navbar />
          <div className="machine_title_area">
            <h1>1호기</h1>
          </div>
          { realTimeData.length === 0 && (
            <div className="current_sensor_container">
              <Loading message="센서 데이터 수신 대기 중..." />
            </div>
          )}
          <CurrentSensors realTimeData={realTimeData} />
        </div>
      </div>
    </>
  );
}

export default DashboardMachine;