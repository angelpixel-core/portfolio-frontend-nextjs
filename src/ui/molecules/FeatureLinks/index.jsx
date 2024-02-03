import "./styles.css";

import { fetchFeatures } from "@/lib/data/_index";

import { FeatureLink } from "@/atoms/links/_index";

export async function FeatureLinks() {
  const features = await fetchFeatures().map(({ href, name }, index) => (
    <FeatureLink key={index} href={href} name={name} className="feature_link" />
  ));

  return <>{features}</>;
}

export * from "./skeleton";
