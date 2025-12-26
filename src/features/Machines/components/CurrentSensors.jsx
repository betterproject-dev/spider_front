import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

/**
 * 웹소켓으로 온도, 습도, 소음, 누수 센서값을 받아서 data에 넣음
 */

const socket = io("http://localhost:5000");

const CurrentSensors = () => {
  const [data, setData] = useState({
    temperature : 0,
    humidity : 0,
    noise : 0,
    leak : false,
  });

  useEffect(() => {
    socket.on("sensor_data", (newData) => {
      // console.log("실시간 들어오는 데이터 : ", newData)  // 개발 끝나면 삭제
      setData(newData);

      // 컴포넌트가 사라질 때 리스너 해제
      return () => {
        socket.off("sensor_data");
      }
    })
  }, []);

  return (
    <>
      <h1>현재 센서값</h1>
      <p>온도 : {data["temperature"]}℃</p>
      <p>습도 : {data["humidity"]}%</p>
      <p>소음 : {data["noise"]}dB</p>
      <p>누수 : {data["leak"] ? '정상' : '누수 발생'}</p>
    </>
  )
}

export default CurrentSensors;