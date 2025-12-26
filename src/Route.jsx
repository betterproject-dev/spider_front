import { Route, Routes } from "react-router-dom"
import Admin from "./features/Admin/pages/Admin"
import Camera from "./features/Camera/pages/Camera"
import MachinePage from "./features/Machines/pages/MachinePage"


const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Admin/>} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/machine" element={<MachinePage />} />
      </Routes>
    </>
  )
}

export default Routers