import { Route, Routes } from "react-router-dom"
import Admin from "./features/Admin/pages/Admin"
import Camera from "./features/Camera/pages/Camera"
import ProductChart from "./features/Chart/pages/ProductChart"


const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Admin/>} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/chart" element={<ProductChart />} />
      </Routes>
    </>
  )
}

export default Routers