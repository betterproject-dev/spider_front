import React, { useEffect, useState } from 'react';
import '../styles/machineDetail.css';
import MachineLayout from './MachineLayout';
import { useParams } from 'react-router-dom';
import sensorConfig from '../../../utils/sensorConfig';
import STATUS_COLOR from '../../../utils/statusColor';

const MachineDetail = ({ realTimeData }) => {
   // (임시) 더미데이터
  const testData = {
    temperature : 21.62,
    humidity : 9,
    noise : 59.06,
    leak : 1
  }

  const { sensorKey } = useParams();
  const { SENSOR_LIST, checkIsNormal } = sensorConfig;
  const currentData = realTimeData[realTimeData.length - 1];  // 마지막으로 들어온 센서 데이터
  
  const [selectedMachine, setSelectedMachine] = useState(7);
  const [selectedSensor, setSelectedSensor] = useState( sensorKey || 'temperature' );
  const [selectedPeriod, setSelectedPeriod] = useState('live');
  
  const machines = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  const sideButtons = [
    { id: 1, name: '실시간 모니터링', key: 'live' },
    { id: 2, name: '일간 추이', key: 'today' },
    { id: 3, name: '주간 추이', key: 'week' }
  ];

  useEffect(() => {
    setSelectedSensor(sensorKey);
  }, [sensorKey]);

  // 현재 선택된 센서의 설정 정보
  const currentSensorConfig = SENSOR_LIST.find(s => s.key === selectedSensor);
  // 현재 선택된 센서의 값 (단위 포함)
  const selectedSensorData = () => {
    const dataType = currentData ? currentData : testData;

    if (currentSensorConfig.name === "누수") {
      return dataType[selectedSensor] === 1 ? "정상" : "누수 발생"
    }

    return `${dataType[selectedSensor]}${currentSensorConfig.unit}`
  };
  // 현재 선택된 센서의 값 정상 판별
  const isNormal = checkIsNormal(currentSensorConfig, currentData);
  // 현재 선택된 센서의 정상 여부에 따른 색과 텍스트
  const statusColor = isNormal ? STATUS_COLOR.NORMAL : STATUS_COLOR.DANGER;
  const statusText = isNormal ? "정상 작동" : "비정상"

  return (
    <MachineLayout
      title={`[ ${selectedMachine}호기 ] 센서 정보`}
      machines={machines}              // 호기 리스트 전달
      selectedMachine={selectedMachine} // 현재 값 전달
      onMachineChange={setSelectedMachine} // 변경 함수 전달
      tabs={SENSOR_LIST}
      selectedTab={selectedSensor}
      onTabChange={setSelectedSensor}
      sideButtons={sideButtons}
      selectedSide={selectedPeriod}
      onSideChange={setSelectedPeriod}
      summaryItems={[
        { label: '장비명', value: `${selectedMachine}호기` },
        { label: '선택 센서', value: currentSensorConfig.name },
        { label: '상태', value: statusText, color: statusColor }
      ]}
      currentValue={{
        label: `현재 ${currentSensorConfig.name} 센서 현황`,
        value: selectedSensorData()
      }}
    >
      {/* 이 부분이 MachineLayout의 {children} 자리로 들어갑니다 */}
      <h3 className="chart-title">
        {SENSOR_LIST.find(s => s.key === selectedSensor)?.name}
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