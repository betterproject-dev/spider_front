import { useEffect, useState } from 'react';
import '../../DetailLayout/styles/sensorDetail.css';
import MachineLayout from '../../DetailLayout/pages/MachineLayout';  // ✅ 수정
import { useParams } from 'react-router-dom';
import sensorConfig from '../../../utils/sensorConfig';
import STATUS_COLOR from '../../../utils/statusColor';
import SensorDayChart from '../components/SensorDayChart';  // ✅ 수정
import SensorWeekChart from '../components/SensorWeekChart';  // ✅ 수정
import requestHandler from '../../../utils/requestHandler';
import SensorLiveChart from '../components/SensorLiveChart';  // ✅ 수정
import LeakLiveChart from '../components/LeakLiveChart'; 
import LeakStateChart from '../components/LeakStateChart';

const MachineDetail = ({ realTimeData }) => {
  const { machineNum, sensorKey } = useParams();
  const { SENSOR_LIST, checkIsNormal } = sensorConfig;
  
  // 마지막으로 들어온 센서 데이터
  const currentData = realTimeData[realTimeData.length - 1] 

  const [selectedMachine, setSelectedMachine] = useState(Number(machineNum) || 1);
  const [selectedSensor, setSelectedSensor] = useState(() => {
    return sensorKey || SENSOR_LIST[0]?.eng_name || 'temperature';
  });
  const [selectedPeriod, setSelectedPeriod] = useState('live');
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(false)
  
  const machines = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  const sideButtons = [
    { id: 1, name: '실시간 모니터링', key: 'live' },
    { id: 2, name: '일간 추이', key: 'today' },
    { id: 3, name: '주간 추이', key: 'week' }
  ];

  // 데이터 로딩 호출 (requesthandler)
  const getSensorData = async (period) => {

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
        setSensorData(data);
        console.log(data)
      }, 
      onError : (msg) => console.log(msg)

      });
    };

  useEffect(() => {
    console.log("현재 모드 변경됨:", selectedPeriod);
    if (selectedPeriod !== 'live'){
      getSensorData(selectedPeriod);
    }
  }, [selectedMachine, selectedPeriod, selectedDate]);

  // 4. 가공 데이터 (UI에 뿌려줄 값들)
  const currentSensorConfig = SENSOR_LIST.find(s => s.eng_name === selectedSensor) || SENSOR_LIST[0];;
  // // 안전하게 (빈배열일 때 )

  // ✅ 수정: sensorKey가 변경될 때만 업데이트
  useEffect(() => {
    if (sensorKey) {
      setSelectedSensor(sensorKey);
    }
  }, [sensorKey]);
  
  // 현재 선택된 센서의 값 (단위 포함)
  const selectedSensorData = () => {
    if (!currentData) return "--";

    if (currentSensorConfig.name === "누수") {
      return currentData["leak"] === 1 ? "정상" : "누수 발생"
    }
    
    const value = currentData[currentSensorConfig.key];
    return value !== undefined ? `${value}${currentSensorConfig.unit || ''}` : "--";
  };
  // 현재 선택된 센서의 값 정상 판별
  const isNormal = checkIsNormal(currentSensorConfig, currentData);
  // 현재 선택된 센서의 정상 여부에 따른 색과 텍스트
  const statusColor = isNormal ? STATUS_COLOR.SAFE : STATUS_COLOR.DANGER;
  const statusText = isNormal ? "정상 작동" : "비정상"

  // 센서 데이터가 들어오지 않는 경우 로딩
  if (!realTimeData) {
    return (
      <>
      <div className="wrap">
        <Loading message="센서 데이터 수신 대기 중..." />
      </div>
      </>
    )
  }

  return (
    <MachineLayout
      title={`[ ${selectedMachine}호기 ] 센서 정보`}
      sort="센서 정보"
      machines={machines}              // 호기 리스트 전달
      selectedMachine={selectedMachine} // 현재 값 전달
      onMachineChange={setSelectedMachine} // 변경 함수 전달
      tabs={SENSOR_LIST}
      selectedTab={selectedSensor}
      sideButtons={sideButtons}
      selectedSide={selectedPeriod}
      onSideChange={setSelectedPeriod}

      summaryItems={[
        { label: '장비명', value: `${selectedMachine}호기` },
        // { label: '선택 센서', value: sensors.find(s => s.key === selectedSensor)?.name },
        { label: '조회 일자', value: selectedDate },
        { label: '선택 센서', value: currentSensorConfig?.name || "센서 선택됨" },
        { label: '상태', value: statusText, color: statusColor }
      ]}

    // ✅ 우측 상단 현재 수치 강조
      currentValue={{
        label: `현재 ${currentSensorConfig?.name || '센서'} 센서 현황`,
        value: selectedSensorData()
      }}
    >
      {/* 5. 날짜 선택 영역 (차트 상단에 배치) */}
      {selectedPeriod === 'today' &&
        <div className="date-selection-bar" style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', marginRight: '10px' }}>데이터 조회 날짜:</span>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
      }

      {/* 이 부분이 MachineLayout의 {children} 자리로 들어갑니다 */}
      <h3 className="chart-title">
        {SENSOR_LIST.find(s => s.eng_name === selectedSensor)?.name}
        {selectedPeriod === 'today' ? ' 일간 변동 추이' : 
         selectedPeriod === 'week' ? ' 주간 변동 추이' : ' 실시간 모니터링'}
      </h3>


      {/* 6. 그래프 영역 (자식 컴포넌트 호출) */}
<div className="chart-area" style={{ minHeight: '400px', marginTop: '10px' }}>
  {selectedPeriod === 'live' ? (
    // 실시간 모니터링
    selectedSensor === "leak"
      ? <LeakLiveChart realTimeData={realTimeData} sensor={selectedSensor} />
      : <SensorLiveChart 
          realTimeData={realTimeData} 
          dataKey={currentSensorConfig?.key}
          unit={currentSensorConfig?.unit}
          sensorName={currentSensorConfig?.name}
        />
  ) : selectedPeriod === 'today' ? (
    // // ✅ 일간 추이 - 누수 체크 추가
    selectedSensor === "leak"
      ? <LeakStateChart 
          data={sensorData} 
          dataKey={currentSensorConfig?.key} 
        />
      : <SensorDayChart 
          data={sensorData} 
          dataKey={currentSensorConfig?.key} 
          unit={currentSensorConfig?.unit}
          sensorName={currentSensorConfig?.name}
        />
  ) : selectedPeriod === 'week' ? (
    // ✅ 주간 추이 - 누수 체크 추가
    selectedSensor === "leak"
      ? <LeakStateChart 
          data={sensorData} 
          dataKey={currentSensorConfig?.key} 
        />
      : <SensorWeekChart
          data={sensorData} 
          dataKey={currentSensorConfig?.key} 
          unit={currentSensorConfig?.unit}
          sensorName={currentSensorConfig?.name}
        />
  ) : null}
</div>

  </MachineLayout>
  );
   };


export default MachineDetail;