import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// 날짜 추출 함수
const formatFullDate = (label) => {
  if (!label) return "";
  return label.split(' ')[0];
};

const SensorWeekChart = memo(({data, dataKey, unit, sensorName, normal}) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div style={{padding: '50px', textAlign: 'center'}}>데이터가 없습니다</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="createdAt" tickFormatter={(t) => t ? t.split(' ')[0].substring(5, 10) : t}/>
        <YAxis domain={['auto', 'auto']} unit={unit} />
        <Tooltip labelFormatter={formatFullDate} />
        <Bar dataKey={dataKey} fill="#82ca9d" radius={[4, 4, 0, 0]} name={sensorName}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry[dataKey] > normal ? '#ff4d4f' : '#82ca9d'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
});

export default SensorWeekChart;