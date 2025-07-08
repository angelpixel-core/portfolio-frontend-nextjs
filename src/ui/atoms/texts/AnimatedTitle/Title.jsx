import { Content } from "@/models";

import MotionTitle from "./MotionTitle";

const Title = async ({ className }) => {
  const content = await Content.findBy({ id: 1 });

  return <MotionTitle title={content.title} className={className} />;
};

export default Title;
