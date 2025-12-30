import './App.css'
import EmergencyAlertModal from './features/emergency/components/EmergencyAlertModal'
import { EmergencyAlertProvider } from './features/emergency/context/EmergencyAlertContext'
import Routers from './Route'
import Header from "./components/Header/Header.jsx";

function App() {

  return (
    
    <EmergencyAlertProvider>
      <div className="app-layout">
        <Header  />
        <main className="app-main">
          <Routers />
        </main>
        
        <EmergencyAlertModal />
      </div>
    </EmergencyAlertProvider>
    
  )

}

export default App
