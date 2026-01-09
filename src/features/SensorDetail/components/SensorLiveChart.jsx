import { memo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const SensorLiveChart = memo(({ realTimeData, dataKey, unit, sensorName }) => {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={realTimeData} >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="timestamp"
          interval={1}
          padding={{ left: 40, right: 20 }}
        />
        <YAxis
          domain={["dataMin - 5", "dataMax + 5"]}
          unit={unit}
          tickFormatter={(value) => value.toFixed(1)}
          width={60}
        />
        <Tooltip />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke="#3b82f6"
          fill="url(#colorValue)"
          strokeWidth={2}
          connectNulls
          name={sensorName}
          isAnimationActive={true} 
          animationDuration={1500}
          animationEasing="linear"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
});

export default SensorLiveChart;