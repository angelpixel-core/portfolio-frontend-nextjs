import "./styles.css";

import { Feature } from "@/models";
import { Social } from "@/models";
import { MenuFloatingClient } from "@/organisms";

const MenuFloating = async () => {
  const features = await Feature.all();
  const socials = await Social.all();

  return <MenuFloatingClient features={features} socials={socials} />;
};

export default MenuFloating;
