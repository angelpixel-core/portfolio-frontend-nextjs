import "./styles.css";

import { Logo } from "@/molecules";
import { Menu, MenuFloating } from "@/organisms";
import { HireMeHeaderButton } from "@/buttons";

/**
 * NavBar - Main header component containing all navigation zones.
 *
 * ## Header Zones (Epic 11, Story 12.2)
 *
 * | Zone         | Component           | Visibility                      |
 * |--------------|---------------------|---------------------------------|
 * | Burger       | MenuFloating        | mobile, tablet (<841px)         |
 * | Brand        | Logo                | All breakpoints (centered)      |
 * | Hire Me      | HireMeHeaderButton  | mobile, tablet (<841px)         |
 * | Primary Nav  | Menu                | nav+ (≥841px)                   |
 * | Social       | Menu                | wide: only                      |
 * | Auth         | Menu                | wide: only                      |
 * | UI Controls  | Menu/ThemeButton    | tablet+                         |
 *
 * Mobile layout (Story 12.2 AC1): hamburger (left), logo (center), Hire Me (right)
 *
 * @see docs/layout-system.md for breakpoint definitions and visibility matrix
 */
const NavBar = () => {
  return (
    <header className="layout_navbar-container" data-testid="header-container">
      {/* Zone: Mobile Burger Menu (left on mobile) */}
      <MenuFloating />

      {/* Zone: Desktop Menu (Nav, Social, Auth, UI Controls) */}
      <Menu />

      {/* Zone: Brand - Logo centered via absolute positioning */}
      <div className="layout_logo-container" data-testid="header-brand-zone">
        <Logo />
      </div>

      {/* Zone: Hire Me - Right on mobile, hidden on nav+ */}
      <HireMeHeaderButton />
    </header>
  );
};

export default NavBar;
