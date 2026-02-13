import type { Meta, StoryObj } from "@storybook/react";

import { Article } from "../index";

const meta = {
  title: "Molecules/Article",
  component: Article,
  tags: ["autodocs"],
  args: {
    props: {
      img: "/images/articles/pagination component in reactjs.jpg",
      title: "Build A Custom Pagination Component In ReactJS From Scratch",
      date: "March 22, 2023",
      link: "/articles/react-pagination",
    },
  },
} satisfies Meta<typeof Article>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
