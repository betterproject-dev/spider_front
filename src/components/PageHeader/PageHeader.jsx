import { memo } from 'react';
import MachineSelector from './components/MachineSelector';
import Navbar from './components/Navbar';
import './style/PageHeader.css'

const PageHeader = memo(({ detail=false, sort='', selectedMachine, onMachineChange }) => {
  return (
    <div className="page_header_area">
      <Navbar detail={detail} sort={sort} selectedMachine={selectedMachine} />
      <MachineSelector
        selectedMachine={selectedMachine}
        onMachineChange={onMachineChange}
      />
    </div>
  );
});

export default PageHeader;