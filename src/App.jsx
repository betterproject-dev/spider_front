import './App.css'
import EmergencyAlertModal from './features/emergency/components/EmergencyAlertModal'
import { EmergencyAlertProvider } from './features/emergency/context/EmergencyAlertContext'
import Routers from './Route'

function App() {

  return (
    <>
      <EmergencyAlertProvider>
        <Routers />
        <EmergencyAlertModal />
      </EmergencyAlertProvider>
    </>
  )
}

export default App
