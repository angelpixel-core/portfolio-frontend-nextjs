import "./styles.css";

import { Logo } from "@/molecules";
import { Menu, MenuFloating } from "@/organisms";

const NavBar = () => {
  return (
    <header className="layout_navbar-container">
      <Menu />

      <MenuFloating />

      <div className="layout_logo-container">
        <Logo />
      </div>
    </header>
  );
};

export default NavBar;
