import "./styles.css";

import { fetchFeatures } from "@/lib/data/_index";

import { FeatureButton } from "@/atoms/buttons/_index";

export async function FeatureButtons() {
  const features = await fetchFeatures().map(({ href, name }, index) => (
    <FeatureButton key={index} href={href} name={name} />
  ));

  return <>{features}</>;
}

export * from "./skeleton";
