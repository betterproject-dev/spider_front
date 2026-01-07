const SENSOR_LIST = [
  // noraml : 정상 기준 값 (추후 다시 결정)
  { id: 1, name: "온도", key: "temperature_DS18B20", unit: "℃", eng_name : "temperature", normal : 30.0 },
  { id: 2, name: "습도", key: "humidity", unit: "%", eng_name : "humidity", normal : 70.0 },
  { id: 3, name: "소음", key: "noise", unit: "dB", eng_name : "noise", normal : 80.0 },
  { id: 4, name: "누수", key: "leak", unit: "", eng_name : "leak", normal : 1 }
];

/**
 * 센서 데이터가 정상인지 판별하는 공통 함수
 * @param {object} sensor - SENSOR_LIST의 한 항목
 * @param {object} data - 실시간 데이터 (한 개의 row)
 * @returns {boolean} - 정상 여부
 */
const checkIsNormal = (sensor, data) => {
  if (!sensor || !data) return true;

  const sensorName = sensor.eng_name

  // 누수 센서일 경우: 1이면 정상, 0이면 누수 발생
  if (sensorName === "leak") {
    return data[sensorName] === sensor.normal;
  }
  
  // 나머지 센서:기준값(normal)보다 낮으면 정상
  return data[sensorName] < sensor.normal;
};

export default { SENSOR_LIST, checkIsNormal };