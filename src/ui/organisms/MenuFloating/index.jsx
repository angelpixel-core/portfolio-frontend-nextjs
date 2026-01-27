"use client";

import "./styles.css";

import { MenuFloatingClient } from "@/organisms";

/**
 * MenuFloating - Mobile/Tablet burger menu container.
 *
 * ## Zone: Burger (Epic 11)
 *
 * | Breakpoint | Visibility |
 * |------------|------------|
 * | mobile     | visible    |
 * | tablet     | visible    |
 * | desktop+   | hidden     |
 *
 * Contains MenuFloatingClient which renders the burger button and
 * floating overlay with navigation when opened.
 *
 * @see docs/layout-system.md for breakpoint definitions and visibility matrix
 */
const MenuFloating = () => {
  return (
    <div className="menu-floating" data-testid="header-burger-zone">
      <MenuFloatingClient />
    </div>
  );
};

export default MenuFloating;
