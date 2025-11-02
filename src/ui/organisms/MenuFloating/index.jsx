"use client";

import "./styles.css";

import { useNavigationItems } from "@/domains/navigation-item/queries";
import { useContactPoints } from "@/domains/contact-point/queries";

import { MenuFloatingClient } from "@/organisms";

const MenuFloating = async () => {
  const {
    data: navigationItems,
    isLoading: isLoadingNavigation,
    isError: isErrorNavigation,
  } = useNavigationItems();

  const {
    data: socials,
    isLoading: isLoadingSocials,
    isError: isErrorSocials,
  } = useContactPoints();

  return (
    <MenuFloatingClient navigationItems={navigationItems} socials={socials} />
  );
};

export default MenuFloating;
