import { Content } from "@/models";

import MotionTitle from "./MotionTitle";

const Title = async ({ className }) => {
  const { title } = await Content.fetchBy({ page: "home" });

  return <MotionTitle title={title} className={className} />;
};

export default Title;
