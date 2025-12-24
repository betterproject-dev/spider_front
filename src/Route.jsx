import { Route, Routes } from "react-router-dom"
import Admin from "./features/Admin/pages/Admin"
import Camera from "./features/Camera/pages/Camera"
import MachineDetail from "./features/MachineDetail/pages/MachineDetail"


const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Admin/>} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/machineDetail" element={<MachineDetail />} />
      </Routes>
    </>
  )
}

export default Routers