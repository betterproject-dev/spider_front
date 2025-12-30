import '../styles/CurrentSensors.css'
import UseNavi from '../../../hooks/UseNavi';

const CurrentSensors = ({ realTimeData }) => {
  const { goTo } = UseNavi();
  
  const sensorList = [
    { id: 1, name: "온도", key: "temperature", unit: "℃", normal : 30.0 }, // noraml : 정상 기준 값 (추후 다시 결정)
    { id: 2, name: "습도", key: "humidity", unit: "%", normal : 70.0 },
    { id: 3, name: "소음", key: "noise", unit: "dB", normal : 80.0 },
    { id: 4, name: "누수", key: "leak" }
  ];

  // (임시) 더미데이터
  const testData = {
    temperature : 21.62,
    humidity : 9,
    noise : 59.06,
    leak : 1
  }

  const sensorBox = (sensor, data) => {
    const isNormal = sensor.key === "leak"
      ? data[sensor.key] === 1  // 누수 1이면 true = 정상
      : data[sensor.key] < sensor.normal;

    return (
      <div className="current_sensor_box" key={sensor.id} onClick={() => goTo(`/sensor/${sensor.key}`)} >
        <div className="sensor_name_area">
          <div className="sensor_name">{sensor.name}</div>
        </div>
        <div className="sensor_data_area">
          {sensor.key !== "leak" ? (
            <>
              <div className={`status_text ${isNormal ? "normal" : "abnormal"}`}>
                {isNormal ? "● NORMAL" : "● ERROR"}
              </div>
              <div className="sensor_value_container">
                <span className="sensor_value">{data[sensor.key]}</span>
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
        { realTimeData.length !== 0 ? // &&
          sensorList.map((sensor) => {
            return sensorBox(sensor, realTimeData[realTimeData.length - 1])
          })
          // (임시) 실시간 데이터를 받지 못할 경우 임시 데이터로 보여주기
          : sensorList.map((sensor) => {
              return sensorBox(sensor, testData)
            })
        }
        </div>
      </div>
    </>
  )
}

export default CurrentSensors;