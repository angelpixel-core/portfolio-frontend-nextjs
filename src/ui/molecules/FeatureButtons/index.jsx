import "./styles.css";

import { Feature } from "@/models";
import { FeatureButton } from "@/buttons";

const FeatureButtons = async () => {
  const features = await Feature.all()
    .then((items) => items.filter((item) => item.enabled))
    .then((items) =>
      items.map(({ href, name }, idx) => (
        <FeatureButton key={idx} href={href} name={name} />
      ))
    );

  return <>{features}</>;
};

export default FeatureButtons;
