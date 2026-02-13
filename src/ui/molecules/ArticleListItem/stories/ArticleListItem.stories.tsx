import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import ArticleListItem from "../index";
import articlesMock from "@/domains/article/model/mock";

const meta = {
  title: "Molecules/ArticleListItem",
  component: ArticleListItem,
  tags: ["autodocs"],
  args: {
    article: articlesMock[0],
    onHoverChange: fn(),
  },
} satisfies Meta<typeof ArticleListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithClassName: Story = {
  args: {
    className: "custom-class",
  },
};
