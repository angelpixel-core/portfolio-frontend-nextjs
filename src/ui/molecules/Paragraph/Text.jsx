import { Paragraph } from "@/atoms/texts";
import { Content } from "@/models";

const page = "home";

export async function Text({ className }) {
  const { text } = await Content.fetchBy({ page }).then((content) => ({
    text: content.mainContent,
  }));

  return <Paragraph text={text} className={className} />;
}
