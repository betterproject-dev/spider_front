import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import sensorConfig from '../../../utils/sensorConfig';

const SensorLiveChart = ({ realTimeData, sensor, unit, sensorName }) => {
  const { SENSOR_LIST } = sensorConfig;

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
        <XAxis dataKey="timestamp" />
        <YAxis domain={['auto', 'auto']} unit={unit} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey={sensor}
          stroke="#3b82f6"
          fill="url(#colorValue)"
          strokeWidth={2}
          connectNulls
          name={sensorName}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default SensorLiveChart;