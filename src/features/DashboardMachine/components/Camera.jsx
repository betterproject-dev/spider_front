import "../styles/camera.css";
import {useState} from "react";
import UseSocket from "../../../hooks/UseSocket"; // 경로 재확인 필수
import UseNavi from "../../../hooks/UseNavi.jsx";

const Camera = ({ selectedMachine }) => {
  const FlaskUrl = import.meta.env.VITE_FLASK_API_URL || "http://localhost:5000";
  const videoStreamUrl = `${FlaskUrl}/camera/video_feed`;

  const { goTo } = UseNavi();

  // YOLO 감지 결과를 저장할 상태
  const [yoloResult, setYoloResult] = useState([]);

  // UseSocket 커스텀 훅 사용
  UseSocket("yolo_result", (data) => {
    // [확인용] 데이터가 들어오면 무조건 콘솔에 찍힙니다.

    // 데이터가 null이나 undefined로 올 경우를 대비해 빈 배열로 초기화
    setYoloResult(data || []);
  });

  // 상태 판별 도우미 함수 (코드를 깨끗하게 유지)
  const renderStatusContent = () => {
    // 데이터가 없거나 배열이 비어있으면 대기 화면 표시
    if (!yoloResult || yoloResult.length === 0) {
      return (
        <>
          <li className="status-wait">🔍 객체 탐색 중...</li>
          <li className="status-wait" style={{fontSize: "0.8rem", color: "#ccc"}}>
            (카메라에 물체를 보여주세요)
          </li>
          <li className="status-wait">라벨 : -</li>
          <li className="status-wait">색상 : -</li>
          <li className="status-wait">무게 : -</li>
          <li className="status-wait">찌그러짐 : -</li>
        </>
      );
    }

    // 1. 데이터 정규화 (대소문자 무관하게 처리)
    const detected = yoloResult.map((item) => (item.class ? item.class.toLowerCase() : ""));

    // 2. 판별 기준 (백엔드 클래스명: label, crushed, discolored, both_defect 등)
    const hasLabel = detected.includes("label");
    const hasCrushed = detected.includes("crushed") || detected.includes("both_defect");
    const hasColorFail =
      detected.includes("discolored") ||
      detected.includes("color_defect") ||
      detected.includes("both_defect");

    // 3. 결과 메시지 매핑
    const labelStatus = hasLabel ? "정상" : "불량";
    const colorStatus = hasColorFail ? "불량" : "정상";
    const dentStatus = hasCrushed ? "불량" : "정상";

    // 전체 판정
    const isSystemOK = labelStatus === "정상" && colorStatus === "정상" && dentStatus === "정상";
    const getCn = (status) => (status === "불량" ? "status-fail" : "status-ok");

    return (
      <>
        <li
          className={isSystemOK ? "status-ok" : "status-fail"}
          style={{
            fontSize: "1.3rem",
            fontWeight: "bold",
            borderBottom: "2px solid #ddd",
            marginBottom: "10px",
            paddingBottom: "10px",
          }}
        >
          {isSystemOK ? "정상" : "불량"}
        </li>
        <li>
          라벨 상태: <span className={getCn(labelStatus)}>{labelStatus}</span>
        </li>
        <li>
          색상 오염: <span className={getCn(colorStatus)}>{colorStatus}</span>
        </li>
        <li>
          무게 측정: <span className="status-ok">정상</span>
        </li>
        <li>
          외관 변형: <span className={getCn(dentStatus)}>{dentStatus}</span>
        </li>
      </>
    );
  };

  return (
    <div className="camera-container">
      <div className="video-wrapper">
        <img
          src={videoStreamUrl}
          alt="AI Live Stream"
          className="video-feed"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/660x480?text=Camera+Offline";
          }}
        />

        <div className="video_status">
          <ul className="video_status_list" onClick={() => {goTo(`/machine/${selectedMachine}/items/defect`)}}>{renderStatusContent()}</ul>
        </div>
      </div>

      <div className="status-bar">
        <span className="status-dot"></span>
        <span>AI 모니터링 시스템 작동 중</span>
      </div>
    </div>
  );
};

export default Camera;
