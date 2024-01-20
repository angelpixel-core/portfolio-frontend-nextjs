import { ThemeButtonSkeleton } from "@/atoms/buttons/_index";
import { MenuLinkSkeleton, SocialLinkSkeleton } from "@/atoms/links/_index";

export const MenuSkeleton = () => {
  return (
    <div className="layout_menu-container">
      <nav className="menu">
        <MenuLinkSkeleton className="menu_option" />
        <MenuLinkSkeleton className="menu_option" />
        <MenuLinkSkeleton className="menu_option" />
        <MenuLinkSkeleton className="menu_option" />
      </nav>

      <nav className="social-menu">
        <SocialLinkSkeleton className="social-menu_option sm:mx-1" />
        <SocialLinkSkeleton className="social-menu_option sm:mx-1" />

        <ThemeButtonSkeleton />
      </nav>
    </div>
  );
};
