import { Route, Routes } from "react-router-dom"
import Admin from "./features/Admin/pages/Admin"
import Camera from "./features/Camera/pages/Camera"


const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Admin/>} />
        <Route path="/camera" element={<Camera />} />
      </Routes>
    </>
  )
}

export default Routers