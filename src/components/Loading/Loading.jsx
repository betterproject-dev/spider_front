import './Loading.css';

const Loading = ({ message = "데이터를 불러오는 중입니다..." }) => {
  return (
    <div className="loading_container">
      <div className="loading_spinner"></div>
      <p className="loading_text">{message}</p>
    </div>
  );
};

export default Loading;