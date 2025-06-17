import "./styles.css";

import { Feature } from "@/models/_index";
import { FeatureLink } from "@/atoms/links/_index";

export async function FeatureLinks() {
  const features = await Feature.all();

  return (
    <>
      {features.map(({ href, label: name }, idx) => (
        <FeatureLink
          key={idx}
          href={href}
          name={name}
          className="feature_link"
        />
      ))}
    </>
  );
}
