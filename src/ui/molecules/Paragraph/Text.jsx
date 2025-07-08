import { ParagraphText } from "@/atoms/texts";
// import { Content } from "@/models";

const Text = async ({ className }) => {
  // const content = await Content.findBy({ id: 1 });
  const data = await fetch("http://localhost:8000/api/v1/site/contents/1").then(
    (res) => res.json()
  );

  return <ParagraphText text={data.mainContent} className={className} />;
};

export default Text;
