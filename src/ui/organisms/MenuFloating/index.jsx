import "./styles.css";

import { Feature, SocialNetwork } from "@/models";
import { MenuFloatingClient } from "@/organisms";

const MenuFloating = async () => {
  const features = await Feature.fetchAll();
  const socials = await SocialNetwork.fetchAll();

  return <MenuFloatingClient features={features} socials={socials} />;
};

export default MenuFloating;
