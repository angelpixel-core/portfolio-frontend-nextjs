import "./styles.css";

import { Feature } from "@/models/_index";
import { FeatureLink } from "@/atoms/links/_index";

export async function FeatureLinks() {
  const features = await Feature.fetchBy({ enabled: true }).then((items) =>
    items.map(({ href, name }, idx) => (
      <FeatureLink key={idx} href={href} name={name} className="feature_link" />
    ))
  );

  return <>{features}</>;
}

export * from "./skeleton";
