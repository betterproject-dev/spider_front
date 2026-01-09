import { useState } from 'react';
import '../styles/admin.css';
import UseNavi from '../../../hooks/UseNavi';
import requestHandler from '../../../utils/requestHandler';
import Loading from '../../../components/Loading/Loading';
import { useAdminAuthStore } from '../stores/useAdminAuthStore';

const Admin = () => {
  const [pin, setPin] = useState("");
  const { goTo } = UseNavi();
  const [loading, setLoading] = useState(false)

  const authenticate = useAdminAuthStore(state => state.authenticate);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await requestHandler({
      method: "post",
      url: "/api/check-admin",
      payload: {number: pin},
      server: "spring",
      setLoading
    })

    if (result.ok) {
      // 성공 시: requestHandler가 넘겨준 message 활용
      authenticate(); // 전역 상태 true
      alert(result.message);
      goTo('/monitor') // 인증 성공 시 이동할 페이지
    } else {
      // 실패 시: 비밀번호 틀림 혹은 서버 에러
      alert(result.message); // "번호가 일치하지 않습니다." 등
      setPin("");
    }
  };

  return(
    <>
      {loading && <Loading message='인증 확인 중...'/>}
      <div className="wrap">
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
              disabled={loading}
            />
            <button type='submit' className='login-btn'>인증하기</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Admin;