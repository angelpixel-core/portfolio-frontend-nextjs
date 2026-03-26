import type { Meta, StoryObj } from "@storybook/react";

import FeaturedArticlesCarousel from "../index";
import articlesMock from "@/domains/article/model/mock";

const featuredArticles = articlesMock
  .filter((a: any) => a.featured)
  .slice(0, 3);

const meta = {
  title: "Molecules/FeaturedArticlesCarousel",
  component: FeaturedArticlesCarousel,
  tags: ["autodocs"],
  decorators: [
    (Story: any) => (
      <div style={{ minHeight: 400 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    articles: featuredArticles,
    interval: 5000,
  },
} satisfies Meta<typeof FeaturedArticlesCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleArticle: Story = {
  args: {
    articles: [featuredArticles[0]],
  },
};
