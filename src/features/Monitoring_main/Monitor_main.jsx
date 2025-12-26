import "./Monitor_main.css";
import { useState, useEffect } from "react";
import factoryImg from "../../img/factory_bg.png";
import { NavLink } from "react-router-dom";

const MESSAGE_ROW_HEIGHT = 35;
const alertMessages = [
  { machine: "1호기", text: "온도 수치가 허용범위를 초과하였습니다." },
  { machine: "2호기", text: "전압 변동이 감지되었습니다." },
  { machine: "3호기", text: "누수가 발생했습니다." },
  { machine: "4호기", text: "진동 수치가 기준을 초과했습니다." },
];

function Monitor_main() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [messageIndex, setMessageIndex] = useState(0);
  const [transitionOn, setTransitionOn] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ticker = setInterval(() => {
      setMessageIndex((prev) => prev + 1);
    }, 3500);

    return () => clearInterval(ticker);
  }, []);

  const handleMessageTransitionEnd = () => {
    if (messageIndex === alertMessages.length) {
      setTransitionOn(false);
      setMessageIndex(0);
      setTimeout(() => setTransitionOn(true), 50);
    }
  };

  const todayweek = currentTime.getDay();
  const formattedDate = `${currentTime.getFullYear()}.${(currentTime.getMonth()+1)}.${currentTime.getDate()}`;
  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const seconds = String(currentTime.getSeconds()).padStart(2, '0');
  const time = `${hours}:${minutes}:${seconds}`;
  const sec = `${seconds}`;

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[todayweek];

  return (
    <>
      <div className="wrap">
        <div className="monitor_contents">
          <div className="left_container">
            <div className="clock">
              <p className="date">{formattedDate}</p>
              <p className="todayweek">{dayName}</p>
              <p className="time">{time}</p>
            </div>
            <div className="main_button_list">
              <div className="main_btn">생산현황</div>
              <div className="main_btn">생산현황</div>
              <div className="main_btn">생산현황</div>
            </div>
          </div>
          <div className="right_container">
               <div className="factory_image">
                 <img src={factoryImg} alt="factory" className="factory_img" />
               </div>
            <div className="machine_status">
              <div className="status_green">정상가동</div>
              <div className="status_yellow">작동대기</div>
              <div className="status_red">작동중지</div>
            </div>
            <div className="factory_TH">
              <div className="TH_text">공장 내부 온도 | 습도</div>
              <div className="temp">온도 : {sec}℃</div>
              <div className="hum">습도 : {Number(sec) + 2}%</div>
            </div>
            <div className="machine_1"> <NavLink to="/dashboard_machine1">1호기</NavLink></div>
            <div className="machine_2">2호기</div>
            <div className="machine_3">3호기</div>
            <div className="machine_4">4호기</div>
            <div className="monitor_message">
              <div className="message_left">
                <p>Message</p>
              </div>
              <div className="message_right">
                <div className="message_slider">
                  <div
                    className="message_track"
                    style={{
                      transform: `translateY(-${messageIndex * MESSAGE_ROW_HEIGHT}px)`,
                      transition: transitionOn ? "transform 0.45s ease-in-out" : "none",
                    }}
                    onTransitionEnd={handleMessageTransitionEnd}
                  >
                    {[...alertMessages, alertMessages[0]].map((msg, idx) => (
                      <div className="message_item" key={`${msg.machine}-${idx}`}>
                        <div className="machine_num">{msg.machine}</div>
                        <div className="message_text">{msg.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Monitor_main;
