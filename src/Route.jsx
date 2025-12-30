import { Route, Routes } from "react-router-dom"
import MonitoringMain from "./features/MonitoringMain/pages/MonitoringMain.jsx";
import DashboardMachine from "./features/DashboardMachine/pages/DashboardMachine.jsx";
import Admin from "./features/Admin/pages/Admin"
import MachineDetail from "./features/MachineDetail/pages/MachineDetail"
import Camera from "./features/DashboardMachine/components/Camera.jsx"
import SensorDetailPage from "./features/SensorDetail/pages/SensorDetail.jsx";
import DefectItemPage from "./features/DefectItem/pages/DefectItemPage.jsx";


const Routers = ({ realTimeData }) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Admin/>} />
        <Route path="/monitor" element={<MonitoringMain />} />
        <Route path="/dashboard" element={<DashboardMachine realTimeData={realTimeData} />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/machineDetail" element={<MachineDetail />} />
        <Route path="/sensor/:sensorKey" element={<SensorDetailPage realTimeData={realTimeData} />} />
        <Route path="/items/defect" element={<DefectItemPage />} />
      </Routes>
    </>
  );
}

export default Routers