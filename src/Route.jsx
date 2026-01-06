import { Route, Routes } from "react-router-dom"
import MonitoringMain from "./features/MonitoringMain/pages/MonitoringMain.jsx";
import DashboardMachine from "./features/DashboardMachine/pages/DashboardMachine.jsx";
import Admin from "./features/Admin/pages/Admin"
import ProductChart from "./features/Chart/pages/ProductChart"
import SensorDetailPage from "./features/SensorDetail/pages/SensorDetailPage.jsx";
import DefectItemPage from "./features/DefectItem/pages/DefectItemPage.jsx";


const Routers = ({ realTimeData }) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Admin/>} />
        <Route path="/monitor" element={<MonitoringMain />} />
        <Route path="/dashboard/:machineNum" element={<DashboardMachine realTimeData={realTimeData} />} />
        <Route path="/chart" element={<ProductChart />} />
        <Route path="/machine/:machineNum/sensor/:sensorKey" element={<SensorDetailPage realTimeData={realTimeData} />} />
        <Route path="/machine/:machineNum/items/defect" element={<DefectItemPage />} />
      </Routes>
    </>
  );
}

export default Routers