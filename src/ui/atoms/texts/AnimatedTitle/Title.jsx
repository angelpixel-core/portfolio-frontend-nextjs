import MotionTitle from "./MotionTitle";
// import { Content } from "@/models";

const Title = async ({ className }) => {
  // const content = await Content.findBy({ id: 1 });
  const data = await fetch("http://localhost:8000/api/v1/site/contents/1").then(
    (res) => res.json()
  );

  return <MotionTitle title={data.title} className={className} />;
};

export default Title;
