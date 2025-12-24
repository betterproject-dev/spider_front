import { Route, Routes } from "react-router-dom"
import Monitor_main from "./features/Monitoring_main/Monitor_main.jsx";
import Mainpage from "./features/Home/Mainpage.jsx";
import Dashboard_machine1 from "./features/Dashboard_machine1/Dashboard_machine1.jsx";

const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/monitor" element={<Monitor_main />} />
        <Route path="/dashboard_machine1" element={<Dashboard_machine1 />} />
      </Routes>
    </>
  );
}

export default Routers