import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import '../../DetailLayout/styles/sensorDetail.css';
import MachineLayout from '../../DetailLayout/pages/MachineLayout';
import { useParams } from 'react-router-dom';
import sensorConfig from '../../../utils/sensorConfig';
import STATUS_COLOR from '../../../utils/statusColor';
import SensorDayChart from '../components/SensorDayChart';
import SensorWeekChart from '../components/SensorWeekChart';
import requestHandler from '../../../utils/requestHandler';
import SensorLiveChart from '../components/SensorLiveChart';
import LeakLiveChart from '../components/LeakLiveChart'; 
import LeakStateChart from '../components/LeakStateChart';
import Loading from "../../../components/Loading/Loading.jsx";

const SIDE_BUTTONS = [
  { id: 1, name: '실시간 모니터링', key: 'live' },
  { id: 2, name: '일간 추이', key: 'today' },
  { id: 3, name: '주간 추이', key: 'week' }
];

const MachineDetail = memo(({ realTimeData }) => {
  const { machineNum, sensorKey } = useParams();
  const { SENSOR_LIST, checkIsNormal } = sensorConfig;
  
  // =====  state  =====
  const [selectedMachine, setSelectedMachine] = useState(Number(machineNum) || 1);  // 현재 선택된 기계 번호
  const [selectedSensor, setSelectedSensor] = useState(() => {
    return sensorKey || SENSOR_LIST[0]?.eng_name || 'temperature';
  });   // 현재 선택된 센서의 영문명
  const [selectedPeriod, setSelectedPeriod] = useState('live'); // 현재 선택된 사이드 버튼
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);   // 현재 선택된 조회 일자 (일간 추이에서만 변경 가능)
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(false)
  

  // =====  Memoized Values  =====
  // 마지막으로 들어온 센서 데이터
  const currentData = realTimeData[realTimeData.length - 1]

  // 현재 선택된 센서의 SENSOR_LIST 값 (id, name, key, unit, eng_name, normal)
  const currentSensorConfig = useMemo(() => {
    return SENSOR_LIST.find(s => s.eng_name === selectedSensor) || SENSOR_LIST[0];
  }, [selectedSensor]);

  // 그래프 상단에 표시할 현재 선택된 센서의 값 (단위 포함)
  const displaySensorValue = useMemo(() => {
    if (!currentData) return "--";
    if (currentSensorConfig.name === "누수") {
      return currentData["leak"] === 1 ? "정상" : "누수 발생";
    }
    const value = currentData[currentSensorConfig.key];
    return value !== undefined ? `${value}${currentSensorConfig.unit || ''}` : "--";
  }, [currentData, currentSensorConfig]);

  // 현재 선택된 센서의 값 정상 판별
  const isNormal = useMemo(() => {
    return checkIsNormal(currentSensorConfig, currentData);
  }, [currentSensorConfig, currentData]);

  // 요약 바 왼쪽 아이템들
  const summaryItems = useMemo(() => [
    { label: '장비명', value: `${selectedMachine}호기` },
    { label: '조회 일자', value: selectedDate },
    { label: '선택 센서', value: currentSensorConfig?.name || "센서 선택됨" },
    { label: '상태', value: isNormal ? "정상 작동" : "비정상", color: isNormal ? STATUS_COLOR.SAFE : STATUS_COLOR.DANGER }
  ], [selectedMachine, selectedDate, currentSensorConfig, isNormal]);

  // 요약 바 오른쪽 강조 수치
  const currentValue = useMemo(() => ({
    label: `현재 ${currentSensorConfig?.name || '센서'} 센서 현황`,
    value: displaySensorValue
  }), [currentSensorConfig, displaySensorValue]);

  // =====  API  =====
  // 데이터 로딩 호출 (requesthandler)
  const getSensorData = useCallback(async () => {
    if (selectedPeriod === 'live') return;  // 실시간 탭에서는 호출 필요x

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
      }, 
      onError : (msg) => console.log(msg)
    });
  }, [selectedMachine, selectedPeriod, selectedDate]);


  // =====  Effects  =====
  useEffect(() => {
    getSensorData();
  }, [selectedMachine, selectedPeriod, selectedDate]);

  // 파라미터(sensorKey)가 변경될 때마다 현재 선택된 센서(selectedSensor)도 변경
  useEffect(() => {
    if (sensorKey) setSelectedSensor(sensorKey);
  }, [sensorKey]);

  // 사이드 탭이 변경될 때 조회 날짜를 오늘로 리셋
  useEffect(() => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, [selectedPeriod]);
  

  // =====  기타  =====
  // 센서 데이터가 들어오지 않는 경우 로딩
  if (!realTimeData) return <div className="wrap"><Loading message="데이터 수신 대기 중..." /></div>;

  return (
    <MachineLayout
      title={`[ ${selectedMachine}호기 ] 센서 정보`}
      sort="센서 정보"  // 페이지 네비바에 들어갈 상세 페이지 정보
      selectedMachine={selectedMachine} // 현재 기계 번호
      onMachineChange={setSelectedMachine} // 기계 변경 함수 전달
      tabs={SENSOR_LIST}  // 상단 센서 탭
      selectedTab={selectedSensor}  // 현재 선택된 센서의 영문명
      sideButtons={SIDE_BUTTONS}  // 왼쪽 사이드바 버튼 배열 (일간, 주간, 실시간 등)
      selectedSide={selectedPeriod} // 현재 선택된 사이드 버튼
      onSideChange={setSelectedPeriod}
      summaryItems={summaryItems}  // 요약 바 왼쪽 아이템들
      currentValue={currentValue}  // 요약 바 오른쪽 강조 수치
    >

      {/* 날짜 선택 영역 (일간 추이일 경우) */}
      {selectedPeriod === 'today' &&
        <div className="date-selection-bar">
          <span>데이터 조회 날짜:</span>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      }

      {/* 그래프 제목 영역 */}
      <h3 className="chart-title">
        {currentSensorConfig?.name}
        {selectedPeriod === 'today' ? ' 일간 변동 추이' : 
         selectedPeriod === 'week' ? ' 주간 변동 추이' : ' 실시간 모니터링'}
      </h3>


      {/* 그래프 영역 */}
      <div className="chart-area">
        {loading ? (
          <Loading message='그래프를 불러오는 중...' backColor='#fff' fontColor='#000' />
        ) : (
          <>
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
            // 일간 추이
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
            // 주간 추이
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
                  normal={currentSensorConfig.normal}
                />
          ) : null}
          </>
        )}
      </div>

    </MachineLayout>
  );
});


export default MachineDetail;