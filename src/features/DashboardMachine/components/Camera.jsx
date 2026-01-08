import "../styles/camera.css";
import {useState, useEffect, useRef, memo, useMemo, useCallback} from "react"; // useRef 추가됨
import UseSocket from "../../../hooks/UseSocket";
import UseNavi from "../../../hooks/UseNavi.jsx";
import Loading from "../../../components/Loading/Loading.jsx";
import { axiosFlask } from "../../../utils/axiosFactory.js";

// 상태 리스트 렌더링 부분을 별도 컴포넌트로  분리 ( 메모제이션 적용 )
const StatusOverlay = memo(({ yoloResult, onNavigate }) => {
  // 결과 데이터 가공 로직을 useMemo로 최적화
  const statusInfo = useMemo(()=> {
    if ( !yoloResult || yoloResult.length === 0) return null

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

    return {labelStatus, colorStatus, dentStatus, isSystemOK}
  }, [yoloResult])

  if (!statusInfo) {
    return (
      <ul className="video_status_list" onClick={onNavigate}>
        <li className="status-wait">객체 탐색 중...</li>
        {["라벨", "색상", "무게", "찌그러짐"].map(text => (
          <li key={text} className="status-wait">{text} : -</li>
        ))}
      </ul>
    )
  }

  const getCn = (status) => (status === "불량" ? "status-fail" : "status-ok");

  return (
    <ul className="video_status_list" onClick={onNavigate}>
      <li className={statusInfo.isSystemOK ? "status-ok" : "status-fail"} style={{ fontSize: "1.3rem", fontWeight: "bold", borderBottom: "2px solid #ddd", marginBottom: "10px", paddingBottom: "10px" }}>
        {statusInfo.isSystemOK ? "정상" : "불량"}
      </li>
      <li>라벨 상태: <span className={getCn(statusInfo.labelStatus)}>{statusInfo.labelStatus}</span></li>
      <li>색상 오염: <span className={getCn(statusInfo.colorStatus)}>{statusInfo.colorStatus}</span></li>
      <li>무게 측정: <span className="status-ok">정상</span></li>
      <li>외관 변형: <span className={getCn(statusInfo.dentStatus)}>{statusInfo.dentStatus}</span></li>
    </ul>
  )
})

const Camera = ({selectedMachine}) => {
  const FlaskBase = useMemo(() => axiosFlask.defaults.baseURL || "http://localhost:5000")

  // 1. URL을 상태(State)로 관리해야 타임스탬프 업데이트가 가능합니다.
  const [videoStreamUrl, setVideoStreamUrl] = useState("");
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const [yoloResult, setYoloResult] = useState([]);

  const [hasStreamStarted, setHasStreamStarted] = useState(false);

  const {goTo} = UseNavi();
  const disconnectTimer = useRef(null);

  // UseSocket 커스텀 훅
  UseSocket("yolo_result", useCallback((data) => {
    setYoloResult(data || []);

    setHasStreamStarted(prev => {
      if (!prev) setIsCameraLoading(false)
      return true
    })

    if (disconnectTimer.current) clearTimeout(disconnectTimer.current)
    disconnectTimer.current = setTimeout(() => {
      setIsCameraLoading(true)
    }, 3000)
  }, []));

  useEffect(() => {
    setIsCameraLoading(true);
    setHasStreamStarted(false); // 머신 변경 시 초기화
    const timestamp = Date.now()
    setVideoStreamUrl(`${FlaskBase}/camera/video_feed?t=${timestamp}`)

    return () => {
      if (disconnectTimer.current) clearTimeout(disconnectTimer.current);
    };
  }, [selectedMachine, FlaskBase]);

  const handleVideoLoad = useCallback(() => {
    // 이미 소켓 데이터가 오고 있다면 로딩 해제
    if (hasStreamStarted) {
      setIsCameraLoading(false);
    }
  }, [hasStreamStarted]);

  const handleNavigate = useCallback(() => {
    goTo(`/machine/${selectedMachine}/items/defect`)
  }, [goTo, selectedMachine])

  const handleVideoError = () => {
    setIsCameraLoading(true);
  };

  return (
    <div className="camera-container">
      <div
        className="video-wrapper"
        style={{
          position: "relative",
          width: "100%",
          // 4:3 비율 (640x480) 유지. 화면이 줄어들면 높이도 자동으로 계산됨
          aspectRatio: "640 / 480",
          backgroundColor: "#000",
          overflow: "hidden",
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
            <StatusOverlay yoloResult={yoloResult} onNavigate={handleNavigate} />
          </div>
        )}
      </div>

      <div className="status-bar">
        <span className="status-dot"></span>
        <span>AI 모니터링 시스템 작동 중</span>
      </div>
    </div>
  );
};

export default memo(Camera);
