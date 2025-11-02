import "./styles.css";

import { NavigationItem } from "@/models";
import { NavigationItemButton } from "@/buttons";

const NavigationItemButtons = async () => {
  const navigationItems = await NavigationItem.fetchAll()
    .then((items) => items.filter((item) => item.enabled))
    .then((items) =>
      items.map(({ href, name }, idx) => (
        <NavigationItemButton key={idx} href={href} name={name} />
      ))
    );

  return <>{navigationItems}</>;
};

export default NavigationItemButtons;
