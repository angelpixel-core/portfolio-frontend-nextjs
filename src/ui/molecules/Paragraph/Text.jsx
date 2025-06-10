import { Paragraph } from "@/atoms/texts/_index";
import { Content } from "@/models/_index";

const page = "home";

export async function Text({ className }) {
  const { text } = await Content.fetchBy({ page }).then((content) => ({
    text: content.mainContent,
  }));

  return <Paragraph text={text} className={className} />;
}
