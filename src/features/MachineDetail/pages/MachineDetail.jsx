import React, { useEffect, useState } from 'react';
import '../styles/machineDetail.css';
import MachineLayout from './MachineLayout';
import requestHandler from '../../../utils/requestHandler';
import SensorDayChart from '../../SensorDetail/components/SensorDayChart';
import SensorWeekChart from '../../SensorDetail/components/SensorWeekChart';
import LeakStateChart from '../../SensorDetail/components/leakStateChart';

const MachineDetail = () => {
  const [selectedMachine, setSelectedMachine] = useState(1);
  const [selectedSensor, setSelectedSensor] = useState('temperature');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(false)
  
  
  const machines = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const sensors = [
    { id: 1, name: '온도', key: 'temperature' ,  dataKey : 'temperature_DS18B20', unit: '°C'},
    { id: 2, name: '습도', key: 'humidity', dataKey: 'humidity', unit: '%' },
    { id: 3, name: '소음', key: 'noise', dataKey: 'noise', unit: 'dB' },
    { id: 4, name: '누수', key: 'leak',dataKey: 'leak', unit: ''}
  ];

  const sideButtons = [
    { id: 1, name: '실시간 모니터링', key: 'live' },
    { id: 2, name: '일간 추이', key: 'today' },
    { id: 3, name: '주간 추이', key: 'week' }
  ];

  // 데이터 로딩 호출 (requesthandler)
  const getSensorData = async () => {
    const url = selectedPeriod === 'today' ? '/api/sensors/day' : '/api/sensors/week';

    await requestHandler({
      method : "get",
      url : url,
      server : "spring",
      params : {
        machineNumber : selectedMachine,
        date : selectedDate
      },
      setLoading : setLoading,
      onSuccess : (data) =>  {
        console.log(sensorData)
        setSensorData(data);
      }, 
      onError : (msg) => console.log(msg)

      });
    };

    useEffect(() => {
      if (selectedPeriod !== 'live'){
        getSensorData();
      }
    }, [selectedMachine, selectedPeriod, selectedDate]);

    // 4. 가공 데이터 (UI에 뿌려줄 값들)
    const currentSensorObj = sensors.find(s => s.key === selectedSensor);
    // 안전하게 (빈배열일 때 )
    const latestData = sensorData.length > 0 ? sensorData[sensorData.length - 1] : {}; 
    const currentVal = latestData[currentSensorObj?.dataKey];
 

  return (
    <MachineLayout
      title={`[ ${selectedMachine}호기 ] 센서 정보`}
      machines={machines}              // 호기 리스트 전달
      selectedMachine={selectedMachine} // 현재 값 전달
      onMachineChange={setSelectedMachine} // 변경 함수 전달
      tabs={sensors}
      selectedTab={selectedSensor}
      onTabChange={setSelectedSensor}
      sideButtons={sideButtons}
      selectedSide={selectedPeriod}
      onSideChange={setSelectedPeriod}

      summaryItems={[
        { label: '장비명', value: `${selectedMachine}호기` },
        { label: '선택 센서', value: sensors.find(s => s.key === selectedSensor)?.name },
        { label: '조회 일자', value: selectedDate },
        { label: '상태', value: '정상 작동', color: '#40c057' }
      ]}

    // ✅ 우측 상단 현재 수치 강조
      currentValue={{
        label: `현재 ${currentSensorObj?.name} 수치`,
        value: currentVal !== undefined ? `${currentVal} ${currentSensorObj.unit}` : '-'
      }}
    >
      {/* 5. 날짜 선택 영역 (차트 상단에 배치) */}
      <div className="date-selection-bar" style={{ marginBottom: '20px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600', marginRight: '10px' }}>데이터 조회 날짜:</span>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
      </div>

      {/* 이 부분이 MachineLayout의 {children} 자리로 들어갑니다 */}
<h3 className="chart-title">
        {currentSensorObj?.name} 
        {selectedPeriod === 'today' ? ' 일간 변동 추이' : 
         selectedPeriod === 'week' ? ' 주간 변동 추이' : ' 실시간 모니터링'}
      </h3>

      {/* 6. 그래프 영역 (자식 컴포넌트 호출) */}
<div className="chart-area" style={{ minHeight: '400px', marginTop: '10px' }}>
  {selectedSensor === 'leak' ? (
    // 1순위: 누수 센서일 때 (전용 차트만 노출)
    <LeakStateChart 
      data={sensorData} 
      dataKey={currentSensorObj?.dataKey} 
    />
  ) : selectedPeriod === 'today' ? (
    // 2순위: 누수가 아니고 일간 추이일 때
    <SensorDayChart 
      data={sensorData} 
      dataKey={currentSensorObj?.dataKey} 
      unit={currentSensorObj?.unit} 
    />
  ) : selectedPeriod === 'week' ? (
    // 3순위: 누수가 아니고 주간 추이일 때
    <SensorWeekChart
      data={sensorData} 
      dataKey={currentSensorObj?.dataKey} 
      unit={currentSensorObj?.unit} 
    />
  ) : (
    // 그 외 (실시간 등)
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      실시간 모니터링 준비 중...
    </div>
  )}
</div>
    </MachineLayout>
  );
   };


export default MachineDetail;