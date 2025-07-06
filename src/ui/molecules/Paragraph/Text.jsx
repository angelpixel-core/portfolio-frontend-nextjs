import { Paragraph } from "@/atoms/texts";
import { Content } from "@/models";

const page = "home";

const Text = async ({ className }) => {
  const { text } = await Content.fetchBy({ page }).then((content) => ({
    text: content.mainContent,
  }));

  return <Paragraph text={text} className={className} />;
};

export default Text;
