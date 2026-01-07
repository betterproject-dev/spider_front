import { Route, Routes } from "react-router-dom"
import MonitoringMain from "./features/MonitoringMain/pages/MonitoringMain.jsx";
import Admin from "./features/Admin/pages/Admin"
import ProductChart from "./features/Chart/pages/ProductChart"
import { lazy, Suspense } from "react";
import Loading from "./components/Loading/Loading.jsx";

const DashboardMachine = lazy(() => import("./features/DashboardMachine/pages/DashboardMachine.jsx"))
const SensorDetailPage = lazy(() => import("./features/SensorDetail/pages/SensorDetailPage.jsx"))
const DefectItemPage = lazy(() => import("./features/DefectItem/pages/DefectItemPage.jsx"))


const Routers = ({ realTimeData, scores, lastScore }) => {
  return (
    <Suspense fallback={<Loading message="화면을 준비하고 있습니다..." />}>
      <Routes>
        <Route path="/" element={<Admin/>} />
        <Route path="/monitor" element={<MonitoringMain lastScore={lastScore} />} />
        <Route path="/dashboard/:machineNum" element={<DashboardMachine realTimeData={realTimeData} scores={scores} lastScore={lastScore} />} />
        <Route path="/chart" element={<ProductChart />} />
        <Route path="/machine/:machineNum/sensor/:sensorKey" element={<SensorDetailPage realTimeData={realTimeData} />} />
        <Route path="/machine/:machineNum/items/defect" element={<DefectItemPage />} />
      </Routes>
    </Suspense>
  );
}

export default Routers