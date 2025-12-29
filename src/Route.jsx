import { Route, Routes } from "react-router-dom"
import MonitoringMain from "./features/MonitoringMain/pages/MonitoringMain.jsx";
import DashboardMachine from "./features/DashboardMachine/pages/DashboardMachine.jsx";
import Admin from "./features/Admin/pages/Admin"
<<<<<<< HEAD
import Camera from "./features/Camera/pages/Camera"
import ProductChart from "./features/Chart/pages/ProductChart"
=======
import Camera from "./features/DashboardMachine/components/Camera.jsx"
import SensorDetailPage from "./features/SensorDetail/pages/SensorDetail.jsx";
import DefectItemPage from "./features/DefectItem/pages/DefectItemPage.jsx";
>>>>>>> 416670ba99d0dd46a6db952742af8653e979763b


const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Admin/>} />
        <Route path="/monitor" element={<MonitoringMain />} />
        <Route path="/dashboard" element={<DashboardMachine />} />
        <Route path="/camera" element={<Camera />} />
<<<<<<< HEAD
        <Route path="/chart" element={<ProductChart />} />
=======
        <Route path="/sensor" element={<SensorDetailPage />} />
        <Route path="/items/defect" element={<DefectItemPage />} />
>>>>>>> 416670ba99d0dd46a6db952742af8653e979763b
      </Routes>
    </>
  );
}

export default Routers