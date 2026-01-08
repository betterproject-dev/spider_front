import { Route, Routes,Navigate } from "react-router-dom"
import MonitoringMain from "./features/MonitoringMain/pages/MonitoringMain.jsx";
import Admin from "./features/Admin/pages/Admin"
import { lazy, Suspense } from "react";
import Loading from "./components/Loading/Loading.jsx";
import PrivateRoute from "./components/Auth/PrivateRoute.js";

const DashboardMachine = lazy(() => import("./features/DashboardMachine/pages/DashboardMachine.jsx"))
const SensorDetailPage = lazy(() => import("./features/SensorDetail/pages/SensorDetailPage.jsx"))
const DefectItemPage = lazy(() => import("./features/DefectItem/pages/DefectItemPage.jsx"))


const Routers = ({ realTimeData, scores, lastScore }) => {
  return (
    <Suspense fallback={<Loading message="화면을 준비하고 있습니다..." />}>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} /> {/* / → /admin 리다이렉트 */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/monitor" element={<PrivateRoute><MonitoringMain realTimeData={realTimeData} lastScore={lastScore} /></PrivateRoute>} />
        <Route path="/dashboard/:machineNum" element={<PrivateRoute><DashboardMachine realTimeData={realTimeData} scores={scores} lastScore={lastScore} /></PrivateRoute>} />
        <Route path="/machine/:machineNum/sensor/:sensorKey" element={<PrivateRoute><SensorDetailPage realTimeData={realTimeData} /></PrivateRoute>} />
        <Route path="/machine/:machineNum/items/defect" element={<PrivateRoute><DefectItemPage /></PrivateRoute>} />
      </Routes>
    </Suspense>
  );
}

export default Routers