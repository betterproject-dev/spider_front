import Navbar from "../../../components/Navbar/Navbar";
import MachineDetail from "../../MachineDetail/pages/MachineDetail";

const SensorDetailPage = () => {
  return (
    <>
      {/* 아래 스타일 임시용 = 나중에 제거 */}
      <div className="wrap" style={{display:'flex', flexDirection:'column'}}>
        <Navbar detail={true} sort="센서 상세" />
        <h1>센서 페이지</h1>
        <MachineDetail/>
      </div>
    </>
  )
};

export default SensorDetailPage;