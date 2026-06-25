import { permanentRedirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArticleRedirectPage({
  params,
}: Props): Promise<never> {
  const { slug } = await params;
  permanentRedirect(`/articles/${slug}`);
}
