import '../styles/camera.css';
import { axiosFlask } from '../../../utils/axiosFactory.js';

const Camera = () => {

  const videoStreamUrl = `${axiosFlask.defaults.baseURL}/camera/video_feed`;

  return (
    <>
    <div className="camera-container">
      <div className="camera-header">
        <h2>AI 실시간 불량 탐지 시스템</h2>
      </div>

      <div className="video-wrapper">
        <img 
          src={videoStreamUrl} 
          alt="AI Live Stream" 
          className="video-feed"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/640x480?text=Camera+Connection+Failed";
          }}
        />
      </div>

      <div className="status-bar">
        <span className="status-dot"></span>
        <span>시스템 정상 가동 중 (AI Model: YOLO)</span>
      </div>

    </div>
    </>
  )
}

export default Camera;