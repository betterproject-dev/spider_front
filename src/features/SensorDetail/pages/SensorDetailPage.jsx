import MachineDetail from "../../MachineDetail/pages/MachineDetail";

const SensorDetailPage = ({ realTimeData }) => {
  return (
    <>
      <div className="wrap">
        <MachineDetail realTimeData={realTimeData} />
      </div>
    </>
  )
};

export default SensorDetailPage;