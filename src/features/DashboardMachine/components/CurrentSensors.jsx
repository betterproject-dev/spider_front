import '../styles/CurrentSensors.css'
import UseNavi from '../../../hooks/UseNavi';

const CurrentSensors = ({ realTimeData }) => {
  const { goTo } = UseNavi();
  
  const sensorList = [
    { id: "temperature", name: "온도", unit: "℃", normal : 30.0 }, // noraml : 정상 기준 값 (추후 다시 결정)
    { id: "humidity", name: "습도", unit: "%", normal : 70.0 },
    { id: "noise", name: "소음", unit: "dB", normal : 80.0 },
    { id: "leak", name: "누수" }
  ];

  const sensorBox = (sensor, data) => {
    const isNormal = sensor.id === "leak"
      ? data[sensor.id] === 1  // 누수 1이면 true = 정상
      : data[sensor.id] < sensor.normal;

    return (
      <div className="current_sensor_box" key={sensor.id} onClick={() => goTo('/sensor')} >
        <div className="sensor_name_area">
          <div className="sensor_name">{sensor.name}</div>
        </div>
        <div className="sensor_data_area">
          {sensor.id !== "leak" ? (
            <>
              <div className={`status_text ${isNormal ? "normal" : "abnormal"}`}>
                {isNormal ? "● NORMAL" : "● ERROR"}
              </div>
              <div className="sensor_value_container">
                <span className="sensor_value">{data[sensor.id]}</span>
                <span className="sensor_unit">{sensor.unit}</span>
              </div>
            </>
          ) : (
            <>
              <div className={`status_text ${isNormal ? "normal" : "abnormal"}`}>
                {isNormal ? "● SYSTEM SAFE" : "● WARNING"}
              </div>
              <div className="sensor_value_container">
                <span className={`sensor_value_leak ${isNormal ? "normal" : "abnormal"}`}>
                  {isNormal ? "정상" : "누수 발생"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    )
  };

  return (
    <>
      <div className="current_sensor_container">
        <div className="current_sensor_wrap">
        { realTimeData.length !== 0 &&
          sensorList.map((sensor) => {
            return sensorBox(sensor, realTimeData[realTimeData.length - 1])
          })
        }
        </div>
      </div>
    </>
  )
}

export default CurrentSensors;