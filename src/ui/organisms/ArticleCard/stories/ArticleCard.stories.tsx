import type { Meta, StoryObj } from "@storybook/react";

import ArticleCard from "../index";
import { FeaturedArticleCard } from "../variants/Featured";
import { GridArticleCard } from "../variants/Grid";
import articlesMock from "@/domains/article/model/mock";

const featuredArticle = articlesMock.find((a) => a.featured)!;
const gridArticle = articlesMock.find((a) => !a.featured)!;

const meta = {
  title: "Organisms/ArticleCard",
  component: ArticleCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Featured: Story = {
  render: () => <FeaturedArticleCard article={featuredArticle} />,
};

export const Grid: Story = {
  render: () => <GridArticleCard article={gridArticle} />,
};

export const Auto: Story = {
  args: {
    article: featuredArticle,
  },
};
