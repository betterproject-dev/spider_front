import Navbar from "../../../components/Navbar/Navbar";

const SensorDetailPage = () => {
  return (
    <>
      {/* 아래 스타일 임시용 = 나중에 제거 */}
      <div className="wrap" style={{display:'flex', flexDirection:'column'}}>
        <Navbar detail={true} sort="센서 상세" />
        <h1>센서 페이지</h1>
      </div>
    </>
  )
};

export default SensorDetailPage;