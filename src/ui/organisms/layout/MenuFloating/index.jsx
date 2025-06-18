import "./styles.css";

import { Feature } from "@/models/_index";
import { Social } from "@/models/_index";
import { MenuFloatingClient } from "@/organisms/layout/_index";

export async function MenuFloating() {
  const features = await Feature.all();
  const socials = await Social.all();

  return <MenuFloatingClient features={features} socials={socials} />;
}
