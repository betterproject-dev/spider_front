import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const LeakStateChart = ({ data, dataKey }) => {

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div style={{padding: '50px', textAlign: 'center'}}>데이터가 없습니다</div>;
  }

  // ✅ 백엔드 데이터: leak: true(누수) -> 위쪽(1), leak: false(정상) -> 아래쪽(-1)
  const processedData = data.map(item => {
    const isLeak = item[dataKey] === true;  // true면 누수
    
    return {
      ...item,
      leakStatusValue: isLeak ? 1 : -1  // 누수(true) -> 1, 정상(false) -> -1
    };
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={processedData} stackOffset="sign" barCategoryGap={0}>
        <XAxis 
          dataKey="createdAt"
          tickFormatter={(t) => {
            if (!t) return '';
            return t.split(' ')[1]?.substring(0, 5) || t;
          }}
          tick={{fontSize: 12}} 
        />
        <YAxis 
          width={60}
          domain={[-1.2, 1.2]}
          ticks={[-1, 1]}
          tickFormatter={(value) => value === 1 ? "누수" : "정상"}
          tick={{ fontSize: 13, fontWeight: 'bold' }}
        />
        <ReferenceLine y={0} stroke="#666" />
        <Tooltip
          formatter={(value, name, props) => {
            const isLeak = props.payload[dataKey] === true;
            return [isLeak ? "누수 발생" : "정상", "상태"];
          }}
        />
        <Bar dataKey="leakStatusValue" isAnimationActive={false}>
          {processedData.map((entry, i) => (
            <Cell
              key={`cell-${i}`}
              fill={entry.leakStatusValue > 0 ? '#ef4444' : '#3b82f6'} 
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LeakStateChart;