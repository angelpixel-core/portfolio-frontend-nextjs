import "./styles.css";

import { Logo } from "@/molecules/_index";
import { Menu, MenuFloating } from "@/organisms/layout/_index";

export function NavBar() {
  return (
    <header className="layout_navbar-container">
      <Menu />

      <MenuFloating />

      <div className="layout_logo-container">
        <Logo />
      </div>
    </header>
  );
}
