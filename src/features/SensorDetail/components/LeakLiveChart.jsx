import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const LeakLiveChart =({ realTimeData, sensor }) => {
  // 누수용 데이터 변환 (정상은 -1, 누수는 1)
  const processedData =
    realTimeData.map(item => ({
      ...item,
      leakStatusValue: item[sensor] === 0 ? 1 : -1 // 누수(0) -> 1, 정상(1) -> -1
    }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={processedData} stackOffset="sign" barCategoryGap={0}>
        <XAxis dataKey="timestamp" interval={1} />
        <YAxis 
          width={60}
          domain={[-1.2, 1.2]}  // 그래프에 보여줄 Y축 데이터 범위
          ticks={[-1, 1]} // 눈금을 그려줄 범위
          tickFormatter={(value) => value === 1 ? "누수" : "정상"}
          tick={{ fontWeight: 'bold' }}
        />
        <ReferenceLine y={0} stroke="#666" />
        <Tooltip
          formatter={(value, name, props) => [
            props.payload[sensor] === 0 ? "누수 발생" : "정상",
            "상태"
          ]}
        />
        <Bar dataKey="leakStatusValue" isAnimationActive={false}>
          {processedData.map((entry, i) => (
            <Cell
              key={`cell-${i}`}
              fill={entry.leakStatusValue > 0 ? 'var(--color-danger)' : 'var(--color-safe)'} 
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default LeakLiveChart;