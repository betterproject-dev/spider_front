import "../styles/camera.css";
import {useEffect, useState} from "react";
import {io} from "socket.io-client";

const Camera = () => {
  const FlaskUrl = import.meta.env.VITE_FLASK_API_URL;
  const videoStreamUrl = `${FlaskUrl}/camera/video_feed`;

  // YOLO 결과 상태
  const [yoloResult, setYoloResult] = useState([]);

  useEffect(() => {
    const socket = io(FlaskUrl);

    socket.on("yolo_result", (data) => {
      setYoloResult(data); // [{class, confidence, points}, ...]
    });

    return () => {
      socket.disconnect();
    };
  }, [FlaskUrl]);

  return (
    <div className="camera-container">
      <div className="video-wrapper">
        <img
          src={videoStreamUrl}
          alt="AI Live Stream"
          className="video-feed"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/660x480?text=Camera+Connection+Failed";
          }}
        />
        <div className="video_status">
          <ul className="video_status_list">
            {yoloResult.length > 0 ? (
              (() => {
                const item = yoloResult[0];
                const isBoth = item.class === "Both_Defect";
                const isColor = item.class === "Color_Defect";
                const isLabel = item.class === "Label_Defect";
                const isNormal = item.class === "normal";

                // 상태 텍스트 결정
                const labelStatus = isLabel || isBoth ? "정상" : "불량";
                const colorStatus = isColor || isBoth ? "불량" : "정상";
                const dentStatus = isBoth ? "불량" : "정상";

                // 클래스명 결정 함수
                const getClassName = (status) => (status === "불량" ? "status-fail" : "status-ok");

                return (
                  <>
                    <li
                      className={isNormal ? "status-ok" : "status-fail"}
                      style={{
                        fontSize: "1.3rem",
                        borderBottom: "1px solid #ddd",
                        paddingBottom: "5px",
                      }}
                    >
                      {isNormal ? "정상" : "불량"}
                    </li>
                    <li>
                      라벨 : <span className={getClassName(labelStatus)}>{labelStatus}</span>
                    </li>
                    <li>
                      색 : <span className={getClassName(colorStatus)}>{colorStatus}</span>
                    </li>
                    <li>
                      무게 : <span className="status-ok">정상</span>
                    </li>
                    <li>
                      찌그러짐 : <span className={getClassName(dentStatus)}>{dentStatus}</span>
                    </li>
                  </>
                );
              })()
            ) : (
              <>
                <li className="status-wait">대기 중</li>
                <li className="status-wait">라벨 : -</li>
                <li className="status-wait">색 : -</li>
                <li className="status-wait">무게 : -</li>
                <li className="status-wait">찌그러짐 : -</li>
              </>
            )}
          </ul>
        </div>
      </div>
      <div className="status-bar">
        <span className="status-dot"></span>
        <span>시스템 정상 가동 중 (AI Model: YOLO)</span>
      </div>
    </div>
  );
};

export default Camera;
