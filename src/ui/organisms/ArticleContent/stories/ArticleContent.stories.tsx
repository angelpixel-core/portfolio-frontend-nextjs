import type { Meta, StoryObj } from "@storybook/react";

import ArticleContent from "../index";
import ArticleContentSkeleton from "../skeleton";
import articlesMock from "@/domains/article/model/mock";

const articleWithContent = articlesMock.find((a) => a.content && a.content.length > 200)!;

const meta = {
  title: "Organisms/ArticleContent",
  component: ArticleContent,
  tags: ["autodocs"],
} satisfies Meta<typeof ArticleContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    article: articleWithContent,
  },
};

export const Loading: Story = {
  render: () => <ArticleContentSkeleton />,
};
