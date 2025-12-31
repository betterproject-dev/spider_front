import {ComposedChart,Area,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer, } from 'recharts';

const LeakStateChart = ({ data, dataKey }) => {

// 1. 데이터 보완: 값이 null이거나 undefined일 경우를 방지하고 
  // false -> 1(정상), true -> 0(누수)으로 명확히 고정

  console.log("=== LeakStateChart 받은 데이터 ===");
  console.log("전체 데이터:", data);
  console.log("dataKey:", dataKey);
  data?.slice(0, 5).forEach((item, idx) => {
    console.log(`${idx}번째:`, {
      createdAt: item.createdAt,
      leak: item.leak,
      temperature: item.temperature_DS18B20
    });
  });
const chartData = data?.map(item => {
    // 데이터가 없는 구간(온도/습도 0)이거나 백엔드 leak이 false면 정상(1)
    const isActuallyLeak = item[dataKey] === true;
    
    return {
      ...item,
      // 누수면 0(바닥), 정상이면 1(상단)
      val: isActuallyLeak ? 0 : 1 
    };
  });

  return (
    <div style={{ width: '100%', height: '350px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="createdAt" 
            tickFormatter={(t) => t.split(' ')[1]?.substring(0, 5)} 
            fontSize={12}
          />
          <YAxis 
            domain={[0, 1]} 
            ticks={[0, 1]} 
            tickFormatter={(val) => (val === 1 ? '정상' : '누수')} 
            fontSize={12}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const isLeak = payload[0].payload.val === 0;
                return (
                  <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ddd' }}>
                    <p style={{ margin: 0 }}>{payload[0].payload.createdAt}</p>
                    <p style={{ margin: 0, color: isLeak ? 'red' : 'blue', fontWeight: 'bold' }}>
                      상태: {isLeak ? '🚨 누수 발생' : '✅ 정상'}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          
          {/* ✅ Area: 정상(1)일 때는 투명하게, 누수(0)로 떨어질 때만 강조하고 싶다면 fill 사용 */}
          <Area 
            type="stepAfter" 
            dataKey="val" 
            fill="#e6f7ff" 
            stroke="none" 
            baseLine={1} // 기준선을 1에 두어 0으로 떨어질 때만 색이 채워지게 함
          />
          
          {/* ✅ Line: 'stepAfter'를 써야만 불필요한 사선 꺾임 없이 직각으로 움직입니다. */}
          <Line 
            type="stepAfter" 
            dataKey="val" 
            stroke="#1890ff" 
            strokeWidth={3} 
            dot={false} 
            connectNulls={true} // 데이터 중간이 비어도 선이 끊기지 않게 보완
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeakStateChart