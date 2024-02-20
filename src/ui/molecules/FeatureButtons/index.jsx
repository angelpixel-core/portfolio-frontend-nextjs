import "./styles.css";

import { Feature } from "@/models/_index";
import { FeatureButton } from "@/atoms/buttons/_index";

export async function FeatureButtons() {
  const features = await Feature.fetchBy({ enabled: true }).then((items) =>
    items.map(({ href, name }, idx) => (
      <FeatureButton key={idx} href={href} name={name} />
    ))
  );

  return <>{features}</>;
}

export * from "./skeleton";
