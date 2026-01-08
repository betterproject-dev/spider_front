import "./Header.css";
import logo from "../../img/logov3.png";
import UseNavi from "../../hooks/UseNavi.jsx";
import { useEmergencyAlertContext } from "../../features/emergency/context/EmergencyAlertContext.jsx";
import NotificationBell from "../../features/alerts/components/NotificationBell.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";

function Header() {
  const { goTo } = UseNavi();
  const {alert} = useEmergencyAlertContext()

  return (
    <>
      <header>
        <ul>
          <li className="logo" onClick={() => goTo("/monitor")}><img src={logo} alt="logo" className="logo_img" /></li>
          <li className={`alarm ${alert?.isOpen ? "emergency" : ""}`}>
            <NotificationBell>
              <FontAwesomeIcon icon={faBell} />
            </NotificationBell>
          </li>
        </ul>
      </header>
    </>
  );
}

export default Header;