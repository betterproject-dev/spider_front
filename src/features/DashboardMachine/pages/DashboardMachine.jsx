import Navbar from "../../../components/Navbar/Navbar";
import UseNavi from "../../../hooks/UseNavi";
import "../styles/DashboardMachine.css";

const DashboardMachine = () => {
  const { goTo } = UseNavi();

  return (
    <>
      <div className="wrap">
        <div className="dashboard_main">
          <Navbar />
          <div className="machine_title_area">
            <h1>1호기</h1>
          </div>
            {/* 임시 버튼 */}
            <button onClick={() => goTo('/camera')}>카메라</button>
            <button onClick={() => goTo('/sensor')}>센서 페이지</button>
            <button onClick={() => goTo('/items/defect')}>제품 불량 페이지</button>
        </div>
      </div>
    </>
  );
}

export default DashboardMachine;