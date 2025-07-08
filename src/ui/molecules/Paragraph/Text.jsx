import { Paragraph } from "@/atoms/texts";
import { Content } from "@/models";

const Text = async ({ className }) => {
  const content = await Content.findBy({ id: 1 });

  return <Paragraph text={content.mainContent} className={className} />;
};

export default Text;
