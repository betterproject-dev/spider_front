import { useState } from 'react';
import '../styles/productChart.css';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const ProductChart = () => {
  const [activeTab, setActiveTab] = useState('일간');

  // 임시 데이터 (막대차트용)
  const typeData = [
    {name: '라벨', count: 15},
    {name: '내용물', count: 40},
    {name: '병모양', count: 10},
    {name: '무게', count: 30}
  ];

  // 라인차트용
  const trendData = [
    {time: '09:00', count: 2},
    {time: '11:00', count: 5},
    {time: '13:00', count: 12},
    {time: '15:00', count: 8},
    {time: '17:00', count: 4}
  ]

  return (
    <>
    <div className="graphs-container">
      <div className="graphs-header">
        <h2>4호기_제품 불량 통계</h2>
        <div className="filter-tabs">
          {['일간', '주간', '월간', '연간'].map(tab => (
            <button 
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-wrapper">
        {/* 종류별 빈도 */}
        <div className="chart-card">
          <span className='chart-title'>제품 불량 종류별 빈도</span>
          <div style={{width: '100%', height: 350}}>
            <ResponsiveContainer>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#5b9bd5" barSize={50}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 날짜별 추이 */}
        <div className="chart-card">
          <span className='chart-title'>{activeTab}별 불량 발생 추이</span>
          <div style={{width: '100%', height: 350}}>
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey='time' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#ed7d31" strokeWidth={3} name="발생 건수"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
    </>
  )
}

export default ProductChart;