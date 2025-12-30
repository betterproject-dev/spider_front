import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { EmergencyAlertProvider } from './features/emergency/context/EmergencyAlertContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <EmergencyAlertProvider>
      <App />
    </EmergencyAlertProvider>
  </BrowserRouter>
)
