import { useState } from "react"
import NotificationPanel from "./NotificationPanel"
import "../styles/notification.css"

const NotificationBell = ({children}) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="nbell-wrap">
      <button
        className="nbell-trigger"
        onClick={() => setOpen(p => !p)}
      >
        {children}
      </button>

      {open && <NotificationPanel onClose={() => setOpen(false)} />}
    </div>
  )
}

export default NotificationBell