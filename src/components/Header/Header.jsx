import "./Header.css";
import logo from "../../img/logov3.png";
import porfile from "../../img/profileWH.png";
import { NavLink } from "react-router-dom";
import UseNavi from "../../utils/UseNavi.jsx";

function Header() {

  const {goTo} = UseNavi();

  return (
    <>
      <header>
        <ul>
          <li className="logo"><NavLink to ="/monitor"><img src={logo} alt="logo" className="logo_img" /></NavLink></li>
          <li className="login"><img src={porfile} alt="profile" className="profile_img" /></li>
        </ul>
      </header>
    </>
  );
}

export default Header;