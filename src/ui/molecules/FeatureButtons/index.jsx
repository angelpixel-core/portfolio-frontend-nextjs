import "./styles.css";

import { Feature } from "@/models";
import { FeatureButton } from "@/atoms/buttons";

export async function FeatureButtons() {
  const features = await Feature.all()
    .then((items) => items.filter((item) => item.enabled))
    .then((items) =>
      items.map(({ href, name }, idx) => (
        <FeatureButton key={idx} href={href} name={name} />
      ))
    );

  return <>{features}</>;
}

export * from "./skeleton";
