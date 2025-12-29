import "./Header.css";
import logo from "../../img/logov3.png";
import porfile from "../../img/profileWH.png";
import UseNavi from "../../hooks/UseNavi.jsx";

function Header() {
  const { goTo } = UseNavi();

  return (
    <>
      <header>
        <ul>
          <li className="logo" onClick={() => goTo("/monitor")}><img src={logo} alt="logo" className="logo_img" /></li>
          <li className="login"><img src={porfile} alt="profile" className="profile_img" /></li>
        </ul>
      </header>
    </>
  );
}

export default Header;