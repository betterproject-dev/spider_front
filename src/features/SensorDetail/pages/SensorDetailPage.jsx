import Navbar from "../../../components/Navbar/Navbar";
import MachineDetail from "./MachineDetail";

const SensorDetailPage = ({ realTimeData }) => {
  return (
    <>
      <div className="wrap">
        <Navbar detail={true} sort="센서 상세" />
        <h1>센서 페이지</h1>
        <MachineDetail realTimeData={realTimeData} />
      </div>
    </>
  )
};

export default SensorDetailPage;