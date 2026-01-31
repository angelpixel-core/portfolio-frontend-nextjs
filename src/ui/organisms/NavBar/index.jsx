import "./styles.css";

import { Logo, HireMe } from "@/molecules";
import { Menu, MenuFloating } from "@/organisms";

/**
 * NavBar - Main header component with mobile/desktop layouts.
 *
 * ## Mobile Layout (<841px) per design doc:
 * | padding | logo | AIR | auth | theme | AIR |
 * - Logo acts as menu trigger (opens overlay with nav + socials)
 * - HireMe circular floats (fixed to viewport bottom-right)
 *
 * ## Desktop Layout (≥841px) per design doc:
 * | padding | logo | AIR | nav | AIR | socials | AIR | ui | AIR | hireMe |
 * - Menu component handles full layout
 * - HireMe circular is part of header flow (not fixed)
 *
 * NOTE: No rectangular HireMe button exists. Only circular HireMe.
 *
 * @see _bmad-output/implementation-artifacts/ux-design-behavior/06-home-layout-rules/
 */
const NavBar = () => {
  return (
    <header className="layout_navbar-container" data-testid="header-container">
      {/* Mobile: Burger Menu trigger - hidden on nav+ */}
      <MenuFloating />

      {/* Mobile: Logo (acts as menu trigger) - hidden on nav+ */}
      <div
        className="layout_logo-container"
        data-testid="header-brand-zone-mobile"
      >
        <Logo />
      </div>

      {/* Desktop: Full Menu with all zones - hidden below nav */}
      <Menu />

      {/* Mobile: HireMe circular floating - fixed to viewport bottom-right */}
      <div className="layout_hireme-mobile">
        <HireMe />
      </div>
    </header>
  );
};

export default NavBar;
