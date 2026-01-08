import { memo } from "react";
import MachineDetail from "./MachineDetail";

const SensorDetailPage = memo(({ realTimeData }) => {
  return (
    <>
      <div className="wrap">
        <MachineDetail realTimeData={realTimeData} />
      </div>
    </>
  )
});

export default SensorDetailPage;