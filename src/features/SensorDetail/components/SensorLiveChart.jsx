import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const SensorLiveChart = ({ realTimeData, sensor }) => {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={'100%'} height={'100%'} data={realTimeData}>
        <Line
          type={'monotone'}
          dataKey={sensor}
          stroke='#8884d8'
          isAnimationActive={false}
        />
        <XAxis dataKey={'timestamp'} />
        <YAxis width="auto" domain={['dataMin - 5', 'dataMax + 5']} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default SensorLiveChart;