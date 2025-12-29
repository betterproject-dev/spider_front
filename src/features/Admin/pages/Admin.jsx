import { useState } from 'react';
import '../styles/admin.css';
import axios from 'axios';
import UseNavi from '../../../hooks/UseNavi';

const Admin = () => {
  const [pin, setPin] = useState("");
  const { goTo } = UseNavi();

  const SpringUrl = import.meta.env.VITE_SPRING_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${SpringUrl}/api/check-admin`, {number: pin});
      if (res.data.success) {
        alert(res.data.message);
        goTo('/camera') // 인증 성공 시 이동할 페이지
      } else {
        alert(res.data.message);
        setPin(""); // 틀리면 입력창 초기화
      }
    } catch (err) {
      console.error(err)
      alert("서버 연결 실패")
    }
  };

  return(
    <>
    <div className="admin-login-box">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Admin Access</h2>
        <p>관리자 번호 4자리를 입력하세요.</p>
        <input 
          type="password" 
          className='pin-input'
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength="4"
          placeholder='* * * *'
        />
        <button type='submit' className='login-btn'>인증하기</button>
      </form>
    </div>
    </>
  )
}

export default Admin;