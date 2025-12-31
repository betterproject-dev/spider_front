import '../style/MachineSelector.css'

// 기계 번호 목록
const MACHINES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const MachineSelector = ({ selectedMachine, onMachineChange }) => {

  return (
    <div className="machine_selector_wrap">
      <p className="machine_selector_text">설비 선택 : </p>
      <select
        className="machine_selector"
        value={selectedMachine}
        onChange={(e) => onMachineChange(Number(e.target.value))}
      >
        {MACHINES.map((num) => (
          <option key={num} value={num}>{num}호기</option>
        ))}
      </select>
    </div>
  )
}

export default MachineSelector;