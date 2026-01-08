import { useEffect, useState } from "react";
import MachineLayout from "../../DetailLayout/pages/MachineLayout";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import requestHandler from "../../../utils/requestHandler";
import '../styles/defectItem.css';
import Loading from "../../../components/Loading/Loading";
import { useParams } from "react-router-dom";

const COLORS = ['#4A90E2', '#fa7735ff', '#FFBB28', '#00C49F', '#8884d8'];
const BAR_COLOR = '#fd6a6aff'

const DefectItemPage = () => {
  const { machineNum } = useParams();

  const [selectedMachine, setSelectedMachine] = useState(Number(machineNum) || 1);
  const [selectedSide, setSelectedSide] = useState('today');
  const [defectData, setDefectData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({totalInspected: 0, totalRejected: 0, avgRate: 0});
  const visibleTrendData = trendData.filter(item => (item.rejectionRate || 0) > 0);

  const defectLabelMap = {
    Normal: "정상",
    Label: "라벨",
    Crushed: "파손",
    Discolored: "변색",
    weight: "무게"
  }

  const fetchDefectSummary = (machineId, onSuccess, type, setLoading) => {
    return requestHandler({
      method:"get",
      url:`/api/stats/defect-summary?machineId=${machineId}&type=${type}`,
      server:"spring",
      onSuccess,
      setLoading
    })
  }

  const fetchRejectionTrend = (machineId, type, onSuccess, setLoading) => {
    return requestHandler({
      method:"get",
      url:`/api/stats/rejection-trend/${machineId}?type=${type}`,
      server:"spring",
      onSuccess,
      setLoading
    })
  }

  useEffect(() => {
    setLoading(true);
    // 파이 차트 데이터 호출
    fetchDefectSummary(selectedMachine, (data) => {
      const formattedData = [
        { defectType: 'Label', count: data.labelCount || 0 },
        { defectType: 'Crushed', count: data.crushedCount || 0 },
        { defectType: 'Discolored', count: data.discoloredCount || 0 },
        { defectType: 'weight', count: data.weightCount || 0 }
      ];
      setDefectData(formattedData);
    }, selectedSide, setLoading);

    // 바 차트 데이터 호출
    fetchRejectionTrend(selectedMachine, selectedSide, (data) => {
      setTrendData(data);

      // 데이터가 있을 때만 합산 계산
      if (data && data.length > 0){
        const totalIns = data.reduce((acc, cur) => acc + (cur.totalInspected || 0), 0);
        const totalRej = data.reduce((acc, cur) => acc + (cur.totalRejected || 0), 0);
        const avg = totalIns > 0 ? ((totalRej / totalIns) * 100).toFixed(2) : "0.00";

        setSummary({
          totalInspected: totalIns,
          totalRejected: totalRej,
          avgRate: avg
        });
      } else {
        setSummary({totalInspected: 0, totalRejected: 0, avgRate: "0.00"});
      }
    }, setLoading);
  }, [selectedMachine, selectedSide]);

  return (
    <>
    <div className="wrap">
      <MachineLayout
        title="제품 불량률 통계 페이지"
        sort="제품 불량률 통계"
        selectedMachine={selectedMachine}
        onMachineChange={setSelectedMachine}
        sideButtons={[
          { id: 1, name: '오늘', key: 'today'},
          { id: 2, name: '직전 7일', key: 'week'}
        ]}
        selectedSide={selectedSide}
        onSideChange={setSelectedSide}
        summaryItems={[
          { label: "총 검사수", value: summary.totalInspected.toLocaleString(), color: "#333"},
          { label: "불량수", value: summary.totalRejected.toLocaleString(), color: "red"}
        ]}
        currentValue={{label: "평균 불량률", value: `${summary.avgRate}%`, color: "red"}}
        >
          {loading && <Loading message="데이터 로딩 중..." backColor="#fff" fontColor="#000" />}
          <div className="stats-chart-container">
            <section className="chart-section">
              <h3 className="chart-title">제품 불량 종류별 빈도</h3>
              <p className="chart-subtitle">어떤 불량이 많이 나오는가?</p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={defectData.map(item => ({
                      ...item,
                      name: defectLabelMap[item.defectType] || item.defectType
                    }))}
                    dataKey="count"
                    nameKey="name"
                    cx="50%" cy="50%"
                    outerRadius={80}
                    label={({name, value}) => `${value}개`}
                    isAnimationActive={false}
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