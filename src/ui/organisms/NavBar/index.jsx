import "./styles.css";

import { Logo } from "@/molecules";
import { Menu, MenuFloating } from "@/organisms";

/**
 * NavBar - Main header component containing all navigation zones.
 *
 * ## Header Zones (Epic 11)
 *
 * | Zone         | Component        | Visibility                    |
 * |--------------|------------------|-------------------------------|
 * | Brand        | Logo             | All breakpoints (centered)    |
 * | Primary Nav  | Menu             | desktop+, wide: full          |
 * | Social       | Menu             | wide: only                    |
 * | Auth         | Menu             | wide: only                    |
 * | UI Controls  | Menu/ThemeButton | tablet+                       |
 * | Burger       | MenuFloating     | mobile, tablet (≤1024px)      |
 *
 * @see docs/layout-system.md for breakpoint definitions and visibility matrix
 */
const NavBar = () => {
  return (
    <header className="layout_navbar-container" data-testid="header-container">
      {/* Zone: Desktop Menu (Nav, Social, Auth, UI Controls) */}
      <Menu />

      {/* Zone: Mobile Burger Menu */}
      <MenuFloating />

      {/* Zone: Brand - Logo centered via absolute positioning */}
      <div className="layout_logo-container" data-testid="header-brand-zone">
        <Logo />
      </div>
    </header>
  );
};

export default NavBar;
