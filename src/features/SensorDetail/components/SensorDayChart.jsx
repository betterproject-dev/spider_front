import { memo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SensorDayChart = memo(({data, dataKey, unit, sensorName}) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div style={{padding: '50px', textAlign: 'center'}}>데이터가 없습니다</div>;
  }

  return (

    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="createdAt" tickFormatter={(t) => t.split(' ')[1].substring(0, 5)} />
        <YAxis domain={['auto', 'auto']} unit={unit} />
        <Tooltip labelFormatter={(label) => label && label.split(' ')[1] ? label.split(' ')[1].substring(0, 5) : label} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke="#3b82f6"
          fill="url(#colorValue)"
          strokeWidth={2}
          connectNulls
          name={sensorName}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
});

export default SensorDayChart;