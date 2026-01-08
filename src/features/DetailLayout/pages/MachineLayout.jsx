import '../styles/sensorDetail.css';
import UseNavi from '../../../hooks/UseNavi';
import PageHeader from '../../../components/PageHeader/PageHeader';
import DefectlogCard from '../../DefectItem/pages/DefectlogCard';

const MachineLayout = ({
  title = "정보 없음",
  sort,  // 페이지 네비바에 들어갈 상세 페이지 정보
  selectedMachine,      // 현재 선택된 호기
  onMachineChange,      // 호기 변경 함수
  tabs = [],          // 상단 센서 탭 배열
  selectedTab = "",   // 현재 선택된 센서 key
  sideButtons = [],   // 왼쪽 사이드바 버튼 배열 (일간, 주간, 실시간 등)
  selectedSide = "",  // 현재 선택된 사이드 버튼 key
  onSideChange = () => { },
  summaryItems = [],  // 요약 바 왼쪽 아이템들 [{label, value, color}, ...]
  currentValue = { label: "현재 수치", value: "-" }, // 요약 바 오른쪽 강조 수치
  children,            // 하단 그래프 영역에 들어갈 내용 (h3 및 차트)
  defectLog = []
}) => {
  const { goTo } = UseNavi();
  if (selectedSide === "log") {
    console.log(defectLog);
    return (
      <>
        <PageHeader
          detail={true}
          sort={sort}
          selectedMachine={selectedMachine}
          onMachineChange={onMachineChange}
        />
        <h1 className="page-title">{title}</h1>

        {/* 2. 상단 센서 탭 (데이터가 있을 때만 렌더링) */}
        {tabs.length > 0 && (
          <nav className="sensor-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`sensor-tab ${selectedTab === tab.eng_name ? 'active' : ''}`}
                onClick={() => goTo(`/machine/${selectedMachine}/sensor/${tab.eng_name}`)}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        )}

        <div className="dashboard-layout">
          {/* 3. 사이드바 기간/메뉴 버튼 */}
          <aside className="sidebar">
            {sideButtons.map((btn) => (
              <button
                key={btn.id}
                className={`period-btn ${selectedSide === btn.key ? 'active' : ''}`}
                onClick={() => onSideChange(btn.key)}
              >
                {btn.name}
              </button>
            ))}
          </aside>

          {/* 4. 메인 컨텐츠 영역 (흰색 박스) */}
          <main className="machine_contents">
            <DefectlogCard />
          </main>
        </div>
      </>
    )
  }
  return (
    <>
      {/* 1. 최상단 타이틀 */}
      <PageHeader
        detail={true}
        sort={sort}
        selectedMachine={selectedMachine}
        onMachineChange={onMachineChange}
      />
      <h1 className="page-title">{title}</h1>

      {/* 2. 상단 센서 탭 (데이터가 있을 때만 렌더링) */}
      {tabs.length > 0 && (
        <nav className="sensor-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`sensor-tab ${selectedTab === tab.eng_name ? 'active' : ''}`}
              onClick={() => goTo(`/machine/${selectedMachine}/sensor/${tab.eng_name}`)}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      )}

      <div className="dashboard-layout">
        {/* 3. 사이드바 기간/메뉴 버튼 */}
        <aside className="sidebar">
          {sideButtons.map((btn) => (
            <button
              key={btn.id}
              className={`period-btn ${selectedSide === btn.key ? 'active' : ''}`}
              onClick={() => onSideChange(btn.key)}
            >
              {btn.name}
            </button>
          ))}
        </aside>

        {/* 4. 메인 컨텐츠 영역 (흰색 박스) */}
        <main className="machine_contents">
          {/* 요약 바 */}
          <div className="info-summary-bar">
            {/* 왼쪽 정보 그룹 */}
            <div className="info-group-left">
              {summaryItems.map((item, idx) => (
                <div className="info-item" key={idx}>
                  <span className="info-label">{item.label}</span>
                  <span className="info-value" style={{ color: item.color }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* 오른쪽 현재값 강조 박스 */}
            <div className="info-item current-value-box">
              <span className="info-label">{currentValue.label}</span>
              <span className="info-value highlight-value">
                {currentValue.value}
              </span>
            </div>
          </div>

          {/* 그래프 영역: 부모 컴포넌트에서 전달한 children이 여기에 꽂힘 */}
          <div className="chart-card">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default MachineLayout;