import MachineDetail from "./MachineDetail";

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