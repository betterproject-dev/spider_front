import "./Header.css";
import logo from "../../img/logov3.png";
import porfile from "../../img/profileWH.png";
import UseNavi from "../../hooks/UseNavi.jsx";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEmergencyAlertContext } from "../../features/emergency/context/EmergencyAlertContext.jsx";

function Header() {
  const { goTo } = UseNavi();
  const {alert} = useEmergencyAlertContext()

  return (
    <>
      <header>
        <ul>
          <li className="logo" onClick={() => goTo("/monitor")}><img src={logo} alt="logo" className="logo_img" /></li>
          <li className={`alarm ${alert.isOpen ? "emergency" : ""}`}>
            <FontAwesomeIcon icon={faBell} />
          </li>
          <li className="login"><img src={porfile} alt="profile" className="profile_img" /></li>
        </ul>
      </header>
    </>
  );
}

export default Header;