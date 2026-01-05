import { useLocation, useParams } from 'react-router-dom';
import '../style/MachineSelector.css'
import UseNavi from '../../../hooks/UseNavi';

// 기계 번호 목록
const MACHINES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const MachineSelector = ({ onMachineChange }) => {
  const { machineNum } = useParams();
  const location = useLocation();
  const { goTo } = UseNavi();

  const handleMachineChange = (newNum) => {
    const pathSegments = location.pathname.split('/');
    // 기계 번호가 들어올 2번방 값을 새로운 번호로 교체
    pathSegments[2] = newNum;

    const newPath = pathSegments.join('/');
    goTo(newPath);
  }

  return (
    <div className="machine_selector_wrap">
      <p className="machine_selector_text">설비 선택 : </p>
      <select
        className="machine_selector"
        value={machineNum}
        onChange={(e) => {
          onMachineChange(Number(e.target.value))
          handleMachineChange(e.target.value)
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