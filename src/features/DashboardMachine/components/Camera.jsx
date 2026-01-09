import "../styles/camera.css";
import {useState, useEffect, useRef} from "react"; // useRef 추가됨
import UseSocket from "../../../hooks/UseSocket";
import UseNavi from "../../../hooks/UseNavi.jsx";
import Loading from "../../../components/Loading/Loading.jsx";

const Camera = ({selectedMachine}) => {
  const FlaskUrl = import.meta.env.VITE_FLASK_API_URL || "http://localhost:5000";

  // 1. URL을 상태(State)로 관리해야 타임스탬프 업데이트가 가능합니다.
  const [videoStreamUrl, setVideoStreamUrl] = useState(`${FlaskUrl}/camera/video_feed`);
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const [yoloResult, setYoloResult] = useState([]);

  const [hasStreamStarted, setHasStreamStarted] = useState(false);

  const {goTo} = UseNavi();
  const disconnectTimer = useRef(null);

  // UseSocket 커스텀 훅
  UseSocket("yolo_result", (data) => {
    setYoloResult(data || []);

    if (!hasStreamStarted) {
      setHasStreamStarted(true);
      setIsCameraLoading(false);
    }

    clearTimeout(disconnectTimer.current);
    disconnectTimer.current = setTimeout(() => {
      setIsCameraLoading(true);
    }, 3000);
  });

  useEffect(() => {
    setIsCameraLoading(true);
    setHasStreamStarted(false); // 머신 변경 시 초기화
    // 2. 새로고침이나 머신 변경 시 URL 뒤에 시간을 붙여 캐시를 방지합니다.
    const newUrl = `${FlaskUrl}/camera/video_feed?t=${new Date().getTime()}`;
    setVideoStreamUrl(newUrl);

    return () => {
      if (disconnectTimer.current) clearTimeout(disconnectTimer.current);
    };
  }, [selectedMachine, FlaskUrl]);

  const handleVideoLoad = () => {
    // 이미 소켓 데이터가 오고 있다면 로딩 해제
    if (hasStreamStarted) {
      setIsCameraLoading(false);
    }
  };

  const handleVideoError = () => {
    setIsCameraLoading(true);
  };

  const renderStatusContent = () => {
    if (!yoloResult || yoloResult.length === 0) {
      return (
        <>
          <li className="status-wait">객체 탐색 중...</li>
          <li className="status-wait">라벨 : -</li>
          <li className="status-wait">색상 : -</li>
          <li className="status-wait">찌그러짐 : -</li>
        </>
      );
    }

    const detected = yoloResult.map((item) => (item.class ? item.class.toLowerCase() : ""));
    const hasLabel = detected.includes("label");
    const hasCrushed = detected.includes("crushed") || detected.includes("both_defect");
    const hasColorFail =
      detected.includes("discolored") ||
      detected.includes("color_defect") ||
      detected.includes("both_defect");

    const labelStatus = hasLabel ? "정상" : "불량";
    const colorStatus = hasColorFail ? "불량" : "정상";
    const dentStatus = hasCrushed ? "불량" : "정상";

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
          외관 변형: <span className={getCn(dentStatus)}>{dentStatus}</span>
        </li>
      </>
    );
  };

  return (
    <div className="camera-container">
      <div
        className="video-wrapper clickable-area"
        onClick={() => goTo(`/machine/${selectedMachine}/items/defect`)}
        style={{
          position: "relative",
          width: "100%",
          // 4:3 비율 (640x480) 유지. 화면이 줄어들면 높이도 자동으로 계산됨
          aspectRatio: "640 / 480",
          backgroundColor: "#000",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {isCameraLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 10,
              backgroundColor: "#001a33",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loading message="카메라 스트림을 연결 중입니다..." />
          </div>
        )}
        <img
          src={videoStreamUrl}
          alt="AI Live Stream"
          className="video-feed"
          onLoad={handleVideoLoad}
          onError={handleVideoError}
          style={{width: "100%", display: isCameraLoading ? "none" : "block"}}
        />
        {!isCameraLoading && (
          <div className="video_status">
            <ul
              className="video_status_list"
              onClick={() => goTo(`/machine/${selectedMachine}/items/defect`)}
            >
              {renderStatusContent()}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Camera;
