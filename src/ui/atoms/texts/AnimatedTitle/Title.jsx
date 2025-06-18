import { Content } from "@/models";
import { MotionTitle } from "./MotionTitle";

export async function Title({ className }) {
  const { title } = await Content.fetchBy({ page: "home" });

  return <MotionTitle title={title} className={className} />;
}
