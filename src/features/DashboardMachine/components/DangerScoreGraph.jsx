import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, LabelList, ReferenceArea } from 'recharts';
import "../styles/DangerScoreGraph.css"
import { memo, useCallback, useMemo } from 'react';

/** [상수 분리] 유지보수 효율화 */
const CHART_MARGIN = { top: 5, right: 30, left: 20, bottom: 25 };
const SCORE_THRESHOLDS = { DANGER: 70, WARNING: 40 };
const MS_PER_MINUTE = 60000; // 1분당 밀리초
const DATA_INTERVAL_MINUTES = 1; // 데이터 간격 (1분)
const STATUS_CONFIG = {
  danger: { label: "위험", class: "danger", color: "#feb2b2", min: 70, max: 100 },
  warning: { label: "주의", class: "warning", color: "#faf089", min: 40, max: 70 },
  safe: { label: "정상", class: "safe", color: "#9ae6b4", min: 0, max: 40 }
};

const CHART_STYLES = {
  stroke: "#8884d8",
  strokeWidth: 3,
  gridColor: "#e2e8f0",
  labelColor: "#666"
};

const DangerScoreGraph = ({machine_number, scores, lastScore}) => {
  const currentStatus = useMemo(() => {
    const score = Number(lastScore ?? 0)
    if (score >= SCORE_THRESHOLDS.DANGER) return STATUS_CONFIG.danger;
    if (score >= SCORE_THRESHOLDS.WARNING) return STATUS_CONFIG.warning;
    return STATUS_CONFIG.safe;
  }, [lastScore])

  // Tooltip 함수 레퍼런스 고정
  const tooltipLabelFormatter = useCallback((label) => {
    // 최근 10개 기준으로 시간을 만듬
    // payload[0].payload.__idx 같은 값을 사전에 넣어주는 게 가장 안전
    // 일단 현재 방식 유지하되 label이 number일 때만 적용
    const n = Number(label)
    if (Number.isFinite(n)) {
      const now = new Date()
      // (전체 데이터 개수 - 현재 인덱스) * 간격 * 60000
      const minutesAgo = (10 - n) * DATA_INTERVAL_MINUTES;
      const d = new Date(now.getTime() - (minutesAgo * MS_PER_MINUTE));
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      return `${h}:${m}`
    }
    return String(label)
  }, [])

  const tooltipValueFormatter = useCallback(
    (value) => [`${value}점`, "위험도"],
    []
  );

  return (
    <>
      {/* 왼쪽: 그래프 영역 */}
      <div className="graph-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={scores} margin={CHART_MARGIN}>
            <CartesianGrid strokeDasharray="5 5" stroke={CHART_STYLES.gridColor} vertical={false} />
            <XAxis tickFormatter={(value, index) => index + 1} interval={0} padding={{ left: 30, right: 30 }} tick={{ fontSize: 12 }}>
              <Label value="데이터 순번 (Index)" offset={-10} position="insideBottom" style={{ fontSize: '20px' }} />
            </XAxis>
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }}>
              <Label value="위험도 점수" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: CHART_STYLES.labelColor, fontSize: '20px' }} />
            </YAxis>
            <Tooltip
              labelFormatter={tooltipLabelFormatter}
              formatter={tooltipValueFormatter}
            />
            {/* 배경 영역 상수 기반 렌더링 */}
            <ReferenceArea y1={STATUS_CONFIG.safe.min} y2={STATUS_CONFIG.safe.max} fill={STATUS_CONFIG.safe.color} fillOpacity={0.2} stroke="none" />
            <ReferenceArea y1={STATUS_CONFIG.warning.min} y2={STATUS_CONFIG.warning.max} fill={STATUS_CONFIG.warning.color} fillOpacity={0.2} stroke="none" />
            <ReferenceArea y1={STATUS_CONFIG.danger.min} y2={STATUS_CONFIG.danger.max} fill={STATUS_CONFIG.danger.color} fillOpacity={0.2} stroke="none" />
            <Line type="monotone" dataKey="dangerScore" stroke={CHART_STYLES.stroke} strokeWidth={CHART_STYLES.strokeWidth} activeDot={{ r: 8 }}>
              <LabelList dataKey="dangerScore" position="top" offset={10} style={{ fontSize: '12px', fill: CHART_STYLES.stroke }} />
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
          {Object.values(STATUS_CONFIG).reverse().map((status) => (
            <div key={status.class} className={`guide-item ${currentStatus.class === status.class ? 'active' : ''}`}>
              <span className={`dot ${status.class}`}></span> {status.label} ({status.min}-{status.max})
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default memo(DangerScoreGraph);