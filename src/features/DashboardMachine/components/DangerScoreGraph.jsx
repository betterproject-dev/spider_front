import { useEffect, useState } from "react";
import requestHandler from "../../../utils/requestHandler.js"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, LabelList, ReferenceArea } from 'recharts';
import "../styles/DangerScoreGraph.css"

const DangerScoreGraph = ({machine_number}) => {
  const [scores, setScores] = useState([]);

  const getScore = async () => {
    const res = await requestHandler({
      method: "get",
      url: '/sensormodel/load_score/'+machine_number
    })
    console.log(res.data)
    const { data, message, ok } = res.data
    return data
  }
  const lastData = scores && scores.length > 0 ? scores[scores.length - 1] : null;
  // 점수가 존재하면 소수점 1자리까지, 없으면 0.0으로 표시
  const lastScore = lastData ? parseFloat(lastData.dangerScore).toFixed(2) : "0.0";

  // 2. 점수에 따른 상태 판별 함수
  const getStatus = (score) => {
    if (score >= 70) return { label: "위험", class: "danger", color: "#feb2b2" };
    if (score >= 40) return { label: "주의", class: "warning", color: "#faf089" };
    return { label: "정상", class: "safe", color: "#9ae6b4" };
  };

  const currentStatus = getStatus(lastScore);

  useEffect(() => {
    const load = async () => {
      const result = await getScore();
      setScores(result);
    };

    // 1. 컴포넌트가 처음 나타날 때 한 번 실행
    load();

    // 2. 1분(60,000ms)마다 load 함수를 실행하는 타이머 설정
    const timerId = setInterval(() => {
      console.log("1분 경과: 데이터를 새로 불러옵니다.");
      load();
    }, 60000);

    // 3. Cleanup 함수: 컴포넌트가 사라질 때 타이머를 제거하여 메모리 누수 방지
    return () => {
      clearInterval(timerId);
      console.log("타이머가 종료되었습니다.");
    };
  }, []); // 빈 배열이므로 마운트 시에만 타이머 생성

  return (
    <div className="dashboard-layout">
      {/* 왼쪽: 그래프 영역 */}
      <div className="graph-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={scores} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="5 5" stroke="#e2e8f0" vertical={false} />
            <XAxis tickFormatter={(value, index) => index + 1} interval={0} padding={{ left: 30, right: 30 }}>
              <Label value="데이터 순번 (Index)" offset={-10} position="insideBottom" />
            </XAxis>
            <YAxis domain={[0, 100]}>
              <Label value="위험도 점수" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#666' }} />
            </YAxis>
            <Tooltip
              labelFormatter={(value, index) => `${value + 1}번째 데이터`}
              formatter={(value) => [`${value}점`, "위험도"]}
            />
            <ReferenceArea y1={0} y2={40} fill={"#9ae6b4"} fillOpacity={0.3} />
            <ReferenceArea y1={40} y2={70} fill={"#faf089"} fillOpacity={0.3} />
            <ReferenceArea y1={70} y2={100} fill={"#feb2b2"} fillOpacity={0.3} />
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
    </div>
  );
}

export default DangerScoreGraph;