import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SensorDayChart =  ({data, dataKey, unit, sensorName}) => {

  //   console.log('=== SensorDayChart 디버깅 ===');
  // console.log('받은 data:', data);
  // console.log('받은 dataKey:', dataKey);
  // console.log('받은 unit:', unit);
  // console.log('data 길이:', data?.length);
  // console.log('첫 번째 데이터:', data?.[0]);
  // console.log('데이터에 해당 키 있나?:', data?.[0]?.[dataKey]);

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
        <Tooltip />
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
}

export default SensorDayChart;