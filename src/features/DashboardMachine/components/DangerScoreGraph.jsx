import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, LabelList, ReferenceArea } from 'recharts';
import "../styles/DangerScoreGraph.css"

const DangerScoreGraph = ({machine_number, scores, lastScore}) => {
  const getStatus = (score) => {
    if (score >= 70) return { label: "위험", class: "danger", color: "#feb2b2" };
    if (score >= 40) return { label: "주의", class: "warning", color: "#faf089" };
    return { label: "정상", class: "safe", color: "#9ae6b4" };
  };

  const currentStatus = getStatus(lastScore);

  return (
    <>
      {/* 왼쪽: 그래프 영역 */}
      <div className="graph-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={scores} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="5 5" stroke="#e2e8f0" vertical={false} />
            <XAxis tickFormatter={(value, index) => index + 1} interval={0} padding={{ left: 30, right: 30 }} tick={{ fontSize: 12 }}>
              <Label value="데이터 순번 (Index)" offset={-10} position="insideBottom" style={{ fontSize: '20px'}}/>
            </XAxis>
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }}>
              <Label value="위험도 점수" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#666', fontSize: '20px' }} />
            </YAxis>
            <Tooltip
              labelFormatter={(value, index) => `${value + 1}번째 데이터`}
              formatter={(value) => [`${value}점`, "위험도"]}
            />
            <ReferenceArea y1={0} y2={40} fill={"#9ae6b4"} fillOpacity={0.3} stroke="none" />
            <ReferenceArea y1={40} y2={70} fill={"#faf089"} fillOpacity={0.3} stroke="none" />
            <ReferenceArea y1={70} y2={100} fill={"#feb2b2"} fillOpacity={0.3} stroke="none" />
            <Line type="monotone" dataKey="dangerScore" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }}>
              <LabelList dataKey="dangerScore" position="top" offset={10} style={{ fontSize: '12px', fill: '#8884d8' }} />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 오른쪽: 상태 설명 칸 */}
      <div className="status-legend-container">
        <div className="current-status-box">
          <p>위험예측모델</p>
          <h2 className={`status-text ${currentStatus.class}`}>{currentStatus.label}</h2>
          <div className="current-score">
            <span className="score-val">{lastScore}</span>
            <span className="score-unit">점</span>
          </div>
        </div>

        <div className="status-guide">
          <div className={`guide-item ${currentStatus.class === 'danger' ? 'active' : ''}`}>
            <span className="dot danger"></span> 위험 (70-100)
          </div>
          <div className={`guide-item ${currentStatus.class === 'warning' ? 'active' : ''}`}>
            <span className="dot warning"></span> 주의 (40-70)
          </div>
          <div className={`guide-item ${currentStatus.class === 'safe' ? 'active' : ''}`}>
            <span className="dot safe"></span> 정상 (0-40)
          </div>
        </div>
      </div>
    </>
  );
}

export default DangerScoreGraph;