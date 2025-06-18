import "./styles.css";

import { Feature } from "@/models";
import { Social } from "@/models";
import { MenuFloatingClient } from "@/organisms/layout";

export async function MenuFloating() {
  const features = await Feature.all();
  const socials = await Social.all();

  return <MenuFloatingClient features={features} socials={socials} />;
}
