import '../styles/CurrentSensors.css'
import UseNavi from '../../../hooks/UseNavi';
import sensorConfig from '../../../utils/sensorConfig';
import { memo, useCallback, useMemo } from 'react';

// 개별 센서 카드를 별도 컴포넌트로 분리하고 memo 적용
// 이 컴포넌트는 자신이 전달받은 sensor와 value가 변할 때만 리렌더링.
const SensorItem = memo(({sensor, value, isNormal, onGo}) => {
  return (
    <div className="current_sensor_box" onClick={() => onGo(sensor.eng_name)} >
      <div className="sensor_name_area">
        <div className="sensor_name">{sensor.name}</div>
      </div>
      <div className="sensor_data_area">
        <div className={`status_text ${isNormal ? "normal" : "abnormal"}`}>
          {sensor.key !== "leak"
            ? (isNormal ? "● NORMAL" : "● ERROR")
            : (isNormal ? "● SYSTEM SAFE" : "● WARNING")
          }
        </div>
        <div className="sensor_value_container">
          {sensor.key !== "leak" ? (
            <>
              <span className="sensor_value">{value}</span>
              <span className="sensor_unit">{sensor.unit}</span>
            </>
          ) : (
            <span className={`sensor_value_leak ${isNormal ? "normal" : "abnormal"}`}>
              {isNormal ? "정상" : "누수 발생"}
            </span>
          )}
        </div>
      </div>
    </div>
  )
})

const CurrentSensors = ({ realTimeData, selectedMachine }) => {
  const { goTo } = UseNavi();
  const { SENSOR_LIST, checkIsNormal } = sensorConfig;

  const currentData = useMemo(() => {
    return realTimeData?.length ? realTimeData[realTimeData.length - 1] : null
  }, [realTimeData])

  const handleGo = useCallback(
    (engName) => goTo(`/machine/${selectedMachine}/sensor/${engName}`),
    [goTo, selectedMachine]
  )

  const items = useMemo(() => {
    if (!currentData) return []
    return SENSOR_LIST.map((sensor) => ({
      sensor,
      value: currentData[sensor.key],
      isNormal: checkIsNormal(sensor, currentData)
    }))
  }, [currentData, SENSOR_LIST, checkIsNormal])

  if (!currentData) return null

  return (
    <div className="current_sensor_container">
      <div className="current_sensor_wrap">
        {items.map(({sensor, value, isNormal}) => (
          <SensorItem 
            key={sensor.id}
            sensor={sensor}
            value={value} // 필요한 단일 값만 전달
            isNormal={isNormal} // 계산된 결과 전달
            onGo={handleGo}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(CurrentSensors);