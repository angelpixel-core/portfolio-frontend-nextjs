import "./styles.css";

import { Logo } from "@/molecules";
import { Menu, MenuFloating } from "@/organisms/layout";

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
