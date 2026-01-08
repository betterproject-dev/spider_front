import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SensorWeekChart = ({data, dataKey, unit, sensorName}) => {

// 날짜 추출 함수
  const formatFullDate = (label) => {
    if (!label) return "";
    return label.split(' ')[0];
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
              fill={dataKey === 'noise' && entry[dataKey] > 70 ? '#ff4d4f' : '#82ca9d'} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>

)



}

export default SensorWeekChart;