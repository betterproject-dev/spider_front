import '../styles/CurrentSensors.css'
import UseNavi from '../../../hooks/UseNavi';
import sensorConfig from '../../../utils/sensorConfig';

const CurrentSensors = ({ realTimeData }) => {
  const { goTo } = UseNavi();
  const { SENSOR_LIST, checkIsNormal } = sensorConfig;
    
  // (임시) 더미데이터
  const testData = {
    temperature : 21.62,
    humidity : 9,
    noise : 59.06,
    leak : 1
  }

  // const currentData = realTimeData[realTimeData.length - 1
  const currentData = realTimeData.length > 0 
    ? realTimeData[realTimeData.length - 1] 
    : testData;

  const sensorBox = (sensor, data) => {
    const isNormal = checkIsNormal(sensor, data);

    return (
      <div className="current_sensor_box" key={sensor.id} onClick={() => goTo(`/sensor/${sensor.key}`)} >
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
              <span className="sensor_value">{data[sensor.key]}</span>
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
  };

  return (
    <>
      <div className="current_sensor_container">
        <div className="current_sensor_wrap">
        {/* 임시 주석 처리 */}
        {/* { realTimeData.length !== 0 &&
          SENSOR_LIST.map((sensor) => {
            return sensorBox(sensor, currentData)
          })
        } */}
        {
          SENSOR_LIST.map((sensor) => {
            return sensorBox(sensor, currentData)
          })
        }
        </div>
      </div>
    </>
  )
}

export default CurrentSensors;