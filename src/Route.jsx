import { Route, Routes } from "react-router-dom"
import MonitoringMain from "./features/MonitoringMain/pages/MonitoringMain.jsx";
import DashboardMachine from "./features/DashboardMachine/pages/DashboardMachine.jsx";
import Admin from "./features/Admin/pages/Admin"
import ProductChart from "./features/Chart/pages/ProductChart"
import MachineDetail from "./features/SensorDetail/pages/MachineDetail";
import Camera from "./features/DashboardMachine/components/Camera.jsx"
import SensorDetailPage from "./features/SensorDetail/pages/SensorDetailPage.jsx";
import DefectItemPage from "./features/DefectItem/pages/DefectItemPage.jsx";


const Routers = ({ realTimeData, scores, lastScore }) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Admin/>} />
        <Route path="/monitor" element={<MonitoringMain lastScore={lastScore} />} />
        <Route path="/dashboard" element={<DashboardMachine realTimeData={realTimeData} scores={scores} lastScore={lastScore} />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/chart" element={<ProductChart />} />
        <Route path="/machineDetail" element={<MachineDetail realTimeData={realTimeData} />} />
        <Route path="/sensor" element={<SensorDetailPage realTimeData={realTimeData} />} />
        <Route path="/sensor/:sensorKey" element={<SensorDetailPage realTimeData={realTimeData} />} />
        <Route path="/items/defect" element={<DefectItemPage />} />
      </Routes>
    </>
  );
}

export default Routers