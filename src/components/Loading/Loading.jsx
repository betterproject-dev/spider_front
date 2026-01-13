import './Loading.css';

const Loading = ({ message = "데이터를 불러오는 중입니다...", backColor="#2a3a4a", fontColor="#b7d4ff" }) => {
  return (
    <div className="loading_container" style={{backgroundColor: backColor}}>
      <div className="loading_spinner"></div>
      <p className="loading_text" style={{color: fontColor}}>{message}</p>
    </div>
  );
};

export default Loading;