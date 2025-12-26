import { Route, Routes } from "react-router-dom"
import Monitor_main from "./features/Monitoring_main/Monitor_main.jsx";
import Mainpage from "./features/Home/Mainpage.jsx";
import Dashboard_machine1 from "./features/Dashboard_machine1/Dashboard_machine1.jsx";
import Admin from "./features/Admin/pages/Admin"
import Camera from "./features/Camera/pages/Camera"
import MachineDetail from "./features/MachineDetail/pages/MachineDetail"


const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/main" element={<Mainpage />} />
        <Route path="/monitor" element={<Monitor_main />} />
        <Route path="/dashboard_machine1" element={<Dashboard_machine1 />} />
        <Route path="/" element={<Admin/>} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/machineDetail" element={<MachineDetail />} />
      </Routes>
    </>
  );
}

export default Routers