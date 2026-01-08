import { useEffect, useMemo, useState } from "react";
import MachineLayout from "../../DetailLayout/pages/MachineLayout";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import requestHandler from "../../../utils/requestHandler";
import '../styles/defectItem.css';
import Loading from "../../../components/Loading/Loading";
import { useParams } from "react-router-dom";

/** [상수 분리] 디자인 및 설정값 */
const COLORS = ['#4A90E2', '#fa7735ff', '#FFBB28', '#00C49F', '#8884d8'];
const BAR_COLOR = '#fd6a6aff'
const DEFECT_LABEL_MAP = {
  Normal: "정상",
  Label: "라벨",
  Crushed: "파손",
  Discolored: "변색",
  weight: "무게"
}

// 서버 데이터 키 -> 차트 라벨 매핑
const SERVER_KEY_MAPPING = {
  labelCount: "Label",
  crushedCount: "Crushed",
  discoloredCount: "Discolored",
  weightCount: "weight"
};

const SIDE_BUTTONS = [
  { id: 1, name: '오늘', key: 'today' },
  { id: 2, name: '직전 7일', key: 'week' }
];

const INITIAL_SUMMARY = { totalInspected: 0, totalRejected: 0, avgRate: "0.00" };

/** [스타일 상수] 차트 미출력 시 보여줄 빈 박스 스타일 */
const EMPTY_CHART_STYLE = {
  height: '300px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#666',
  fontSize: '14px',
  width: '100%',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px'
};

const DefectItemPage = () => {
  const { machineNum } = useParams();

  const [selectedMachine, setSelectedMachine] = useState(Number(machineNum) || 1);
  const [selectedSide, setSelectedSide] = useState('today');
  const [defectData, setDefectData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(INITIAL_SUMMARY);

  // 가공 데이터 메모제이션: 렌더링 시 매번 map/filter 돌리는 것 방지
  const chartDefectData = useMemo(() => {
    // 데이터가 없거나 배열이 아니더라도 객체일 경우를 대비해 방어 로직 구축
    if (!defectData || typeof defectData !== 'object') return [];

    return Object.keys(SERVER_KEY_MAPPING).map(key => ({
      defectType: SERVER_KEY_MAPPING[key],
      name: DEFECT_LABEL_MAP[SERVER_KEY_MAPPING[key]] || SERVER_KEY_MAPPING[key],
      value: Number(defectData[key] || 0)
    })).filter(item => item.value > 0);
  }, [defectData]);

  // 바 차트용 데이터 필터링 
  const visibleTrendData = useMemo(() => {
    return trendData.filter(item => (item.rejectionRate || 0) > 0);
  }, [trendData])
  
  useEffect(() => {
    let isMounted = true
    setLoading(true);

    const fetchData = async () => {
      // 파이 차트 데이터 URL
      const summaryUrl = `/api/stats/defect-summary?machineId=${selectedMachine}&type=${selectedSide}`;
      // 바 차트 데이터 URL
      const trendUrl = `/api/stats/rejection-trend/${selectedMachine}?type=${selectedSide}`;

      // Promise.all을 사용하여 두 API 호출을 병렬로 처리 (성능 향상)
      const [summaryRes, trendRes] = await Promise.all([
        requestHandler({ method: "get", url: summaryUrl, server: "spring" }),
        requestHandler({ method: "get", url: trendUrl, server: "spring" })
      ]);

      if (isMounted) {
        // summaryRes.data가 {labelCount: 6, ...} 형태인 객체이므로 그대로 set
        if (summaryRes.ok) setDefectData(summaryRes.data);
        
        if (trendRes.ok) {
          const data = trendRes.data || [];
          setTrendData(data);

          if (data.length > 0) {
            const totalIns = data.reduce((acc, cur) => acc + (cur.totalInspected || 0), 0);
            const totalRej = data.reduce((acc, cur) => acc + (cur.totalRejected || 0), 0);
            const avg = totalIns > 0 ? ((totalRej / totalIns) * 100).toFixed(2) : "0.00";
            setSummary({ totalInspected: totalIns, totalRejected: totalRej, avgRate: avg });
          } else {
            setSummary(INITIAL_SUMMARY);
          }
        }
        setLoading(false);
      }
    }
    fetchData()
    return () => {isMounted = false}
  }, [selectedMachine, selectedSide]);

  return (
    <>
    <div className="wrap">
      <MachineLayout
        title="제품 불량률 통계 페이지"
        sort="제품 불량률 통계"
        selectedMachine={selectedMachine}
        onMachineChange={setSelectedMachine}
        sideButtons={SIDE_BUTTONS}
        selectedSide={selectedSide}
        onSideChange={setSelectedSide}
        summaryItems={[
          { label: "총 검사수", value: summary.totalInspected.toLocaleString(), color: "#333"},
          { label: "불량수", value: summary.totalRejected.toLocaleString(), color: "red"}
        ]}
        currentValue={{label: "평균 불량률", value: `${summary.avgRate}%`, color: "red"}}
        >
          {loading && <Loading message="데이터 로딩 중..."/>}
          <div className="stats-chart-container">
            <section className="chart-section">
              <h3 className="chart-title">제품 불량 종류별 빈도</h3>
              <p className="chart-subtitle">어떤 불량이 많이 나오는가?</p>
              {/* 데이터가 비어있을 때의 예외 처리 추가 */}
              {chartDefectData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartDefectData}
                      dataKey="value" // 명시적으로 value 사용
                      nameKey="name"
                      cx="50%" cy="50%"
                      outerRadius={80}
                      label={({name, value}) => `${value}개`}
                      isAnimationActive={false}
                    >
                      {chartDefectData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ): (
                <div style={EMPTY_CHART_STYLE}>
                  표시할 불량 데이터가 없습니다.
                </div>
              )}
            </section>

            <section className="chart-section" style={{flex: 1.5}}>
              <h3 className="chart-title">일일 불량률 추이</h3>
              <p className="chart-subtitle">(%)일자별 총 검사수 대비 불량 발생 비중의 변화(1분)</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={visibleTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="createdAt" />
                  <YAxis unit='%' domain={[0, 100]}/>
                  <Tooltip formatter={(val) => `${val}%`} isAnimationActive={false}/>
                  <Bar
                    dataKey="rejectionRate"
                    fill={BAR_COLOR}
                    barSize={40}
                    isAnimationActive={false}
                    label={{
                      position: 'top', 
                      formatter: (val) => `${val}%`, 
                      fill:'#333', 
                      fontSize:12, 
                      fontWeight:'bold',
                      dy: -10
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </section>
          </div>
      </MachineLayout>
    </div>           
    </>
  )
};

export default DefectItemPage;