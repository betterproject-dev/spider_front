import { useEffect, useState } from "react";
import MachineLayout from "../../DetailLayout/pages/MachineLayout";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import requestHandler from "../../../utils/requestHandler";
import '../styles/defectItem.css';
import Loading from "../../../components/Loading/Loading";
import { useParams } from "react-router-dom";

const COLORS = ['#4A90E2', '#FF8042', '#FFBB28', '#00C49F', '#8884d8'];

const DefectItemPage = () => {
  const { machineNum } = useParams();

  const [selectedMachine, setSelectedMachine] = useState(Number(machineNum) || 1);
  const [selectedSide, setSelectedSide] = useState('today');
  const [defectData, setDefectData] = useState([]);
  const [defectLog, setDefectLog] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ totalInspected: 0, totalRejected: 0, avgRate: 0 });
  const visibleTrendData = trendData.filter(item => (item.rejectionRate || 0) > 0);

  const fetchDefectSummary = (onSuccess, type, setLoading) => {
    return requestHandler({
      method: "get",
      url: `/api/stats/defect-summary?type=${type}`,
      server: "spring",
      onSuccess,
      setLoading
    })
  }

  const fetchRejectionTrend = (machineId, type, onSuccess, setLoading) => {
    return requestHandler({
      method: "get",
      url: `/api/stats/rejection-trend/${machineId}?type=${type}`,
      server: "spring",
      onSuccess,
      setLoading
    })
  }

  const fetchDefectLog = (machineId, type, onSuccess, setLoading) => {
    return requestHandler({
      method: "get",
      url: `/api/stats/getLog/${machineId}`,
      server: "spring",
      onSuccess,
      setLoading
    })
  }

  useEffect(() => {
    setLoading(true);
    // 파이 차트 데이터 호출
    fetchDefectSummary((data) => setDefectData(data), selectedSide, setLoading);

    // 불량 로그 데이터 호출
    fetchDefectLog(selectedMachine, (data) => setDefectLog(data), setLoading);

    // 바 차트 데이터 호출
    fetchRejectionTrend(selectedMachine, selectedSide, (data) => {
      setTrendData(data);

      // 데이터가 있을 때만 합산 계산
      if (data && data.length > 0) {
        const totalIns = data.reduce((acc, cur) => acc + (cur.totalInspected || 0), 0);
        const totalRej = data.reduce((acc, cur) => acc + (cur.totalRejected || 0), 0);
        const avg = totalIns > 0 ? ((totalRej / totalIns) * 100).toFixed(1) : 0;

        setSummary({
          totalInspected: totalIns,
          totalRejected: totalRej,
          avgRate: avg
        });
      } else {
        setSummary({ totalInspected: 0, totalRejected: 0, avgRate: 0 });
      }
    }, setLoading);
  }, [selectedMachine, selectedSide]);

  useEffect(() => {
    setLoading(true);
    fetchDefectLog(selectedMachine, (data) => {
      setDefectLog(data);
    }, setLoading);
  }, [selectedMachine]);

  return (
    <>
      <div className="wrap">
        <MachineLayout
          title="제품 불량률 통계 페이지"
          sort="제품 불량률 통계"
          selectedMachine={selectedMachine}
          onMachineChange={setSelectedMachine}
          sideButtons={[
            { id: 1, name: '오늘', key: 'today' },
            { id: 2, name: '직전 7일', key: 'week' },
            { id: 3, name: '불량품 로그', key: 'log' }
          ]}
          selectedSide={selectedSide}
          onSideChange={setSelectedSide}
          defectLog={defectLog}
          summaryItems={[
            { label: "총 검사수", value: summary.totalInspected.toLocaleString(), color: "#333" },
            { label: "불량수", value: defectData.reduce((acc, cur) => acc + cur.count, 0), color: "red" }
          ]}
          currentValue={{ label: "평균 불량률", value: `${summary.avgRate}%` }}
        >
          {loading && <Loading message="데이터 로딩 중..." />}
          <div className="stats-chart-container">
            <section className="chart-section">
              <h3 className="chart-title">어떤 불량이 많이 나오는가?</h3>
              <p className="chart-subtitle">제품 불량 종류별 빈도</p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={defectData}
                    dataKey="count"
                    nameKey="defectType"
                    cx="50%" cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${value}개`}
                  >
                    {defectData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </section>

            <section className="chart-section" style={{ flex: 1.5 }}>
              <h3 className="chart-title">언제 제품 불량이 많이 나오는가?</h3>
              <p className="chart-subtitle">(%)일일 불량률 추이</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={visibleTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="createdAt" />
                  <YAxis unit='%' />
                  <Tooltip formatter={(val) => `${val}%`} />
                  <Bar
                    dataKey="rejectionRate"
                    fill='#5b9bd5'
                    barSize={40}
                    label={{ position: 'top', formatter: (val) => `${val}%` }}
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