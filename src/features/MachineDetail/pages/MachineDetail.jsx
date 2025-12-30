import React, { useEffect, useState } from 'react';
import '../styles/machineDetail.css';
import MachineLayout from './MachineLayout';
import { useParams } from 'react-router-dom';

const MachineDetail = () => {
  const { sensorKey } = useParams();

  const [selectedMachine, setSelectedMachine] = useState(7);
  const [selectedSensor, setSelectedSensor] = useState( sensorKey || 'temperature' );
  const [selectedPeriod, setSelectedPeriod] = useState('live');

  const machines = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const sensors = [
    { id: 1, name: '온도', key: 'temperature' },
    { id: 2, name: '습도', key: 'humidity' },
    { id: 3, name: '소음', key: 'noise' },
    { id: 4, name: '누수', key: 'leak' }
  ];

  const sideButtons = [
    { id: 1, name: '실시간 모니터링', key: 'live' },
    { id: 2, name: '일간 추이', key: 'today' },
    { id: 3, name: '주간 추이', key: 'week' }
  ];

  useEffect(() => {
    setSelectedSensor(sensorKey);
  }, [sensorKey]);

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
        { label: '상태', value: '정상 작동', color: '#40c057' }
      ]}
      currentValue={{
        label: `현재 ${sensors.find(s => s.key === selectedSensor)?.name} 센서 현황`,
        value: '24.5'
      }}
    >
      {/* 이 부분이 MachineLayout의 {children} 자리로 들어갑니다 */}
      <h3 className="chart-title">
        {sensors.find(s => s.key === selectedSensor)?.name} 
        {selectedPeriod === 'today' ? ' 일간 변동 추이' : 
         selectedPeriod === 'week' ? ' 주간 변동 추이' : ' 실시간 모니터링'}
      </h3>
      <div className="chart-placeholder">
        그래프 영역 (여기에 실제 차트 컴포넌트 삽입)
      </div>
    </MachineLayout>
  );
};

export default MachineDetail;