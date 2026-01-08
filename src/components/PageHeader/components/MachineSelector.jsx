import { useLocation, useParams } from 'react-router-dom';
import '../style/MachineSelector.css'
import UseNavi from '../../../hooks/UseNavi';

// 기계 번호 목록
const MACHINES = [1, 2, 3, 4];

const MachineSelector = ({ onMachineChange }) => {
  const { machineNum } = useParams();
  const location = useLocation();
  const { goTo } = UseNavi();

  /**
   * 페이지 헤더의 기계 번호 선택 시 실행되는 함수
   * 현재 주소 체계(/dashboard/1 또는 /machine/1/sensor/*)에서
   * 기계 번호가 들어가는 특정 위치만 변경하여 이동함
   */
  const handleMachineChange = (newNum) => {
    const pathSegments = location.pathname.split('/');
    // 기계 번호가 들어올 2번방 값을 새로운 번호로 교체
    pathSegments[2] = newNum;

    // 기계 번호 교체하여 새로운 URL 생성
    const newPath = pathSegments.join('/');
    // 새 URL로 이동
    goTo(newPath);
  }

  return (
    <div className="machine_selector_wrap">
      <p className="machine_selector_text">현재 설비 : </p>
      <select
        className="machine_selector"
        value={machineNum}
        onChange={(e) => {
          onMachineChange(Number(e.target.value))
          handleMachineChange(Number(e.target.value))
        }}
      >
        {MACHINES.map((num) => (
          <option key={num} value={num}>{num}호기</option>
        ))}
      </select>
    </div>
  )
}

export default MachineSelector;